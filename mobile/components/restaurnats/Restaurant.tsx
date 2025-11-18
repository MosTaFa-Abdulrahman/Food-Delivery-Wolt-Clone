import { styles } from "@/styles/restaurnats/restaurant.style";
import { useState } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

// React-Query
import { useToggleRestaurantFavourite } from "@/store/restaurants/restaurantsSlice";

// Types
import { Restaurant as RestaurantType } from "@/types/restaurants.types";

interface RestaurantProps {
  restaurant: RestaurantType;
}

export default function Restaurant({ restaurant }: RestaurantProps) {
  const router = useRouter();
  const toggleFavourite = useToggleRestaurantFavourite();

  // Local state for optimistic UI
  const [isLiked, setIsLiked] = useState(restaurant.isLiked ?? false);

  const handleToggleLike = (e: any) => {
    e.stopPropagation();

    // Store previous state for rollback
    const previousState = isLiked;

    // Optimistic update
    setIsLiked(!isLiked);

    // API call - mutate doesn't return anything, use callbacks
    toggleFavourite.mutate(restaurant.id, {
      onSuccess: (data) => {
        // Update state based on server response
        setIsLiked(data.isLiked);
      },
      onError: (error) => {
        // Rollback on error
        setIsLiked(previousState);
      },
    });
  };

  const handlePress = () => {
    router.push(`/(modal)/(restaurant)/${restaurant.id}`);
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      {/* Image Container */}
      <View style={styles.imageContainer}>
        <Image
          source={{
            uri:
              restaurant.imgUrl ||
              "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800",
          }}
          style={styles.image}
          resizeMode="cover"
        />

        {/* Love Button */}
        <TouchableOpacity
          style={[styles.loveButton, isLiked && styles.loveButtonActive]}
          onPress={handleToggleLike}
          disabled={toggleFavourite.isPending}
        >
          <Ionicons
            name={isLiked ? "heart" : "heart-outline"}
            size={24}
            color={isLiked ? "#FF3B30" : "#666"}
          />
        </TouchableOpacity>

        {/* Delivery Tag */}
        {restaurant.deliveryTime && (
          <View style={styles.deliveryTag}>
            <Text style={styles.deliveryTagText}>
              🚚 {restaurant.deliveryTime}
            </Text>
          </View>
        )}
      </View>

      {/* Info Section */}
      <View style={styles.info}>
        {/* Header Row */}
        <View style={styles.headerRow}>
          <Text style={styles.name} numberOfLines={1}>
            {restaurant.name}
          </Text>
          {restaurant.rating && (
            <View style={styles.ratingBadge}>
              <Ionicons name="star" size={14} color="#FFB800" />
              <Text style={styles.ratingText}>{restaurant.rating}</Text>
            </View>
          )}
        </View>

        {/* Description */}
        {restaurant.description && (
          <Text style={styles.description} numberOfLines={2}>
            {restaurant.description}
          </Text>
        )}

        {/* Footer Info */}
        <View style={styles.footer}>
          {/* Delivery Fee */}
          {restaurant.deliveryFee !== null && (
            <View style={styles.footerItem}>
              <Ionicons name="bicycle-outline" size={16} color="#666" />
              <Text style={styles.footerText}>
                ${restaurant.deliveryFee.toFixed(2)}
              </Text>
            </View>
          )}

          {restaurant.deliveryFee !== null && restaurant.minOrder !== null && (
            <View style={styles.footerDot} />
          )}

          {/* Min Order */}
          {restaurant.minOrder !== null && (
            <View style={styles.footerItem}>
              <Ionicons name="wallet-outline" size={16} color="#666" />
              <Text style={styles.footerText}>
                Min ${restaurant.minOrder.toFixed(2)}
              </Text>
            </View>
          )}

          {restaurant.minOrder !== null && !restaurant.isActive && (
            <View style={styles.footerDot} />
          )}

          {/* Status */}
          {!restaurant.isActive && (
            <Text style={styles.closedText}>Closed</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}
