import { styles } from "@/styles/global/header.styles";
import { Text, TouchableOpacity, View } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedStyle,
  useDerivedValue,
} from "react-native-reanimated";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Link } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface HeaderProps {
  title: string;
  scrollOffset: SharedValue<number>;
  address: string;
}

const SCOLL_THRESHOLD = 60;

export default function Header({ title, scrollOffset, address }: HeaderProps) {
  const insets = useSafeAreaInsets();

  // Determine which header should be interactive
  const isHeader2Visible = useDerivedValue(() => {
    return scrollOffset.value > SCOLL_THRESHOLD * 0.5;
  });

  const header1Style = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollOffset.value,
      [0, SCOLL_THRESHOLD * 0.6],
      [1, 0],
      Extrapolation.CLAMP
    );

    const translateY = interpolate(
      scrollOffset.value,
      [0, SCOLL_THRESHOLD * 0.6],
      [0, -10],
      Extrapolation.CLAMP
    );

    return {
      opacity,
      transform: [{ translateY }],
    };
  });

  const header2Style = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollOffset.value,
      [SCOLL_THRESHOLD * 0.3, SCOLL_THRESHOLD],
      [0, 1],
      Extrapolation.CLAMP
    );

    const translateY = interpolate(
      scrollOffset.value,
      [SCOLL_THRESHOLD * 0.3, SCOLL_THRESHOLD],
      [-10, 0],
      Extrapolation.CLAMP
    );

    return {
      opacity,
      transform: [{ translateY }],
    };
  });

  const shadowStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollOffset.value,
      [0, SCOLL_THRESHOLD],
      [0, 1],
      Extrapolation.CLAMP
    );

    return {
      shadowOpacity: opacity * 0.1,
      elevation: opacity * 4,
    };
  });

  return (
    <Animated.View
      style={[styles.headerContainer, shadowStyle, { paddingTop: insets.top }]}
    >
      {/* Header 1 */}
      <Animated.View
        style={[styles.header1, header1Style]}
        pointerEvents={isHeader2Visible.value ? "none" : "auto"}
      >
        <TouchableOpacity style={styles.locationButton}>
          <View style={styles.locationButtonIcon}>
            <Ionicons name="business-outline" size={16} />
          </View>
          <Text style={styles.locationText}>{address}</Text>
          <Ionicons name="chevron-down" size={16} />
        </TouchableOpacity>

        <View style={styles.rightIcons}>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="filter" size={20} />
          </TouchableOpacity>
          <Link href={"/(modal)/map"} asChild>
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="map-outline" size={20} />
            </TouchableOpacity>
          </Link>
        </View>
      </Animated.View>

      {/* Header 2 */}
      <Animated.View
        style={[styles.header2, header2Style]}
        pointerEvents={isHeader2Visible.value ? "auto" : "none"}
      >
        <View style={styles.centerContent}>
          <Text style={styles.titleSmall}>{title}</Text>
          <TouchableOpacity style={styles.locationSmall}>
            <Text style={styles.locationSmallText}>{address}</Text>
            <Ionicons name="chevron-down" size={14} />
          </TouchableOpacity>
        </View>
        <View style={styles.rightIcons}>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="filter" size={20} />
          </TouchableOpacity>
        </View>
      </Animated.View>
    </Animated.View>
  );
}
