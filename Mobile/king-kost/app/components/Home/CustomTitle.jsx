import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Colors from "../../utils/Colors";

export default CustomTitle = ({ title, subTitle, onPress }) => {
  return (

    <View style={styles.headerContainer}>
      <View>
        <Text style={styles.title}>{title}</Text>
      </View>
      {subTitle ?
        <TouchableOpacity onPress={onPress}>
          <View style={styles.container}>
            <Text style={styles.subTitle}>{subTitle}</Text>
          </View>
        </TouchableOpacity> : null
      }
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  title: {
    color: Colors.BLACK,
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 4,
  },
  container: {
    backgroundColor: Colors.PRIMARY_COLOR,
    borderRadius: 10,
  },
  subTitle: {
    color: Colors.BLACK,
    fontSize: 15,
    fontWeight: "normal",
    marginHorizontal: 8,
    marginVertical: 5,
  },
});
