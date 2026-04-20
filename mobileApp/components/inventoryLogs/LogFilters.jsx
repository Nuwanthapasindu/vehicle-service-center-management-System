import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Calendar, Filter, ChevronRight, Activity } from 'lucide-react-native';
import colors from '../../constants/colors';
import enums from '../../constants/enums';

const LogFilters = ({ 
  actionType, 
  setActionType, 
  actionTypes, 
  period, 
  setPeriod,
  startDate,
  setStartDate,
  endDate,
  setEndDate 
}) => {
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const periods = [
    { label: 'All', value: enums.LOG_PERIODS.ALL },
    { label: 'Today', value: enums.LOG_PERIODS.TODAY },
    { label: 'Weekly', value: enums.LOG_PERIODS.WEEKLY },
    { label: 'Monthly', value: enums.LOG_PERIODS.MONTHLY },
    { label: 'Yearly', value: enums.LOG_PERIODS.YEARLY },
    { label: 'Custom', value: enums.LOG_PERIODS.CUSTOM },
  ];

  const onStartDateChange = (event, selectedDate) => {
    setShowStartPicker(false);
    if (selectedDate) setStartDate(selectedDate);
  };

  const onEndDateChange = (event, selectedDate) => {
    setShowEndPicker(false);
    if (selectedDate) setEndDate(selectedDate);
  };

  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <View style={styles.actionHeader}>
          <Activity size={16} color={colors.PRIMARY} />
          <Text style={styles.sectionLabel}>Action Type</Text>
        </View>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={actionType}
            onValueChange={(v) => setActionType(v)}
            style={styles.picker}
            dropdownIconColor={colors.PRIMARY}
            mode="dropdown"
          >
            <Picker.Item label="All Movement Types" value="" />
            {actionTypes.map((type) => (
              <Picker.Item key={type} label={type} value={type} />
            ))}
          </Picker>
        </View>
      </View>

      <View style={styles.periodSection}>
        <Text style={styles.sectionLabel}>Select Period</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsContainer}
        >
          {periods.map((p) => {
            const isActive = period === p.value;
            return (
              <TouchableOpacity
                key={p.value}
                style={[styles.chip, isActive && styles.activeChip]}
                onPress={() => setPeriod(p.value)}
                activeOpacity={0.7}
              >
                <Text style={[styles.chipText, isActive && styles.activeChipText]}>
                  {p.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
      
      {period === enums.LOG_PERIODS.CUSTOM && (
        <View style={styles.customDateContainer}>
          <View style={styles.dateRow}>
            <TouchableOpacity 
              style={styles.dateInput} 
              onPress={() => setShowStartPicker(true)}
            >
              <Text style={styles.dateLabel}>Starting From</Text>
              <View style={styles.dateValueRow}>
                <Calendar size={14} color={colors.PRIMARY} />
                <Text style={styles.dateValue}>{startDate.toLocaleDateString()}</Text>
              </View>
            </TouchableOpacity>

            <View style={styles.dateDivider}>
              <ChevronRight size={16} color="#adb5bd" />
            </View>

            <TouchableOpacity 
              style={styles.dateInput} 
              onPress={() => setShowEndPicker(true)}
            >
              <Text style={styles.dateLabel}>Ending At</Text>
              <View style={styles.dateValueRow}>
                <Calendar size={14} color={colors.PRIMARY} />
                <Text style={styles.dateValue}>{endDate.toLocaleDateString()}</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {showStartPicker && (
        <DateTimePicker
          value={startDate}
          mode="date"
          display="default"
          onChange={onStartDateChange}
          maximumDate={endDate}
        />
      )}

      {showEndPicker && (
        <DateTimePicker
          value={endDate}
          mode="date"
          display="default"
          onChange={onEndDateChange}
          minimumDate={startDate}
          maximumDate={new Date()}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f5',
    paddingBottom: 4,
  },
  topSection: {
    padding: 16,
    paddingBottom: 10,
  },
  actionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.SECONDARY,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  pickerContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
    overflow: 'hidden',
    height: 50,
    justifyContent: 'center',
  },
  picker: {
    width: '100%',
    color: colors.DARK,
  },
  periodSection: {
    paddingLeft: 16,
    marginBottom: 16,
  },
  chipsContainer: {
    paddingRight: 16,
    paddingTop: 10,
    gap: 10,
  },
  chip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    backgroundColor: '#f1f3f5',
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  activeChip: {
    backgroundColor: colors.PRIMARY,
    borderColor: colors.PRIMARY,
    shadowColor: colors.PRIMARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6c757d',
  },
  activeChipText: {
    color: '#fff',
  },
  customDateContainer: {
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateInput: {
    flex: 1,
  },
  dateLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#adb5bd',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  dateValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dateValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.DARK,
  },
  dateDivider: {
    paddingHorizontal: 12,
  },
});

export default LogFilters;
