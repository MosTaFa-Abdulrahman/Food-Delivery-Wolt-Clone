import { styles } from "@/styles/restaurnats/restaurant.style";
import { useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";

// Icons & Constants
import { COLORS } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";

// Components
import { Loader } from "@/components/global/Loader";
import Header from "@/components/global/Header";
import Restaurant from "@/components/restaurnats/Restaurant";

// React-Query
import { useInfiniteRestaurants } from "@/store/restaurants/restaurantsSlice";

// Not-Found
const NoRestaurantsFound = () => {
  return (
    <View style={styles.emptyState}>
      <View style={styles.emptyIconContainer}>
        <Ionicons name="restaurant-outline" size={50} color={COLORS.primary} />
      </View>
      <Text style={styles.emptyStateText}>No Restaurants Found</Text>
      <Text style={styles.emptyStateSubtext}>
        There are no restaurants available at the moment. Check back later!
      </Text>
    </View>
  );
};

// Error
const ErrorState = ({ onRetry }: { onRetry: () => void }) => {
  return (
    <View style={styles.errorState}>
      <View style={styles.errorIconContainer}>
        <Ionicons name="alert-circle-outline" size={50} color="#FF3B30" />
      </View>
      <Text style={styles.errorStateText}>Oops! Something went wrong</Text>
      <Text style={styles.errorStateSubtext}>
        We couldn't load the restaurants. Please check your connection and try
        again.
      </Text>
      <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
        <Text style={styles.retryButtonText}>Try Again</Text>
      </TouchableOpacity>
    </View>
  );
};

export default function Restaurants() {
  const insets = useSafeAreaInsets();
  const scrollOffset = useSharedValue(0);
  const HEADER_HEIGHT = 60;

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollOffset.value = event.contentOffset.y;
    },
  });

  // State
  const [refreshing, setRefreshing] = useState(false);

  // React-Query
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteRestaurants();

  // Handle On Refresh
  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  // Handle Load More
  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  // All Restaurnats
  const restaurants = data?.pages.flatMap((page) => page.content) ?? [];

  if (isLoading) return <Loader text="Loading Restaurants..." />;
  if (isError) return <ErrorState onRetry={() => refetch()} />;
  if (restaurants.length === 0) return <NoRestaurantsFound />;

  // Footer
  const renderFooter = () => {
    if (!isFetchingNextPage) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={COLORS.primary} />
        <Text style={styles.loadingMoreText}>Loading more...</Text>
      </View>
    );
  };

  // Header component for FlatList
  const ListHeaderComponent = () => (
    <Text style={styles.pageTitle}>Restaurants</Text>
  );

  return (
    <View style={styles.container}>
      <Header
        title="Restaurants"
        scrollOffset={scrollOffset}
        address="Address"
      />
      <Animated.FlatList
        data={restaurants}
        renderItem={({ item }) => <Restaurant restaurant={item} />}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={ListHeaderComponent}
        ListFooterComponent={renderFooter}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: insets.top + HEADER_HEIGHT,
          ...styles.listContainer,
        }}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.primary}
          />
        }
      />
    </View>
  );
}
