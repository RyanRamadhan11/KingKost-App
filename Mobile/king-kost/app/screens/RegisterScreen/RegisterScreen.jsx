import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  Entypo,
  FontAwesome,
  FontAwesome5,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import apiInstance from "../../config/apiInstance";

export default function RegisterScreen() {
  const [hidePassword, setHidePassword] = useState(true);
  const [registrationData, setRegistrationData] = useState({
    username: "",
    password: "",
    fullName: "",
    address: "",
    phoneNumber: "",
    email: "",
    genderTypeId: "",
  });
  const [errorMessages, setErrorMessages] = useState({
    username: "",
    password: "",
    fullName: "",
    address: "",
    phoneNumber: "",
    email: "",
    genderTypeId: "",
  });
  const [genders, setGenders] = useState([]);
  const navigation = useNavigation();

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

  const handleFieldChange = (field, text) => {
    setRegistrationData({
      ...registrationData,
      [field]: text,
    });
  };
  const togglePasswordVisibility = () => {
    setHidePassword(!hidePassword);
  };

  const handleRegister = async () => {
    const {
      username,
      password,
      fullName,
      address,
      phoneNumber,
      email,
      genderTypeId,
    } = registrationData;

    const errors = {};
    if (!username) errors.username = "Username is required.";
    if (!password) errors.password = "Password is required.";
    if (!fullName) errors.fullName = "Name is required.";
    if (!address) errors.address = "Address is required.";
    if (!phoneNumber) errors.phoneNumber = "Mobile Phone is required.";
    if (!email) errors.email = "Email is required.";
    if (!genderTypeId) errors.genderTypeId = "genderTypeId is required.";

    setErrorMessages(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    try {
      const response = await apiInstance.post(
        `/api/auth/register/customer`,
        registrationData
      );
      console.log(response.status, "status");
      if (response.status === 200) {
        Alert.alert(
          "Registration Success",
          "You can login now",
          [
            {
              onPress: () => {
                navigation.navigate("Login");
              },
            },
          ],
          { cancelable: false }
        );
      }
    } catch (error) {
      console.error("Error during registration:", error);
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
          source={require("../../../assets/images/register.png")}
        />

        <View style={styles.subContainer}>
          <Text style={styles.title}>Register</Text>
          <View>
            <View style={styles.inputContainer}>
              <FontAwesome
                name="user"
                size={24}
                color="grey"
                style={styles.icon}
              />
              <TextInput
                style={{
                  ...styles.input,
                  marginTop: 10,
                }}
                placeholder="Username"
                value={registrationData.username}
                onChangeText={(text) => handleFieldChange("username", text)}
                placeholderTextColor="grey"
              />
            </View>
            {errorMessages.username ? (
              <Text style={styles.errorMessage}>{errorMessages.username}</Text>
            ) : null}
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
                value={registrationData.password}
                onChangeText={(text) => handleFieldChange("password", text)}
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
            {errorMessages.password ? (
              <Text style={styles.errorMessage}>{errorMessages.password}</Text>
            ) : null}
            <View style={styles.inputContainer}>
              <FontAwesome name="address-card" size={16} color="grey" />
              <TextInput
                style={{ ...styles.input, marginTop: 10 }}
                placeholder="Name"
                placeholderTextColor="grey"
                value={registrationData.fullName}
                onChangeText={(text) => handleFieldChange("fullName", text)}
              />
            </View>
            {errorMessages.name ? (
              <Text style={styles.errorMessage}>{errorMessages.name}</Text>
            ) : null}
            <View style={styles.inputContainer}>
              <FontAwesome name="street-view" size={21} color="grey" />
              <TextInput
                style={{ ...styles.input, marginTop: 10 }}
                placeholder="Address"
                placeholderTextColor="grey"
                value={registrationData.address}
                onChangeText={(text) => handleFieldChange("address", text)}
              />
            </View>
            {errorMessages.address ? (
              <Text style={styles.errorMessage}>{errorMessages.address}</Text>
            ) : null}
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={registrationData.genderTypeId}
                onValueChange={(itemValue, itemIndex) =>
                  handleFieldChange("genderTypeId", itemValue)
                }
                style={{ marginTop: -8 }}
              >
                <Picker.Item
                  label="Select Gender"
                  style={{ color: "grey" }}
                  value=""
                />
                {genders &&
                  genders
                    .filter((gender) => gender.name !== "CAMPUR")
                    .map((gender) => (
                      <Picker.Item
                        key={gender.id}
                        label={gender.name}
                        value={gender.id}
                      />
                    ))}
              </Picker>
            </View>
            {errorMessages.genderTypeId ? (
              <Text style={styles.errorMessage}>
                {errorMessages.genderTypeId}
              </Text>
            ) : null}
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
                value={registrationData.email}
                onChangeText={(text) => handleFieldChange("email", text)}
              />
            </View>
            {errorMessages.email ? (
              <Text style={styles.errorMessage}>{errorMessages.email}</Text>
            ) : null}
            <View style={styles.inputContainer}>
              <FontAwesome5 name="phone-square-alt" size={21} color="grey" />
              <TextInput
                style={{ ...styles.input, marginTop: 10 }}
                placeholder="Mobile Phone"
                placeholderTextColor="grey"
                keyboardType="phone-pad"
                value={registrationData.phoneNumber}
                onChangeText={(text) => handleFieldChange("phoneNumber", text)}
              />
            </View>
            {errorMessages.phoneNumber ? (
              <Text style={styles.errorMessage}>
                {errorMessages.phoneNumber}
              </Text>
            ) : null}
            <TouchableOpacity
              style={styles.registerButton}
              onPress={handleRegister}
            >
              <Text style={styles.buttonText}>Register</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.registerButtonContainer}>
            <Text style={styles.text}>Already have account?</Text>
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
    height: 350,
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
