import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "../constants/colors";

export default function DropdownInput({
  value,
  options,
  onSelect,
  placeholder = "Select...",
  modalTitle = "Select Option",
  disabled = false,
}) {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <>
      <TouchableOpacity
        style={[styles.dropdown, disabled && { backgroundColor: "#F3F4F6", opacity: 0.7 }]}
        activeOpacity={0.7}
        disabled={disabled}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.dropdownText}>{value || placeholder}</Text>
        <Ionicons name="chevron-down" size={20} color={colors.SECONDARY} />
      </TouchableOpacity>


      <Modal visible={modalVisible} transparent animationType="fade">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{modalTitle}</Text>
            </View>
            <View style={{ maxHeight: "70%" }}>
              <ScrollView showsVerticalScrollIndicator={false}>
                {options.map((option, index) => {
                  const isActive = value === option;
                  return (
                    <TouchableOpacity
                      key={`${option}-${index}`}
                      style={styles.modalOption}
                      onPress={() => {
                        onSelect(option);
                        setModalVisible(false);
                      }}
                    >
                      <Text
                        style={[
                          styles.modalOptionText,
                          isActive && styles.modalOptionTextActive,
                        ]}
                      >
                        {option}
                      </Text>
                      {isActive && (
                        <Ionicons
                          name="checkmark-circle"
                          size={22}
                          color={colors.PRIMARY}
                        />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  dropdown: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.LIGHT,
    borderWidth: 1,
    borderColor: colors.BORDER_COLOR,
    borderRadius: 8,
    paddingHorizontal: 16,
    height: 48,
  },
  dropdownText: {
    fontSize: 15,
    color: colors.DARK,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: colors.LIGHT,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
  },
  modalHeader: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.BORDER_COLOR,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.DARK,
    textAlign: "center",
  },
  modalOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: colors.BORDER_COLOR + "40",
  },
  modalOptionText: {
    fontSize: 16,
    color: colors.SECONDARY,
  },
  modalOptionTextActive: {
    color: colors.DARK,
    fontWeight: "bold",
  },
});
