import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import axios from "axios";

export default function ForgotPasswordScreen({ navigation }) {
  const [inputData, setInputData] = useState({
    email: "",
  });

  const [errorMessages, setErrorMessages] = useState({
    email: "",
  });

  const handleFieldChange = (field, text) => {
    setInputData({
      ...inputData,
      [field]: text,
    });
  };

  const handleForgotPassword = async () => {
    const { email } = inputData;

    const errors = {};
    if (!email) errors.email = "Email is required.";

    setErrorMessages(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    try {
      const response = await axios.post(`/reset/request-customer`, inputData);
      console.log(response.status, "status");
      if (response.status === 200) {
        Alert.alert(
          "New Password Just Sent to Your Email",
          "Your new password has been sent to your email. Please check your inbox.",
          [
            {
              text: "OK",
              onPress: () => {
                navigation.navigate("Login");
              },
            },
          ],
          { cancelable: false }
        );
      }
    } catch (error) {
      console.error("Error during forgot password:", error);
    }
  };

  const handleLogin = () => {
    navigation.navigate("Login");
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <Image
          style={styles.loginImage}
          source={require("../../../assets/images/forgot.png")}
        />

        <View style={styles.subContainer}>
          <Text style={styles.title}>Forgot Password</Text>
          <View>
            <View style={styles.inputContainer}>
              <MaterialCommunityIcons
                name="email-multiple"
                size={18}
                color="grey"
              />
              <TextInput
                style={{ ...styles.input, marginTop: 10 }}
                placeholder="Email"
                placeholderTextColor="grey"
                value={inputData.email}
                onChangeText={(text) => handleFieldChange("email", text)}
              />
            </View>
            {errorMessages.email ? (
              <Text style={styles.errorMessage}>{errorMessages.email}</Text>
            ) : null}
            <TouchableOpacity
              style={styles.registerButton}
              onPress={handleForgotPassword}
            >
              <Text style={styles.buttonText}>Send</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.registerButtonContainer}>
            <Text style={styles.text}>Remember Password?</Text>
            <TouchableOpacity onPress={handleLogin}>
              <Text style={styles.signInText}>Sign in</Text>
            </TouchableOpacity>
          </View>
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
    height: 320,
  },
  subContainer: {
    minWidth: "100%",
    height: "100%",
    backgroundColor: "#f1f1f1",
    marginTop: -57,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
  },
  title: {
    fontSize: 20,
    color: "black",
    textAlign: "center",
    marginBottom: 15,
  },
  input: {
    height: 35,
    borderColor: "white",
    backgroundColor: "white",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
    color: "black",
    width: "97%",
  },
  inputContainer: {
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
  errorMessage: {
    color: "red",
    fontSize: 12,
    marginTop: -9,
    marginBottom: 5,
    paddingLeft: 5,
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
    borderRadius: 10,
    color: "black",
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
  },
  toggleButton: {
    position: "absolute",
    top: 10,
    right: 10,
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
  button: {
    padding: 10,
    backgroundColor: "white",
    borderRadius: 99,
    marginTop: 15,
  },
  text: {
    textAlign: "center",
    marginTop: 10,
    color: "white",
  },
  buttonText: {
    textAlign: "center",
    fontSize: 17,
    color: "grey",
  },
  text: {
    color: "grey",
  },
  registerButton: {
    backgroundColor: "#F9A826",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  registerButtonContainer: {
    flexDirection: "row",
    marginTop: 10,
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  signInText: {
    textAlign: "center",
    fontSize: 14,
    color: "grey",
    fontWeight: "bold",
  },
});
