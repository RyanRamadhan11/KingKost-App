import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import Colors from "../../utils/Colors";
import { StatusBar } from "expo-status-bar";
import BackButton from "../../components/DetailKost/BackButton";
import SearchBar from "../../components/PopularKostArea/SearchBar";
import KostItem from "../../components/PopularKostArea/KostItem";
import NoDataFound from "../../components/NoDataFound";
import LoadingComponent from "../../components/LoadingComponent";
import apiInstance from "../../config/apiInstance";

export default PopularKostArea = ({ navigation, route }) => {
  const { provinceId, cityId } = route.params;
  const [searchQuery, setSearchQuery] = useState("");
  const [kostData, setKostData] = useState([]);
  const [originalKostData, setOriginalKostData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPage, setTotalPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const handleReload = () => {
    setRefreshing(true);
    fetchKostData();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchKostData();
  }, [currentPage]);

  const fetchKostData = async () => {
    setLoading(true);
    try {
      let url = `/kost?page=${currentPage}`;
      if (provinceId) {
        url += `&province_id=${provinceId}`;
      }
      if (cityId) {
        url += `&city_id=${cityId}`;
      }
      console.log(url);
      const response = await apiInstance.get(url);
      const { data, paggingResponse } = response.data;
      const newData = data.map((item) => ({
        id: item.id,
        title: item.name,
        image: item.images[0].url,
        subdistrict: item.subdistrict.name,
        city: item.city.name,
        description: item.description,
        province: item.city.province.name,
        gender: item.genderType.name.toLowerCase(),
        price: item.kostPrice.price,
        sellerName: item.seller.fullName,
        sellerPhone: item.seller.phoneNumber,
        availableRoom: item.availableRoom,
        isWifi: item.isWifi,
        isAc: item.isAc,
        isParking: item.isParking,
        images: item.images.map((image) => ({
          uri: `${image.url}`,
        })),
      }));
      setOriginalKostData(newData);
      setKostData(newData);
      setTotalPage(paggingResponse.totalPage);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setLoading(false);
  };

  const handleSearch = async (text) => {
    setSearchQuery(text);
    try {
      if (text === "") {
        setKostData(originalKostData);
      } else {
        let url = `/kost?page=${currentPage}&name=${text}`;
        if (provinceId) {
          url += `&province_id=${provinceId}`;
        }
        if (cityId) {
          url += `&city_id=${cityId}`;
        }
        const response = await apiInstance.get(url);
        console.log(url);
        const { data, paggingResponse } = response.data;
        const newData = data.map((item) => ({
          id: item.id,
          title: item.name,
          image: item.images[0].url,
          subdistrict: item.subdistrict.name,
          city: item.city.name,
          description: item.description,
          province: item.city.province.name,
          gender: item.genderType.name.toLowerCase(),
          price: item.kostPrice.price,
          sellerName: item.seller.fullName,
          sellerPhone: item.seller.phoneNumber,
          availableRoom: item.availableRoom,
          isWifi: item.isWifi,
          isAc: item.isAc,
          isParking: item.isParking,
          images: item.images.map((image) => ({
            uri: `${image.url}`,
          })),
        }));
        setKostData(newData);
        setTotalPage(paggingResponse.totalPage);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPage) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
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
          <Text style={styles.title}>List Kost Area</Text>
        </View>
        <SearchBar onSearch={handleSearch} />
      </View>
      <View style={styles.listCard}>
        {loading ? (
          <LoadingComponent />
        ) : kostData.length === 0 ? (
          <NoDataFound description="No kosts available" />
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
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleReload}
              />
            }
          />
        )}
      </View>
      <View style={styles.pagination}>
        <TouchableOpacity
          onPress={handlePreviousPage}
          disabled={currentPage === 0}
        >
          <View style={styles.paginationButton}>
            <Text
              style={[
                styles.paginationText,
                { color: currentPage === 0 ? "gray" : "black" },
              ]}
            >
              Previous
            </Text>
          </View>
        </TouchableOpacity>
        <Text style={styles.paginationText}>
          {totalPage == 0 ? currentPage : currentPage + 1}/{totalPage}
        </Text>
        <TouchableOpacity
          onPress={handleNextPage}
          disabled={currentPage === totalPage - 1}
        >
          <View style={styles.paginationButton}>
            <Text
              style={[
                styles.paginationText,
                { color: currentPage === totalPage - 1 ? "gray" : "black" },
              ]}
            >
              Next
            </Text>
          </View>
        </TouchableOpacity>
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
    flex: 1,
  },
  noDataContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  noDataText: {
    fontSize: 16,
    color: Colors.BLACK,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    alignContent: "center",
    paddingHorizontal: 20,
  },
  paginationText: {
    fontSize: 16,
    textAlign: "center",
    alignContent: "center",
  },
  paginationButton: {
    height: 30,
    width: 80,
    marginVertical: 10,
    borderRadius: 5,
    paddingTop: 3,
    backgroundColor: Colors.PRIMARY_COLOR,
  },
});
