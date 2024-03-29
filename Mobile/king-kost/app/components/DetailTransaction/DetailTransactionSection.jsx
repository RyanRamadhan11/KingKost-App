import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import {
  Fontisto,
  FontAwesome5,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import Colors from "../../utils/Colors";

export default DetailTransactionSection = ({
  title,
  city,
  subdistrict,
  province,
  wifi,
  parking,
  airConditioner,
  description,
  gender,
  type,
}) => {
  return (
    <View style={style.detailsContainer}>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <View>
          <Text
            style={{ fontSize: 20, fontWeight: "bold" }}
            ellipsizeMode="tail"
          >
            {title}
          </Text>
          {city !== null && (
            <Text
              style={{ fontSize: 16, color: Colors.GREY }}
              ellipsizeMode="tail"
              numberOfLines={1}
            >
              {subdistrict}
            </Text>
          )}
          {city !== null && (
            <Text
              style={{ fontSize: 16, color: Colors.GREY }}
              ellipsizeMode="tail"
              numberOfLines={1}
            >
              {city}
            </Text>
          )}
          {city !== null && (
            <Text
              style={{ fontSize: 16, color: Colors.GREY }}
              ellipsizeMode="tail"
              numberOfLines={1}
            >
              {province}
            </Text>
          )}
          <View style={{ flexDirection: "row" }}>
            <Text style={{ fontSize: 16, color: Colors.GREY }}>
              Gender type:{""}
            </Text>
            <Image
              style={{
                width: type == "campur" ? 35 : 25,
                height: type == "campur" ? 25 : 20,
              }}
              source={gender}
            />
          </View>
        </View>
        <View>
          <View style={{ marginTop: 10, flexDirection: "row" }}>
            {wifi !== false && (
              <View style={style.facility}>
                <Fontisto name="wifi-logo" size={20} color="black" />
              </View>
            )}
            {parking !== false && (
              <View style={style.facility}>
                <FontAwesome5 name="parking" size={20} color="black" />
              </View>
            )}
            {airConditioner !== false && (
              <View style={style.facility}>
                <MaterialCommunityIcons
                  name="air-conditioner"
                  size={20}
                  color="black"
                />
              </View>
            )}
          </View>
        </View>
      </View>
      <Text style={{ marginTop: 20, color: Colors.GREY }}>{description}</Text>
    </View>
  );
};

const style = StyleSheet.create({
  detailsContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  facility: {
    flexDirection: "row",
    marginRight: 15,
  },
});
