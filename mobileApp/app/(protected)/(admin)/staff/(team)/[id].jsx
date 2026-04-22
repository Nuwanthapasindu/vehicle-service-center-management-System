import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import { useRouter, useLocalSearchParams } from "expo-router";
import colors from "../../../../../constants/colors";
import EmployeeCard from "../../../../../components/EmployeeCard";
import axios from "axios";

export default function EditTeam() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const [teamName, setTeamName] = useState("");
  const [employees, setEmployees] = useState([]);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchData();
  }, [id]);

  // --- Filter employees whenever searchQuery or employees change
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredEmployees(employees);
    } else {
      const filtered = employees.filter((emp) =>
        emp.user?.name
          ?.toLowerCase()
          .includes(searchQuery.trim().toLowerCase()),
      );
      setFilteredEmployees(filtered);
    }
  }, [searchQuery, employees]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const empRes = await axios.get("/employees?isAvailable=true");
      const empData = empRes.data;

      const teamRes = await axios.get(`/teams/${id}`);
      const teamData = teamRes.data;

      if (empData?.payload?.data) {
        // Only show employees that are not deleted
        setEmployees(empData.payload.data.filter((emp) => !emp.isDeleted));
      }

      // FIX: Correctly populate the form with existing team data
      if (teamData?.payload?.data) {
        const team = teamData.payload.data;
        setTeamName(team.name);

        // Extract only the IDs from the employees array to match our selection logic
        const existingEmployeeIds = team.employees.map((emp) =>
          typeof emp === "object" ? emp._id : emp,
        );
        setSelectedEmployees(existingEmployeeIds);
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to load team details",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleEmployeeSelection = (employeeId) => {
    if (selectedEmployees.includes(employeeId)) {
      setSelectedEmployees(selectedEmployees.filter((id) => id !== employeeId));
    } else {
      setSelectedEmployees([...selectedEmployees, employeeId]);
    }
  };

  const handleUpdateTeam = async () => {
    if (!teamName.trim()) return Alert.alert("Error", "Team name is required");
    if (selectedEmployees.length === 0)
      return Alert.alert("Error", "Select at least one member");

    setSubmitting(true);

    try {
      await axios.put(`/teams/${id}`, {
        name: teamName,
        employees: selectedEmployees,
      });

      //success toast
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Team updated successfully",
      });

      router.replace("/(protected)/(admin)/staff/(team)");
    } catch (error) {
      const message = error.response?.data?.payload?.message || "Update failed";
      //error toast
      Toast.show({
        type: "error",
        text1: "Error",
        text2: message,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteTeam = () => {
    Alert.alert("Delete Team", "Are you sure you want to remove this team?", [
      { text: "Cancel", style: "cancel" },

      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await axios.delete(`/teams/${id}`);

            //success toast
            Toast.show({
              type: "success",
              text1: "Deleted",
              text2: "Team deleted successfully",
            });

            router.replace("/(protected)/(admin)/staff/(team)");
          } catch (error) {
            //error toast
            Toast.show({
              type: "error",
              text1: "Error",
              text2: "Delete failed",
            });
          }
        },
      },
    ]);
  };

  const renderEmployeeItem = ({ item }) => {
    const isSelected = selectedEmployees.includes(item._id);
    return (
      <EmployeeCard
        item={item}
        selectable={true}
        selected={isSelected}
        onPress={() => toggleEmployeeSelection(item._id)}
      />
    );
  };

  if (loading)
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.PRIMARY} />
      </View>
    );

  return (
    <View style={styles.container}>

      <View style={styles.content}>
        <Text style={styles.label}>TEAM NAME</Text>
        <TextInput
          style={styles.input}
          value={teamName}
          onChangeText={setTeamName}
          placeholder="Enter team name"
          placeholderTextColor={colors.SECONDARY}
        />

        <Text style={styles.label}>MANAGE EMPLOYEES ({employees.length})</Text>

        {/* --- SEARCH BAR ADDED --- */}
        <TextInput
          style={[styles.input, { marginBottom: 15 }]}
          placeholder="Search employees..."
          placeholderTextColor={colors.SECONDARY}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        <FlatList
          data={filteredEmployees}
          renderItem={renderEmployeeItem}
          keyExtractor={(item) => item._id}
          showsVerticalScrollIndicator={true}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      </View>

      {/* Action Buttons */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.updateButton, submitting && { opacity: 0.7 }]}
          onPress={handleUpdateTeam}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator color={colors.DARK} />
          ) : (
            <Text style={styles.buttonText}>UPDATE TEAM</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={handleDeleteTeam}
        >
          <Ionicons
            name="trash-outline"
            size={20}
            color={colors.DANGER_COLOR}
          />
          <Text style={styles.deleteText}>Delete Team</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.LIGHT },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.BORDER_COLOR,
  },
  headerTitle: { fontSize: 18, fontWeight: "800", color: colors.DARK },
  content: { flex: 1, padding: 20 },
  label: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.DARK,
    marginBottom: 8,
    marginTop: 10,
  },
  input: {
    backgroundColor: colors.BACKGROUND_COLOR,
    borderRadius: 12,
    padding: 15,
    borderColor: colors.BORDER_COLOR,
    marginBottom: 20,
    color: colors.DARK,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: colors.BORDER_COLOR,
  },
  updateButton: {
    backgroundColor: colors.PRIMARY,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  buttonText: {
    fontWeight: "bold",
    fontSize: 16,
    color: colors.DARK,
    letterSpacing: 1,
  },
  deleteButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.DANGER_COLOR,
  },
  deleteText: { color: colors.DANGER_COLOR, fontWeight: "600", marginLeft: 8 },
});
