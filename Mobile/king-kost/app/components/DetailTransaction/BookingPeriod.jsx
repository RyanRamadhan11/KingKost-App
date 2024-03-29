import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Colors from "../../utils/Colors";
import MonthTypeConverter from "../../utils/MonthTypeConverter";

export default BookingPeriod = ({ title, selectedMonths }) => {
  const selectedMonthsNumber = MonthTypeConverter.getMonthCount(selectedMonths);

  return (
    <View style={styles.container}>
      <View style={styles.bookingPeriodContent}>
        <Text style={styles.bookingPeriodText}>{title}</Text>
        <View style={styles.pickerContainer}>
          <Text style={styles.monthPeriodText}>
            {selectedMonthsNumber} Month
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: Colors.WEAK_COLOR,
    borderRadius: 10,
  },
  bookingPeriodContent: {
    marginVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  bookingPeriodText: {
    fontSize: 16,
    color: Colors.BLACK,
    fontWeight: "bold",
    marginLeft: 20,
  },
  monthPeriodText: {
    color: Colors.BLACK,
    fontWeight: "bold",
  },
  pickerContainer: {
    backgroundColor: Colors.PRIMARY_COLOR,
    borderRadius: 10,
    width: "40%",
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
    height: 40,
  },
});
