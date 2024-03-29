import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  RefreshControl,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import Colors from "../../utils/Colors";
import { StatusBar } from "expo-status-bar";
import BackButton from "../../components/DetailKost/BackButton";
import SearchBar from "../../components/PopularKostArea/SearchBar";
import KostItem from "../../components/PopularKostArea/KostItem";
import { Picker } from "@react-native-picker/picker";
import { AntDesign } from "@expo/vector-icons";
import LoadingComponent from "../../components/LoadingComponent";
import NoDataFound from "../../components/NoDataFound";
import apiInstance from "../../config/apiInstance";

export default ListAllKostScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPage, setTotalPage] = useState(1);
  const [kostData, setKostData] = useState([]);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedCityId, setSelectedCityId] = useState(0);
  const [selectedProvinceId, setSelectedProvinceId] = useState(0);
  const [selectedDistrictId, setSelectedDistrictId] = useState(0);
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [genders, setGenders] = useState([]);
  const [selectedGender, setSelectedGender] = useState("");
  const [selectedGenderId, setSelectedGenderId] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchGenders();
    fetchProvinces();
    fetchData();
  }, [currentPage]);

  const handleReload = () => {
    setRefreshing(true);
    fetchData();
    setRefreshing(false);
  };

  const fetchGenders = async () => {
    try {
      const response = await apiInstance.get("/gender/v1");
      const dataGenders = response.data;
      setGenders(dataGenders);
    } catch (error) {
      console.error("Error fetching genders:", error);
    }
  };

  const fetchProvinces = async () => {
    try {
      const response = await apiInstance.get("/province");
      const dataProvinces = response.data.data;
      setProvinces(dataProvinces);
    } catch (error) {
      console.error("Error fetching provinces:", error);
    }
  };

  const fetchCities = async (provinceId) => {
    try {
      const response = await apiInstance.get(`/city?province_id=${provinceId}`);
      const dataCity = response.data.data;
      setCities(dataCity);
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  };

  const fetchDistricts = async (cityId) => {
    try {
      const response = await apiInstance.get(`/subdistrict?city_id=${cityId}`);
      const dataDistrict = response.data.data;
      setDistricts(dataDistrict);
    } catch (error) {
      console.error("Error fetching districts:", error);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await apiInstance.get(`/kost?page=${currentPage}`);
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
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setLoading(false);
  };

  const handleSearch = async (text) => {
    setSearchQuery(text);
    try {
      if (text === "") {
        const params = new URLSearchParams();
        if (selectedDistrictId)
          params.append("subdistrict_id", selectedDistrictId);
        if (selectedProvinceId)
          params.append("province_id", selectedProvinceId);
        if (selectedCityId) params.append("city_id", selectedCityId);
        if (selectedGenderId) params.append("gender_type_id", selectedGenderId);
        const response = await apiInstance.get(`/kost?${params.toString()}`);
        console.log(`/kost?${params.toString()}`);
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
      } else {
        const params = new URLSearchParams();
        if (selectedDistrictId)
          params.append("subdistrict_id", selectedDistrictId);
        if (selectedProvinceId)
          params.append("province_id", selectedProvinceId);
        if (selectedCityId) params.append("city_id", selectedCityId);
        if (selectedGenderId) params.append("gender_type_id", selectedGenderId);
        if (text) params.append("name", text);
        const response = await apiInstance.get(`/kost?${params.toString()}`);
        console.log(`/kost?${params.toString()}`);
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

  const handleFilter = async () => {
    try {
      setLoading(true);
      setShowFilterModal(false);
      const params = new URLSearchParams();
      if (selectedDistrictId)
        params.append("subdistrict_id", selectedDistrictId);
      if (selectedProvinceId) params.append("province_id", selectedProvinceId);
      if (selectedCityId) params.append("city_id", selectedCityId);
      if (selectedGenderId) params.append("gender_type_id", selectedGenderId);
      if (searchQuery) params.append("name", searchQuery);
      const response = await apiInstance.get(`/kost?${params.toString()}`);
      const { data, paggingResponse } = response.data;
      console.log(`/kost?${params.toString()}`);
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
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setLoading(false);
  };

  const handleResetFilter = async () => {
    try {
      setLoading(true);
      setCurrentPage(0);
      setSelectedDistrictId(0);
      setSelectedProvinceId(0);
      setSelectedCityId(0);
      setSelectedGenderId("");
      setShowFilterModal(false);
      const response = await apiInstance.get(`/kost?page=${currentPage}`);
      const { data, paggingResponse } = response.data;
      console.log(`/kost?page=${currentPage}`);
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
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setLoading(false);
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

  const handleFilterIconPress = () => {
    setShowFilterModal(true);
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
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "space-between",
              marginRight: 25,
            }}
          >
            <Text style={styles.title}>List Kost </Text>
            <TouchableOpacity onPress={handleFilterIconPress}>
              <Feather name="filter" size={24} color="black" />
            </TouchableOpacity>
          </View>
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
            showsVerticalScrollIndicator={false}
            extraData={kostData}
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
      <Modal
        visible={showFilterModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowFilterModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text style={styles.modalTitle}>Filter By</Text>
              <TouchableOpacity onPress={() => setShowFilterModal(false)}>
                <AntDesign name="closecircle" size={24} color={Colors.BLACK} />
              </TouchableOpacity>
            </View>
            <View style={styles.dropdownContainer}>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={selectedGenderId}
                  style={styles.dropdown}
                  onValueChange={(itemValue) => {
                    if (itemValue === "") {
                      setSelectedGender("");
                      setSelectedGenderId("");
                    } else {
                      const selectedGenderObj = genders.find(
                        (gender) => gender.id === itemValue
                      );
                      setSelectedGender(selectedGenderObj.name);
                      setSelectedGenderId(selectedGenderObj.id);
                      console.log(selectedGender);
                      console.log(selectedGenderId);
                    }
                  }}
                >
                  <Picker.Item label="Select kost type" value="" />
                  {genders.map((gender) => (
                    <Picker.Item
                      key={gender.id}
                      label={gender.name}
                      value={gender.id}
                    />
                  ))}
                </Picker>
              </View>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={selectedProvinceId}
                  style={styles.dropdown}
                  onValueChange={(itemValue) => {
                    if (itemValue === 0) {
                      setSelectedProvince("");
                      setSelectedProvinceId(0);
                      setSelectedDistrict("");
                      setSelectedDistrictId(0);
                      setCities([]);
                    } else {
                      const selectedProv = provinces.find(
                        (province) => province.id === itemValue
                      );
                      setSelectedProvince(selectedProv.name);
                      setSelectedProvinceId(selectedProv.id);
                      fetchCities(selectedProv.id);
                    }
                  }}
                >
                  <Picker.Item label="Select province" value={0} />
                  {provinces.length > 0 &&
                    provinces.map((province) => (
                      <Picker.Item
                        key={province.id}
                        label={province.name}
                        value={province.id}
                      />
                    ))}
                </Picker>
              </View>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={selectedCityId}
                  style={styles.dropdown}
                  onValueChange={(itemValue) => {
                    if (itemValue === 0) {
                      setSelectedCity("");
                      setSelectedCityId(0);
                      setSelectedDistrict("");
                      setSelectedDistrictId(0);
                      setDistricts([]);
                    } else {
                      const selectedCity = cities.find(
                        (city) => city.id === itemValue
                      );
                      setSelectedCity(selectedCity.name);
                      setSelectedCityId(selectedCity.id);
                      fetchDistricts(selectedCity.id);
                    }
                  }}
                >
                  <Picker.Item label="Select city" value={0} />
                  {cities.length > 0 &&
                    cities.map((city) => (
                      <Picker.Item
                        key={city.id}
                        label={city.name}
                        value={city.id}
                      />
                    ))}
                </Picker>
              </View>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={selectedDistrictId}
                  style={styles.dropdown}
                  onValueChange={(itemValue) => {
                    if (itemValue === 0) {
                      setSelectedDistrict("");
                      setSelectedDistrictId(0);
                    } else {
                      const selectedDist = districts.find(
                        (district) => district.id === itemValue
                      );
                      setSelectedDistrict(selectedDist.name);
                      setSelectedDistrictId(selectedDist.id);
                    }
                  }}
                >
                  <Picker.Item label="Select district" value={0} />
                  {districts.length > 0 &&
                    districts.map((district) => (
                      <Picker.Item
                        key={district.id}
                        label={district.name}
                        value={district.id}
                      />
                    ))}
                </Picker>
              </View>
            </View>
            <View style={{ marginBottom: 10, marginTop: 20 }}>
              <TouchableOpacity onPress={handleFilter}>
                <View style={styles.filter}>
                  <Text
                    style={{
                      fontSize: 17,
                      margin: 8,
                      textAlign: "center",
                    }}
                  >
                    Filter
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
            <View style={{ marginBottom: 10 }}>
              <TouchableOpacity onPress={handleResetFilter}>
                <View style={styles.filter}>
                  <Text
                    style={{
                      fontSize: 17,
                      margin: 8,
                      textAlign: "center",
                    }}
                  >
                    Reset Filter
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  reset: {
    borderRadius: 10,
    backgroundColor: Colors.PRIMARY_COLOR,
  },
  filter: {
    borderRadius: 10,
    backgroundColor: Colors.PRIMARY_COLOR,
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
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.1)",
  },
  modalContent: {
    backgroundColor: Colors.WEAK_COLOR,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    height: 450,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    color: Colors.BLACK,
  },
  modalOption: {
    fontSize: 18,
    marginBottom: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: Colors.WHITE,
    borderRadius: 8,
  },
  dropdownContainer: {
    backgroundColor: Colors.WHITE,
    borderRadius: 8,
    marginBottom: 10,
  },
  pickerContainer: {
    marginHorizontal: 10,
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
