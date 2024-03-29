import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import { FontAwesome, Entypo } from "@expo/vector-icons";
import { ScrollView } from "react-native-gesture-handler";
import BackButton from "../../components/DetailKost/BackButton";
import AsyncStorage from "@react-native-async-storage/async-storage";
import apiInstance from "../../config/apiInstance";

export default function ChangePasswordScreen({ navigation, route }) {
  const [userData, setUserData] = useState({
    id: "",
    fullName: "",
    email: "",
    genderTypeId: "",
    address: "",
    phoneNumber: "",
    username: "",
    password: "",
  });

  const [genders, setGenders] = useState([]);
  const [password, setPassword] = useState([]);
  const [hidePassword, setHidePassword] = useState(true);
  const [hideNewPassword, setHideNewPassword] = useState(true);
  const [errorMessages, setErrorMessages] = useState({
    password: "",
  });

  useEffect(() => {
    const fetchGenders = async () => {
      try {
        const response = await apiInstance.get(`/gender/v1`);
        setGenders(response.data);
      } catch (error) {
        console.error("Error fetching genders:", error);
      }
    };
    fetchGenders();
  }, []);

  useEffect(() => {
    const { userId } = route.params;
    fetchUserData(userId);
  }, []);

  useEffect(() => {
    AsyncStorage.getItem("password")
      .then((pw) => {
        setPassword(pw);
      })
      .catch((err) => console.log(err));
  }, []);

  const fetchUserData = async (userId) => {
    try {
      const response = await apiInstance.get(`/customer/user/${userId}`);
      if (
        !response.data.data.code === 200 ||
        !response.data.data.code === 201
      ) {
        throw new Error("Failed to fetch user data");
      }
      const userData = await response.data.data;
      setUserData(userData);

      handleChange("genderTypeId", userData.genderTypeId.id);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handleUpdateProfile = async () => {
    if (!password) {
      setErrorMessages({
        ...errorMessages,
        password: "New Password is required.",
      });
      return;
    }
    try {
      const response = await apiInstance.put(`/customer/v1`, userData);

      if (!response.data.code === 201 || !response.data.code === 200) {
        throw new Error("Failed to update user data");
      }

      Alert.alert("Success", "Password changed successfully");
      navigation.goBack();
    } catch (error) {
      console.error("Error updating user data:", error);
      Alert.alert("Error", "Failed to change password. Please try again.");
    }
  };

  const handleChange = (key, value) => {
    setUserData((prevUserData) => ({
      ...prevUserData,
      [key]: value,
    }));
  };

  const togglePasswordVisibility = () => {
    setHidePassword(!hidePassword);
  };

  const toggleNewPasswordVisibility = () => {
    setHideNewPassword(!hideNewPassword);
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <Image
          style={styles.loginImage}
          source={require("../../../assets/images/lock.png")}
        />
        <View style={{ position: "absolute", top: 10, left: "4%" }}>
          <BackButton onPress={() => navigation.goBack()} />
        </View>
        <View style={styles.changePasswordContainer}>
          <Text style={styles.title}>Change Password</Text>
          <Text style={styles.inputTitle}>Recent Password</Text>
          <View style={styles.passwordInputContainer}>
            <FontAwesome
              name="lock"
              size={24}
              color="grey"
              style={styles.icon}
            />
            <TextInput
              style={styles.passwordInput}
              placeholder="Password"
              placeholderTextColor="grey"
              secureTextEntry={hidePassword}
              value={password}
              editable={false}
            />
            <TouchableOpacity
              style={styles.toggleButton}
              onPress={togglePasswordVisibility}
            >
              {hidePassword ? (
                <Entypo name="eye-with-line" size={24} color="grey" />
              ) : (
                <Entypo name="eye" size={24} color="grey" />
              )}
            </TouchableOpacity>
          </View>
          <Text style={styles.inputTitle}>New Password</Text>
          <View style={styles.passwordInputContainer}>
            <FontAwesome
              name="lock"
              size={24}
              color="grey"
              style={styles.icon}
            />
            <TextInput
              style={styles.input}
              value={userData.password}
              placeholder="New Password"
              secureTextEntry={hideNewPassword}
              onChangeText={(text) => handleChange("password", text)}
            />
            <TouchableOpacity
              style={styles.toggleButton}
              onPress={toggleNewPasswordVisibility}
            >
              {hideNewPassword ? (
                <Entypo name="eye-with-line" size={24} color="grey" />
              ) : (
                <Entypo name="eye" size={24} color="grey" />
              )}
            </TouchableOpacity>
          </View>
          {errorMessages.password ? (
            <Text style={styles.errorMessage}>{errorMessages.password}</Text>
          ) : null}
          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleUpdateProfile}
          >
            <Text style={styles.buttonText}>Update</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  loginImage: {
    width: "100%",
    height: 300,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    backgroundColor: "white",
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 40,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  changePasswordContainer: {
    minWidth: "100%",
    height: "100%",
    backgroundColor: "#f1f1f1",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
    paddingTop: 50,
    marginTop: -42,
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 24,
    color: "black",
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  editText: {
    fontSize: 20,
    color: "#F9A826",
    fontWeight: "bold",
  },
  input: {
    flex: 1,
    height: "100%",
    paddingHorizontal: 10,
    color: "black",
  },
  loginButton: {
    backgroundColor: "#F9A826",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 15,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  inputTitle: {
    paddingLeft: 8,
    fontWeight: "bold",
  },
  pickerContainer: {
    height: 40,
    borderColor: "white",
    backgroundColor: "white",
    borderWidth: 1,
    marginBottom: 10,
    borderRadius: 10,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  passwordInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    borderColor: "white",
    backgroundColor: "white",
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 40,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  passwordInput: {
    flex: 1,
    height: 35,
    borderColor: "white",
    backgroundColor: "white",
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 5,
    color: "black",
  },
  toggleButton: {
    paddingHorizontal: 10,
  },
  errorMessage: {
    color: "red",
    fontSize: 12,
    marginTop: -9,
    marginBottom: 5,
    paddingLeft: 5,
  },
});
