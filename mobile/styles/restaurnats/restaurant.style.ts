import { StyleSheet } from "react-native";
import { COLORS, FONTS } from "@/constants/theme";

export const styles = StyleSheet.create({
  pageTitle: {
    fontFamily: FONTS.brandBlack,
    fontSize: 30,
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  allRestaurantsTitle: {
    fontFamily: FONTS.brandBold,
    fontSize: 20,
    marginBottom: 16,
    paddingHorizontal: 16,
  },

  card: {
    marginHorizontal: 16,
    marginVertical: 8,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  imageContainer: {
    position: "relative",
    width: "100%",
    height: 200,
    backgroundColor: COLORS.light,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  loveButton: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 24,
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  loveButtonActive: {
    backgroundColor: "#FFE8E8",
  },
  deliveryTag: {
    position: "absolute",
    bottom: 12,
    left: 12,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  deliveryTagText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  info: {
    padding: 16,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  name: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.dark,
    flex: 1,
    marginRight: 8,
  },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF9E6",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  ratingText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#000",
  },
  description: {
    fontSize: 14,
    color: COLORS.muted,
    lineHeight: 20,
    marginBottom: 12,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
  },
  footerItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  footerText: {
    fontSize: 13,
    color: COLORS.muted,
    fontWeight: "500",
  },
  footerDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: COLORS.muted,
  },
  closedText: {
    fontSize: 13,
    color: "#FF3B30",
    fontWeight: "600",
  },

  // =====================================================
  // Screen Container Styles
  // =====================================================
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  listContainer: {
    paddingVertical: 8,
    paddingBottom: 20,
  },

  // =====================================================
  // Loading State Styles
  // =====================================================
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: COLORS.background,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: COLORS.muted,
    fontWeight: "500",
  },

  // =====================================================
  // Empty State Styles
  // =====================================================
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
    marginTop: 80,
    backgroundColor: COLORS.background,
  },
  emptyIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  emptyStateText: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.dark,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 15,
    color: COLORS.muted,
    textAlign: "center",
    lineHeight: 22,
    maxWidth: 280,
  },

  // =====================================================
  // Error State Styles
  // =====================================================
  errorState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
    marginTop: 80,
    backgroundColor: COLORS.background,
  },
  errorIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#FFEBEE",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  errorStateText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FF3B30",
    marginBottom: 8,
  },
  errorStateSubtext: {
    fontSize: 15,
    color: COLORS.muted,
    textAlign: "center",
    lineHeight: 22,
    maxWidth: 280,
  },
  retryButton: {
    marginTop: 24,
    paddingHorizontal: 32,
    paddingVertical: 14,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    shadowColor: COLORS.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  retryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },

  // =====================================================
  // Footer Loader Styles
  // =====================================================
  footerLoader: {
    paddingVertical: 20,
    alignItems: "center",
  },
  loadingMoreText: {
    marginTop: 8,
    fontSize: 14,
    color: COLORS.muted,
    fontWeight: "500",
  },
});
