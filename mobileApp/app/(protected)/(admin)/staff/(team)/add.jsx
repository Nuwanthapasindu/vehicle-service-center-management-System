import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import colors from "../../../../../constants/colors";
import { Formik } from "formik";
import Toast from "react-native-toast-message";
import CreateTeamSchema from "../../../../../schema/CreateTeamSchema";
import EmployeeCard from "../../../../../components/EmployeeCard";
import axios from "axios";

export default function CreateTeam() {
  const router = useRouter();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredEmployees, setFilteredEmployees] = useState([]);

  useEffect(() => {
    fetchEmployees();
  }, []);

  // --- Update filtered list when search query or employees change
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
  const fetchEmployees = async () => {
    try {
      const response = await axios.get("/employees"); 

      const resData = response.data; 
      if (resData && resData.payload && resData.payload.data) {
        const availableOnly = resData.payload.data.filter(
          (emp) => !emp.isDeleted && emp.isAvailable === true
        );
        setEmployees(availableOnly);
      }
    } catch (error) {
      //Alert.alert("Error", "Failed to load employees.");
      //show error toast instead of Alert
      Toast.show({
         type: "error",
         text1: "Error",
         text2: "Failed to load employees.",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleEmployeeSelection = (values, setFieldValue, id) => {
    if (values.employees.includes(id)) {
      setFieldValue(
        "employees",
        values.employees.filter((empId) => empId !== id)
      );
    } else {
      setFieldValue("employees", [...values.employees, id]);
    }
  };

  const handleSelectAll = (values, setFieldValue) => {
    if (values.employees.length === employees.length) {
      setFieldValue("employees", []);
    } else {
      setFieldValue(
        "employees",
        employees.map((emp) => emp._id)
      );
    }
  };

  const handleSaveTeam = async (values) => {
    setSubmitting(true);

    try {
      const response = await axios.post("/teams", {   // CHANGED
        name: values.name,
        employees: values.employees,
      });

      if (response.status === 201 || response.status === 200) {
        // success toast instead of Alert
        Toast.show({
          type: "success",
          text1: "Success",
          text2: "Team created successfully",
        });

        // navigate after toast
        router.replace("/(protected)/(admin)/staff/(team)");
      }
    } catch (error) {
      const message =
        error.response?.data?.payload?.message || "Failed to create team";
        Toast.show({
          type: "error",
          text1: "Error",
          text2: message,
        });
    } finally {
      setSubmitting(false);
    }
  };

  const renderEmployeeItem = (values, setFieldValue) => ({ item }) => {
    const isSelected = values.employees.includes(item._id);

    return (
      <EmployeeCard
        item={item}
        selectable={true}
        selected={isSelected}
        onPress={() => toggleEmployeeSelection(values, setFieldValue, item._id)}
      />
    );
  };

  return (
    <Formik
      initialValues={{
        name: "",
        employees: [],
      }}
      validationSchema={CreateTeamSchema}
      onSubmit={handleSaveTeam}
    >
      {({
        values,
        handleChange,
        handleSubmit,
        setFieldValue,
        errors,
        touched,
      }) => (
        <View style={styles.container}>
          <View style={styles.content}>
            {/* Team Name */}
            <Text style={styles.label}>TEAM NAME</Text>
            {errors.name && touched.name && (
              <Text style={{ color: "red" }}>{errors.name}</Text>
            )}
            <TextInput
              style={styles.input}
              placeholder="e.g., Night Shift Detailing"
              placeholderTextColor={colors.SECONDARY}
              value={values.name}
              onChangeText={handleChange("name")}
            />

            {/* Employee Selection */}
            <View style={styles.selectionHeader}>
              <Text style={styles.sectionLabel}>
                AVAILABLE EMPLOYEES ({employees.length})
              </Text>
              <TouchableOpacity
                onPress={() => handleSelectAll(values, setFieldValue)}
              >
                <Text style={styles.selectAllText}>
                  {values.employees.length === employees.length
                    ? "Deselect All"
                    : "Select All"}
                </Text>
              </TouchableOpacity>
            </View>
             {errors.employees && touched.employees && (
              <Text style={{ color: "red" }}>{errors.employees}</Text>
            )}

            {/* --- SEARCH BAR ADDED HERE --- */}
            <TextInput
              style={[styles.input, { marginBottom: 15 }]}
              placeholder="Search employees..."
              placeholderTextColor={colors.SECONDARY}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />

            {loading ? (
              <ActivityIndicator size="large" color={colors.PRIMARY} />
            ) : (
              <FlatList
                data={filteredEmployees}
                renderItem={renderEmployeeItem(values, setFieldValue)}
                keyExtractor={(item) => item._id}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={true}
              />
            )}
          </View>

          {/* Save Button */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.saveButton, submitting && { opacity: 0.7 }]}
              onPress={handleSubmit}
              disabled={submitting}
            >
              {submitting ? (
                <ActivityIndicator color={colors.DARK} />
              ) : (
                <Text style={styles.saveButtonText}>SAVE TEAM</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      )}
    </Formik>
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