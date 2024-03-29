import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import React, { useEffect, useState } from "react";
import Icon from "react-native-vector-icons/FontAwesome";
import { ScrollView } from "react-native-gesture-handler";
import BackButton from "../../components/DetailKost/BackButton";
import Colors from "../../utils/Colors";
import { Picker } from "@react-native-picker/picker";
import formatCurrencyIDR from "../../utils/formatCurrencyIDR";
import { AntDesign } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Popup from "../../components/Popup";
import apiInstance from "../../config/apiInstance";
import LoadingComponent from "../../components/LoadingComponent";

export default function CreateOrderScreen({ navigation, route }) {
  const kost = route.params;
  const [monthPeriod, setMonthPeriod] = useState(1);
  const [monthData, setMonthData] = useState([]);
  const [selectedMonthId, setSelectedMonthId] = useState(null);
  const [selectedMonths, setSelectedMonths] = useState(null);
  const [paymentTypeId, setPaymentTypeId] = useState("");
  const [paymentTypes, setPaymentTypes] = useState([]);
  const [userId, setUserId] = useState(null);
  const [userGender, setUserGender] = useState(null);
  const [dataOrder, setDataOrder] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [sections, setSections] = useState({
    section1: true,
    section2: false,
    section3: false,
    section4: false,
  });

  const monthTypeMap = {
    ONE_MONTH: 1,
    TWO_MONTH: 2,
    THREE_MONTH: 3,
    FOUR_MONTH: 4,
    FIVE_MONTH: 5,
    SIX_MONTH: 6,
    SEVEN_MONTH: 7,
    EIGHT_MONTH: 8,
    NINE_MONTH: 9,
    TEN_MONTH: 10,
    ELEVEN_MONTH: 11,
    TWELVE_MONTH: 12,
  };

  const calculateTotalPrice = () => {
    const monthlyPrice = kost.price;
    const numberOfMonths = monthTypeMap[selectedMonths];
    const totalPrice = numberOfMonths * monthlyPrice;
    return formatCurrencyIDR(totalPrice);
  };

  const toggleSection = (section) => {
    setSections((prevSections) => ({
      ...prevSections,
      [section]: !prevSections[section],
    }));
  };

  const fetchUserData = async (userId) => {
    try {
      const response = await apiInstance.get(`/customer/user/${userId}`);
      const data = response.data;
      setUserId(data.data.id);
      setUserGender(data.data.genderTypeId.name);
      console.log("kost gender " + kost.gender);
      console.log("user id " + userId);
      console.log("user gender " + userGender);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleMonthChange = (id) => {
    setSelectedMonths(monthData.find((month) => month.id === id).name);
    setSelectedMonthId(id);
  };

  const fetchPaymentTypes = async () => {
    try {
      const response = await apiInstance.get("/payment/v1");
      setPaymentTypes(response.data);
    } catch (error) {
      console.error("Error fetching payment types:", error);
    }
  };

  const fetchMonthData = async () => {
    try {
      const response = await apiInstance.get("/month/v1");
      const months = response.data.map((month) => ({
        id: month.id,
        name: month.name,
      }));
      setMonthData(months);
      setSelectedMonths(months[0].name);
      setSelectedMonthId(months[0].id);
    } catch (error) {
      console.error("Error fetching month data:", error);
    }
  };

  const handleOrderSubmit = async () => {
    if (
      kost.gender.toLowerCase() !== "campur" &&
      userGender.toLowerCase() !== kost.gender.toLowerCase()
    ) {
      setModalMessage(
        `This kost is only available for ${kost.gender.toLowerCase()}`
      );
      setModalVisible(true);
      return;
    }

    if (!paymentTypeId || !monthPeriod) {
      let message = "";
      if (!paymentTypeId) {
        message = "Please choose payment type";
        setModalMessage(message);
        setModalVisible(true);
        return;
      }
      if (!monthPeriod) {
        message = "Please choose period";
        setModalMessage(message);
        setModalVisible(true);
        return;
      }
      return;
    }

    const orderData = {
      kostId: kost.id,
      customerId: userId,
      monthTypeId: selectedMonthId,
      paymentTypeId: paymentTypeId,
    };

    console.log(orderData);

    try {
      setIsLoading(true);
      const response = await apiInstance.post("/transactions", orderData);
      if (response.status === 200 || response.status === 201) {
        setDataOrder(response.data.data);
        console.log(response.data.data);
        console.log(dataOrder);
        console.log(response.status + " Order submitted successfully");
        navigation.replace("OrderStatusScreen", response.data.data);
      } else {
        const errorData = response.data.message ?? "error ";
        console.error("Error:", errorData);
        alert(errorData);
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Error :", error);
      alert(error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    AsyncStorage.getItem("userId")
      .then((userId) => {
        setUserId(userId);
        fetchUserData(userId);
      })
      .catch((error) => {
        console.error("Error retrieving userId from AsyncStorage:", error);
      });
  }, []);

  useEffect(() => {
    fetchPaymentTypes();
    fetchMonthData();
  }, []);

  return (
    <ScrollView>
      <StatusBar
        translucent={false}
        backgroundColor={Colors.WHITE}
        barStyle="dark-content"
      />
      <Popup
        message={modalMessage}
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
      />
      <View style={styles.appBar}>
        <View style={styles.header}>
          <BackButton onPress={navigation.goBack} />
          <Text style={styles.title}>Transaction</Text>
        </View>
      </View>
      <View style={styles.container}>
        <View style={styles.card}>
          <View>
            <TouchableOpacity onPress={() => toggleSection("section1")}>
              <View style={styles.headerListTile}>
                <Text style={styles.sectionTitle}>Kost Detail</Text>
                <Icon
                  name={sections.section1 ? "chevron-up" : "chevron-down"}
                  size={18}
                  color="#000"
                />
              </View>
              <View style={styles.separator}></View>
            </TouchableOpacity>
            {sections.section1 && (
              <>
                <View style={styles.info}>
                  <Text style={styles.titleInfo}>Name</Text>
                  <Text style={styles.trailingInfo}>{kost.title}</Text>
                </View>
                <View style={styles.info}>
                  <Text style={styles.titleInfo}>Description</Text>
                  <View style={{ width: 150 }}>
                    <Text style={styles.trailingInfo}>{kost.description}</Text>
                  </View>
                </View>
                <View style={styles.info}>
                  <Text style={styles.titleInfo}>District</Text>
                  <Text style={styles.trailingInfo}>{kost.subdistrict}</Text>
                </View>
                <View style={styles.info}>
                  <Text style={styles.titleInfo}>City</Text>
                  <View style={{ width: 150 }}>
                    <Text style={styles.trailingInfo}>{kost.city}</Text>
                  </View>
                </View>
                <View style={styles.info}>
                  <Text style={styles.titleInfo}>Province</Text>
                  <Text style={styles.trailingInfo}>{kost.province}</Text>
                </View>
                <View style={styles.info}>
                  <Text style={styles.titleInfo}>Price</Text>
                  <Text style={styles.trailingInfo}>
                    {formatCurrencyIDR(kost.price)} / Month
                  </Text>
                </View>
                <View style={styles.info}>
                  <Text style={styles.titleInfo}>Available room</Text>
                  <Text style={styles.trailingInfo}>
                    {kost.availableRoom} Room
                  </Text>
                </View>
                <View style={styles.info}>
                  <Text style={styles.titleInfo}>Wifi</Text>
                  <Text style={styles.trailingInfo}>
                    {kost.isWifi ? (
                      <AntDesign
                        name="checkcircle"
                        size={22}
                        color={Colors.GREEN}
                      />
                    ) : (
                      <AntDesign
                        name="closecircle"
                        size={22}
                        color={Colors.RED}
                      />
                    )}
                  </Text>
                </View>
                <View style={styles.info}>
                  <Text style={styles.titleInfo}>Air Conditioner</Text>
                  <Text style={styles.trailingInfo}>
                    {kost.isAc ? (
                      <AntDesign
                        name="checkcircle"
                        size={22}
                        color={Colors.GREEN}
                      />
                    ) : (
                      <AntDesign
                        name="closecircle"
                        size={22}
                        color={Colors.RED}
                      />
                    )}
                  </Text>
                </View>
                <View style={styles.info}>
                  <Text style={styles.titleInfo}>Parking</Text>
                  <Text style={styles.trailingInfo}>
                    {kost.isParking ? (
                      <AntDesign
                        name="checkcircle"
                        size={22}
                        color={Colors.GREEN}
                      />
                    ) : (
                      <AntDesign
                        name="closecircle"
                        size={22}
                        color={Colors.RED}
                      />
                    )}
                  </Text>
                </View>
                <View style={styles.info}>
                  <Text style={styles.titleInfo}>Kost Type</Text>
                  <Text style={styles.trailingInfo}>
                    {kost.gender == "male" ? "Male" : "Female"}
                  </Text>
                </View>
              </>
            )}
          </View>
        </View>
        <View style={styles.card}>
          <View>
            <TouchableOpacity onPress={() => toggleSection("section2")}>
              <View style={styles.headerListTile}>
                <Text style={styles.sectionTitle}>Seller Details</Text>
                <Icon
                  name={sections.section2 ? "chevron-up" : "chevron-down"}
                  size={18}
                  color="#000"
                />
              </View>
              <View style={styles.separator}></View>
            </TouchableOpacity>
            {sections.section2 && (
              <>
                <View style={styles.info}>
                  <Text style={styles.titleInfo}>Name</Text>
                  <Text style={styles.trailingInfo}>{kost.sellerName}</Text>
                </View>
                <View style={styles.info}>
                  <Text style={styles.titleInfo}>Phone Number</Text>
                  <Text style={styles.trailingInfo}>{kost.sellerPhone}</Text>
                </View>
                <View style={styles.info}>
                  <Text style={styles.titleInfo}>Email</Text>
                  <Text style={styles.trailingInfo}>{kost.sellerEmail}</Text>
                </View>
                <View style={styles.info}>
                  <Text style={styles.titleInfo}>Address</Text>
                  <Text style={styles.trailingInfo}>{kost.sellerAddress}</Text>
                </View>
              </>
            )}
          </View>
        </View>
        <View style={styles.card}>
          <View>
            <TouchableOpacity onPress={() => toggleSection("section3")}>
              <View style={styles.headerListTile}>
                <Text style={styles.sectionTitle}>Payment Type</Text>
                <Icon
                  name={sections.section3 ? "chevron-up" : "chevron-down"}
                  size={18}
                  color="#000"
                />
              </View>
              <View style={styles.separator}></View>
            </TouchableOpacity>
            {sections.section3 && (
              <View>
                {paymentTypes.map((payment) => (
                  <TouchableOpacity
                    key={payment.id}
                    onPress={() => setPaymentTypeId(payment.id)}
                    style={[
                      styles.paymentOption,
                      payment.id === paymentTypeId
                        ? styles.selectedPaymentOption
                        : null,
                    ]}
                  >
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <View
                        style={[
                          styles.paymentOptionCheckbox,
                          payment.id === paymentTypeId
                            ? styles.selectedPaymentOptionCheckbox
                            : null,
                        ]}
                      ></View>
                      <Text
                        style={
                          payment.id === paymentTypeId
                            ? styles.trailingInfo
                            : null
                        }
                      >
                        {payment.name}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </View>
        <View style={styles.card}>
          <View>
            <TouchableOpacity onPress={() => toggleSection("section4")}>
              <View style={styles.headerListTile}>
                <Text style={styles.sectionTitle}>Order Details</Text>
                <Icon
                  name={sections.section4 ? "chevron-up" : "chevron-down"}
                  size={18}
                  color="#000"
                />
              </View>
              <View style={styles.separator}></View>
            </TouchableOpacity>
            {sections.section4 && (
              <View>
                <View style={styles.choosePeriodContent}>
                  <Text style={styles.titleInfo}>Choose Period</Text>
                  <View style={styles.pickerContainer}>
                    <Picker
                      style={styles.monthPicker}
                      selectedValue={selectedMonthId}
                      onValueChange={handleMonthChange}
                    >
                      {monthData.map((month) => (
                        <Picker.Item
                          style={styles.trailingInfo}
                          key={month.id}
                          label={`${monthTypeMap[month.name]} Month`}
                          value={month.id}
                        />
                      ))}
                    </Picker>
                  </View>
                </View>
                <View style={styles.info}>
                  <Text style={styles.titleInfo}>Total Price</Text>
                  <Text style={styles.trailingInfo}>
                    {calculateTotalPrice()}
                  </Text>
                </View>
              </View>
            )}
          </View>
        </View>
        {isLoading ? (
          <LoadingComponent />
        ) : (
          <TouchableOpacity style={styles.button} onPress={handleOrderSubmit}>
            <Text style={styles.buttonText}>Book Now</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  appBar: {
    backgroundColor: Colors.WHITE,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerListTile: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  container: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  card: {
    backgroundColor: Colors.WHITE,
    paddingHorizontal: 20,
    paddingBottom: 20,
    marginBottom: 10,
    borderRadius: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  separator: {
    borderBottomWidth: 1,
    borderColor: "#ccc",
    marginBottom: 20,
    marginTop: 10,
  },
  button: {
    backgroundColor: Colors.PRIMARY_COLOR,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginVertical: 20,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  choosePeriodContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  pickerContainer: {
    backgroundColor: Colors.WEAK_COLOR,
    borderRadius: 10,
    width: "50%",
  },
  monthPicker: {
    width: "100%",
    height: 50,
    color: Colors.BLACK,
  },
  info: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  titleInfo: {
    fontSize: 14,
    color: Colors.GREY_BOLD,
  },
  trailingInfo: {
    fontSize: 14,
    overflow: "visible",
    color: Colors.BLACK,
    fontWeight: "bold",
    textAlign: "right",
  },
  paymentOptionCheckbox: {
    height: 12,
    width: 12,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.GREY_BOLD,
    marginRight: 10,
  },
  selectedPaymentOptionCheckbox: {
    backgroundColor: Colors.PRIMARY_COLOR,
    color: Colors.PRIMARY_COLOR,
  },
  paymentOption: {
    marginBottom: 10,
  },
});
