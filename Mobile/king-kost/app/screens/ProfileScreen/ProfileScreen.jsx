import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Modal,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FontAwesome } from "@expo/vector-icons";
import apiInstance from "../../config/apiInstance";
import { useAuth } from "../../context/AuthContext";

export default ProfileScreen = ({ navigation }) => {
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [userData, setUserData] = useState([]);
  const [userId, setUserId] = useState(null);
  const [notificationOn, setNotificationOn] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const { logout } = useAuth();

  const fetchUserData = async (userId) => {
    try {
      const response = await apiInstance(`/customer/user/${userId}`);
      const data = response.data;
      setFullName(data.data.fullName);
      setUserData(data.data);
      setPhoneNumber(data.data.phoneNumber);
    } catch (error) {}
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
  }, [navigation][userData]);

  const handleProfilePress = () => {
    navigation.navigate("InfoProfile", { userId: userId });
  };
  const handleHelpCenterPress = () => {
    navigation.navigate("HelpCenter");
  };
  const handleTermsAndConditionsPress = () => {
    navigation.navigate("TermsAndConditions");
  };

  const handleLogout = async () => {
    try {
      logout();
    } catch (error) {
      console.error("Error logging out:", error);
      Alert.alert("Error", "An error occurred while logging out");
    }
  };

  const toggleNotification = () => {
    setNotificationOn(!notificationOn);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Image
            source={
              userData.url
                ? { uri: userData.url }
                : require("../../../assets/images/default-profile.jpg")
            }
            style={styles.profileImage}
          />
        </TouchableOpacity>
        <Text style={styles.userName}>{fullName}</Text>
        <Text style={styles.userRole}>{phoneNumber}</Text>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <View style={styles.modalContainer}>
          <Image
            source={
              userData.url
                ? { uri: userData.url }
                : require("../../../assets/images/default-profile.jpg")
            }
            style={styles.modalImage}
          />
          <TouchableOpacity
            onPress={() => setModalVisible(false)}
            style={styles.closeButton}
          >
            <FontAwesome name="close" size={24} color={"#fff"} />
          </TouchableOpacity>
        </View>
      </Modal>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Settings</Text>

        <TouchableOpacity
          style={styles.settingsItem}
          onPress={handleProfilePress}
        >
          <FontAwesome name="user" size={24} color={"#333"} />
          <View style={styles.settingsTextContainer}>
            <Text style={styles.settingsTitle}>Profile</Text>
            <Text style={styles.settingsValue}>Settings</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.settingsItem}
          onPress={toggleNotification}
        >
          <FontAwesome
            name={notificationOn ? "bell" : "bell-slash"}
            size={24}
            color={"#333"}
          />
          <View style={styles.settingsTextContainer}>
            <Text style={styles.settingsTitle}>Notification</Text>
            <Text style={styles.settingsValue}>
              {notificationOn ? "On" : "Off"}
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingsItem}>
          <FontAwesome name="language" size={24} color={"#333"} />
          <View style={styles.settingsTextContainer}>
            <Text style={styles.settingsTitle}>Language</Text>
            <Text style={styles.settingsValue}>English</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.settingsItem}
          onPress={() =>
            navigation.navigate("ChangePassword", { userId: userId })
          }
        >
          <FontAwesome name="lock" size={24} color={"#333"} />
          <View style={styles.settingsTextContainer}>
            <Text style={styles.settingsTitle}>Change Password</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.settingsItem}
          onPress={handleHelpCenterPress}
        >
          <FontAwesome name="question" size={24} color={"#333"} />
          <View style={styles.settingsTextContainer}>
            <Text style={styles.settingsTitle}>Help Center</Text>
            <Text style={styles.settingsValue}>Ask</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.settingsItem}
          onPress={handleTermsAndConditionsPress}
        >
          <FontAwesome name="font-awesome" size={24} color={"#333"} />
          <View style={styles.settingsTextContainer}>
            <Text style={styles.settingsTitle}>Terms and Conditions</Text>
            <Text style={styles.settingsValue}>Read More</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <FontAwesome name="sign-out" size={24} color={"white"} />
          <View style={styles.settingsTextContainer}>
            <Text style={{ ...styles.settingsTitle, color: "white" }}>
              Logout
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    alignItems: "center",
    padding: 20,
    backgroundColor: "#F9A826",
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 10,
    color: "white",
  },
  userRole: {
    fontSize: 16,
    color: "white",
    marginTop: 5,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
  },
  modalImage: {
    width: 300,
    height: 300,
    resizeMode: "contain",
  },
  closeButton: {
    position: "absolute",
    top: 20,
    right: 20,
  },
  section: {
    padding: 20,
    borderBottomColor: "#ccc",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  settingsItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    padding: 15,
    borderRadius: 8,
    backgroundColor: "#F9A826",
  },
  settingsTextContainer: {
    marginLeft: 10,
  },
  settingsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  settingsValue: {
    fontSize: 14,
    color: "#555",
  },
});
