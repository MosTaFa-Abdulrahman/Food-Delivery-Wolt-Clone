import { StyleSheet } from "react-native";
import { COLORS } from "@/constants/theme";

export const styles = StyleSheet.create({
  headerContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    zIndex: 100,
    // boxShadow: '0px 2px 4px -2px rgba(0, 0, 0, 0.2)',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  header1: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  header2: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  locationText: {
    fontSize: 14,
    fontWeight: "600",
  },
  locationButton: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
    gap: 6,
  },
  locationButtonIcon: {
    borderRadius: 20,
    backgroundColor: COLORS.light,
    padding: 10,
  },
  rightIcons: {
    flexDirection: "row",
    gap: 8,
  },
  iconButton: {
    width: 40,
    height: 40,
    backgroundColor: COLORS.light,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  centerContent: {
    flex: 1,
    alignItems: "center",
    paddingLeft: 40,
  },
  titleSmall: {
    fontSize: 16,
    fontWeight: 700,
    marginBottom: 2,
  },
  locationSmall: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  locationSmallText: {
    fontSize: 12,
    color: COLORS.muted,
  },
});
