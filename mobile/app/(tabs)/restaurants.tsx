import { styles } from "@/styles/restaurnats/restaurant.style";
import React, { useCallback, useState, useMemo } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  Text,
  TextInput,
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
const NoRestaurantsFound = ({ searchQuery }: { searchQuery?: string }) => {
  return (
    <View style={styles.emptyState}>
      <View style={styles.emptyIconContainer}>
        <Ionicons name="restaurant-outline" size={50} color={COLORS.primary} />
      </View>
      <Text style={styles.emptyStateText}>
        {searchQuery ? "No Results Found" : "No Restaurants Found"}
      </Text>
      <Text style={styles.emptyStateSubtext}>
        {searchQuery
          ? `We couldn't find any restaurants matching "${searchQuery}". Try a different search.`
          : "There are no restaurants available at the moment. Check back later!"}
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
        We could not load the restaurants. Please check your connection and try
        again.
      </Text>
      <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
        <Text style={styles.retryButtonText}>Try Again</Text>
      </TouchableOpacity>
    </View>
  );
};

// Search Header Component - Memoized to prevent re-renders
const SearchHeader = React.memo(
  ({
    searchInput,
    setSearchInput,
    handleSubmitEditing,
    handleClearSearch,
    handleSearch,
    activeSearch,
    resultsCount,
  }: {
    searchInput: string;
    setSearchInput: (text: string) => void;
    handleSubmitEditing: () => void;
    handleClearSearch: () => void;
    handleSearch: () => void;
    activeSearch: string;
    resultsCount: number;
  }) => (
    <>
      <Text style={styles.pageTitle}>Restaurants</Text>

      {/* Search Input */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search restaurants..."
          placeholderTextColor={COLORS.muted}
          value={searchInput}
          onChangeText={setSearchInput}
          returnKeyType="search"
          onSubmitEditing={handleSubmitEditing}
          autoCorrect={false}
          autoCapitalize="none"
        />

        {searchInput.length > 0 && (
          <TouchableOpacity
            onPress={handleClearSearch}
            style={styles.clearButton}
          >
            <Ionicons name="close-circle" size={20} color={COLORS.muted} />
          </TouchableOpacity>
        )}

        <TouchableOpacity
          onPress={handleSearch}
          style={styles.searchButton}
          activeOpacity={0.7}
        >
          <Ionicons name="search" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Active Search Badge */}
      {activeSearch && (
        <View style={styles.activeSearchBadge}>
          <Text style={styles.activeSearchText}>
            Searching for: {activeSearch}
          </Text>
          <TouchableOpacity onPress={handleClearSearch}>
            <Ionicons name="close" size={18} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
      )}

      {/* Results count */}
      {activeSearch && resultsCount > 0 && (
        <Text style={styles.resultsCount}>
          Found {resultsCount} restaurant{resultsCount !== 1 ? "s" : ""}
        </Text>
      )}
    </>
  )
);

SearchHeader.displayName = "SearchHeader";

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
  const [searchInput, setSearchInput] = useState("");
  const [activeSearch, setActiveSearch] = useState("");

  // React-Query with active search query
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteRestaurants({
    search: activeSearch || undefined,
  });

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

  // Handle Search Button Click
  const handleSearch = useCallback(() => {
    setActiveSearch(searchInput.trim());
  }, [searchInput]);

  // Handle Clear Search
  const handleClearSearch = useCallback(() => {
    setSearchInput("");
    setActiveSearch("");
  }, []);

  // Handle Submit on keyboard
  const handleSubmitEditing = useCallback(() => {
    handleSearch();
  }, [handleSearch]);

  // All Restaurants
  const restaurants = data?.pages.flatMap((page) => page.content) ?? [];

  if (isLoading) return <Loader text="Loading Restaurants..." />;
  if (isError) return <ErrorState onRetry={() => refetch()} />;

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

  // Header component for FlatList - useMemo to prevent re-renders
  const ListHeaderComponent = useMemo(
    () => (
      <SearchHeader
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        handleSubmitEditing={handleSubmitEditing}
        handleClearSearch={handleClearSearch}
        handleSearch={handleSearch}
        activeSearch={activeSearch}
        resultsCount={data?.pages[0]?.totalElements || 0}
      />
    ),
    [
      searchInput,
      activeSearch,
      data?.pages,
      handleSubmitEditing,
      handleClearSearch,
      handleSearch,
    ]
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
        ListEmptyComponent={<NoRestaurantsFound searchQuery={activeSearch} />}
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
