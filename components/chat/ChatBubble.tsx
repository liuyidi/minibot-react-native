import { useCallback, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import {
  Bubble,
  type BubbleProps,
  type RenderMessageTextProps,
} from "react-native-gifted-chat";

import { ChatMessageText } from "@/components/chat/ChatMessageText";
import { ThemedText } from "@/components/ThemedText";
import type { AppChatMessage } from "@/types/chat";
import { useLanguage } from "@/context/LanguageContext";
import { useAppTheme } from "@/hooks/useAppTheme";

type ChatBubbleProps = BubbleProps<AppChatMessage> & {
  colorScheme: "light" | "dark";
  isStreaming?: boolean;
};

export function ChatBubble(props: ChatBubbleProps) {
  const theme = useAppTheme();
  const { t } = useLanguage();
  const { currentMessage, isStreaming = false } = props;
  const reasoningContent = currentMessage?.reasoningContent?.trim();
  const [isReasoningExpanded, setIsReasoningExpanded] = useState(false);
  const isAssistant = currentMessage?.user._id !== 1;
  const isPendingReply =
    isAssistant &&
    Boolean(currentMessage?.isPending) &&
    isStreaming;

  const renderMessageText = useCallback(
    (messageTextProps: RenderMessageTextProps<AppChatMessage>) => (
      <ChatMessageText {...messageTextProps} />
    ),
    []
  );

  return (
    <View style={styles.wrap}>
      {isAssistant && reasoningContent ? (
        <View
          style={[
            styles.reasoningCard,
            {
              backgroundColor: theme.card,
              borderColor: theme.border,
            },
          ]}
        >
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ expanded: isReasoningExpanded }}
            onPress={() => setIsReasoningExpanded((expanded) => !expanded)}
            style={styles.reasoningHeader}
          >
            <ThemedText type="defaultSemiBold" style={styles.reasoningTitle}>
              {t("chat.thinkingProcess")}
            </ThemedText>
            <ThemedText type="secondary" style={styles.reasoningToggle}>
              {isReasoningExpanded ? t("chat.collapse") : t("chat.expand")}
            </ThemedText>
          </Pressable>
          {isReasoningExpanded ? (
            <ThemedText type="secondary" style={styles.reasoningText}>
              {reasoningContent}
            </ThemedText>
          ) : null}
        </View>
      ) : null}
      <Bubble
        {...props}
        renderMessageText={renderMessageText}
        currentMessage={
          isPendingReply
            ? { ...currentMessage!, text: t("chat.replying") }
            : currentMessage
        }
        containerStyle={{
          left: styles.bubbleContainerLeft,
          right: styles.bubbleContainerRight,
        }}
        wrapperStyle={{
          right: {
            backgroundColor: theme.userBubble,
            borderRadius: 18,
            paddingHorizontal: 2,
            marginLeft: 56,
          },
          left: {
            backgroundColor: theme.assistantBubble,
            borderRadius: 18,
            // GiftedChat default is marginRight: 60; match Message left inset (8).
            marginRight: 8,
            paddingLeft: 0,
          },
        }}
        textStyle={{
          right: { color: theme.userBubbleText },
          left: { color: theme.text },
        }}
        // GiftedChat typings omit timeTextStyle; still supported at runtime.
        {...({
          timeTextStyle: {
            left: {
              color: theme.textSecondary,
              fontSize: 11,
            },
            right: {
              color: theme.textSecondary,
              fontSize: 11,
              fontWeight: "500",
            },
          },
        } as object)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: 6,
    flex: 1,
  },
  bubbleContainerLeft: {
    marginLeft: 0,
    marginRight: 0,
  },
  bubbleContainerRight: {
    marginLeft: 0,
  },
  reasoningCard: {
    marginLeft: 0,
    marginRight: 8,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  reasoningHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  reasoningTitle: {
    fontSize: 13,
  },
  reasoningToggle: {
    fontSize: 13,
  },
  reasoningText: {
    fontSize: 13,
    lineHeight: 20,
  },
});
