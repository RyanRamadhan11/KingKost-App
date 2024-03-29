import React from "react";
import { TouchableOpacity, Image, StyleSheet, Dimensions } from "react-native";
const { width } = Dimensions.get("screen");

export default ImageCardList = ({ interior, index, onPress }) => (
  <TouchableOpacity onPress={() => onPress(index)}>
    <Image source={interior} style={styles.interiorImage} />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  interiorImage: {
    width: width / 3 - 20,
    height: 80,
    marginRight: 10,
    borderRadius: 10,
  },
});
