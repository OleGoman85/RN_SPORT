import { useAuth, useSignUp } from '@clerk/expo'
import { type Href, Link, useRouter } from 'expo-router'
import React from 'react'
import { Pressable, StyleSheet, TextInput, View, Text } from 'react-native'

export default function Page() {
  const { signUp, errors, fetchStatus } = useSignUp()
  const { isSignedIn } = useAuth()
  const router = useRouter()

  const [emailAddress, setEmailAddress] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [code, setCode] = React.useState('')

  const handleSubmit = async () => {
    const { error } = await signUp.password({
      emailAddress,
      password,
    })
    if (error) {
      console.error(JSON.stringify(error, null, 2))
      return
    }

    if (!error) await signUp.verifications.sendEmailCode()
  }

  const handleVerify = async () => {
    await signUp.verifications.verifyEmailCode({
      code,
    })
    if (signUp.status === 'complete') {
      await signUp.finalize({
        // Redirect the user to the home page after signing up
        navigate: ({ session, decorateUrl }) => {
          if (session?.currentTask) {
            // Handle pending session tasks
            // See https://clerk.com/docs/guides/development/custom-flows/authentication/session-tasks
            console.log(session?.currentTask)
            return
          }

          const url = decorateUrl('/')
          if (url.startsWith('http')) {
            window.location.href = url
          } else {
            router.push(url as Href)
          }
        },
      })
    } else {
      // Check why the sign-up is not complete
      console.error('Sign-up attempt not complete:', signUp)
    }
  }

  if (signUp.status === 'complete' || isSignedIn) {
    return null
  }

  if (
    signUp.status === 'missing_requirements' &&
    signUp.unverifiedFields.includes('email_address') &&
    signUp.missingFields.length === 0
  ) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>
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
            fetchStatus === 'fetching' && styles.buttonDisabled,
            pressed && styles.buttonPressed,
          ]}
          onPress={handleVerify}
          disabled={fetchStatus === 'fetching'}
        >
          <Text style={styles.buttonText}>Verify</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [styles.secondaryButton, pressed && styles.buttonPressed]}
          onPress={() => signUp.verifications.sendEmailCode()}
        >
          <Text style={styles.secondaryButtonText}>I need a new code</Text>
        </Pressable>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Sign up
      </Text>

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
      {errors.fields.emailAddress && (
        <Text style={styles.error}>{errors.fields.emailAddress.message}</Text>
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
          (!emailAddress || !password || fetchStatus === 'fetching') && styles.buttonDisabled,
          pressed && styles.buttonPressed,
        ]}
        onPress={handleSubmit}
        disabled={!emailAddress || !password || fetchStatus === 'fetching'}
      >
        <Text style={styles.buttonText}>Sign up</Text>
      </Pressable>
      {/* For your debugging purposes. You can just console.log errors, but we put them in the UI for convenience */}
      {errors && <Text style={styles.debug}>{JSON.stringify(errors, null, 2)}</Text>}

<View style={styles.linkContainer}>
  <Text style={styles.linkText}>Already have an account? </Text>
  <Link href="/(auth)/sign-in">
    <Text style={styles.linkAccent}>Sign in</Text>
  </Link>
</View>

      {/* Required for sign-up flows. Clerk's bot sign-up protection is enabled by default */}
      <View nativeID="clerk-captcha" />
    </View>
  )
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
