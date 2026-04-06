import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, TextInput, 
  TouchableOpacity, ActivityIndicator, Alert, FlatList, Modal 
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Toast from "react-native-toast-message";
import axios from 'axios';

const JobCardPage = () => {
  const router = useRouter();
  
  // Data State
  const [bookings, setBookings] = useState([]);
  const [packages, setPackages] = useState([]);
  const [services, setServices] = useState([]);
  const [eligibleTeams, setEligibleTeams] = useState([]);
  const [loading, setLoading] = useState(false);

  // UI State
  const [isModalVisible, setModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('packages');

  // Form State
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null); // single selection
  const [mileage, setMileage] = useState("");
  const [createdJobCard, setCreatedJobCard] = useState(null);

  const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [bookRes, pkgRes, svcRes] = await Promise.all([
        axios.get(`${BASE_URL}/job-cards/bookings`),
        axios.get(`${BASE_URL}/job-cards/packages`),
        axios.get(`${BASE_URL}/job-cards/services`)
      ]);
      setBookings(bookRes.data?.payload?.data || []);
      setPackages(pkgRes.data?.payload?.data || []);
      setServices(svcRes.data?.payload?.data || []);
    } catch (err) {
      // toast instead of alert
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Could not fetch data from server",
      });
    } finally {
      setLoading(false);
    }
  };

  // SINGLE SELECTION
  const selectWorkItem = (item) => {
    setSelectedItem(item); // Replace previous selection
  };

  const handleCreateJobCard = async () => {
  if (!selectedBooking || !selectedItem || !mileage) {
    Toast.show({
       type: "error",
       text1: "Missing Information",
       text2: "Please select a vehicle, a service/package, and mileage.",
    });
    return;
  }

  try {
    setLoading(true);

    const response = await axios.post(
      `${BASE_URL}/job-cards`, 
      {
        booking: selectedBooking._id.toString(),
        selectedPackage: selectedItem._id.toString(),
        milageCount: Number(mileage),
      },
    );

    const newCard = response.data?.payload?.data;

    setCreatedJobCard(newCard);
    Toast.show({
      type: "success",
      text1: "Step 1 Complete",
      text2: "Job Card created successfully",
    });

    await fetchAvailableTeams();
  } catch (err) {
    console.log("CREATE JOB CARD ERROR:", err.response?.data);
    Toast.show({
      type: "error",
      text1: "Error",
      text2: err.response?.data?.payload?.message || "Failed to create Job Card",
    });
  } finally {
    setLoading(false);
  }
};

  const fetchAvailableTeams = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/job-cards/eligible-teams`);
      const teams = res.data?.payload?.data || [];
      setEligibleTeams(teams);
    } catch (err) {
      console.error("Teams fetch failed", err);
    }
  };

  const handleAssignTeam = async (teamId) => {
    try {
      setLoading(true);
      await axios.patch(`${BASE_URL}/job-cards/assign`, {
        jobCardId: createdJobCard._id,
        teamId: teamId
      });
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Team assigned successfully",
      });
      router.back(); 
    } catch (err) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Assignment failed",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{flex: 1, backgroundColor: '#F8FAFC'}}>
      <ScrollView contentContainerStyle={{paddingBottom: 40}}>
        <View style={styles.headerCard}>
          <Text style={styles.headerTitle}>Create Job Card</Text>
          <Text style={styles.subText}>Assign an available technical team</Text>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.label}>Select Available Booking</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalList}>
            {bookings?.map((b) => (
              <TouchableOpacity 
                key={b._id} 
                style={[styles.bookingChip, selectedBooking?._id === b._id && styles.activeChip]}
                onPress={() => setSelectedBooking(b)}
              >
                <Ionicons name="car-outline" size={16} color={selectedBooking?._id === b._id ? "#000" : "#718096"} />
                <Text style={[styles.chipText, selectedBooking?._id === b._id && styles.activeChipText]}>
                  {b.vehicle?.licensePlate || "N/A"}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <Text style={styles.label}>Service / Package</Text>
          <TouchableOpacity style={styles.selectorInput} onPress={() => setModalVisible(true)}>
            <Text style={[styles.selectorText, !selectedItem && {color: '#A0AEC0'}]} numberOfLines={1}>
              {selectedItem ? selectedItem.name || selectedItem.packageName || selectedItem.serviceName : "Select Package or Service..."}
            </Text>
            <Ionicons name="chevron-down" size={20} color="#718096" />
          </TouchableOpacity>

          <Text style={styles.label}>Current Mileage (km)</Text>
          <View style={styles.inputWrapper}>
            <TextInput 
              placeholder="e.g. 25000" 
              style={styles.textInput}
              keyboardType="numeric"
              value={mileage}
              onChangeText={setMileage}
            />
          </View>

          {!createdJobCard && (
            <TouchableOpacity style={styles.primaryBtn} onPress={handleCreateJobCard} disabled={loading}>
              {loading ? <ActivityIndicator color="#1A202C" /> : <Text style={styles.primaryBtnText}>GENERATE JOB CARD</Text>}
            </TouchableOpacity>
          )}
        </View>

        {createdJobCard && (
          <View style={styles.assignmentSection}>
            <View style={styles.divider} />
            <Text style={styles.sectionTitle}>Available Teams</Text>
            {eligibleTeams.length > 0 ? (
              eligibleTeams.map((team) => (
                <View key={team._id} style={styles.teamCard}>
                  <View style={styles.teamInfo}>
                    <View style={styles.teamAvatar}>
                      <Text style={styles.avatarInitial}>{team.name?.charAt(0)}</Text>
                    </View>
                    <View>
                      <Text style={styles.teamName}>{team.name}</Text>
                      <Text style={styles.teamStatus}>{team.employees?.length || 0} Members Available</Text>
                    </View>
                  </View>
                  <TouchableOpacity style={styles.assignBtn} onPress={() => handleAssignTeam(team._id)}>
                    <Text style={styles.assignBtnText}>Assign</Text>
                  </TouchableOpacity>
                </View>
              ))
            ) : (
              <View style={styles.emptyState}>
                <Ionicons name="people-outline" size={40} color="#CBD5E0" />
                <Text style={styles.emptyText}>No teams are available right now.</Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>

      {/* MODAL */}
      <Modal visible={isModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Work Type</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close-circle" size={28} />
              </TouchableOpacity>
            </View>
            <View style={styles.tabBar}>
              <TouchableOpacity 
                style={[styles.tab, activeTab === 'packages' && styles.activeTab]} 
                onPress={() => setActiveTab('packages')}
              >
                <Text style={activeTab === 'packages' ? styles.activeTabLabel : styles.tabLabel}>Packages</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.tab, activeTab === 'services' && styles.activeTab]} 
                onPress={() => setActiveTab('services')}
              >
                <Text style={activeTab === 'services' ? styles.activeTabLabel : styles.tabLabel}>Services</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={activeTab === 'packages' ? packages : services}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => {
                const isSelected = selectedItem?._id === item._id;
                return (
                  <TouchableOpacity 
                    style={[styles.listItem, isSelected && { backgroundColor: '#F0FDF4' }]} 
                    onPress={() => selectWorkItem(item)}
                  >
                    <View>
                      <Text style={styles.listItemTitle}>{item.name || item.packageName || item.serviceName}</Text>
                      <Text style={styles.listItemPrice}>Rs. {item.price || item.basePrice || '0.00'}</Text>
                    </View>
                    <Ionicons 
                      name={isSelected ? "checkmark-circle" : "add-circle"} 
                      size={24} 
                      color={isSelected ? "#48BB78" : "#B2F113"} 
                    />
                  </TouchableOpacity>
                );
              }}
            />
            <TouchableOpacity 
              style={[styles.primaryBtn, { marginTop: 15 }]} 
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.primaryBtnText}>
                DONE {selectedItem ? `- ${selectedItem.name || selectedItem.packageName || selectedItem.serviceName}` : ''}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  // --- Keep all your existing styles unchanged ---
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  divider: { height: 1, backgroundColor: '#E2E8F0', marginBottom: 25 },
  headerCard: { padding: 25, backgroundColor: '#FFFFFF', borderBottomLeftRadius: 30, borderBottomRightRadius: 30, elevation: 2 },
  headerTitle: { fontSize: 26, fontWeight: '800', color: '#1A202C' },
  subText: { fontSize: 14, color: '#718096', marginTop: 5 },
  formContainer: { padding: 20 },
  label: { fontSize: 13, fontWeight: '700', color: '#4A5568', textTransform: 'uppercase', marginTop: 20, marginBottom: 10 },
  horizontalList: { flexDirection: 'row', marginBottom: 5 },
  bookingChip: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, paddingVertical: 12, backgroundColor: '#FFFFFF', borderRadius: 12, marginRight: 10, borderWidth: 1, borderColor: '#E2E8F0' },
  activeChip: { backgroundColor: '#B2F113', borderColor: '#B2F113' },
  chipText: { marginLeft: 8, fontWeight: '600', color: '#4A5568' },
  activeChipText: { color: '#000000' },
  selectorInput: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFFFFF', borderRadius: 12, paddingHorizontal: 15, height: 60, borderWidth: 1, borderColor: '#E2E8F0' },
  selectorText: { fontSize: 16, fontWeight: '500', color: '#1A202C' },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 12, paddingHorizontal: 15, height: 60, borderWidth: 1, borderColor: '#E2E8F0' },
  textInput: { flex: 1, fontSize: 16, color: '#1A202C' },
  primaryBtn: { backgroundColor: '#B2F113', height: 60, borderRadius: 15, justifyContent: 'center', alignItems: 'center', marginTop: 35, elevation: 4 },
  primaryBtnText: { fontSize: 16, fontWeight: '900', letterSpacing: 1, color: '#1A202C' },
  assignmentSection: { padding: 20 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#1A202C', marginBottom: 15 },
  teamCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFFFFF', padding: 15, borderRadius: 15, marginBottom: 12, elevation: 1 },
  teamInfo: { flexDirection: 'row', alignItems: 'center' },
  teamAvatar: { width: 45, height: 45, borderRadius: 22.5, backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  avatarInitial: { fontWeight: 'bold', color: '#64748B' },
  teamName: { fontSize: 16, fontWeight: '700', color: '#1A202C' },
  teamStatus: { fontSize: 12, color: '#48BB78', marginTop: 2 },
  assignBtn: { backgroundColor: '#1A202C', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 10 },
  assignBtnText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 13 },
  emptyState: { alignItems: 'center', marginTop: 30 },
  emptyText: { color: '#94A3B8', marginTop: 10 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 30, borderTopRightRadius: 30, height: '75%', padding: 25 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 20, fontWeight: '800' },
  tabBar: { flexDirection: 'row', backgroundColor: '#F1F5F9', borderRadius: 12, padding: 5, marginBottom: 20 },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 10 },
  activeTab: { backgroundColor: '#FFFFFF', elevation: 2 },
  tabLabel: { fontWeight: '700', color: '#64748B' },
  activeTabLabel: { color: '#1A202C' },
  listItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 18, paddingHorizontal: 10, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  listItemTitle: { fontSize: 16, fontWeight: '700', color: '#1A202C' },
  listItemPrice: { fontSize: 14, color: '#94A3B8', marginTop: 4 }
});
export default JobCardPage;