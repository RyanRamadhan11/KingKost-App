import React, { useState, useEffect } from "react";
import { SafeAreaView, StyleSheet, View, Text, FlatList } from "react-native";

import Colors from "../../utils/Colors";
import { StatusBar } from "expo-status-bar";
import BackButton from "../../components/DetailKost/BackButton";
import SearchBar from "../../components/PopularKostArea/SearchBar";
import KostItem from "../../components/PopularKostArea/KostItem";

export default MaleKostListScreen = ({ navigation, route }) => {
  const kost = route.params.kost;
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [kostData, setKostData] = useState([]);

  useEffect(() => {
    const maleKostData = kost.filter((item) => item.gender === "male");
    setKostData(maleKostData);
  }, []);

  const handleSearch = (text) => {
    setSearchQuery(text);
    const filteredData = kost.filter(
      (item) =>
        item.title.toLowerCase().includes(text.toLowerCase()) &&
        item.gender === "male"
    );
    setKostData(filteredData);
  };

  const handleLoadMore = () => {
    setCurrentPage(currentPage + 1);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        translucent={false}
        backgroundColor={Colors.WHITE}
        barStyle="dark-content"
      />
      <View style={styles.appBar}>
        <View style={styles.header}>
          <BackButton onPress={navigation.goBack} />
          <Text style={styles.title}>Male Kost List</Text>
        </View>
        <SearchBar onSearch={handleSearch} />
      </View>
      <View style={styles.listCard}>
        {kostData.length === 0 ? (
          <Text style={styles.emptyText}>No male kosts available</Text>
        ) : (
          <FlatList
            data={kostData}
            renderItem={({ item }) => (
              <KostItem
                item={item}
                onPress={() => navigation.navigate("DetailKostScreen", item)}
              />
            )}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.flatListContainer}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.1}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  appBar: {
    backgroundColor: Colors.WHITE,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
  },
  container: {
    flex: 1,
    backgroundColor: Colors.WEAK_COLOR,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  listCard: {
    marginHorizontal: 20,
    marginTop: 20,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: Colors.GREY,
  },
});
