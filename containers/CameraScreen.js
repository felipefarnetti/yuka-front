import React, { useState, useEffect } from "react";
import { Button, Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import { Audio } from "expo-av";

export default function CameraScreen({ navigation }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const handleBarCodeScanned = async ({ data }) => {
    setScanned(true);
    await playScannedSound();
    navigation.navigate("ProductScreen", {
      productScanned: data,
    });
  };

  const playScannedSound = async () => {
    try {
      const soundObject = new Audio.Sound();
      await soundObject.loadAsync(require("../assets/system_sound.mp3"));
      await soundObject.playAsync();
    } catch (error) {
      console.log("Error playing sound: ", error);
    }
  };

  if (hasPermission === null) {
    return <Text>Requesting camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View
      style={{ flex: 1, flexDirection: "column", justifyContent: "flex-end" }}
    >
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
      <View style={styles.scannerContainer}>
        <View style={styles.scannerBorder} />
      </View>
      {scanned && (
        <Button
          title="Appuyez pour scanner à nouveau"
          onPress={() => setScanned(false)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  scannerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  scannerBorder: {
    height: "80%",
    width: "80%",
    borderWidth: 2,
    borderColor: "white",
    borderRadius: 10,
  },
});
