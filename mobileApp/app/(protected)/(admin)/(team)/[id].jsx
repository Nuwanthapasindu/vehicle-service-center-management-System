import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import colors from "../../../../constants/colors";
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
          .includes(searchQuery.trim().toLowerCase())
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
        setEmployees(empData.payload.data.filter(emp => !emp.isDeleted));
      }

      // FIX: Correctly populate the form with existing team data
      if (teamData?.payload?.data) {
        const team = teamData.payload.data;
        setTeamName(team.name);
        
        // Extract only the IDs from the employees array to match our selection logic
        const existingEmployeeIds = team.employees.map(emp => 
          typeof emp === 'object' ? emp._id : emp
        );
        setSelectedEmployees(existingEmployeeIds);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      Alert.alert("Error", "Failed to load team details");
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
    if (selectedEmployees.length === 0) return Alert.alert("Error", "Select at least one member");

    setSubmitting(true);

    try {
      await axios.put(`/teams/${id}`, {
        name: teamName,
        employees: selectedEmployees,
      });

      Alert.alert("Success", "Team updated successfully", [
        {
          text: "OK",
          onPress: () => router.replace("/(protected)/(admin)/(team)")
        }
      ]);

    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Update failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteTeam = () => {

    Alert.alert(
      "Delete Team",
      "Are you sure you want to remove this team?",
      [
        { text: "Cancel", style: "cancel" },

        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {

            try {
              await axios.delete(`/teams/${id}`);

              router.replace("/(protected)/(admin)/(team)");

            } catch (error) {
              Alert.alert("Error", "Delete failed");
            }

          }
        }
      ]
    );
  };

  const renderEmployeeItem = ({ item }) => {
    const isSelected = selectedEmployees.includes(item._id);
    return (
      <TouchableOpacity 
        style={styles.employeeCard} 
        onPress={() => toggleEmployeeSelection(item._id)}
      >
        <Ionicons name="person-circle" size={44} color={colors.PRIMARY} />
        <View style={styles.employeeInfo}>
          <Text style={styles.employeeName}>{item.user?.name || "Unknown Employee"}</Text>
          <Text style={styles.employeeRole}>{item.user?.role || "No Role Assigned"}</Text>
        </View>
        <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
          {isSelected && <Ionicons name="checkmark" size={16} color={colors.LIGHT} />}
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) return (
    <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.PRIMARY} />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header 
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => router.push("/(protected)/(admin)/(team)")} // Forces navigation to Team Directory
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={28} color={colors.PRIMARY} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>EDIT TEAM</Text>
        <View style={{ width: 28 }} /> 
      </View>*/}

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
        
        <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteTeam}>
          <Ionicons name="trash-outline" size={20} color={colors.DANGER_COLOR} />
          <Text style={styles.deleteText}>Delete Team</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
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
    borderBottomColor: colors.BORDER_COLOR 
  },
  headerTitle: { fontSize: 18, fontWeight: "800", color: colors.DARK },
  content: { flex: 1, padding: 20 },
  label: { fontSize: 12, fontWeight: "700", color: colors.DARK, marginBottom: 8, marginTop: 10 },
  input: { 
    backgroundColor: colors.BACKGROUND_COLOR, 
    borderRadius: 12, 
    padding: 15, 
    borderWidth: 1, 
    borderColor: colors.BORDER_COLOR, 
    marginBottom: 20,
    color: colors.DARK
  },
  employeeCard: { 
    flexDirection: "row", 
    alignItems: "center", 
    padding: 12, 
    borderRadius: 12, 
    marginBottom: 10, 
    borderWidth: 1, 
    borderColor: colors.BORDER_COLOR,
    backgroundColor: colors.LIGHT
  },
  employeeInfo: { flex: 1, marginLeft: 12 },
  employeeName: { fontSize: 15, fontWeight: "700", color: colors.DARK },
  employeeRole: { fontSize: 12, color: colors.SECONDARY, marginTop: 2 },
  checkbox: { 
    width: 24, 
    height: 24, 
    borderRadius: 6, 
    borderWidth: 2, 
    borderColor: colors.BORDER_COLOR, 
    justifyContent: "center", 
    alignItems: "center" 
  },
  checkboxSelected: { backgroundColor: colors.PRIMARY, borderColor: colors.PRIMARY },
  footer: { padding: 20, borderTopWidth: 1, borderTopColor: colors.BORDER_COLOR },
  updateButton: { 
    backgroundColor: colors.PRIMARY, 
    padding: 16, 
    borderRadius: 12, 
    alignItems: "center", 
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4
  },
  buttonText: { fontWeight: "bold", fontSize: 16, color: colors.DARK, letterSpacing: 1 },
  deleteButton: { 
    flexDirection: "row", 
    justifyContent: "center", 
    alignItems: "center", 
    marginTop: 15, 
    padding: 12, 
    borderRadius: 12, 
    borderWidth: 1, 
    borderColor: colors.DANGER_COLOR 
  },
  deleteText: { color: colors.DANGER_COLOR, fontWeight: "600", marginLeft: 8 }
});