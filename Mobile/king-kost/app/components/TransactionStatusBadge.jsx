import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Colors from "../utils/Colors";

const TransactionStatusBadge = ({ status, date }) => {
  let badgeColor = Colors.DEFAULT;
  let statusText = "";

  switch (status) {
    case 0:
      badgeColor = Colors.PRIMARY_COLOR;
      statusText = "Pending";
      break;
    case 3:
      badgeColor = Colors.GREEN;
      statusText = "Approved";
      break;
    case 2:
      badgeColor = Colors.RED;
      statusText = "Rejected";
      break;
    case 1:
      badgeColor = Colors.GREY;
      statusText = "Cancelled";
      break;
    default:
      statusText = "Unknown";
  }

  return (
    <View style={styles.container}>
      <View
        style={{
          height: 30,
          width: date !== 0 ? 70 : 100,
          backgroundColor: badgeColor,
          borderRadius: 5,
          justifyContent: "center",
          alignItems: "center",
          marginRight: -2,
        }}
      >
        <Text style={{ color: Colors.WHITE }}>{statusText}</Text>
      </View>
      <Text style={{ fontSize: 13 }}>{date}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "flex-end",
  },
});

export default TransactionStatusBadge;
