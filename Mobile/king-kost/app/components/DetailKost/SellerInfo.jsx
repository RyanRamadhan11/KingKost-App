import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import Colors from "../../utils/Colors";
import { FontAwesome } from "@expo/vector-icons";

export default SellerInfo = ({ seller, phone, image, onPress }) => {
  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <Image
          style={styles.profileImage}
          source={
            image == null
              ? require("../../../assets/images/default-profile.jpg")
              : { uri: image }
          }
        />
        <View
          style={{
            justifyContent: "space-between",
            flexDirection: "row",
            flex: 1,
          }}
        >
          <View style={styles.sellerInfo}>
            <Text style={styles.sellerName}>{seller ?? ""}</Text>
            <View style={styles.whatsappContainer}>
              <FontAwesome
                name="whatsapp"
                size={20}
                color={Colors.BLACK}
                style={styles.whatsappIcon}
              />
              <Text style={styles.whatsappText}>{phone ?? ""}</Text>
            </View>
          </View>
          <TouchableOpacity onPress={onPress}>
            <View
              style={{
                height: 40,
                borderRadius: 10,
                backgroundColor: Colors.WHITE,
                alignSelf: "center",
              }}
            >
              <Text
                style={{
                  margin: 10,
                  alignItems: "center",
                  alignContent: "center",
                  alignSelf: "center",
                }}
              >
                Chat Now
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = {
  container: {
    marginHorizontal: 20,
    marginVertical: 20,
    backgroundColor: Colors.WEAK_COLOR,
    borderRadius: 10,
  },
  profileContainer: {
    marginVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: Colors.GREY,
  },
  sellerInfo: {
    marginLeft: 20,
  },
  sellerName: {
    fontSize: 16,
    color: Colors.BLACK,
    fontWeight: "bold",
  },
  whatsappContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  whatsappIcon: {
    marginRight: 8,
  },
};
