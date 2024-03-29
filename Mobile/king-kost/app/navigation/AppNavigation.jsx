import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import BottomTabNavigation from "./BottomTabNavigation";
import RegisterScreen from "../screens/RegisterScreen/RegisterScreen";
import DetailKostScreen from "../screens/DetailKostScreen/DetailKostScreen";
import InfoProfilScreen from "../screens/InfoProfileScreen/InfoProfilScreen";
import HelpCenterScreen from "../screens/HelpCenterScreen/HelpCenterScreen";
import MaleKostListScreen from "../screens/MaleKostListScreen/MaleKostListScreen";
import FemaleKostListScreen from "../screens/FemaleKostListScreen/FemaleKostListScreen";
import PopularKostAreaScreen from "../screens/PopularKostAreaScreen/PopularKostAreaScreen";
import ListAllKostScreen from "../screens/ListAllKostScreen/ListAllKostScreen";
import CreateOrderScreen from "../screens/CreateOrderScreen/CreateOrderScreen";
import OrderStatusScreen from "../screens/OrderStatusScreen/OrderStatusScreen";
import LoginScreen from "../screens/LoginScreen/LoginScreen";
import ChangePasswordScreen from "../screens/ChangePasswordScreen/ChangePasswordScreen";
import TermsAndConditionsScreen from "../screens/TermsAndConditionsScreen/TermsAndConditionsScreen";
import ForgotPasswordScreen from "../screens/ForgotPasswordScreen.jsx/ForgotPasswordScreen";
import DetailTransactionScreen from "../screens/DetailTransactionScreen/DetailTransactionScreen";
import { useAuth } from "../context/AuthContext";

const Stack = createStackNavigator();

export const AppNavigation = () => {
  const { signedIn } = useAuth();

  console.log(signedIn);
  return (
    <Stack.Navigator>
      {signedIn ? (
        <>
          <Stack.Screen
            name="BottomTabNavigation"
            component={BottomTabNavigation}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="DetailKostScreen"
            component={DetailKostScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="DetailTransactionScreen"
            component={DetailTransactionScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="PopularKostArea"
            component={PopularKostAreaScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ListAllKostScreen"
            component={ListAllKostScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="InfoProfile"
            component={InfoProfilScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="HelpCenter"
            component={HelpCenterScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="TermsAndConditions"
            component={TermsAndConditionsScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="MaleKostListScreen"
            component={MaleKostListScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="FemaleKostListScreen"
            component={FemaleKostListScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="CreateOrderScreen"
            component={CreateOrderScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="OrderStatusScreen"
            component={OrderStatusScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ChangePassword"
            component={ChangePasswordScreen}
            options={{ headerShown: false }}
          />
        </>
      ) : (
        <>
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Register"
            component={RegisterScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ForgotPassword"
            component={ForgotPasswordScreen}
            options={{ headerShown: false }}
          />
        </>
      )}
    </Stack.Navigator>
  );
};
