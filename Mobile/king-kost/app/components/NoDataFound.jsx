import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

export default NoDataFound = ({description}) => {
  return (
    <View style={{ alignItems: "center", marginBottom: 20 }}>
      <View style={styles.containerDataNotFound}>
        <Image
          source={require("../../assets/images/data-notfound.jpg")}
          style={styles.imageNotFound}
        />
      </View>
      <Text>{description}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  containerDataNotFound: {
    alignItems: "center",
    marginVertical: 10,
    borderRadius: 10,
  },
  imageNotFound: {
    width: 200,
    height: 200,
    resizeMode: "contain",
    borderRadius: 20,
  },
});
