import { View, TextInput, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, FONTS } from "@/constants/theme";

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export default function SearchBar({
  value,
  onChangeText,
  placeholder = "Search",
}: SearchBarProps) {
  return (
    <View style={styles.searchContainer}>
      <Ionicons
        name="search"
        size={20}
        color={COLORS.muted}
        style={styles.searchIcon}
      />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={COLORS.muted}
      />
      {value.length > 0 && (
        <Pressable onPress={() => onChangeText("")} style={styles.clearButton}>
          <Ionicons name="close-circle" size={20} color={COLORS.muted} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 44,
    flex: 1,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: FONTS.brand,
    color: COLORS.dark,
  },
  clearButton: {
    padding: 4,
  },
});
