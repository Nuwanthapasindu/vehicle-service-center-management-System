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
import { useRouter } from "expo-router";
import colors from "../../../../constants/colors";

export default function CreateTeam() {
  const router = useRouter();
  const [teamName, setTeamName] = useState("");
  const [employees, setEmployees] = useState([]);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Fetch employees from backend to populate the list
  useEffect(() => {
    fetchEmployees();
  }, []);
  
  const fetchEmployees = async () => {
  try {
    const response = await fetch("http://192.168.8.186:5000/api/v1/employees");
    const resData = await response.json();
    
    console.log("Fetched Employees:", resData.payload.data);

    if (resData && resData.payload && resData.payload.data) {
      // FIX: Filter for employees who are NOT deleted AND ARE available
      const availableOnly = resData.payload.data.filter(
        emp => !emp.isDeleted && emp.isAvailable === true
      );
      setEmployees(availableOnly);
    }
  } catch (error) {
    console.error("Fetch employees error:", error);
    Alert.alert("Error", "Failed to load employees.");
  } finally {
    setLoading(false);
  }
};

  const toggleEmployeeSelection = (id) => {
    if (selectedEmployees.includes(id)) {
      setSelectedEmployees(selectedEmployees.filter((empId) => empId !== id));
    } else {
      setSelectedEmployees([...selectedEmployees, id]);
    }
  };

  const handleSelectAll = () => {
    if (selectedEmployees.length === employees.length) {
      setSelectedEmployees([]);
    } else {
      setSelectedEmployees(employees.map((emp) => emp._id));
    }
  };
 
  const handleSaveTeam = async () => {
    if (!teamName.trim()) {
      Alert.alert("Validation Error", "Team name is required");
      return;
    }
    if (selectedEmployees.length === 0) {
      Alert.alert("Validation Error", "A team must have at least one employee");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("http://192.168.8.186:5000/api/v1/teams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: teamName,
          employees: selectedEmployees,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        Alert.alert("Success", "Team created successfully", [
          {
            text: "OK",
            onPress: () => {
              // CHANGE: Navigate explicitly to the Team Directory index
              // router.replace ensures the "Add" screen is removed from the history
              router.replace("/(protected)/(admin)/(team)");
            },
          },
        ]);
      } else {
        Alert.alert("Error", result.message || "Failed to create team");
      }
    } catch (error) {
      Alert.alert("Error", "Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };
 
  
  const renderEmployeeItem = ({ item }) => {
  const isSelected = selectedEmployees.includes(item._id);
  
  // Because your backend uses .populate('user'), 
  // the name and role are inside item.user
  const displayName = item.user?.name || "Name Missing";
  const displayRole = item.user?.role || "No Role Assigned";

  return (
    <TouchableOpacity
      style={styles.employeeCard}
      onPress={() => toggleEmployeeSelection(item._id)}
    >
      <View style={styles.avatarContainer}>
        <Ionicons name="person-circle" size={40} color={colors.PRIMARY} />
      </View>
      <View style={styles.employeeInfo}>
        <Text style={styles.employeeName}>{displayName}</Text>
        <Text style={styles.employeeRole}>{displayRole}</Text>
      </View>
      <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
        {isSelected && <Ionicons name="checkmark" size={16} color={colors.LIGHT} />}
      </View>
    </TouchableOpacity>
  );
};

  return (
    <SafeAreaView style={styles.container}>
      {/* Header 
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} color={colors.PRIMARY} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>NEW TEAM</Text>
        <View style={{ width: 28 }} />
      </View>*/}

      <View style={styles.content}>
        {/* Team Name Input */}
        <Text style={styles.label}>TEAM NAME</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., Night Shift Detailing"
          placeholderTextColor={colors.SECONDARY}
          value={teamName}
          onChangeText={setTeamName}
        />

        {/* Selection Header */}
        <View style={styles.selectionHeader}>
          <Text style={styles.sectionLabel}>
            AVAILABLE EMPLOYEES ({employees.length})
          </Text>
          <TouchableOpacity onPress={handleSelectAll}>
            <Text style={styles.selectAllText}>
              {selectedEmployees.length === employees.length ? "Deselect All" : "Select All"}
            </Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color={colors.PRIMARY} />
        ) : (
          <FlatList
            data={employees}
            renderItem={renderEmployeeItem}
            keyExtractor={(item) => item._id}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>

      {/* Save Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.saveButton, submitting && { opacity: 0.7 }]}
          onPress={handleSaveTeam}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator color={colors.DARK} />
          ) : (
            <Text style={styles.saveButtonText}>SAVE TEAM</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.LIGHT },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
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
    fontSize: 16,
    borderWidth: 1,
    borderColor: colors.BORDER_COLOR,
    color: colors.DARK,
    marginBottom: 25,
  },
  selectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  sectionLabel: { fontSize: 12, fontWeight: "700", color: colors.DARK },
  selectAllText: { color: colors.PRIMARY, fontWeight: "bold", fontSize: 13 },
  listContainer: { paddingBottom: 20 },
  employeeCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.LIGHT,
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.BORDER_COLOR,
  },
  avatarContainer: { marginRight: 12 },
  employeeInfo: { flex: 1 },
  employeeName: { fontSize: 15, fontWeight: "700", color: colors.DARK },
  employeeRole: { fontSize: 12, color: colors.SECONDARY, marginTop: 2 },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.BORDER_COLOR,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxSelected: {
    backgroundColor: colors.PRIMARY,
    borderColor: colors.PRIMARY,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: colors.BORDER_COLOR,
  },
  saveButton: {
    backgroundColor: colors.PRIMARY,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    // Shadow matching your UI image
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  saveButtonText: {
    color: colors.DARK,
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 1,
  },
});