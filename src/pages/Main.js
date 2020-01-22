import React, { useEffect, useState } from "react";
import {
  View,
  Keyboard,
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
  TextInput
} from "react-native";
import MapView, { Marker, Callout } from "react-native-maps";
import {
  getCurrentPositionAsync,
  requestPermissionsAsync
} from "expo-location";
import { MaterialIcons as Icon } from "@expo/vector-icons";

import api from "../services/api";

export default function Main({ navigation }) {
  const [currentRegion, setCurrentRegion] = useState(null);
  const [techs, setTechs] = useState("");
  const [devs, setDevs] = useState([]);

  useEffect(() => {
    async function loadInitialLocation() {
      const { granted } = await requestPermissionsAsync();

      if (granted) {
        const { coords } = await getCurrentPositionAsync({
          enableHighAccuracy: true
        });
        const { latitude, longitude } = coords;

        setCurrentRegion({
          latitude,
          longitude,
          latitudeDelta: 0.04,
          longitudeDelta: 0.04
        });
      }
    }

    loadInitialLocation();
  }, []);

  async function loadDevs() {
    const { latitude, longitude } = currentRegion;

    const response = await api.get("/search", {
      params: {
        techs,
        latitude,
        longitude
      }
    });

    setDevs(response.data);
  }

  function handleRegionChanged(coordinates) {
    setCurrentRegion(coordinates);
  }

  if (!currentRegion) {
    return null;
  }

  return (
    <>
      <MapView
        loadingEnabled
        style={styles.map}
        initialRegion={currentRegion}
        onPress={() => Keyboard.dismiss()}
        onRegionChangeComplete={handleRegionChanged}
      >
        {devs.map(dev => (
          <Marker
            key={dev._id}
            coordinate={{
              longitude: dev.location.coordinates[0],
              latitude: dev.location.coordinates[1]
            }}
          >
            <Image style={styles.userAvatar} source={{ uri: dev.avatar_url }} />
            <Callout
              onPress={() => {
                navigation.navigate("Detail", {
                  github_username: dev.github_username
                });
              }}
            >
              <View style={styles.callout}>
                <Text style={styles.devName}>{dev.name}</Text>
                <Text style={styles.devBio}>{dev.bio}</Text>
                <Text style={styles.devTechs}>{dev.techs.join(", ")}</Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>

      <View style={styles.searchForm}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar devs por techs..."
          placeholderTextColor="#999"
          onChangeText={setTechs}
          value={techs}
          autoCapitalize="words"
          autoCorrect={false}
        />
        <TouchableOpacity
          disabled={!techs}
          style={[styles.loadButton, !techs ? { opacity: 0.7 } : {}]}
          onPress={loadDevs}
        >
          <Icon name="my-location" size={20} color="#FFF" />
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1
  },

  userAvatar: {
    width: 54,
    height: 54,
    borderRadius: 4,
    borderWidth: 4,
    borderColor: "#FFF"
  },

  callout: {
    width: 260
  },

  devName: {
    fontWeight: "bold",
    fontSize: 16
  },

  devBio: {
    color: "#666",
    marginTop: 5
  },

  devTechs: {
    marginTop: 5
  },

  searchForm: {
    flexDirection: "row",
    position: "absolute",
    top: 20,
    left: 20,
    right: 20,
    zIndex: 5
  },

  searchInput: {
    flex: 1,
    height: 50,
    backgroundColor: "#FFF",
    color: "#333",
    borderRadius: 25,
    paddingHorizontal: 20,
    fontSize: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: {
      width: 4,
      height: 4
    }
  },

  loadButton: {
    width: 50,
    height: 50,
    backgroundColor: "#8E4DFF",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 15
  }
});
