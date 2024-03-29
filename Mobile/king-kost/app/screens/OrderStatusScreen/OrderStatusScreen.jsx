import React, { useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import Colors from "../../utils/Colors";
import { OpenWhatsApp } from "../../utils/OpenWhatsapp";

export default OrderStatusScreen = ({ navigation, route }) => {
  const dataOrder = route.params
  const [orderStatus, setOrderStatus] = useState(null);
  console.log(dataOrder);

  return (
    <View style={styles.container}>
      <Image
        source={require("../../../assets/images/order-status.png")}
        style={styles.image}
      />
      <Text style={styles.orderStatus}>
        {dataOrder.aprStatus === 0
          ? "Order in progress"
          : dataOrder.aprStatus === 1
            ? "Order has been canceled by you"
            : dataOrder.aprStatus === 2
              ? "Order failed"
              : "Order successful"}
      </Text>
      <View>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate("Transaction")}
        >
          <Text style={{ color: Colors.BLACK, fontWeight: "bold" }}>
            Check your order
          </Text>
        </TouchableOpacity>
      </View>
      <View style={{ marginTop : 20 }}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => OpenWhatsApp(phone=dataOrder.kost.seller?.phoneNumber ?? "", message=`Halo, Saya sudah memesan kost ${dataOrder.kost.name ?? ""}`)}
        >
          <Text style={{ color: Colors.BLACK, fontWeight: "bold" }}>
            Chat Seller
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  orderStatus: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  backButton: {
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.PRIMARY_COLOR,
    borderRadius: 10,
    paddingHorizontal: 20,
  },
});
