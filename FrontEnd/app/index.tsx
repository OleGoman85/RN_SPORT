import { useAuth } from "@clerk/expo";
import { Redirect } from "expo-router";

export default function Index() {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return null;
  }

  if (isSignedIn) {
    return <Redirect href="/(home)/(tabs)/home" />;
  }

  return <Redirect href="/(auth)/welcome" />;
}
