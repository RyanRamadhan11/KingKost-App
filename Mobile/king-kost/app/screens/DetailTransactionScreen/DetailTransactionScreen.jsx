import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  Image,
  FlatList,
} from "react-native";
import Colors from "../../utils/Colors";
import { StatusBar } from "expo-status-bar";
import SellerInfo from "../../components/DetailKost/SellerInfo";
import { OpenWhatsApp } from "../../utils/OpenWhatsapp";
import MonthTypeConverter from "../../utils/MonthTypeConverter";
import apiInstance from "../../config/apiInstance";
import LoadingComponent from "../../components/LoadingComponent";
import BackgroundImage from "../../components/DetailKost/BackgroundImage";
import ImageCardList from "../../components/DetailKost/ImageCardList";
import BookingPeriod from "../../components/DetailTransaction/BookingPeriod";
import TotalPriceAndCancel from "../../components/DetailTransaction/TotalPriceAndCancel";
import DetailTransactionSection from "../../components/DetailTransaction/DetailTransactionSection";
import formatCurrencyIDR from "../../utils/formatCurrencyIDR";
import ImageModal from "../../components/DetailKost/ImageModal";
const { width } = Dimensions.get("screen");

export default DetailTransactionScreen = ({ navigation, route }) => {
  const { transactionId } = route.params;
  const [transaction, setTransaction] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [images, setImages] = useState([]);
  const [sellerImage, setSellerImage] = useState(null);

  console.log(images);

  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        const response = await apiInstance.get(
          `/transactions/${transactionId}`
        );
        setTransaction(response.data.data);
        console.log(response.data.data.kost.images);
        const image = response.data.data.kost.images.map((image) => ({
          uri: `${image.url}`,
        }));
        const sellerPhoto = response.data.data.kost.seller.url;
        setImages(image);
        setSellerImage(sellerPhoto);
      } catch (error) {
        console.error("Error fetching transaction:", error);
      }
    };

    fetchTransaction();
  }, [transactionId]);

  const openModal = (index) => {
    setSelectedImageIndex(index);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedImageIndex(null);
  };

  const calculateTotalPrice = () => {
    const selectedMonths = MonthTypeConverter.getMonthCount(
      transaction.monthType.name
    );
    const monthlyPrice = transaction.kost.kostPrice.price;
    const totalPrice = selectedMonths * monthlyPrice;

    return formatCurrencyIDR(totalPrice);
  };

  if (!transaction) {
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
            transaction.kost.images && transaction.kost.images.length > 0
              ? { uri: transaction.kost.images[0].url }
              : require("../../../assets/images/default-image.png")
          }
          onPress={navigation.goBack}
        />
        <View style={styles.flatListContainer}>
          {transaction.kost.images && transaction.kost.images.length > 0 ? (
            <FlatList
              contentContainerStyle={{ marginTop: 20 }}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(_, key) => key.toString()}
              data={images}
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
          imageSource={images[selectedImageIndex]}
        />

        <DetailTransactionSection
          title={transaction.kost.name}
          availability={
            transaction.kost.availableRoom != 0 ? "Available" : "Not Available"
          }
          roomCount={transaction.kost.availableRoom}
          city={transaction.kost.city.name}
          subdistrict={transaction.kost.subdistrict.name}
          province={transaction.kost.province.name}
          wifi={transaction.isWifi}
          parking={transaction.isParking}
          airConditioner={transaction.isAc}
          description={transaction.kost.description}
          type={transaction.kost.genderType.name}
          gender={
            transaction.kost.genderType.name === "MALE"
              ? require("../../../assets/icons/male.jpg")
              : transaction.kost.genderType.name == "CAMPUR"
              ? require("../../../assets/icons/mix.jpg")
              : require("../../../assets/icons/female.jpg")
          }
        />

        <SellerInfo
          onPress={() =>
            OpenWhatsApp(
              (phone = transaction.kost.seller.phoneNumber),
              (message = `Halo! Saya ingin bertanya tentang kost "${transaction.kost.name}"`)
            )
          }
          seller={transaction.kost.seller.fullName}
          phone={transaction.kost.seller.phoneNumber}
          image={sellerImage}
        />

        <BookingPeriod
          title="Book for: "
          selectedMonths={transaction.monthType.name}
        />

        <TotalPriceAndCancel
          calculateTotalPrice={calculateTotalPrice}
          transactionStatus={transaction.aprStatus}
          transactionId={transaction.id}
          customerId={transaction.customer.id}
          onCancelBooking={() => navigation.goBack()}
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
