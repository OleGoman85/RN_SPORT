// Bottom chat input with send button.
import { Ionicons } from "@expo/vector-icons";
import { Pressable, TextInput, View } from "react-native";
import { colors } from "../../constants/colors";
import { styles } from "../../styles/chatRoom.styles";

type ChatComposerProps = {
  bottomInset: number;
  isSending: boolean;
  messageText: string;
  onChangeMessageText: (text: string) => void;
  onSend: () => void;
};

export function ChatComposer({
  bottomInset,
  isSending,
  messageText,
  onChangeMessageText,
  onSend,
}: ChatComposerProps) {
  const isDisabled = isSending || !messageText.trim();

  return (
    <View style={[styles.composerWrap, { paddingBottom: bottomInset + 10 }]}>
      <TextInput
        style={styles.input}
        value={messageText}
        onChangeText={onChangeMessageText}
        placeholder="Message..."
        placeholderTextColor={colors.secondaryText}
        multiline
      />

      <Pressable
        disabled={isDisabled}
        style={({ pressed }) => [
          styles.sendButton,
          isDisabled && styles.disabledButton,
          pressed && styles.buttonPressed,
        ]}
        onPress={onSend}
      >
        <Ionicons name="send" size={20} color={colors.background} />
      </Pressable>
    </View>
  );
}
