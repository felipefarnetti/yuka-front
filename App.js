import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import HeaderLogo from "./components/HeaderLogo";

// Screens
import SplashScreen from "./containers/SplashScreen";
import CameraScreen from "./containers/CameraScreen";
import FavoritesScreen from "./containers/FavoritesScreen";
// import ProductsScreen from "./containers/ProductsScreen";
import ProfileScreen from "./containers/ProfileScreen";
import SignInScreen from "./containers/SignInScreen";
import SignUpScreen from "./containers/SignUpScreen";
import ProductScreen from "./containers/ProductScreen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);
  const [userId, setUserId] = useState(null);

  const setToken = async (token) => {
    if (token) {
      await AsyncStorage.setItem("userToken", token);
    } else {
      await AsyncStorage.removeItem("userToken");
    }

    setUserToken(token);
  };

  const setId = async (id) => {
    if (id) {
      await AsyncStorage.setItem("UserId", id);
    } else {
      await AsyncStorage.removeItem("userId");
    }
    setUserId(id);
  };

  useEffect(() => {
    const bootstrapAsync = async () => {
      const userToken = await AsyncStorage.getItem("userToken");
      const userId = await AsyncStorage.getItem("userId");

      setUserToken(userToken);
      setUserId(userId);
      setIsLoading(false);
    };

    bootstrapAsync();
  }, []);

  if (isLoading === true) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {userToken === null ? (
          <>
            <Stack.Screen
              name="SplashScreen"
              options={{ headerShown: false }}
              component={SplashScreen}
            />
            <Stack.Screen
              name="SignInScreen"
              options={{
                title: "Se connecter",
                headerStyle: { backgroundColor: "#7ab387" },
              }}
            >
              {() => <SignInScreen setToken={setToken} setId={setId} />}
            </Stack.Screen>
            <Stack.Screen
              name="SignUpScreen"
              options={{
                title: "Création de compte",
                headerStyle: { backgroundColor: "#7ab387" },
              }}
            >
              {() => <SignUpScreen setToken={setToken} setId={setId} />}
            </Stack.Screen>
          </>
        ) : (
          <>
            <Stack.Screen name="Main" options={{ headerShown: false }}>
              {() => (
                <Tab.Navigator
                  screenOptions={{
                    headerShown: false,
                    tabBarActiveTintColor: "green",
                    tabBarInactiveTintColor: "grey",
                  }}
                >
                  <Tab.Screen
                    name="Favorites"
                    options={{
                      headerShown: true,
                      headerTitle: () => <HeaderLogo />,
                      tabBarLabel: "Favoris",
                      tabBarIcon: ({ color, size }) => (
                        <FontAwesome5 name="carrot" size={size} color={color} />
                      ),
                    }}
                  >
                    {() => <FavoritesScreen userToken={userToken} />}
                  </Tab.Screen>
                  <Tab.Screen
                    name="Camera"
                    component={CameraScreen}
                    options={{
                      headerShown: true,
                      headerTitle: () => <HeaderLogo />,
                      tabBarLabel: "Scanner un produit",
                      tabBarIcon: ({ color, size }) => (
                        <Ionicons name="ios-camera" size={size} color={color} />
                      ),
                    }}
                  />

                  {/* <Tab.Screen
                    name="Products"
                    options={{
                      headerShown: true,
                      headerTitle: () => <HeaderLogo />,
                      tabBarLabel: "Produits",
                      tabBarIcon: ({ color, size }) => (
                        <Ionicons name="ios-basket" size={size} color={color} />
                      ),
                    }}
                  >
                    {() => <ProductsScreen userToken={userToken} />}
                  </Tab.Screen> */}
                  <Tab.Screen
                    name="Profile"
                    options={{
                      headerShown: true,
                      headerTitle: () => <HeaderLogo />,
                      tabBarLabel: "Mon Compte",
                      tabBarIcon: ({ color, size }) => (
                        <Ionicons name="ios-person" size={size} color={color} />
                      ),
                    }}
                  >
                    {() => (
                      <ProfileScreen
                        userToken={userToken}
                        userId={userId}
                        setToken={setToken}
                        setId={setId}
                      />
                    )}
                  </Tab.Screen>
                </Tab.Navigator>
              )}
            </Stack.Screen>
            <Stack.Screen
              name="ProductScreen"
              options={({ navigation }) => ({
                title: "Informations sur le produit",
              })}
            >
              {() => <ProductScreen userToken={userToken} />}
            </Stack.Screen>
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
