import React from "react";
import {
  Pressable,
  Text,
  StyleSheet,
  View,
  Dimensions,
  Image,
} from "react-native";
import Colors from "../../utils/Colors";
import {
  Fontisto,
  FontAwesome5,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import formatCurrencyIDR from "../../utils/formatCurrencyIDR";
const { width } = Dimensions.get("screen");

export default KostCard = ({ kost, navigation }) => {
  return (
    <Pressable
      activeOpacity={0.8}
      onPress={() => navigation.navigate("DetailKostScreen", kost)}
    >
      <View style={styles.card}>
        {kost.image !== null ? (
          <Image source={{ uri: kost.image }} style={styles.cardImage} />
        ) : (
          <Image
            source={require("../../../assets/images/default-image.png")}
            style={styles.cardImage}
          />
        )}
        <View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 10,
            }}
          >
            <Text
              style={{ fontSize: 16, fontWeight: "bold" }}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {kost.title}
            </Text>
            <Text
              style={{ fontWeight: "bold", color: Colors.GREEN, fontSize: 16 }}
            >
              {formatCurrencyIDR(kost.price)}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 5,
            }}
          >
            <Text style={{ color: Colors.GREY, fontSize: 14, marginTop: 5 }}>
              {kost.city}
            </Text>
            <Image
              style={{ marginTop: 5, width: kost.gender != "campur" ? 25 : 35, height: 25 }}
              source={
                kost.gender == "male"
                  ? require("../../../assets/icons/male.jpg")
                  : kost.gender == "campur" ? require("../../../assets/icons/mix.jpg") : require("../../../assets/icons/female.jpg")
              }
            />
          </View>
          <View style={{ marginTop: 10, flexDirection: "row" }}>
            {kost.isWifi ? (
              <View style={styles.facility}>
                <Fontisto name="wifi-logo" size={20} color="black" />
              </View>
            ) : null}
            {kost.isParking ? (
              <View style={styles.facility}>
                <FontAwesome5 name="parking" size={20} color="black" />
              </View>
            ) : null}
            {kost.isAc ? (
              <View style={styles.facility}>
                <MaterialCommunityIcons
                  name="air-conditioner"
                  size={20}
                  color="black"
                />
              </View>
            ) : null}
          </View>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    height: 350,
    backgroundColor: Colors.WHITE,
    elevation: 10,
    width: width / 1.2,
    marginRight: 20,
    padding: 15,
    borderRadius: 20,
  },
  cardImage: {
    width: "100%",
    height: 220,
    borderRadius: 15,
  },
  facility: { flexDirection: "row", marginRight: 15 },
});
