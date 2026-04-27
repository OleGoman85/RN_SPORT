import { useAuth, useSignUp } from "@clerk/expo";
import { type Href, Link, useRouter } from "expo-router";
import React from "react";
import {
  ImageBackground,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { colors } from "../constants/colors";
import { styles } from "../styles/sign_up.styles";


export default function Page() {
  const { signUp, errors, fetchStatus } = useSignUp();
  const { isSignedIn } = useAuth();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [code, setCode] = React.useState("");

  const handleSubmit = async () => {
    const { error } = await signUp.password({
      emailAddress,
      password,
    });

    if (error) {
      console.error(JSON.stringify(error, null, 2));
      return;
    }

    await signUp.verifications.sendEmailCode();
  };

  const handleVerify = async () => {
    await signUp.verifications.verifyEmailCode({
      code,
    });

    if (signUp.status === "complete") {
      await signUp.finalize({
        navigate: ({ session, decorateUrl }) => {
          if (session?.currentTask) {
            console.log(session.currentTask);
            return;
          }

          const url = decorateUrl("/");

          if (url.startsWith("http")) {
            window.location.href = url;
          } else {
            router.push(url as Href);
          }
        },
      });
    } else {
      console.error("Sign-up attempt not complete:", signUp);
    }
  };

  if (signUp.status === "complete" || isSignedIn) {
    return null;
  }

  if (
    signUp.status === "missing_requirements" &&
    signUp.unverifiedFields.includes("email_address") &&
    signUp.missingFields.length === 0
  ) {
    return (
      <ImageBackground
        source={require("../../assets/images/running.png")}
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          <View style={styles.formCard}>
            <Text style={styles.title}>Verify your account</Text>

            <TextInput
              style={styles.input}
              value={code}
              placeholder="Enter your verification code"
              placeholderTextColor={colors.secondaryText}
              onChangeText={setCode}
              keyboardType="numeric"
            />

            {errors.fields.code && (
              <Text style={styles.error}>{errors.fields.code.message}</Text>
            )}

            <Pressable
              style={({ pressed }) => [
                styles.button,
                fetchStatus === "fetching" && styles.buttonDisabled,
                pressed && styles.buttonPressed,
              ]}
              onPress={handleVerify}
              disabled={fetchStatus === "fetching"}
            >
              <Text style={styles.buttonText}>Verify</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.secondaryButton,
                pressed && styles.buttonPressed,
              ]}
              onPress={() => signUp.verifications.sendEmailCode()}
            >
              <Text style={styles.secondaryButtonText}>I need a new code</Text>
            </Pressable>
          </View>
        </View>
      </ImageBackground>
    );
  }

  return (
    <ImageBackground
      source={require("../../assets/images/running.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <View style={styles.formCard}>
          <Text style={styles.title}>Create Account</Text>

          <Text style={styles.label}>Email address</Text>
          <TextInput
            style={styles.input}
            autoCapitalize="none"
            value={emailAddress}
            placeholder="Enter email"
            placeholderTextColor={colors.secondaryText}
            onChangeText={setEmailAddress}
            keyboardType="email-address"
          />

          {errors.fields.emailAddress && (
            <Text style={styles.error}>{errors.fields.emailAddress.message}</Text>
          )}

          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            value={password}
            placeholder="Enter password"
            placeholderTextColor={colors.secondaryText}
            secureTextEntry
            onChangeText={setPassword}
          />

          {errors.fields.password && (
            <Text style={styles.error}>{errors.fields.password.message}</Text>
          )}

          <Pressable
            style={({ pressed }) => [
              styles.button,
              (!emailAddress || !password || fetchStatus === "fetching") &&
                styles.buttonDisabled,
              pressed && styles.buttonPressed,
            ]}
            onPress={handleSubmit}
            disabled={!emailAddress || !password || fetchStatus === "fetching"}
          >
            <Text style={styles.buttonText}>Sign up</Text>
          </Pressable>

          {errors && (
            <Text style={styles.debug}>{JSON.stringify(errors, null, 2)}</Text>
          )}

          <View style={styles.linkContainer}>
            <Text style={styles.linkText}>Already have an account? </Text>
            <Link href="/(auth)/sign-in">
              <Text style={styles.linkAccent}>Sign in</Text>
            </Link>
          </View>

          <View nativeID="clerk-captcha" />
        </View>
      </View>
    </ImageBackground>
  );
}
