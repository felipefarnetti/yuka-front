import { useNavigation } from "@react-navigation/core";
import React, { useState } from "react";
import axios from "axios";
import {
  Text,
  TextInput,
  StyleSheet,
  Image,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Constants from "expo-constants";
import logo from "../assets/yukasplash.png";

export default function SignInScreen({ setToken }) {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleSubmit = async () => {
    if (email && password) {
      if (setErrorMessage !== null) {
        setErrorMessage(null);
      }
      try {
        const response = await axios.post(
          `https://site--yuka-back--4w9wbptccl4w.code.run/login`,
          { email, password }
        );
        // console.log(JSON.stringify(response.data.id, null, 2));
        if (response.data.token) {
          const token = response.data.token;
          setToken(token);
          // console.log(token);
          setIsLoading(false);
          alert("Vous êtes connecté");
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          setErrorMessage("Informations incorrectes");
        } else {
          setErrorMessage("Erreur");
        }
      }
    } else {
      setErrorMessage("Veuillez remplir tous les champs");
    }
  };

  return !isLoading ? (
    <View
      style={[
        styles.container,
        { flexDirection: "row", justifyContent: "space-around", padding: 10 },
      ]}
    >
      <ActivityIndicator size="large" color="green" />
    </View>
  ) : (
    <KeyboardAwareScrollView
      contentContainerStyle={styles.contentContainer}
      style={StyleSheet.container}
    >
      <View style={styles.view}>
        <Image source={logo} style={styles.img} />
        <Text style={styles.title}>Se connecter</Text>
      </View>

      <View style={[styles.view, { marginBottom: 80 }]}>
        <TextInput
          style={styles.input}
          autoCapitalize="none"
          autoComplete="email"
          placeholder="email"
          placeholderTextColor="lightgrey"
          onChangeText={(text) => {
            setEmail(text);
          }}
          value={email}
        />

        <TextInput
          style={styles.input}
          autoCapitalize="none"
          placeholder="password"
          placeholderTextColor="lightgrey"
          secureTextEntry={true}
          onChangeText={(text) => {
            setPassword(text);
          }}
          value={password}
        />
      </View>

      <View style={styles.view}>
        {errorMessage && (
          <Text style={styles.errorMessage}>{errorMessage}</Text>
        )}
        <TouchableOpacity
          style={styles.btn}
          onPress={() => {
            handleSubmit();
          }}
        >
          <Text style={styles.btnText}>Sign In</Text>
        </TouchableOpacity>

        <Text
          style={{ color: "white" }}
          onPress={() => {
            navigation.navigate("SignUpScreen");
          }}
        >
          Vous n'avez pas de compte? par ici !
        </Text>
      </View>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: Constants.statusBarHeight,
  },
  contentContainer: {
    backgroundColor: "#7ab387",
    alignItems: "center",
    flex: 1,
  },
  view: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  img: {
    height: 180,
    width: 150,
    resizeMode: "contain",
    marginTop: 30,
  },
  title: {
    color: "white",
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 40,
    marginTop: 10,
  },
  input: {
    height: 40,
    borderBottomColor: "white",
    borderBottomWidth: 1,
    width: "80%",
    marginBottom: 30,
    fontSize: 16,
  },
  btn: {
    height: 50,
    width: "40%",
    alignItems: "center",
    justifyContent: "center",
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderRadius: 20,
    marginBottom: 20,
    borderColor: "white",
  },
  btnText: {
    color: "white",
    fontSize: 18,
    fontWeight: "500",
  },
  link: {
    marginBottom: 20,
  },
  errorMessage: {
    color: "black",
    marginBottom: 20,
  },
});
