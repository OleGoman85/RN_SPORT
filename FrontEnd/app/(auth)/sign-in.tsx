import { useSignIn } from "@clerk/expo";
import { type Href, Link, useRouter } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, TextInput, View, Text } from "react-native";

export default function Page() {
  const { signIn, errors, fetchStatus } = useSignIn();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [code, setCode] = React.useState("");

  const handleSubmit = async () => {
    const { error } = await signIn.password({
      emailAddress,
      password,
    });
    if (error) {
      console.error(JSON.stringify(error, null, 2));
      return;
    }

    if (signIn.status === "complete") {
      await signIn.finalize({
        navigate: ({ session, decorateUrl }) => {
          if (session?.currentTask) {
            // Handle pending session tasks
            // See https://clerk.com/docs/guides/development/custom-flows/authentication/session-tasks
            console.log(session?.currentTask);
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
    } else if (signIn.status === "needs_second_factor") {
      // See https://clerk.com/docs/guides/development/custom-flows/authentication/multi-factor-authentication
    } else if (signIn.status === "needs_client_trust") {
      // For other second factor strategies,
      // see https://clerk.com/docs/guides/development/custom-flows/authentication/client-trust
      const emailCodeFactor = signIn.supportedSecondFactors.find(
        (factor) => factor.strategy === "email_code",
      );

      if (emailCodeFactor) {
        await signIn.mfa.sendEmailCode();
      }
    } else {
      // Check why the sign-in is not complete
      console.error("Sign-in attempt not complete:", signIn);
    }
  };

  const handleVerify = async () => {
    await signIn.mfa.verifyEmailCode({ code });

    if (signIn.status === "complete") {
      await signIn.finalize({
        navigate: ({ session, decorateUrl }) => {
          if (session?.currentTask) {
            // Handle pending session tasks
            // See https://clerk.com/docs/guides/development/custom-flows/authentication/session-tasks
            console.log(session?.currentTask);
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
      // Check why the sign-in is not complete
      console.error("Sign-in attempt not complete:", signIn);
    }
  };

  if (signIn.status === "needs_client_trust") {
    return (
      <View style={styles.container}>
        <Text style={[styles.title, { fontSize: 24, fontWeight: "bold" }]}>
          Verify your account
        </Text>
        <TextInput
          style={styles.input}
          value={code}
          placeholder="Enter your verification code"
          placeholderTextColor="#666666"
          onChangeText={(code) => setCode(code)}
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
          onPress={() => signIn.mfa.sendEmailCode()}
        >
          <Text style={styles.secondaryButtonText}>I need a new code</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [
            styles.secondaryButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={() => signIn.reset()}
        >
          <Text style={styles.secondaryButtonText}>Start over</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back</Text>

      <Text style={styles.label}>Email address</Text>
      <TextInput
        style={styles.input}
        autoCapitalize="none"
        value={emailAddress}
        placeholder="Enter email"
        placeholderTextColor="#666666"
        onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
        keyboardType="email-address"
      />
      {errors.fields.identifier && (
        <Text style={styles.error}>{errors.fields.identifier.message}</Text>
      )}
      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        value={password}
        placeholder="Enter password"
        placeholderTextColor="#666666"
        secureTextEntry={true}
        onChangeText={(password) => setPassword(password)}
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
        <Text style={styles.buttonText}>Continue</Text>
      </Pressable>
      {/* For your debugging purposes. You can just console.log errors, but we put them in the UI for convenience */}
      {errors && (
        <Text style={styles.debug}>{JSON.stringify(errors, null, 2)}</Text>
      )}

<View style={styles.linkContainer}>
  <Text style={styles.linkText}>Do not have an account? </Text>
  <Link href="/(auth)/sign-up">
    <Text style={styles.linkAccent}>Sign up</Text>
  </Link>
</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
    paddingHorizontal: 24,
    justifyContent: "center",
    gap: 12,
  },

  title: {
    color: "#ffffff",
    fontSize: 34,
    fontWeight: "800",
    marginBottom: 20,
	textAlign: 'center'
  },

  label: {
    color: "#cbd5e1",
    fontSize: 14,
    fontWeight: "600",
  },

  input: {
    backgroundColor: "#1e293b",
    borderWidth: 1,
    borderColor: "#334155",
    borderRadius: 16,
    paddingVertical: 15,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#ffffff",
  },

  button: {
    backgroundColor: "#ff7a00",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 12,
  },

  buttonPressed: {
    opacity: 0.75,
  },

  buttonDisabled: {
    opacity: 0.5,
  },

  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },

  secondaryButton: {
    paddingVertical: 14,
    alignItems: "center",
  },

  secondaryButtonText: {
    color: "#ffb86b",
    fontSize: 15,
    fontWeight: "600",
  },

  linkContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 4,
    marginTop: 16,
    alignItems: "center",
  },

  linkText: {
    color: "#cbd5e1",
  },

  linkAccent: {
    color: "#ff7a00",
    fontWeight: "700",
  },

  error: {
    color: "#fb7185",
    fontSize: 12,
    marginTop: -6,
  },

  debug: {
    color: "#94a3b8",
    fontSize: 10,
    opacity: 0.5,
    marginTop: 8,
  },
});
