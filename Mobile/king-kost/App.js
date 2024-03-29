import React from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet } from "react-native";
import { AppNavigation } from "./app/navigation/AppNavigation";
import { NavigationContainer } from "@react-navigation/native";
import { AuthProvider } from "./app/context/AuthContext";


export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <AppNavigation />
        <StatusBar style="auto" />
      </NavigationContainer>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
