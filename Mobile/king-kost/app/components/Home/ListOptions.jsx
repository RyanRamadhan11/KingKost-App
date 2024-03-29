import React from "react";
import { View } from "react-native";
import OptionsCard from "./OptionsCard";

export default ListOptions = ({ navigation, maleKostData, femaleKostData }) => {
  const optionsList = [
    {
      title: "Kost Putra",
      img: require("../../../assets/icons/male.jpg"),
      screen: "MaleKostListScreen",
      params: { kost: maleKostData },
    },
    {
      title: "Kost Putri",
      img: require("../../../assets/icons/female.jpg"),
      screen: "FemaleKostListScreen",
      params: { kost: femaleKostData },
    },
  ];

  const handleOptionPress = (screenName, params) => {
    navigation.navigate(screenName, params);
  };

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-evenly",
        paddingHorizontal: 20,
      }}
    >
      {optionsList.map((option, index) => (
        <OptionsCard
          onPress={() => handleOptionPress(option.screen, option.params)}
          key={index}
          title={option.title}
          img={option.img}
        />
      ))}
    </View>
  );
};
