import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import colors from "../../../../../constants/colors";
import { Formik } from "formik";
import Toast from "react-native-toast-message";
import UpdateEmployeeSchema from "../../../../../schema/UpdateEmployeeSchema";
import axios from "axios";
import enums from "../../../../../constants/enums";
import DateTimePicker from "@react-native-community/datetimepicker";
import CustomInput from "../../../../../components/CustomInput";

export default function EditEmployee() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [form, setForm] = useState({
    name: "",
    mobile: "",
    address: "",
    nic: "",
    dob: "",
    gender: "MALE",
    isAvailable: true,
    skills: [],
    userName: "",
    password: "",
  });



  useEffect(() => {
    fetchEmployeeDetails();
  }, [id]);

  // FETCH EMPLOYEE DETAILS
  const fetchEmployeeDetails = async () => {
    try {
      const response = await axios.get("/employees");

      const employees = response?.data?.payload?.data || [];

      const employee = employees.find((emp) => emp._id === id);

      if (employee) {
        setForm({
          name: employee.user?.name || "",
          mobile: employee.user?.mobile || "",
          address: employee.user?.address || "",
          nic: employee.nic || "",
          dob: employee.dob ? employee.dob.split("T")[0] : "",
          gender: employee.gender || "MALE",
          isAvailable: employee.isAvailable ?? true,
          skills: employee.skills || [],
          userName: employee.auth?.userName || "",
          password: "",
        });
      }
    } catch (error) {
      //Alert.alert("Error", "Failed to load employee details");
      // show error toast instead of Alert
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to load employee details",
      });
    } finally {
      setLoading(false);
    }
  };

  // SKILL TOGGLE
  const toggleSkill = (skill, values, setFieldValue) => {
    const updatedSkills = values.skills.includes(skill)
      ? values.skills.filter((s) => s !== skill)
      : [...values.skills, skill];

    setFieldValue("skills", updatedSkills);
  };

  // UPDATE EMPLOYEE
  const handleUpdate = async (values) => {
    setProcessing(true);

    try {
      let payload = { ...values };

      if (!payload.password) delete payload.password;

      const response = await axios.put(`/employees/${id}`, payload);

      if (response.status === 200) {
        //Alert.alert("Success", "Employee updated successfully");
        // success toast instead of Alert
        Toast.show({
          type: "success",
          text1: "Success",
          text2: "Employee updated successfully",
        });

        router.back();
      }
    } catch (error) {
      const message =
        error?.response?.data?.payload?.message || "Employee update failed";

      //Alert.alert("Error", message);
      // show error toast instead of Alert
      Toast.show({
        type: "error",
        text1: "Error",
        text2: message,
      });
    } finally {
      setProcessing(false);
    }
  };

  // DELETE EMPLOYEE
  const handleDelete = () => {
    Alert.alert(
      "Delete Employee",
      "Are you sure you want to delete this employee?",
      [
        { text: "Cancel", style: "cancel" },

        {
          text: "Delete",
          style: "destructive",

          onPress: async () => {
            try {
              const response = await axios.delete(`/employees/${id}`);

              if (response.status === 200) {
                //Alert.alert("Success", "Employee deleted successfully");
                // success toast instead of Alert
                Toast.show({
                  type: "success",
                  text1: "Success",
                  text2: "Employee deleted successfully",
                });

                router.replace("/(protected)/(admin)/staff/(employee)");
              }
            } catch (error) {
              //Alert.alert("Error", "Delete failed");
              //error toast instead of Alert
              Toast.show({
                type: "error",
                text1: "Error",
                text2: "Delete failed",
              });
            }
          },
        },
      ],
    );
  };
  if (loading)
    return <ActivityIndicator style={{ flex: 1 }} color={colors.PRIMARY} />;

  return (
    <Formik
      initialValues={form}
      enableReinitialize={true}
      validationSchema={UpdateEmployeeSchema}
      onSubmit={handleUpdate}
    >
      {({
        handleChange,
        handleSubmit,
        values,
        errors,
        touched,
        setFieldValue,
      }) => (
        <View style={styles.mainContainer}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            {/* Personal Information */}
            <Text style={styles.sectionLabel}>PERSONAL INFORMATION</Text>

            <CustomInput
              label="FULL NAME"
              placeholder="e.g. John Doe"
              value={values.name}
              onChangeText={handleChange("name")}
              error={errors.name}
              touched={touched.name}
              icon={<Ionicons name="person-outline" size={20} color={colors.SECONDARY} />}
            />

            <CustomInput
              label="MOBILE NUMBER"
              placeholder="e.g. 0712345678"
              keyboardType="phone-pad"
              value={values.mobile}
              onChangeText={handleChange("mobile")}
              error={errors.mobile}
              touched={touched.mobile}
              icon={<Ionicons name="call-outline" size={20} color={colors.SECONDARY} />}
            />

            <CustomInput
              label="ADDRESS"
              placeholder="e.g. 123 Main St, Colombo"
              value={values.address}
              onChangeText={handleChange("address")}
              error={errors.address}
              touched={touched.address}
              icon={<Ionicons name="location-outline" size={20} color={colors.SECONDARY} />}
            />

            <CustomInput
              label="USERNAME"
              placeholder="e.g. johndoe"
              value={values.userName}
              onChangeText={handleChange("userName")}
              error={errors.userName}
              touched={touched.userName}
              icon={<Ionicons name="at-outline" size={20} color={colors.SECONDARY} />}
            />

            <CustomInput
              label="PASSWORD"
              placeholder="Leave blank to keep current password"
              value={values.password}
              onChangeText={handleChange("password")}
              error={errors.password}
              touched={touched.password}
              isPassword={true}
              icon={<Ionicons name="lock-closed-outline" size={20} color={colors.SECONDARY} />}
            />

            <View style={styles.rowInputs}>
              <View style={{ flex: 1, marginRight: 10 }}>
                <CustomInput
                  label="NIC"
                  placeholder="e.g. 199012345678"
                  value={values.nic}
                  onChangeText={handleChange("nic")}
                  error={errors.nic}
                  touched={touched.nic}
                  icon={<Ionicons name="card-outline" size={20} color={colors.SECONDARY} />}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.fieldLabel}>DATE OF BIRTH</Text>
                <TouchableOpacity
                  style={styles.input}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Text style={{ color: values.dob ? colors.DARK : colors.SECONDARY, paddingTop: 3 }}>
                    {values.dob || "YYYY-MM-DD"}
                  </Text>
                </TouchableOpacity>

                {showDatePicker && (
                  <DateTimePicker
                    value={values.dob ? new Date(values.dob) : new Date()}
                    mode="date"
                    display="default"
                    maximumDate={new Date()}
                    onChange={(event, selectedDate) => {
                      setShowDatePicker(false);
                      if (event.type === "set" && selectedDate) {
                        const formattedDate = selectedDate.toISOString().split("T")[0];
                        setFieldValue("dob", formattedDate);
                      }
                    }}
                  />
                )}
                {touched.dob && errors.dob && (
                  <Text style={styles.errorText}>{errors.dob}</Text>
                )}
              </View>
            </View>

            {/* Gender */}
            <Text style={styles.sectionLabel}>GENDER</Text>
            <View style={styles.chipContainer}>
              {Object.values(enums.GENDERS).map((g) => (
                <TouchableOpacity
                  key={g}
                  style={[
                    styles.chip,
                    values.gender === g && styles.activeChip,
                  ]}
                  onPress={() => setFieldValue("gender", g)}
                >
                  <Text
                    style={[
                      styles.chipText,
                      values.gender === g && styles.activeChipText,
                    ]}
                  >
                    {g}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {touched.gender && errors.gender && (
              <Text style={styles.errorText}>{errors.gender}</Text>
            )}

            {/* Availability */}
            <Text style={styles.sectionLabel}>AVAILABILITY STATUS</Text>
            <View style={styles.chipContainer}>
              {[true, false].map((status) => (
                <TouchableOpacity
                  key={status.toString()}
                  style={[
                    styles.chip,
                    values.isAvailable === status && styles.activeChip,
                  ]}
                  onPress={() => setFieldValue("isAvailable", status)}
                >
                  <Text
                    style={[
                      styles.chipText,
                      values.isAvailable === status && styles.activeChipText,
                    ]}
                  >
                    {status ? "AVAILABLE" : "UNAVAILABLE"}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Skills */}
            <Text style={styles.sectionLabel}>ASSIGNED SKILLS</Text>
            <View style={styles.chipContainer}>
              {enums.AVAILABLE_SKILLS.map((skill) => (
                <TouchableOpacity
                  key={skill}
                  onPress={() => toggleSkill(skill, values, setFieldValue)}
                  style={[
                    styles.chip,
                    values.skills.includes(skill) && styles.activeChip,
                  ]}
                >
                  <Text
                    style={[
                      styles.chipText,
                      values.skills.includes(skill) && styles.activeChipText,
                    ]}
                  >
                    {skill}
                  </Text>
                </TouchableOpacity>
              ))}
              {touched.skills && errors.skills && (
                <Text style={styles.errorText}>{errors.skills}</Text>
              )}
            </View>

            {/* Buttons */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.saveBtn}
                onPress={handleSubmit}
                disabled={processing}
              >
                {processing ? (
                  <ActivityIndicator color={colors.DARK} />
                ) : (
                  <>
                    <Ionicons
                      name="save-outline"
                      size={20}
                      color={colors.DARK}
                    />
                    <Text style={styles.saveBtnText}>SAVE CHANGES</Text>
                  </>
                )}
              </TouchableOpacity>

              <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
                <Ionicons name="trash-outline" size={20} color={colors.LIGHT} />
                <Text style={styles.deleteBtnText}>DELETE EMPLOYEE</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      )}
    </Formik>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: colors.BACKGROUND_COLOR },
  scrollContent: { padding: 20 },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "bold",
    color: colors.SECONDARY,
    marginTop: 25,
    marginBottom: 15,
    letterSpacing: 1,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.SECONDARY,
    marginBottom: 8,
    marginLeft: 4,
  },
  input: {
    backgroundColor: colors.LIGHT,
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.BORDER_COLOR,
    marginBottom: 15,
    color: colors.DARK,
    fontSize: 15,
  },
  rowInputs: { flexDirection: "row", justifyContent: "space-between" },
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 10,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 25,
    backgroundColor: colors.LIGHT,
    borderWidth: 1,
    borderColor: colors.BORDER_COLOR,
  },
  activeChip: { backgroundColor: colors.PRIMARY, borderColor: colors.PRIMARY },
  chipText: { fontSize: 13, fontWeight: "600", color: colors.SECONDARY },
  activeChipText: { color: colors.DARK },
  buttonContainer: { marginTop: 40, marginBottom: 30 },
  saveBtn: {
    backgroundColor: colors.PRIMARY,
    padding: 18,
    borderRadius: 14,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
  },
  saveBtnText: { color: colors.DARK, fontWeight: "800", fontSize: 16 },
  deleteBtn: {
    backgroundColor: colors.DANGER_COLOR,
    padding: 18,
    borderRadius: 14,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  deleteBtnText: { color: colors.LIGHT, fontWeight: "800", fontSize: 16 },
  errorText: { color: "red", fontSize: 12, marginBottom: 8, marginLeft: 4 },
});
