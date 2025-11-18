import { useContext } from "react";
import { Redirect } from "expo-router";

// Context
import { AuthContext } from "@/context/AuthContext";

export default function Index() {
  const { currentUser } = useContext(AuthContext);

  if (currentUser) return <Redirect href="/(tabs)/restaurants" />;

  return <Redirect href="/(auth)/login" />;
}
