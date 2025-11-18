import { StyleSheet } from "react-native";
import { COLORS } from "@/constants/theme";

export const styles = StyleSheet.create({
  header: {
    position: "absolute",
    top: 0,
    left: 16,
    right: 16,
    zIndex: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    width: 40,
    height: 40,
    backgroundColor: COLORS.background || "#fff",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  footerScroll: {
    position: "absolute",
    bottom: 30,
    left: 0,
    right: 0,
    paddingBottom: 20,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 12,
    marginVertical: 16,
  },
  card: {
    width: 280,
    backgroundColor: "#fff",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    flexDirection: "row",
  },
  cardSelected: {
    borderWidth: 2,
    borderColor: COLORS.secondary || "#ff6b6b",
    transform: [{ scale: 1.02 }],
  },
  cardImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    margin: 10,
  },
  cardContent: {
    flex: 1,
    padding: 12,
    paddingLeft: 0,
    justifyContent: "center",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#000",
    flex: 1,
  },
  cardDescription: {
    fontSize: 13,
    color: "#666",
    marginBottom: 8,
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  cardFooterItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  cardFooterText: {
    fontSize: 12,
    color: "#666",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});
