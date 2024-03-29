import React, { createContext, useState, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [signedIn, setSignedIn] = useState(false);

  const login = async (username, password) => {
    try {
      const response = await axios.post(`/api/auth/login`, {
        username,
        password,
      });

      if (response.status === 200) {
        const { userId, token, role, username } = response.data.data;
        await AsyncStorage.setItem("userId", userId);
        await AsyncStorage.setItem("token", token);
        await AsyncStorage.setItem("role", role);
        await AsyncStorage.setItem("password", password);

        console.log("user id: " + userId);
        console.log(token);
        console.log(role);
        console.log(password);

        setSignedIn(true);
      } else {
        Alert.alert("Error", response.data.message);
      }
    } catch (error) {
      console.error("Error during login:", error);
      Alert.alert("Error", error.message);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("userId");
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("role");
      await AsyncStorage.removeItem("password");

      setSignedIn(false);
    } catch (error) {
      console.error("Error during logout:", error);
      Alert.alert("Error", error.message);
    }
  };

  return (
    <AuthContext.Provider value={{ signedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
