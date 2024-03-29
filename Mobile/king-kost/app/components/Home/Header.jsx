import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Colors from "../../utils/Colors";
import profile from "../../../assets/images/default-profile.jpg";
import apiInstance from "../../config/apiInstance";

export default function Header() {
  const [fullName, setFullName] = useState("");
  const [customer, setCustomer] = useState([]);
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    fetchUserData();
  }, [customer]);
  async function fetchUserData() {
    try {
      const userId = await AsyncStorage.getItem("userId");
      if (userId) {
        const response = await apiInstance.get(`/customer/user/${userId}`);
        if (response.status === 200) {
          const userData = response.data.data;
          setCustomer(userData);
          setFullName(userData.fullName);
          setProfileImage(userData.url || null);
          await AsyncStorage.setItem("customerId", userData.id);
        } else {
          console.error("Failed to fetch user data:", response.data.message);
        }
      } else {
        console.error("User ID not found in AsyncStorage");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={{ color: Colors.DARK }}>Welcome,</Text>
          <Text
            style={{ color: Colors.DARK, fontSize: 20, fontWeight: "bold" }}
          >
            {fullName ? fullName : "Guest"}
          </Text>
        </View>
        <View style={styles.imageContainer}>
          <Image
            style={styles.profileImage}
            source={profileImage ? { uri: profileImage } : profile}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.WHITE,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  header: {
    backgroundColor: Colors.TRANSPARENT,
    paddingVertical: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  profileImage: {
    height: 50,
    width: 50,
    borderRadius: 25,
  },
  imageContainer: {
    borderColor: Colors.GREY,
    borderWidth: 1,
    borderRadius: 50,
  },
});
