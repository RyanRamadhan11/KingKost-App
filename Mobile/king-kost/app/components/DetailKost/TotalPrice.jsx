import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Colors from "../../utils/Colors";

export default TotalPrice = ({ text, calculateTotalPrice, onPress }) => {
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.totalPriceText}>Price</Text>
        <Text style={styles.totalPriceValue}>{calculateTotalPrice()}</Text>
      </View>
      <View style={styles.bookNowContainer}>
        <TouchableOpacity style={styles.bookNowButton} onPress={onPress}>
          <Text style={{ color: Colors.BLACK, fontWeight: "bold" }}>
            {text}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = {
  container: {
    height: 70,
    backgroundColor: Colors.WHITE,
    borderRadius: 10,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  totalPriceText: {
    fontSize: 16,
    color: Colors.BLACK,
    fontWeight: "bold",
  },
  totalPriceValue: {
    color: Colors.GREEN,
    fontWeight: "bold",
    fontSize: 18,
  },
  bookNowButton: {
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.PRIMARY_COLOR,
    borderRadius: 10,
    paddingHorizontal: 20,
  },
};
