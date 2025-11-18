import { ScrollView, Pressable, Text, StyleSheet, View } from "react-native";
import { COLORS, FONTS } from "@/constants/theme";

interface Category {
  id: string | null;
  name: string;
}

interface CategoryTabsProps {
  categories: Category[];
  selectedCategory: string | null;
  onSelectCategory: (categoryId: string | null) => void;
}

export default function CategoryTabs({
  categories,
  selectedCategory,
  onSelectCategory,
}: CategoryTabsProps) {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {categories.map((category) => {
          const isSelected = category.id === selectedCategory;
          return (
            <Pressable
              key={category.id || "all"}
              style={[styles.tab, isSelected && styles.tabSelected]}
              onPress={() => onSelectCategory(category.id)}
            >
              <Text
                style={[styles.tabText, isSelected && styles.tabTextSelected]}
              >
                {category.name}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.background,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 12,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "transparent",
  },
  tabSelected: {
    backgroundColor: "transparent",
    borderBottomWidth: 3,
    borderBottomColor: COLORS.primary,
    borderRadius: 0,
  },
  tabText: {
    fontSize: 15,
    fontFamily: FONTS.brand,
    color: "#999",
  },
  tabTextSelected: {
    color: COLORS.primary,
    fontFamily: FONTS.brandBold,
  },
});
