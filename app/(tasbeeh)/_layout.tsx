/**
 * Tasbeeh Module Stack Layout
 */

import { useThemeColor } from "@/hooks/use-theme-color";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Stack, useRouter } from "expo-router";
import { TouchableOpacity } from "react-native";

export default function TasbeehLayout() {
  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const router = useRouter();

  const BackButton = () => (
    <TouchableOpacity onPress={() => router.back()} activeOpacity={0.6}>
      <MaterialIcons name="chevron-left" size={28} color={textColor} />
    </TouchableOpacity>
  );

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor },
        headerShadowVisible: false,
        headerTintColor: textColor,
        headerTitleStyle: { fontWeight: "600" },
        headerBackVisible: false,
        headerLeft: () => <BackButton />,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Tasbeeh Counters",
          headerLargeTitle: true,
          headerLeft: () => null,
        }}
      />
      <Stack.Screen
        name="edit"
        options={{
          title: "New Tasbeeh",
          presentation: "modal",
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          title: "Counter",
        }}
      />
    </Stack>
  );
}
