import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import colors from "../../../../../constants/colors";
import enums from "../../../../../constants/enums";
import { Formik } from "formik";
import Toast from "react-native-toast-message";
import AddEmployeeSchema from "../../../../../schema/AddEmployeeSchema";
import axios from "axios";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function AddEmployee() {
  const router = useRouter();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);



  const toggleSkill = (values, setFieldValue, skill) => {
    if (values.skills.includes(skill)) {
      setFieldValue(
        "skills",
        values.skills.filter((s) => s !== skill),
      );
    } else {
      setFieldValue("skills", [...values.skills, skill]);
    }
  };

  const handleCreate = async (values) => {
    try {
      const response = await axios.post("/employees", values);

      if (response.status === 201) {
        // show success toast instead of Alert
        Toast.show({
          type: "success",
          text1: "Success",
          text2: "Employee registered successfully",
        });

        router.replace("/(protected)/(admin)/staff/(employee)");
      }
    } catch (error) {
      const message =
        error?.response?.data?.payload?.message ||
        "Employee registration failed";

      // show error toast instead of Alert
      Toast.show({
        type: "error",
        text1: "Error",
        text2: message,
      });
    }
  };

  return (
    <Formik
      initialValues={{
        name: "",
        mobile: "",
        address: "",
        role: enums.USER_ROLES.MECHANIC,
        dob: "",
        nic: "",
        skills: [],
        gender: "MALE",
        userName: "",
        password: "",
      }}
      validationSchema={AddEmployeeSchema}
      onSubmit={handleCreate}
    >
      {({
        values,
        handleChange,
        handleSubmit,
        setFieldValue,
        errors,
        touched,
      }) => (
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <ScrollView
            style={styles.container}
            contentContainerStyle={{ padding: 20 }}
          >
            <Text style={styles.sectionLabel}>PERSONAL INFORMATION</Text>

            {errors.name && touched.name && (
              <Text style={{ color: "red" }}>{errors.name}</Text>
            )}
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              value={values.name}
              onChangeText={handleChange("name")}
            />

            {errors.mobile && touched.mobile && (
              <Text style={{ color: "red" }}>{errors.mobile}</Text>
            )}
            <TextInput
              style={styles.input}
              placeholder="Mobile Number"
              keyboardType="phone-pad"
              value={values.mobile}
              onChangeText={handleChange("mobile")}
            />

            {errors.address && touched.address && (
              <Text style={{ color: "red" }}>{errors.address}</Text>
            )}
            <TextInput
              style={styles.input}
              placeholder="Address"
              value={values.address}
              onChangeText={handleChange("address")}
            />

            {errors.nic && touched.nic && (
              <Text style={{ color: "red" }}>{errors.nic}</Text>
            )}
            <TextInput
              style={styles.input}
              placeholder="NIC"
              value={values.nic}
              onChangeText={handleChange("nic")}
            />

            {errors.dob && touched.dob && (
              <Text style={{ color: "red" }}>{errors.dob}</Text>
            )}
            <TouchableOpacity
              style={styles.input}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={{ color: values.dob ? colors.DARK : colors.SECONDARY, paddingTop: 3 }}>
                {values.dob || "Date of Birth (YYYY-MM-DD)"}
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

            {errors.gender && touched.gender && (
              <Text style={{ color: "red" }}>{errors.gender}</Text>
            )}
            <Text style={styles.sectionLabel}>GENDER</Text>
            <View style={styles.rowContainer}>
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

            <Text style={styles.sectionLabel}>ASSIGN SKILLS</Text>
            <View style={styles.rowContainer}>
              {enums.AVAILABLE_SKILLS.map((skill) => (
                <TouchableOpacity
                  key={skill}
                  style={[
                    styles.chip,
                    values.skills.includes(skill) && styles.activeChip,
                  ]}
                  onPress={() => toggleSkill(values, setFieldValue, skill)}
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
            </View>
            {errors.skills && touched.skills && (
              <Text style={{ color: "red" }}>{errors.skills}</Text>
            )}

            <Text style={styles.sectionLabel}>ACCESS CONTROL</Text>
            <View style={styles.rowContainer}>
              {Object.values(enums.USER_ROLES).filter(r=>r !== enums.USER_ROLES.CUSTOMER).map((r) => (
                <TouchableOpacity
                  key={r}
                  style={[styles.chip, values.role === r && styles.activeChip]}
                  onPress={() => setFieldValue("role", r)}
                >
                  <Text
                    style={[
                      styles.chipText,
                      values.role === r && styles.activeChipText,
                    ]}
                  >
                    {r}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {errors.role && touched.role && (
              <Text style={{ color: "red" }}>{errors.role}</Text>
            )}

            <Text style={styles.sectionLabel}>SECURITY</Text>
            {errors.userName && touched.userName && (
              <Text style={{ color: "red" }}>{errors.userName}</Text>
            )}
            <TextInput
              style={styles.input}
              placeholder="Username"
              value={values.userName}
              onChangeText={handleChange("userName")}
            />

            {errors.password && touched.password && (
              <Text style={{ color: "red" }}>{errors.password}</Text>
            )}
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Password"
                secureTextEntry={!isPasswordVisible}
                value={values.password}
                onChangeText={handleChange("password")}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setIsPasswordVisible(!isPasswordVisible)}
              >
                <Ionicons
                  name={isPasswordVisible ? "eye-outline" : "eye-off-outline"}
                  size={22}
                  color={colors.SECONDARY}
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
              <Ionicons
                name="person-add-outline"
                size={20}
                color={colors.DARK}
              />
              <Text style={styles.submitBtnText}>Create Employee</Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      )}
    </Formik>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.BACKGROUND_COLOR },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "bold",
    color: colors.SECONDARY,
    marginTop: 20,
    marginBottom: 10,
  },
  input: {
    backgroundColor: colors.LIGHT,
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.BORDER_COLOR,
    marginBottom: 12,
    color: colors.DARK,
    height: 50,
  },
  rowContainer: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.LIGHT,
    borderWidth: 1,
    borderColor: colors.BORDER_COLOR,
  },
  activeChip: { backgroundColor: colors.PRIMARY, borderColor: colors.PRIMARY },
  chipText: { color: colors.SECONDARY, fontWeight: "600" },
  activeChipText: { color: colors.DARK },
  submitBtn: {
    backgroundColor: colors.PRIMARY,
    padding: 18,
    borderRadius: 14,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
    marginBottom: 40,
    gap: 10,
  },
  submitBtnText: { fontSize: 18, fontWeight: "bold", color: colors.DARK },
  // ---STYLES FOR PASSWORD CONTAINER ---
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.LIGHT,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.BORDER_COLOR,
    marginBottom: 12,
    height: 50,
  },
  passwordInput: {
    flex: 1,
    padding: 15,
    color: colors.DARK,
  },
  eyeIcon: {
    paddingHorizontal: 15,
  },
});
