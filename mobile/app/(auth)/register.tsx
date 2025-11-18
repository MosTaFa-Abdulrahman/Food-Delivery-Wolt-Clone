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

// Make-Request
import { makeRequest } from "../../requestMethod";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  // Handle Register
  const handleRegister = async () => {
    // Clear previous messages
    setErrorMessage("");

    if (!username || !email || !password) {
      setErrorMessage("Please fill all fields");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage("Please enter a valid email address");
      return;
    }

    // Password validation
    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);
    try {
      await makeRequest.post("/auth/register", {
        username,
        email,
        password,
      });
      router.push("/(auth)/login");
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.error ||
        "Registration failed. Please try again.";
      setErrorMessage(errorMessage);
    } finally {
      setLoading(false);
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
                Create your account
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
                    name="person-outline"
                    size={20}
                    color={COLORS.muted}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Username"
                    placeholderTextColor="#999"
                    value={username}
                    onChangeText={setUsername}
                    autoCapitalize="none"
                    editable={!loading}
                  />
                </View>

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
                    editable={!loading}
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
                    placeholder="Password (min 6 characters)"
                    placeholderTextColor="#999"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    editable={!loading}
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
                    loading && styles.loginButtonDisabled,
                  ]}
                  onPress={handleRegister}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.loginButtonText}>Sign up</Text>
                  )}
                </TouchableOpacity>

                {/* <View style={styles.dividerContainer}>
                  <View style={styles.divider} />
                  <Text style={styles.dividerText}>or</Text>
                  <View style={styles.divider} />
                </View> */}

                <View style={styles.registerContainer}>
                  <Text style={styles.registerText}>
                    Already have an account?{" "}
                  </Text>
                  <Link href="/(auth)/login" asChild>
                    <TouchableOpacity>
                      <Text style={styles.registerLink}>Log in</Text>
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
