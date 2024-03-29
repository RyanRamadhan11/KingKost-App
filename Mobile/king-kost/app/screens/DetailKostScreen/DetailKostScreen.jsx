import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
} from "react-native";
import { OpenWhatsApp } from "../../utils/OpenWhatsapp";
import Colors from "../../utils/Colors";
import { FlatList } from "react-native-gesture-handler";
import BackgroundImage from "../../components/DetailKost/BackgroundImage";
import ImageCardList from "../../components/DetailKost/ImageCardList";
import ImageModal from "../../components/DetailKost/ImageModal";
import DetailSection from "../../components/DetailKost/DetailSection";
import formatCurrencyIDR from "../../utils/formatCurrencyIDR";
import SellerInfo from "../../components/DetailKost/SellerInfo";
import ChoosePeriod from "../../components/DetailKost/ChoosePeriod";
import TotalPrice from "../../components/DetailKost/TotalPrice";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import apiInstance from "../../config/apiInstance";
import LoadingComponent from "../../components/LoadingComponent";
const { width } = Dimensions.get("screen");

export default DetailKostScreen = ({ navigation, route }) => {
  const kost = route.params;
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [selectedMonths, setSelectedMonths] = useState(1);
  const [listKost, setListKost] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  console.log(listKost);
  console.log(listKost.bookingStatus);

  const openModal = (index) => {
    setSelectedImageIndex(index);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedImageIndex(null);
  };
  const calculateTotalPrice = () => {
    const monthlyPrice = kost.price;
    const totalPrice = selectedMonths * monthlyPrice;
    return formatCurrencyIDR(totalPrice);
  };

  useEffect(() => {
    const fetchData = async () => {
      const userId = await AsyncStorage.getItem("customerId");
      if (!userId) {
        console.error("User ID not found in localStorage");
      } else {
        console.log(`/kost/id?kostId=${kost.id}&customerId=${userId}`);
        await apiInstance
          .get(`/kost/id?kostId=${kost.id}&customerId=${userId}`)
          .then((res) => {
            const data = res.data.data;
            const kostData = {
              id: data.id,
              title: data.name,
              image: data.images[0].url,
              subdistrict: data.subdistrict.name,
              city: data.city.name,
              description: data.description,
              province: data.city.province.name,
              gender: data.genderType.name.toLowerCase(),
              price: data.kostPrice.price,
              sellerId: data.seller.id,
              sellerName: data.seller.fullName,
              sellerPhone: data.seller.phoneNumber,
              sellerEmail: data.seller.email,
              sellerAddress: data.seller.address,
              sellerImage: data.seller.url,
              availableRoom: data.availableRoom,
              isWifi: data.isWifi,
              isAc: data.isAc,
              isParking: data.isParking,
              bookingStatus: data.currentBookingStatus,
              images: data.images.map((image) => ({
                uri: `${image.url}`,
              })),
            };
            setListKost(kostData);
            setIsLoading(false);
          })
          .catch((err) => {
            alert(err);
            console.log(res);
            setIsLoading(false);
          });
      }
    };

    fetchData();
  }, [listKost]);

  if (isLoading) {
    return <LoadingComponent />;
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.WHITE }}>
      <StatusBar
        translucent={false}
        backgroundColor={Colors.WHITE}
        barStyle="dark-content"
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <BackgroundImage
          source={
            listKost.image != null || listKost.image != ""
              ? { uri: listKost.image }
              : require("../../../assets/images/default-image.png")
          }
          onPress={navigation.goBack}
        />
        <View style={styles.flatListContainer}>
          {listKost && listKost.images !== null && listKost.images !== "" ? (
            <FlatList
              contentContainerStyle={{ marginTop: 20 }}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(_, key) => key.toString()}
              data={listKost.images}
              renderItem={({ item, index }) => (
                <ImageCardList
                  interior={item}
                  index={index}
                  onPress={openModal}
                />
              )}
            />
          ) : (
            <Image
              source={require("../../../assets/images/default-image.png")}
              style={styles.cardImage}
            />
          )}
        </View>

        <ImageModal
          visible={isModalVisible}
          closeModal={closeModal}
          imageSource={listKost.images[selectedImageIndex]}
        />

        <DetailSection
          title={listKost.title}
          availability={
            listKost.availableRoom != 0 ? "Available" : "Not Available"
          }
          roomCount={listKost.availableRoom}
          city={listKost.city}
          subdistrict={listKost.subdistrict}
          province={listKost.province}
          wifi={listKost.isWifi}
          parking={listKost.isParking}
          airConditioner={listKost.isAc}
          description={listKost.description}
          type={listKost.gender}
          gender={
            listKost.gender === "male"
              ? require("../../../assets/icons/male.jpg")
              : listKost.gender === "campur"
              ? require("../../../assets/icons/mix.jpg")
              : require("../../../assets/icons/female.jpg")
          }
        />

        <SellerInfo
          onPress={() =>
            OpenWhatsApp(
              (phone = listKost.sellerPhone),
              (message = `Halo! Saya ingin bertanya tentang listKost "${listKost.title}"`)
            )
          }
          seller={listKost.sellerName}
          phone={listKost.sellerPhone}
          image={listKost.sellerImage}
        />
        <ChoosePeriod
          title="Simulate Prices"
          selectedMonths={selectedMonths}
          setSelectedMonths={setSelectedMonths}
        />
        <TotalPrice
          text={
            listKost.bookingStatus == 4 ||
            listKost.bookingStatus == 1 ||
            listKost.bookingStatus == 2
              ? "Book this kost"
              : listKost.bookingStatus == 0
              ? "Book Pending"
              : "Booked"
          }
          onPress={() => {
            if (listKost.bookingStatus != 0 && listKost.bookingStatus != 3) {
              navigation.navigate("CreateOrderScreen", listKost);
            } else {
              navigation.navigate("Transaction");
            }
          }}
          calculateTotalPrice={calculateTotalPrice}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  flatListContainer: {
    paddingHorizontal: 20,
  },
  cardImage: {
    width: width / 3 - 20,
    height: 80,
    marginRight: 10,
    borderRadius: 10,
    marginTop: 10,
    backgroundColor: Colors.WEAK_COLOR,
  },
});
