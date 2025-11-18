import { Stack } from "@/components/global/Stack";
import Transition from "react-native-screen-transitions";

export default function ModalLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

      <Stack.Screen
        name="(modal)/(restaurant)/[id]"
        options={{
          ...Transition.presets.DraggableCard(),
        }}
      />

      <Stack.Screen
        name="(modal)/map"
        options={{
          headerShown: false,
          ...Transition.presets.SlideFromBottom(),
        }}
      />

      <Stack.Screen
        name="(modal)/cart"
        options={{
          headerShown: false,
          ...Transition.presets.SlideFromBottom(),
        }}
      />
    </Stack>
  );
}
