import React from "react";
import {
  Pressable,
  Text,
  Image,
  StyleSheet,
  View,
  Dimensions,
} from "react-native";
import Colors from "../../utils/Colors";
const { width } = Dimensions.get("screen");

export default KostAreaCard = ({ onPress, kostArea }) => {
  return (
    <Pressable
      activeOpacity={0.8}
      onPress={() => onPress(kostArea.provinceId, kostArea.cityId)}
    >
      <View style={styles.cardKostArea}>
        <Image source={kostArea.image} style={styles.cardImageKostArea} />
        <View style={styles.centeredTextContainer}>
          <Text
            style={{ fontWeight: "bold", color: Colors.BLACK, fontSize: 16 }}
          >
            {kostArea.city}
          </Text>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  cardKostArea: {
    height: 180,
    backgroundColor: Colors.WHITE,
    elevation: 10,
    width: width / 2,
    marginRight: 20,
    borderRadius: 20,
  },
  centeredTextContainer: {
    position: "absolute",
    top: "27.8%",
    left: width / 8.25,
    transform: [{ translateX: -50 }, { translateY: -50 }],
    backgroundColor: Colors.PRIMARY_COLOR,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderTopStartRadius: 14,
    borderBottomEndRadius: 14,
  },
  cardImageKostArea: {
    width: "100%",
    height: "100%",
    borderRadius: 15,
  },
});
