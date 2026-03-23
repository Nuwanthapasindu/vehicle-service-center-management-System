import React, { useState } from "react";
import { StyleSheet, Text, View, ScrollView, TextInput, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import colors from "../../../../constants/colors";
import enums from "../../../../constants/enums";

export default function AddEmployee() {
  const router = useRouter();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [form, setForm] = useState({
    name: "", 
    mobile: "", 
    address: "", 
    role: enums.USER_ROLES.MECHANIC,
    dob: "", 
    nic: "", 
    skills: [], 
    gender: "MALE", 
    userName: "", 
    password: ""
  });

  const availableSkills = ["Engine Repair", "Electrical", "Body Wash", "Diagnostics", "Tire Service"];

  const toggleSkill = (skill) => {
    setForm(prev => ({
      ...prev,
      skills: prev.skills.includes(skill) 
        ? prev.skills.filter(s => s !== skill) 
        : [...prev.skills, skill]
    }));
  };

  const handleCreate = async () => {
    try {
      const response = await fetch("http://192.168.8.186:5000/api/v1/employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        Alert.alert("Success", "Employee registered successfully");
        // Use replace to force navigation back to the directory/index
        router.replace("/(protected)/(admin)/(employee)"); 
      } else {
        const errorData = await response.json();
        Alert.alert("Error", errorData.message || "Registration failed");
      }
    } catch (error) {
      Alert.alert("Error", "Connection to server failed");
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 20 }}>
      <Text style={styles.sectionLabel}>PERSONAL INFORMATION</Text>
      <TextInput style={styles.input} placeholder="Full Name" onChangeText={(v) => setForm({...form, name: v})} />
      <TextInput style={styles.input} placeholder="Mobile Number" keyboardType="phone-pad" onChangeText={(v) => setForm({...form, mobile: v})} />
      <TextInput style={styles.input} placeholder="Address" onChangeText={(v) => setForm({...form, address: v})} />
      <TextInput style={styles.input} placeholder="NIC" onChangeText={(v) => setForm({...form, nic: v})} />
      
      {/* Date of Birth Field */}
      <TextInput 
        style={styles.input} 
        placeholder="Date of Birth (YYYY-MM-DD)" 
        onChangeText={(v) => setForm({...form, dob: v})} 
      />

      <Text style={styles.sectionLabel}>GENDER</Text>
      <View style={styles.rowContainer}>
        {["MALE", "FEMALE"].map((g) => (
          <TouchableOpacity 
            key={g} 
            style={[styles.chip, form.gender === g && styles.activeChip]}
            onPress={() => setForm({...form, gender: g})}
          >
            <Text style={[styles.chipText, form.gender === g && styles.activeChipText]}>{g}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.sectionLabel}>ASSIGN SKILLS</Text>
      <View style={styles.rowContainer}>
        {availableSkills.map((skill) => (
          <TouchableOpacity 
            key={skill} 
            style={[styles.chip, form.skills.includes(skill) && styles.activeChip]}
            onPress={() => toggleSkill(skill)}
          >
            <Text style={[styles.chipText, form.skills.includes(skill) && styles.activeChipText]}>{skill}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.sectionLabel}>ACCESS CONTROL</Text>
      <View style={styles.rowContainer}>
        {Object.values(enums.USER_ROLES).map((r) => (
          <TouchableOpacity 
            key={r} 
            style={[styles.chip, form.role === r && styles.activeChip]}
            onPress={() => setForm({...form, role: r})}
          >
            <Text style={[styles.chipText, form.role === r && styles.activeChipText]}>{r}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.sectionLabel}>SECURITY</Text>
      <TextInput style={styles.input} placeholder="Username" onChangeText={(v) => setForm({...form, userName: v})} />
      {/* --- CHANGED PLACE: PASSWORD FIELD WITH EYE ICON --- */}
      <View style={styles.passwordContainer}>
        <TextInput 
          style={styles.passwordInput} 
          placeholder="Password" 
          secureTextEntry={!isPasswordVisible} // Toggle visibility
          onChangeText={(v) => setForm({...form, password: v})} 
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

      <TouchableOpacity style={styles.submitBtn} onPress={handleCreate}>
        <Ionicons name="person-add-outline" size={20} color={colors.DARK} />
        <Text style={styles.submitBtnText}>Create Employee</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.BACKGROUND_COLOR },
  sectionLabel: { fontSize: 12, fontWeight: "bold", color: colors.SECONDARY, marginTop: 20, marginBottom: 10 },
  input: { backgroundColor: colors.LIGHT, padding: 15, borderRadius: 12, borderWidth: 1, borderColor: colors.BORDER_COLOR, marginBottom: 12, color: colors.DARK,height: 50,},
  rowContainer: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  chip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: colors.LIGHT, borderWidth: 1, borderColor: colors.BORDER_COLOR },
  activeChip: { backgroundColor: colors.PRIMARY, borderColor: colors.PRIMARY },
  chipText: { color: colors.SECONDARY, fontWeight: "600" },
  activeChipText: { color: colors.DARK },
  submitBtn: { backgroundColor: colors.PRIMARY, padding: 18, borderRadius: 14, flexDirection: "row", justifyContent: "center", alignItems: "center", marginTop: 30, marginBottom: 40, gap: 10 },
  submitBtnText: { fontSize: 18, fontWeight: "bold", color: colors.DARK },
  // --- ADDED STYLES FOR PASSWORD CONTAINER ---
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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