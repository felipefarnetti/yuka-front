import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/core";
import axios from "axios";
import { FontAwesome } from "@expo/vector-icons";
import getNutriscoreImage from "../utils/getNutriscoreImage";

export default function ProductScreen({ userToken }) {
  const { params } = useRoute();
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState({});
  const [isFavorite, setIsFavorite] = useState(false);
  const [modal, setModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      console.log(params.productScanned);
      try {
        const response = await axios.get(
          `https://world.openfoodfacts.org/api/v0/product/${params.productScanned}.json`
        );

        setData(response.data);
        setIsLoading(false);
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchData();

    const checkFavorite = async () => {
      try {
        const response = await axios.get(
          "https://site--yuka-back--4w9wbptccl4w.code.run/favorites",
          {
            headers: { Authorization: `Bearer ${userToken}` },
          }
        );
        const favorites = response.data.favorites;
        const isProductInFavorites = favorites.includes(params.productScanned);
        setIsFavorite(isProductInFavorites);
      } catch (error) {
        console.log(error.message);
      }
    };

    checkFavorite();
  }, [params.productScanned, userToken, navigation]);

  const toggleFavorite = async () => {
    try {
      const response = await axios.get(
        "https://site--yuka-back--4w9wbptccl4w.code.run/favorites",
        {
          headers: { Authorization: `Bearer ${userToken}` },
        }
      );

      const favorites = response.data.favorites;
      const isProductInFavorites = favorites.includes(params.productScanned);

      if (isProductInFavorites) {
        await axios.delete(
          "https://site--yuka-back--4w9wbptccl4w.code.run/favorites/delete",
          {
            headers: { Authorization: `Bearer ${userToken}` },
            data: { productId: params.productScanned },
          }
        );
      } else {
        await axios.post(
          "https://site--yuka-back--4w9wbptccl4w.code.run/favorites/add",
          { productId: params.productScanned },
          { headers: { Authorization: `Bearer ${userToken}` } }
        );
      }

      setIsFavorite(!isProductInFavorites);
    } catch (error) {
      console.log(error.message);
    }
  };

  const openImageModal = () => {
    setModal(true);
  };

  const closeImageModal = () => {
    setModal(false);
  };

  return (
    <View style={styles.container}>
      {isLoading ? (
        <Text>
          Chargement...
          <ActivityIndicator />
        </Text>
      ) : (
        <ScrollView style={{ flex: 1, width: "100%" }}>
          <View>
            <View style={styles.blocHaut}>
              <TouchableOpacity onPress={openImageModal}>
                <Image
                  style={styles.img}
                  source={{
                    uri: data.product?.image_front_url
                      ? data.product?.image_front_url
                      : getNutriscoreImage,
                  }}
                />
              </TouchableOpacity>
              <View style={styles.blocHautDroite}>
                <Text style={styles.title}>
                  {data.product?.product_name || "Non disponible"}
                </Text>
                <Text style={{ marginTop: 10, fontSize: 18, color: "#d04a14" }}>
                  Marque : {data.product?.brands || "Non disponible"}
                </Text>

                <Image
                  source={getNutriscoreImage(
                    data.product?.nutriscore_data?.grade
                  )}
                  style={styles.nutriscoreImage}
                />
                <TouchableOpacity
                  style={{
                    alignSelf: "flex-end",
                    marginTop: 20,
                    marginRight: 10,
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                  onPress={toggleFavorite}
                >
                  <Text>
                    {isFavorite
                      ? "Supprimer des favoris"
                      : "Ajouter aux favoris"}
                  </Text>
                  <FontAwesome
                    name={isFavorite ? "heart" : "heart-o"}
                    size={30}
                    color={isFavorite ? "red" : "gray"}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View>
              <View style={styles.blocInfo}>
                <Text style={{ fontSize: 20, fontWeight: "500" }}>
                  Défaults
                </Text>
                <Text style={{ fontSize: 16 }}>pour 100 g / ml</Text>
              </View>

              <View style={styles.blocInfo}>
                <Text style={{ fontSize: 16 }}>Graisses saturées</Text>
                <Text style={{ fontSize: 16 }}>
                  {data.product?.nutriments.fat_100g
                    ? data.product.nutriments.fat_100g + "g"
                    : "Non disponible"}
                </Text>
              </View>

              <View style={styles.blocInfo}>
                <Text style={{ fontSize: 16 }}>Calories</Text>
                <Text style={{ fontSize: 16 }}>
                  {data.product?.nutriments["energy-kcal"]
                    ? data.product?.nutriments["energy-kcal"] + "kcal"
                    : "Non disponible"}
                </Text>
              </View>
              <View style={styles.blocInfo}>
                <Text style={{ fontSize: 16 }}>Sucre</Text>
                <Text style={{ fontSize: 16 }}>
                  {data.product?.nutriments.sugars
                    ? data.product?.nutriments.sugars + "g"
                    : "Non disponible"}
                </Text>
              </View>
              <View style={styles.blocInfo}>
                <Text style={{ fontSize: 20, fontWeight: "500" }}>
                  Qualités
                </Text>
                <Text style={{ fontSize: 16 }}>pour 100 g / ml</Text>
              </View>
              <View style={styles.blocInfo}>
                <Text style={{ fontSize: 16 }}>Fibres</Text>
                <Text style={{ fontSize: 16 }}>
                  {data.product?.nutriments.fiber
                    ? data.product?.nutriments.fiber + "g"
                    : "Non disponible"}
                </Text>
              </View>
              <View style={styles.blocInfo}>
                <Text style={{ fontSize: 16 }}>Protéines</Text>
                <Text style={{ fontSize: 16 }}>
                  {data.product?.nutriments.proteins
                    ? data.product?.nutriments.proteins + "g"
                    : "Not available"}
                </Text>
              </View>
              <View style={styles.blocInfo}>
                <Text style={{ fontSize: 16 }}>Sel</Text>
                <Text style={{ fontSize: 16 }}>
                  {data.product?.nutriments.salt
                    ? data.product?.nutriments.salt + "g"
                    : "Non disponible"}
                </Text>
              </View>

              <View style={styles.blocInfo}>
                <Text style={{ fontSize: 20, fontWeight: "500" }}>
                  Allergènes
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  marginVertical: 10,
                  marginLeft: 10,
                  marginRight: 10,
                }}
              >
                {Object.entries(data.product?.allergens || "Not available").map(
                  ([key, value]) => (
                    <View key={key}>
                      <Text>
                        {value.startsWith("en:") ? value.substring(3) : value}
                      </Text>
                    </View>
                  )
                )}
              </View>

              <View style={styles.blocInfo}>
                <Text style={{ fontSize: 20, fontWeight: "500" }}>
                  Tableau nutritionnel
                </Text>
              </View>
              <View style={styles.blocInfo}>
                <Text style={{ fontSize: 16 }}>Energie</Text>
                <Text style={{ fontSize: 16 }}>
                  {data.product?.nutriments["energy"]
                    ? data.product?.nutriments["energy"] + "kj"
                    : "Non disponible"}
                </Text>
              </View>
              <View style={styles.blocInfo}>
                <Text style={{ fontSize: 16 }}>Glucides</Text>
                <Text style={{ fontSize: 16 }}>
                  {data.product?.nutriments.carbohydrates
                    ? data.product?.nutriments.carbohydrates + "g"
                    : "Non disponible"}
                </Text>
              </View>

              <View style={styles.blocInfo}>
                <Text style={{ fontSize: 16 }}>Matières grasses</Text>
                <Text style={{ fontSize: 16 }}>
                  {data.product?.nutriments.fat
                    ? data.product?.nutriments.fat + "g"
                    : "Non disponible"}
                </Text>
              </View>

              <View style={styles.blocInfo}>
                <Text style={{ fontSize: 16 }}>Vitamine B1</Text>
                <Text style={{ fontSize: 16 }}>
                  {data.product?.nutriments["vitamin-b1_100g"]
                    ? data.product?.nutriments["vitamin-b1_100g"] + "mg"
                    : "Non disponible"}
                </Text>
              </View>
              <View style={styles.blocInfo}>
                <Text style={{ fontSize: 16 }}>Vitamine B2</Text>
                <Text style={{ fontSize: 16 }}>
                  {data.product?.nutriments["vitamin-b2_100g"]
                    ? data.product?.nutriments["vitamin-b2_100g"] + "mg"
                    : "Non disponible"}
                </Text>
              </View>
              <View style={styles.blocInfo}>
                <Text style={{ fontSize: 16 }}>Vitamine B3</Text>
                <Text style={{ fontSize: 16 }}>
                  {data.product?.nutriments["vitamin-pp_100g"]
                    ? data.product?.nutriments["vitamin-pp_100g"] + "mg"
                    : "Non disponible"}
                </Text>
              </View>
              <View style={styles.blocInfo}>
                <Text style={{ fontSize: 16 }}>Vitamine B6</Text>
                <Text style={{ fontSize: 16 }}>
                  {data.product?.nutriments["vitamin-b6_100g"]
                    ? data.product?.nutriments["vitamin-b6_100g"] + "mg"
                    : "Non disponible"}
                </Text>
              </View>
              <View style={styles.blocInfo}>
                <Text style={{ fontSize: 16 }}>Vitamine B9</Text>
                <Text style={{ fontSize: 16 }}>
                  {data.product?.nutriments["vitamin-b9_100g"]
                    ? data.product?.nutriments["vitamin-b9_100g"] + "mg"
                    : "Non disponible"}
                </Text>
              </View>
              <View style={styles.blocInfo}>
                <Text style={{ fontSize: 16 }}>Vitamine B12</Text>
                <Text style={{ fontSize: 16 }}>
                  {data.product?.nutriments["vitamin-b12_100g"]
                    ? data.product?.nutriments["vitamin-b12_100g"] + "mg"
                    : "Non disponible"}
                </Text>
              </View>
              <View style={styles.blocInfo}>
                <Text style={{ fontSize: 16 }}>Fer</Text>
                <Text style={{ fontSize: 16 }}>
                  {data.product?.nutriments.iron_100g
                    ? data.product?.nutriments.iron_100g + "mg"
                    : "Non disponible"}
                </Text>
              </View>
              <View style={styles.blocInfo}>
                <Text style={{ fontSize: 16 }}>Sodium</Text>
                <Text style={{ fontSize: 16 }}>
                  {data.product?.nutriments.sodium_100g
                    ? data.product?.nutriments.sodium_100g + "mg"
                    : "Non disponible"}
                </Text>
              </View>
              <View style={styles.blocInfo}>
                <Text style={{ fontSize: 16 }}>Phosphore</Text>
                <Text style={{ fontSize: 16 }}>
                  {data.product?.nutriments.phosphorus
                    ? data.product?.nutriments.phosphorus + "mg"
                    : "Non disponible"}
                </Text>
              </View>
              <View style={styles.blocInfo}>
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: "500",
                  }}
                >
                  Ingrédients
                </Text>
              </View>
              <View style={styles.blocInfo}>
                <Text style={{ fontSize: 16, textAlign: "justify" }}>
                  {data.product?.ingredients_text
                    ? data.product?.ingredients_text
                    : "Non disponible"}
                </Text>
              </View>
              <View style={styles.blocInfo}>
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: "500",
                  }}
                >
                  Additifs
                </Text>
              </View>
              <View style={{ flexDirection: "row", marginBottom: 40 }}>
                {Object.entries(
                  data.product?.additives_tags || "Not available"
                ).map(([key, value]) => (
                  <View style={styles.blocInfo} key={key}>
                    <Text>{value.replace("en:", "").toUpperCase()}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </ScrollView>
      )}

      {/* Modal */}

      <Modal visible={modal} onRequestClose={closeImageModal}>
        <View style={styles.modalContainer}>
          <TouchableOpacity
            onPress={closeImageModal}
            style={styles.closeButton}
          >
            <FontAwesome name="close" size={40} color="white" />
          </TouchableOpacity>
          <Image
            style={styles.modalImage}
            source={{
              uri: data.product?.image_front_url
                ? data.product?.image_url
                : "Not available",
            }}
          />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  blocHaut: {
    flexDirection: "row",
    alignSelf: "center",
    borderRadius: 10,
    backgroundColor: "#efffed",
    borderColor: "#717171",
    borderWidth: 2,
    width: "95%",
    marginTop: 10,
  },
  blocHautDroite: {
    marginTop: 10,
    flex: 1,
    width: "100%",
  },
  blocInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
    marginLeft: 10,
    marginRight: 10,
  },
  img: {
    height: 220,
    width: 140,
    resizeMode: "contain",
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#717171",
    marginBottom: 10,
    marginTop: 10,
    marginLeft: 10,
    backgroundColor: "#efffed",
  },
  title: {
    fontSize: 20,
  },
  nutriscoreImage: {
    marginTop: 10,
    width: 110,
    height: 60,
    resizeMode: "contain",
    alignSelf: "center",
    borderWidth: 0.5,
    borderRadius: 15,
    borderColor: "#717171",
  },
  txtSmallGrey: {
    color: "grey",
    fontSize: 16,
  },
  txtMediumBlack: {
    color: "black",
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "black",
    alignItems: "center",
    justifyContent: "center",
  },
  closeButton: {
    position: "absolute",
    top: 70,
    right: 20,
    zIndex: 1,
  },
  modalImage: {
    width: "80%",
    height: "80%",
    resizeMode: "contain",
  },
});
