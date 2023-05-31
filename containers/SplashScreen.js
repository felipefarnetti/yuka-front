import React, { useRef } from "react";
import { StyleSheet, View, Text, Image, PanResponder } from "react-native";
import { useNavigation } from "@react-navigation/native";

import yukaSplash from "../assets/yukasplash.png";

function SplashScreen() {
  const navigation = useNavigation();
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => {
        return gestureState.dx < -50;
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dx < -100) {
          navigation.navigate("SignInScreen");
        }
      },
    })
  ).current;

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      <Image source={yukaSplash} style={{ height: 200, width: 200 }} />
      <Text style={styles.title}>Bienvenue !</Text>
      <Text style={styles.text}>
        Yuka est une appli 100% indépendante qui vous aide à choisir les bons
        produits
      </Text>
      {/* <TouchableHighlight
        style={styles.touchable}
        underlayColor="darkblue"
        onPress={() => navigation.navigate("SignInScreen")}
      >
        <Text style={{ color: "white" }}>Se connecter</Text>
      </TouchableHighlight> */}
      <View>
        <Text>Glisser vers la gauche pour continuer</Text>
      </View>
    </View>
  );
}

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-around",
    paddingTop: 80,
    paddingBottom: 20,
    backgroundColor: "#7ab387",
  },
  title: {
    fontSize: 28,
    fontStyle: "italic",
    color: "white",
  },
  text: {
    margin: 20,
    textAlign: "center",
    fontSize: 14,
    color: "white",
  },
  touchable: {
    marginTop: 30,
    padding: 10,
    backgroundColor: "green",
    borderRadius: 15,
  },
});
