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
import colors from "../../../../constants/colors";

export default function EditEmployee() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
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

  const availableSkills = ["Engine Repair", "Electrical", "Body Wash", "Diagnostics", "Tire Service"];

  useEffect(() => {
    fetchEmployeeDetails();
  }, [id]);

  const fetchEmployeeDetails = async () => {
    try {
      const response = await fetch(`http://192.168.8.186:5000/api/v1/employees`);
      const resData = await response.json();
      
      const employee = resData.payload.data.find(emp => emp._id === id);
      
      if (employee) {
        setForm({
          name: employee.user?.name || "",
          mobile: employee.user?.mobile || "",
          address: employee.user?.address || "",
          nic: employee.nic || "",
          dob: employee.dob ? employee.dob.split('T')[0] : "",
          gender: employee.gender || "MALE",
          isAvailable: employee.isAvailable ?? true,
          skills: employee.skills || [],
          userName: employee.auth?.userName || "",
        });
      }
    } catch (error) {
      Alert.alert("Error", "Failed to load employee details");
    } finally {
      setLoading(false);
    }
  };

  const toggleSkill = (skill) => {
    setForm(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  const handleUpdate = async () => {
    setProcessing(true);  
    try {
      let payload = { ...form };

      // Remove empty password
      if (!payload.password) {
        delete payload.password;
      }
      const response = await fetch(`http://192.168.8.186:5000/api/v1/employees/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        Alert.alert("Success", "Employee updated successfully");
        router.back();
      } else {
        const error = await response.json();
        Alert.alert("Error", error.message || "Update failed");
      }
    } catch (error) {
      Alert.alert("Error", "Server connection failed");
    } finally {
      setProcessing(false);
    }
  };

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
              const response = await fetch(`http://192.168.8.186:5000/api/v1/employees/${id}`, {
                method: "DELETE",
              });
              if (response.ok) {
                router.replace("/(protected)/(admin)/(employee)");
              }
            } catch (e) {
              Alert.alert("Error", "Delete failed");
            }
          } 
        },
      ]
    );
  };

  if (loading) return <ActivityIndicator style={{ flex: 1 }} color={colors.PRIMARY} />;

  return (
    <View style={styles.mainContainer}>
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.sectionLabel}>PERSONAL INFORMATION</Text>
        
        <Text style={styles.fieldLabel}>FULL NAME</Text>
        <TextInput 
          style={styles.input} 
          value={form.name} 
          onChangeText={(v) => setForm({...form, name: v})} 
        />

        <Text style={styles.fieldLabel}>MOBILE NUMBER</Text>
        <TextInput 
          style={styles.input} 
          value={form.mobile} 
          keyboardType="phone-pad"
          onChangeText={(v) => setForm({...form, mobile: v})} 
        />

        <Text style={styles.fieldLabel}>ADDRESS</Text>
        <TextInput 
          style={styles.input} 
          value={form.address} 
          onChangeText={(v) => setForm({...form, address: v})} 
        />

        <Text style={styles.fieldLabel}>USERNAME</Text>
        <TextInput 
           style={styles.input} 
           value={form.userName} 
          onChangeText={(v) => setForm({...form, userName: v})} 
        />

        <Text style={styles.fieldLabel}>PASSWORD</Text>
        <TextInput 
          style={styles.input} 
          value={form.password} 
          secureTextEntry
          placeholder="Leave blank to keep current password"
          onChangeText={(v) => setForm({...form, password: v})} 
        />
        <View style={styles.rowInputs}>
            <View style={{flex: 1, marginRight: 10}}>
                <Text style={styles.fieldLabel}>NIC</Text>
                <TextInput 
                    style={styles.input} 
                    value={form.nic} 
                    onChangeText={(v) => setForm({...form, nic: v})} 
                />
            </View>
            <View style={{flex: 1}}>
                <Text style={styles.fieldLabel}>DATE OF BIRTH</Text>
                <TextInput 
                    style={styles.input} 
                    placeholder="YYYY-MM-DD"
                    value={form.dob} 
                    onChangeText={(v) => setForm({...form, dob: v})} 
                />
            </View>
        </View>

        <Text style={styles.sectionLabel}>GENDER</Text>
        <View style={styles.chipContainer}>
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

        <Text style={styles.sectionLabel}>AVAILABILITY STATUS</Text>
        <View style={styles.chipContainer}>
          <TouchableOpacity 
            style={[styles.chip, form.isAvailable === true && styles.activeChip]}
            onPress={() => setForm({...form, isAvailable: true})}
          >
            <Text style={[styles.chipText, form.isAvailable === true && styles.activeChipText]}>AVAILABLE</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.chip, form.isAvailable === false && styles.activeChip]}
            onPress={() => setForm({...form, isAvailable: false})}
          >
            <Text style={[styles.chipText, form.isAvailable === false && styles.activeChipText]}>UNAVAILABLE</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionLabel}>ASSIGNED SKILLS</Text>
        <View style={styles.chipContainer}>
          {availableSkills.map((skill) => (
            <TouchableOpacity 
              key={skill} 
              onPress={() => toggleSkill(skill)}
              style={[styles.chip, form.skills.includes(skill) && styles.activeChip]}
            >
              <Text style={[styles.chipText, form.skills.includes(skill) && styles.activeChipText]}>
                {skill}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.buttonContainer}>
            <TouchableOpacity 
            style={styles.saveBtn} 
            onPress={handleUpdate}
            disabled={processing}
            >
            {processing ? <ActivityIndicator color={colors.DARK} /> : (
                <>
                <Ionicons name="save-outline" size={20} color={colors.DARK} />
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
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: colors.BACKGROUND_COLOR },
  header: { 
    flexDirection: "row", 
    alignItems: "center", 
    justifyContent: "space-between", 
    paddingTop: 50, 
    paddingBottom: 20, 
    backgroundColor: colors.LIGHT,
    paddingHorizontal: 15
  },
  headerTitle: { fontSize: 18, fontWeight: "800", color: colors.DARK },
  scrollContent: { padding: 20 },
  sectionLabel: { fontSize: 12, fontWeight: "bold", color: colors.SECONDARY, marginTop: 25, marginBottom: 15, letterSpacing: 1 },
  fieldLabel: { fontSize: 11, fontWeight: "700", color: colors.SECONDARY, marginBottom: 8, marginLeft: 4 },
  input: { 
    backgroundColor: colors.LIGHT, 
    padding: 15, 
    borderRadius: 12, 
    borderWidth: 1, 
    borderColor: colors.BORDER_COLOR, 
    marginBottom: 15, 
    color: colors.DARK,
    fontSize: 15 
  },
  rowInputs: { flexDirection: 'row', justifyContent: 'space-between' },
  chipContainer: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 10 },
  chip: { 
    paddingHorizontal: 16, 
    paddingVertical: 10, 
    borderRadius: 25, 
    backgroundColor: colors.LIGHT, 
    borderWidth: 1, 
    borderColor: colors.BORDER_COLOR 
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
    marginBottom: 12
  },
  saveBtnText: { color: colors.DARK, fontWeight: "800", fontSize: 16 },
  deleteBtn: { 
    backgroundColor: colors.DANGER_COLOR, 
    padding: 18, 
    borderRadius: 14, 
    flexDirection: "row", 
    justifyContent: "center", 
    alignItems: "center", 
    gap: 10
  },
  deleteBtnText: { color: colors.LIGHT, fontWeight: "800", fontSize: 16 },
});