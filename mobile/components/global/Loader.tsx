import { ActivityIndicator, View, Text } from "react-native";
import { COLORS } from "@/constants/theme";

export function Loader({ text }: { text: string }) {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.background,
      }}
    >
      <Text>{text}</Text>
      <ActivityIndicator size="large" color={COLORS.primary} />
    </View>
  );
}
