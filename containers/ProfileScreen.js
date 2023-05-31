import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  TouchableHighlight,
  Alert,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export default function ProfileScreen({ userToken, setToken }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserInfo = async () => {
    try {
      // console.log(userToken);
      const response = await axios.get(
        "https://site--yuka-back--4w9wbptccl4w.code.run/user",
        {
          headers: {
            Authorization: "Bearer " + userToken,
          },
        }
      );

      if (response.status === 200) {
        setUser(response.data);
        setIsLoading(false);
      } else {
        const errorMessage =
          response.data.message || "Error fetching user information";
        Alert.alert("Error", errorMessage);
      }
    } catch (error) {
      console.error("Error:", error);
      Alert.alert(
        "Error",
        "An error occurred while fetching user information."
      );
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const handleDisconnect = () => {
    setToken(null);
    AsyncStorage.removeItem("userToken");
  };

  const handleDeleteAccount = () => {
    Alert.alert("ATTENTION", "Vous voulez vraiment suprimmer votre compte?", [
      {
        text: "Non",
        style: "cancel",
      },
      {
        text: "Oui",
        onPress: () => {
          deleteAccount();
        },
      },
    ]);
  };

  const deleteAccount = async () => {
    try {
      const response = await axios.delete(
        "https://site--yuka-back--4w9wbptccl4w.code.run/user/delete",
        {
          headers: {
            Authorization: "Bearer " + userToken,
          },
        }
      );
      if (response.status === 200) {
        setToken(null);
        AsyncStorage.removeItem("userToken");
      } else {
        const errorMessage =
          response.data.message || "Error deleting user account";
        Alert.alert("Error", errorMessage);
      }
    } catch (error) {
      console.error("Error:", error);
      Alert.alert("Error", "An error occurred while deleting user account.");
    }
  };

  return (
    <View style={styles.container}>
      {isLoading ? (
        <Text>Chargement...</Text>
      ) : (
        <View style={styles.internalContainer}>
          <View>
            <Text style={styles.title}>Mon compte</Text>
          </View>

          <View>
            <Text style={styles.userInfo}>Email: {user.email}</Text>
            <Text style={styles.userInfo}>Username: {user.username}</Text>
          </View>

          <View style={{ alignItems: "center" }}>
            <TouchableHighlight
              style={styles.touchableHighlight}
              onPress={handleDisconnect}
              underlayColor="rgba(128, 128, 128, 0.5)"
            >
              <Text
                style={{
                  color: "blue",
                  fontWeight: "500",
                }}
              >
                Se déconnecter
              </Text>
            </TouchableHighlight>
            <TouchableHighlight
              style={styles.touchableHighlight}
              onPress={handleDeleteAccount}
              underlayColor="rgba(128, 128, 128, 0.5)"
            >
              <Text
                style={{
                  color: "red",
                  fontWeight: "500",
                }}
              >
                Supprimer mon compte
              </Text>
            </TouchableHighlight>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ebebeb",
    borderWidth: 20,
    borderColor: "#717171",
  },
  internalContainer: {
    alignItems: "center",
    justifyContent: "space-around",
    borderWidth: 1,
    borderRadius: 20,
    width: "80%",
    height: "50%",
  },
  title: {
    fontSize: 28,
    marginTop: 20,
    shadowColor: "green",
    shadowOffset: {
      width: 1,
      height: 2,
    },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
  userInfo: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: "center",
  },
  touchableHighlight: {
    justifyContent: "center",
    alignItems: "center",
    width: 190,
    height: 40,
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 10,
  },
});
