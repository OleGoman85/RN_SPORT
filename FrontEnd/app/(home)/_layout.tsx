// Protected home stack: blocks guests and hosts tabs, create-event modal, and chat room.
import { useAuth } from "@clerk/expo";
import { Redirect, Stack } from "expo-router";

export default function HomeLayout() {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) {
    return null;
  }

  if (!isSignedIn) {
    return <Redirect href="/(auth)/welcome" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="(tabs)" />

      <Stack.Screen
        name="create-event"
        options={{
          presentation: "modal",
          animation: "slide_from_bottom",
        }}
      />

      <Stack.Screen name="chat-room/[chatId]" />
    </Stack>
  );
}
