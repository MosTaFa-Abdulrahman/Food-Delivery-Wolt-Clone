import { StyleSheet } from "react-native";
import { COLORS, FONTS } from "@/constants/theme";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    flexGrow: 1,
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 30,
    paddingVertical: 20,
    justifyContent: "center",
  },
  brandLogo: {
    width: "100%",
    height: 48,
    resizeMode: "contain",
    marginBottom: 20,
  },
  tagline: {
    fontSize: 32,
    fontFamily: FONTS.brandBlack,
    textAlign: "center",
    marginBottom: 30,
    lineHeight: 36,
    color: COLORS.dark,
  },
  formContainer: {
    width: "100%",
    gap: 12,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 55,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: COLORS.dark,
    fontWeight: "500",
  },
  eyeIcon: {
    padding: 5,
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffebee",
    padding: 12,
    borderRadius: 8,
    gap: 8,
    marginBottom: 8,
  },
  errorText: {
    color: "#ff4444",
    fontSize: 14,
    flex: 1,
    fontWeight: "500",
  },
  loginButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 17,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    shadowColor: COLORS.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  loginButtonDisabled: {
    backgroundColor: "#b3e5f0",
    shadowOpacity: 0,
    elevation: 0,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "#e0e0e0",
  },
  dividerText: {
    color: "#999",
    paddingHorizontal: 15,
    fontSize: 14,
    fontWeight: "500",
  },
  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5,
  },
  registerText: {
    fontSize: 15,
    color: COLORS.muted,
    fontWeight: "500",
  },
  registerLink: {
    fontSize: 15,
    color: COLORS.primary,
    fontWeight: "700",
  },
  infiniteScrollContainer: {
    height: 300,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
    position: "relative",
    overflow: "hidden",
  },
  gradient: {
    position: "absolute",
    height: 200,
    left: 0,
    bottom: 0,
    right: 0,
  },
});
