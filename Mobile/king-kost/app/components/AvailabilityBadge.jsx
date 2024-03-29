import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Colors from "../utils/Colors";

export default AvailabilityBadge = ({ availability, roomCount }) => {
  return (
    <View style={style.container}>
      {availability !== null && (
        <View
          style={{
            height: 30,
            width: roomCount !== 0 ? 70 : 100,
            backgroundColor: roomCount !== 0 ? Colors.GREEN : Colors.RED,
            borderRadius: 5,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ color: Colors.WHITE }}>{availability}</Text>
        </View>
      )}
      {roomCount !== 0 && (
        <Text style={{ fontSize: 13 }}>{roomCount} room</Text>
      )}
    </View>
  );
};

const style = StyleSheet.create({
  availableTag: {
    height: 30,
    width: 70,
    backgroundColor: Colors.GREEN,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    alignItems: "flex-end",
  },
});
