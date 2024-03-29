import React, { useEffect, useRef, useState } from "react";
import {
  SafeAreaView,
  StatusBar,
  FlatList,
  Dimensions,
  ScrollView,
} from "react-native";
import Colors from "../../utils/Colors";
import Header from "../../components/Home/Header";
import KostAreaCard from "../../components/Home/KostAreaCard";
import KostCard from "../../components/Home/KostCard";
import CustomTitle from "../../components/Home/CustomTitle";
import CarouselBanner from "../../components/Home/CarouselBanner";
import LoadingComponent from "../../components/LoadingComponent";
import NoDataFound from "../../components/NoDataFound";
import apiInstance from "../../config/apiInstance";

const { width } = Dimensions.get("screen");
export default HomeScreen = ({ navigation }) => {
  const [listKost, setListKost] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await apiInstance.get("/kost?page=0");
        const data = response.data;
        const kostData = data.data.map((item) => ({
          id: item.id,
          title: item.name,
          image: item.images[0].url,
          subdistrict: item.subdistrict.name,
          city: item.city.name,
          description: item.description,
          province: item.city.province.name,
          gender: item.genderType.name.toLowerCase(),
          price: item.kostPrice.price,
          sellerId: item.seller.id,
          sellerName: item.seller.fullName,
          sellerPhone: item.seller.phoneNumber,
          sellerEmail: item.seller.email,
          sellerAddress: item.seller.address,
          availableRoom: item.availableRoom,
          isWifi: item.isWifi,
          isAc: item.isAc,
          isParking: item.isParking,
          images: item.images.map((image) => ({
            uri: `${image.url}`,
          })),
        }));
        setListKost(kostData);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching Kost data:", error);
        setIsLoading(false);
      }
    }
    fetchData();
  }, [listKost]);

  const navigateToPopularKostScreen = async (provinceId, cityId) => {
    navigation.navigate("PopularKostArea", { provinceId, cityId });
  };

  const listKostByArea = [
    {
      id: "1",
      provinceId: 31,
      image: require("../../../assets/images/jakarta.jpg"),
      city: "Jakarta",
    },
    {
      id: "2",
      image: require("../../../assets/images/bandung.jpg"),
      city: "Bandung",
      cityId: 32.73,
    },
    {
      id: "3",
      image: require("../../../assets/images/bogor.jpg"),
      city: "Bogor",
      cityId: 32.71,
    },
    {
      id: "4",
      image: require("../../../assets/images/jogja.jpg"),
      city: "Jogja",
      cityId: 34.71,
    },
  ];

  if (isLoading) {
    return <LoadingComponent />;
  }

  return (
    <SafeAreaView style={{ backgroundColor: Colors.WHITE, flex: 1 }}>
      <StatusBar
        translucent={false}
        backgroundColor={Colors.WHITE}
        barStyle="dark-content"
      />
      <Header />
      <ScrollView showsVerticalScrollIndicator={false}>
        <CarouselBanner />
        <CustomTitle title="Popular Area" />
        <FlatList
          snapToInterval={width - 20}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingLeft: 20, paddingVertical: 20 }}
          horizontal
          data={listKostByArea}
          renderItem={({ item }) => (
            <KostAreaCard
              kostArea={item}
              onPress={() =>
                navigateToPopularKostScreen(item.provinceId, item.cityId)
              }
            />
          )}
        />
        <CustomTitle
          onPress={() => navigation.navigate("ListAllKostScreen")}
          title="Kost"
          subTitle="See All"
        />
        {listKost.length === 0 ? (
          <NoDataFound description="No kosts available" />
        ) : (
          <FlatList
            snapToInterval={width - 20}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingLeft: 20, paddingVertical: 20 }}
            horizontal
            data={listKost}
            renderItem={({ item }) => (
              <KostCard kost={item} navigation={navigation} />
            )}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};
