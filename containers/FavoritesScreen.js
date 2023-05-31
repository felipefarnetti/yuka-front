import React, { useState, useEffect } from "react";
import {
  View,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  StyleSheet,
  Text,
} from "react-native";
import axios from "axios";
import { useNavigation, useFocusEffect } from "@react-navigation/native";

export default function FavoritesScreen({ userToken }) {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);

  const fetchFavorites = async () => {
    try {
      const response = await axios.get(
        "https://site--yuka-back--4w9wbptccl4w.code.run/favorites",
        {
          headers: { Authorization: `Bearer ${userToken}` },
        }
      );
      const favoritesWithInfo = await Promise.all(
        response.data.favorites.map(async (productId) => {
          const productInfo = await fetchProductInfo(productId);
          return { productId, ...productInfo };
        })
      );
      setFavorites(favoritesWithInfo);
      setIsLoading(false);
    } catch (error) {
      console.log(error.message);
    }
  };

  const fetchProductInfo = async (productId) => {
    try {
      const response = await axios.get(
        `https://world.openfoodfacts.org/api/v0/product/${productId}.json`
      );

      return response.data.product;
    } catch (error) {
      console.log(error.message);
      return null;
    }
  };

  const handleProductPress = async (productId) => {
    const productInfo = await fetchProductInfo(productId);
    if (productInfo) {
      navigation.navigate("ProductScreen", { productScanned: productId });
    }
  };

  const renderProductItem = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => handleProductPress(item.productId)}>
        <View style={styles.itemContainer}>
          <Image
            style={styles.itemImage}
            source={{ uri: item.image_front_url }}
          />
          <Text style={styles.itemName}>
            {item.product_name}
            {"\n"}
            {"\n"}
            {item.brands}
          </Text>

          {/* <Text style={styles.itemText}>{item.productId}</Text> */}
        </View>
      </TouchableOpacity>
    );
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchFavorites();

      return () => {
        // refresh de la page
      };
    }, [])
  );

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator size="large" color="gray" />
      ) : (
        <View style={styles.listContainer}>
          <FlatList
            data={favorites.reverse()}
            keyExtractor={(item) => item.productId}
            renderItem={renderProductItem}
          />
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
    padding: 5,
    width: "100%",
  },
  listContainer: {
    flex: 1,
    width: "100%",
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    padding: 5,
    marginVertical: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "grey",
  },
  itemImage: {
    width: 80,
    height: 120,
    marginRight: 10,
    resizeMode: "contain",
  },
  itemName: {
    flexShrink: 1,
    fontSize: 16,
  },
  itemText: {
    fontSize: 16,
  },
});
