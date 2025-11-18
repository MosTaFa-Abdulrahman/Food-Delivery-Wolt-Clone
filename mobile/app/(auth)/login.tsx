import { styles } from "@/styles/auth/auth.styles";
import { useState } from "react";
import {
  Image,
  TouchableOpacity,
  View,
  Text,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import Animated, { FadeInDown } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS } from "@/constants/theme";

// Components
import SmoothInfiniteScroll from "@/components/auth/SmoothInfiniteScroll";

// Context
import { useAuth } from "@/context/AuthContext";
import { makeRequest } from "../../requestMethod";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const { login } = useAuth();

  // Handle Login
  const handleLogin = async () => {
    // Clear previous errors
    setErrorMessage("");

    if (!email || !password) {
      setErrorMessage("Please fill all fields");
      return;
    }

    setIsLoading(true);

    try {
      const response = await makeRequest.post("/auth/login", {
        email,
        password,
      });

      await login({
        token: response.data.token,
        user: response.data.user,
      });

      router.replace("/(tabs)/restaurants");
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.error || "Login failed. Please try again.";
      setErrorMessage(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <View style={styles.infiniteScrollContainer}>
            <View>
              <SmoothInfiniteScroll scrollDirection="down" iconSet="set1" />
            </View>
            <View>
              <SmoothInfiniteScroll scrollDirection="up" iconSet="set2" />
            </View>
            <View>
              <SmoothInfiniteScroll scrollDirection="down" iconSet="set3" />
            </View>
            <LinearGradient
              colors={["transparent", "#fff"]}
              style={styles.gradient}
            />
          </View>

          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.contentContainer}>
              {/* <Image
                source={require("@/assets/images/wolt-logo.png")}
                style={styles.brandLogo}
              />
              <Animated.Text entering={FadeInDown} style={styles.tagline}>
                Almost everything delivered
              </Animated.Text> */}

              {/* Auth Form */}
              <Animated.View
                style={styles.formContainer}
                entering={FadeInDown.delay(200)}
              >
                {errorMessage ? (
                  <View style={styles.errorContainer}>
                    <Ionicons name="alert-circle" size={20} color="#ff4444" />
                    <Text style={styles.errorText}>{errorMessage}</Text>
                  </View>
                ) : null}

                <View style={styles.inputContainer}>
                  <Ionicons
                    name="mail-outline"
                    size={20}
                    color={COLORS.muted}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Email"
                    placeholderTextColor="#999"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    editable={!isLoading}
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Ionicons
                    name="lock-closed-outline"
                    size={20}
                    color={COLORS.muted}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor="#999"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    editable={!isLoading}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.eyeIcon}
                  >
                    <Ionicons
                      name={showPassword ? "eye-outline" : "eye-off-outline"}
                      size={20}
                      color={COLORS.muted}
                    />
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  style={[
                    styles.loginButton,
                    isLoading && styles.loginButtonDisabled,
                  ]}
                  onPress={handleLogin}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.loginButtonText}>Log in</Text>
                  )}
                </TouchableOpacity>

                {/* <View style={styles.dividerContainer}>
                  <View style={styles.divider} />
                  <Text style={styles.dividerText}>or</Text>
                  <View style={styles.divider} />
                </View> */}

                <View style={styles.registerContainer}>
                  <Text style={styles.registerText}>
                    Don't have an account?{" "}
                  </Text>
                  <Link href="/(auth)/register" asChild>
                    <TouchableOpacity>
                      <Text style={styles.registerLink}>Sign up</Text>
                    </TouchableOpacity>
                  </Link>
                </View>
              </Animated.View>
            </View>
          </ScrollView>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
