import React from "react";
import { View, TextInput, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import Colors from "../utils/Colors";
export default SearchBar = ({ onSearchChange, onSortPress }) => {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 20,
      }}
    >
      <View style={style.searchInputContainer}>
        <Icon name="search" color={Colors.GREY} size={25} />
        <TextInput placeholder="Cari nama kost" onChangeText={onSearchChange} />
      </View>

      <View style={style.sortBtn} onPress={onSortPress}>
        <Icon name="tune" color={Colors.WHITE} size={25} />
      </View>
    </View>
  );
};

const style = StyleSheet.create({
  searchInputContainer: {
    height: 50,
    backgroundColor: Colors.WHITE,
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  sortBtn: {
    backgroundColor: Colors.BLACK,
    height: 50,
    width: 50,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
});

{
  /* <SearchSortBar
onSearchChange={handleSearchChange}
onSortPress={handleSortPress}
/> */
}
