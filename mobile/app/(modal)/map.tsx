import { styles } from "@/styles/modal/map.styles";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/theme";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

// Map - Using react-native-maps
import * as Location from "expo-location";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";

// React-Query
import { useAllForMap } from "@/store/restaurants/restaurantsSlice";

export default function Map() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const mapRef = useRef<MapView>(null);
  const scrollRef = useRef<ScrollView>(null);
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<
    string | null
  >(null);

  // Fetch all restaurants from API
  const { data, isLoading: restaurantsLoading } = useAllForMap();
  const restaurants = data?.data ?? []; // Typed as Restaurant[]

  const locateMe = async () => {
    try {
      const location = await Location.getCurrentPositionAsync();
      const coords = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
      setUserLocation(coords);

      mapRef.current?.animateCamera({
        center: coords,
        zoom: 14,
      });
    } catch (error) {
      console.error("Failed to get location:", error);
    }
  };

  useEffect(() => {
    async function getCurrentLocation() {
      let { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        console.log("Permission was not granted");
        return;
      }
      locateMe();
    }
    getCurrentLocation();
  }, []);

  // 🔥 FIX: Center map to show ALL restaurants when data loads
  useEffect(() => {
    if (restaurants.length > 0 && mapRef.current) {
      // Calculate center point of all restaurants
      const avgLat =
        restaurants.reduce((sum, r) => sum + r.latitude, 0) /
        restaurants.length;
      const avgLng =
        restaurants.reduce((sum, r) => sum + r.longitude, 0) /
        restaurants.length;

      // Calculate bounds to fit all restaurants
      const latitudes = restaurants.map((r) => r.latitude);
      const longitudes = restaurants.map((r) => r.longitude);
      const minLat = Math.min(...latitudes);
      const maxLat = Math.max(...latitudes);
      const minLng = Math.min(...longitudes);
      const maxLng = Math.max(...longitudes);

      const latDelta = (maxLat - minLat) * 1.5; // Add 50% padding
      const lngDelta = (maxLng - minLng) * 1.5;

      setTimeout(() => {
        mapRef.current?.animateToRegion(
          {
            latitude: avgLat,
            longitude: avgLng,
            latitudeDelta: Math.max(latDelta, 0.5), // Minimum zoom level
            longitudeDelta: Math.max(lngDelta, 0.5),
          },
          1000
        );
      }, 500);
    }
  }, [restaurants]);

  if (restaurantsLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size={"large"} color={COLORS.secondary} />
      </View>
    );
  }

  const onMarkerPress = (restaurant: any, index: number) => {
    setSelectedRestaurantId(restaurant.id);

    // Animate map to marker
    mapRef.current?.animateCamera({
      center: {
        latitude: restaurant.latitude,
        longitude: restaurant.longitude,
      },
      zoom: 14,
    });

    // Scroll to card
    scrollRef.current?.scrollTo({
      x: index * 292, // card width (280) + gap (12)
      animated: true,
    });
  };

  const onCardPress = (restaurant: any) => {
    // Animate map to restaurant location
    mapRef.current?.animateCamera({
      center: {
        latitude: restaurant.latitude,
        longitude: restaurant.longitude,
      },
      zoom: 15,
    });
    setSelectedRestaurantId(restaurant.id);

    // Navigate to restaurant details after a short delay
    setTimeout(() => {
      router.push(`/(modal)/(restaurant)/${restaurant.id}`);
    }, 300);
  };

  return (
    <>
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.dismiss()}
        >
          <Ionicons name="chevron-back" size={22} color={COLORS.muted} />
        </TouchableOpacity>
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.push("/(modal)/filter")}
          >
            <Ionicons name="filter" size={22} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.backButton} onPress={locateMe}>
            <Ionicons name="locate-outline" size={22} />
          </TouchableOpacity>
        </View>
      </View>

      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFill}
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          // Center on USA since all restaurants are there
          latitude: 37.0902,
          longitude: -95.7129,
          latitudeDelta: 40,
          longitudeDelta: 40,
        }}
        showsUserLocation={true}
        showsMyLocationButton={false}
        showsCompass={true}
        zoomEnabled={true}
        zoomControlEnabled={true}
      >
        {restaurants.map((restaurant, index) => {
          return (
            <Marker
              key={restaurant.id}
              coordinate={{
                latitude: restaurant.latitude,
                longitude: restaurant.longitude,
              }}
              title={restaurant.name}
              description={restaurant.description}
              pinColor={
                selectedRestaurantId === restaurant.id ? "#ff6b6b" : "#4CAF50"
              }
              onPress={() => onMarkerPress(restaurant, index)}
            />
          );
        })}
      </MapView>

      <View style={styles.footerScroll}>
        <ScrollView
          ref={scrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          snapToInterval={292} // card width (280) + gap (12)
          decelerationRate="fast"
        >
          {restaurants.map((restaurant) => (
            <TouchableOpacity
              key={restaurant.id}
              style={[
                styles.card,
                selectedRestaurantId === restaurant.id && styles.cardSelected,
              ]}
              onPress={() => onCardPress(restaurant)}
            >
              <Image
                source={{ uri: restaurant.imgUrl }}
                style={styles.cardImage}
              />
              <View style={styles.cardContent}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle} numberOfLines={1}>
                    {restaurant.name}
                  </Text>
                  {restaurant.isLiked && (
                    <Ionicons name="heart" size={16} color="#e74c3c" />
                  )}
                </View>
                <Text style={styles.cardDescription} numberOfLines={1}>
                  {restaurant.description}
                </Text>
                <View style={styles.cardFooter}>
                  <View style={styles.cardFooterItem}>
                    <Ionicons name="bicycle-outline" size={14} color="#666" />
                    <Text style={styles.cardFooterText}>
                      {restaurant.deliveryFee === 0
                        ? "Free"
                        : `€${restaurant.deliveryFee.toFixed(2)}`}
                    </Text>
                  </View>
                  <View style={styles.cardFooterItem}>
                    <Ionicons name="time-outline" size={14} color="#666" />
                    <Text style={styles.cardFooterText}>
                      {restaurant.deliveryTime}
                    </Text>
                  </View>
                  <View style={styles.cardFooterItem}>
                    <Ionicons name="star" size={14} color="#f39c12" />
                    <Text style={styles.cardFooterText}>
                      {restaurant.rating}
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </>
  );
}
