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
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import { ScrollView } from "react-native-gesture-handler";
import BackButton from "../../components/DetailKost/BackButton";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import LoadingComponent from "../../components/LoadingComponent";
import apiInstance from "../../config/apiInstance";

export default function InfoProfileScreen({ navigation, route }) {
  const [userData, setUserData] = useState({
    id: "",
    fullName: "",
    email: "",
    genderTypeId: "",
    address: "",
    phoneNumber: "",
    username: "",
    password: "",
    url: "",
  });
  const [errorMessages, setErrorMessages] = useState({
    fullName: "",
    genderTypeId: "",
    email: "",
    address: "",
    phoneNumber: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [genders, setGenders] = useState([]);

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
        handleChange("password", pw);
      })
      .catch((err) => console.log(err));
  }, [userData.password]);

  const fetchUserData = async (userId) => {
    try {
      setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    const errors = {};
    if (!userData.fullName) errors.fullName = "Name is required.";
    if (!userData.genderTypeId) errors.genderTypeId = "Gender is required.";
    if (!userData.email) errors.email = "Email is required.";
    if (!userData.address) errors.address = "Address is required.";
    if (!userData.phoneNumber) errors.phoneNumber = "Phone number is required.";

    setErrorMessages(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    try {
      setIsLoading(true);
      const response = await apiInstance.put(`/customer/v1`, userData);

      if (!response.data.code === 201 || !response.data.code === 200) {
        throw new Error("Failed to update user data");
      }

      Alert.alert("Success", "Profile updated successfully", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      console.error("Error updating user data:", error);
      Alert.alert("Error", "Failed to update user data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (key, value) => {
    setUserData((prevUserData) => ({
      ...prevUserData,
      [key]: value,
    }));
  };

  const handleImageClick = () => {
    Alert.alert("Upload Image", "Please upload an image", [
      { text: "Cancel", style: "cancel" },
      { text: "Upload", onPress: handleFileInputChange },
    ]);
  };

  const handleFileInputChange = async () => {
    try {
      setIsLoading(true);

      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      console.log(result.assets[0].uri);

      if (!result.canceled) {
        const formData = new FormData();
        formData.append("file", {
          uri: result.assets[0].uri,
          name: "image.jpg",
          type: "image/jpeg",
        });

        console.log(formData);
        const token = await AsyncStorage.getItem("token");
        console.log(token);

        console.log("user id ", userData.id);
        const response = await apiInstance.post(
          `/customer/v1/upload/${userData.id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log(response);

        if (response.status == 200 || response.status == 201) {
          const data = await response.data;
          console.log("Upload successful:", data);
          Alert.alert("Success", "Profile updated successfully", [
            { text: "OK", onPress: () => navigation.goBack() },
          ]);
        } else {
          const errorData = await response.json();
          console.error("Upload failed:", errorData);
        }
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      Alert.alert("Error", "Failed to upload image. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingComponent />;
  }

  return (
    <ScrollView>
      <View style={styles.container}>
        <Image
          style={styles.loginImage}
          source={
            userData.url
              ? { uri: userData.url }
              : require("../../../assets/images/default-profile.jpg")
          }
        />
        <TouchableOpacity onPress={handleImageClick}>
          <FontAwesome
            style={styles.changePhotoText}
            name="edit"
            size={30}
            color="black"
          />
        </TouchableOpacity>

        <View style={{ position: "absolute", top: 10, left: "4%" }}>
          <BackButton onPress={() => navigation.goBack()} />
        </View>
        <View style={styles.infoProfilContainer}>
          <Text style={styles.title}>Info Profile</Text>
          <Text style={styles.inputTitle}>Name</Text>
          <View style={styles.inputContainer}>
            <FontAwesome name="user" size={24} color="grey" />
            <TextInput
              style={styles.input}
              value={userData.fullName}
              onChangeText={(text) => handleChange("fullName", text)}
            />
          </View>
          {errorMessages.fullName ? (
            <Text style={styles.errorMessage}>{errorMessages.fullName}</Text>
          ) : null}

          <Text style={styles.inputTitle}>Gender</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={userData.genderTypeId}
              onValueChange={(itemValue, itemIndex) =>
                handleChange("genderTypeId", itemValue)
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

          <Text style={styles.inputTitle}>Email</Text>
          <View style={styles.inputContainer}>
            <FontAwesome name="envelope" size={24} color="grey" />
            <TextInput
              style={styles.input}
              value={userData.email}
              onChangeText={(text) => handleChange("email", text)}
            />
          </View>
          {errorMessages.email ? (
            <Text style={styles.errorMessage}>{errorMessages.email}</Text>
          ) : null}

          <Text style={styles.inputTitle}>Address</Text>
          <View style={styles.inputContainer}>
            <FontAwesome name="home" size={24} color="grey" />
            <TextInput
              style={styles.input}
              value={userData.address}
              onChangeText={(text) => handleChange("address", text)}
            />
          </View>
          {errorMessages.address ? (
            <Text style={styles.errorMessage}>{errorMessages.address}</Text>
          ) : null}

          <Text style={styles.inputTitle}>Phone</Text>
          <View style={styles.inputContainer}>
            <FontAwesome5 name="phone" size={24} color="grey" />
            <TextInput
              style={styles.input}
              value={userData.phoneNumber}
              onChangeText={(text) => handleChange("phoneNumber", text)}
            />
          </View>
          {errorMessages.phoneNumber ? (
            <Text style={styles.errorMessage}>{errorMessages.phoneNumber}</Text>
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
  infoProfilContainer: {
    minWidth: "100%",
    height: "100%",
    backgroundColor: "#f1f1f1",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
    paddingTop: 45,
    marginTop: -45,
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  changePhotoText: {
    fontWeight: "bold",
    marginTop: -270,
    marginLeft: 295,
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
  errorMessage: {
    color: "red",
    fontSize: 12,
    marginTop: -9,
    marginBottom: 5,
    paddingLeft: 5,
  },
});
