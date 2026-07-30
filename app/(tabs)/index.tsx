import { useDeepSeekApiKey } from "@/hooks/useDeepSeekApiKey";
import { useChatSessions } from "@/hooks/useChatSessions";
import { useMinibotSessions } from "@/hooks/useMinibotSessions";
import { addTokenUsage } from "@/lib/tokenUsageConfig";
import {
  buildChatApiMessages,
  formatChatErrorMessage,
  streamDeepSeekChat,
} from "@/lib/deepseekChat";
import {
  loadSessionMessages,
  saveSessionMessages,
} from "@/lib/chatSession/storage";
import {
  titleFromUserText,
  toAppMessages,
  toStoredMessages,
  displayChatTitle,
  isDefaultChatTitle,
} from "@/lib/chatSession/types";
import { BOT_USER } from "@/lib/minibot/threadMessages";
import { startWsTurn } from "@/lib/minibot/wsTurn";
import { ChevronDown, Key, Server } from "lucide-react-native";
import { router } from "expo-router";
import React, { useState, useCallback, useEffect, useRef } from "react";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import {
  SystemMessage,
  GiftedChat,
  type IMessage,
} from "react-native-gifted-chat";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";

import { AppIcon } from "@/components/ui/AppIcon";
import { ChatBubble } from "@/components/chat/ChatBubble";
import { ChatPreferencesBar } from "@/components/chat/ChatPreferencesBar";
import {
  ChatHeader,
  ChatSessionDrawer,
} from "@/components/chat/ChatSessionDrawer";
import {
  FloatingChatComposer,
  useChatComposerLayout,
} from "@/components/chat/FloatingChatComposer";
import { ThemedText } from "@/components/ThemedText";
import { useChatPreferences } from "@/context/ChatPreferencesContext";
import { useLanguage } from "@/context/LanguageContext";
import { useMinibot } from "@/context/MinibotClientContext";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useColorScheme } from "@/hooks/useColorScheme";
import type { AppChatMessage } from "@/types/chat";

function makeWelcome(text: string): AppChatMessage {
  return {
    _id: 0,
    system: true,
    text,
    createdAt: new Date(),
    user: {
      _id: 0,
      name: "Minibot",
    },
  };
}

function withWelcome(
  messages: AppChatMessage[],
  welcomeText: string
): AppChatMessage[] {
  if (messages.some((message) => message.system)) {
    return messages;
  }
  return [...messages, makeWelcome(welcomeText)];
}

export default function ChatScreen() {
  const { t } = useLanguage();
  const welcomeText = t("chat.welcome");
  const newChatTitle = t("chat.newChat");
  const [messages, setMessages] = useState<AppChatMessage[]>(() => [
    makeWelcome(welcomeText),
  ]);
  const [composerText, setComposerText] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [messagesReady, setMessagesReady] = useState(false);
  const streamingMessageIdRef = useRef<string | null>(null);
  const activeSessionIdRef = useRef<string | null>(null);
  const persistTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const turnControlRef = useRef<{ abort: () => void; dispose: () => void } | null>(
    null
  );
  const insets = useSafeAreaInsets();
  const theme = useAppTheme();
  const colorScheme = useColorScheme() ?? "light";
  const { apiKey, hasApiKey, isLoading } = useDeepSeekApiKey();
  const { model, thinkingEnabled } = useChatPreferences();
  const {
    client,
    status: minibotStatus,
    isConnected,
    modelName,
  } = useMinibot();
  const useMinibotPath = isConnected && Boolean(client);
  const canChat = useMinibotPath || hasApiKey;
  const tabBarHeight = useBottomTabBarHeight();
  const { listBottomPadding, scrollToBottomBottom } = useChatComposerLayout(tabBarHeight);

  const localSessions = useChatSessions();
  const remoteSessions = useMinibotSessions({
    client,
    isConnected,
    enabled: useMinibotPath,
  });

  const sessions = useMinibotPath ? remoteSessions.sessions : localSessions.sessions;
  const activeSession = useMinibotPath
    ? remoteSessions.activeSession
    : localSessions.activeSession;
  const activeSessionId = useMinibotPath
    ? remoteSessions.activeSessionId
    : localSessions.activeSessionId;
  const sessionsReady = useMinibotPath
    ? remoteSessions.isReady
    : localSessions.isReady;

  const persistMessages = useCallback(
    async (sessionId: string, nextMessages: AppChatMessage[]) => {
      if (useMinibotPath) return;
      await saveSessionMessages(sessionId, toStoredMessages(nextMessages));
    },
    [useMinibotPath]
  );

  const schedulePersist = useCallback(
    (sessionId: string, nextMessages: AppChatMessage[]) => {
      if (useMinibotPath) return;
      if (persistTimerRef.current) {
        clearTimeout(persistTimerRef.current);
      }
      persistTimerRef.current = setTimeout(() => {
        void persistMessages(sessionId, nextMessages);
      }, 400);
    },
    [persistMessages, useMinibotPath]
  );

  const loadMessagesForSession = useCallback(
    async (sessionId: string) => {
      setMessagesReady(false);
      try {
        if (useMinibotPath) {
          const thread = await remoteSessions.loadThread(sessionId);
          setMessages(withWelcome(thread, welcomeText));
        } else {
          const stored = await loadSessionMessages(sessionId);
          setMessages(withWelcome(toAppMessages(stored, BOT_USER), welcomeText));
        }
        activeSessionIdRef.current = sessionId;
      } catch (error) {
        setMessages(
          withWelcome(
            [
              {
                _id: `err_${Date.now()}`,
                system: true,
                text:
                  error instanceof Error
                    ? `${t("chat.loadSessionFailed")}：${error.message}`
                    : t("chat.loadSessionFailed"),
                createdAt: new Date(),
                user: { _id: 0, name: "System" },
              },
            ],
            welcomeText
          )
        );
        activeSessionIdRef.current = sessionId;
      } finally {
        setMessagesReady(true);
      }
    },
    [useMinibotPath, remoteSessions.loadThread, welcomeText, t]
  );

  // Reset active ref when switching transport so we reload.
  useEffect(() => {
    activeSessionIdRef.current = null;
    setMessagesReady(false);
  }, [useMinibotPath]);

  useEffect(() => {
    if (!sessionsReady) {
      return;
    }
    if (!activeSessionId) {
      // Connected but empty remote list — blank welcome until user creates.
      setMessages(withWelcome([], welcomeText));
      activeSessionIdRef.current = null;
      setMessagesReady(true);
      return;
    }
    if (activeSessionIdRef.current === activeSessionId) {
      setMessagesReady(true);
      return;
    }
    void loadMessagesForSession(activeSessionId);
  }, [sessionsReady, activeSessionId, loadMessagesForSession, welcomeText]);

  // Keep welcome system message in sync when language changes.
  useEffect(() => {
    setMessages((prev) =>
      prev.map((message) =>
        message._id === 0 && message.system
          ? { ...message, text: welcomeText }
          : message
      )
    );
  }, [welcomeText]);

  useEffect(() => {
    return () => {
      if (persistTimerRef.current) {
        clearTimeout(persistTimerRef.current);
      }
      turnControlRef.current?.dispose();
      turnControlRef.current = null;
    };
  }, []);

  const renderScrollToBottom = useCallback(
    () => <AppIcon icon={ChevronDown} size={22} color={theme.text} />,
    [theme.text]
  );

  const updateStreamingMessage = useCallback(
    (messageId: string, patch: Partial<AppChatMessage>) => {
      setMessages((prevMessages) => {
        const next = prevMessages.map((message) =>
          String(message._id) === String(messageId)
            ? { ...message, ...patch }
            : message
        );
        const sessionId = activeSessionIdRef.current;
        if (sessionId) {
          schedulePersist(sessionId, next);
        }
        return next;
      });
    },
    [schedulePersist]
  );

  const appendSystemError = useCallback(
    (botMessageId: string, text: string) => {
      setMessages((prevMessages) => {
        const withoutPending = prevMessages.filter(
          (message) => String(message._id) !== String(botMessageId)
        );
        const errorMessage: AppChatMessage = {
          _id: Math.random().toString(36).substring(7),
          system: true,
          text,
          createdAt: new Date(),
          user: { _id: 0, name: "System" },
        };
        const next = GiftedChat.append(withoutPending, [errorMessage]);
        const sessionId = activeSessionIdRef.current;
        if (sessionId) {
          void persistMessages(sessionId, next);
        }
        return next;
      });
    },
    [persistMessages]
  );

  const startMinibotReply = useCallback(
    (chatId: string, botMessageId: string, userText: string) => {
      if (!client) return;

      turnControlRef.current?.dispose();
      streamingMessageIdRef.current = botMessageId;
      setIsStreaming(true);

      const control = startWsTurn(client.ws, chatId, userText, {
        onDelta: (content, reasoningContent) => {
          updateStreamingMessage(botMessageId, {
            text: content,
            reasoningContent: reasoningContent || undefined,
            isPending: false,
          });
        },
        onComplete: () => {
          turnControlRef.current = null;
          streamingMessageIdRef.current = null;
          setIsStreaming(false);
          setMessages((prev) => {
            const current = prev.find((m) => String(m._id) === String(botMessageId));
            if (current && !current.text?.trim() && !current.reasoningContent?.trim()) {
              return prev.map((m) =>
                String(m._id) === String(botMessageId)
                  ? { ...m, text: t("chat.emptyReply"), isPending: false }
                  : m
              );
            }
            return prev;
          });
          remoteSessions.touchSession(chatId);
        },
        onError: (detail) => {
          turnControlRef.current = null;
          streamingMessageIdRef.current = null;
          setIsStreaming(false);
          appendSystemError(botMessageId, detail);
        },
      });
      turnControlRef.current = control;
    },
    [client, updateStreamingMessage, remoteSessions.touchSession, appendSystemError, t]
  );

  const startDeepSeekReply = useCallback(
    async (
      botMessageId: string,
      apiMessages: ReturnType<typeof buildChatApiMessages>
    ) => {
      if (!apiKey) {
        return;
      }

      streamingMessageIdRef.current = botMessageId;
      setIsStreaming(true);

      let content = "";
      let reasoningContent = "";

      await streamDeepSeekChat({
        apiKey,
        model,
        messages: apiMessages,
        thinkingEnabled,
        onDelta: (delta) => {
          if (delta.content) {
            content += delta.content;
          }
          if (delta.reasoningContent) {
            reasoningContent += delta.reasoningContent;
          }
          updateStreamingMessage(botMessageId, {
            text: content,
            reasoningContent: reasoningContent || undefined,
            isPending: false,
          });
        },
        onComplete: (usage) => {
          streamingMessageIdRef.current = null;
          setIsStreaming(false);

          if (!content.trim() && !reasoningContent.trim()) {
            updateStreamingMessage(botMessageId, {
              text: t("chat.emptyReply"),
              isPending: false,
            });
          }

          const sessionId = activeSessionIdRef.current;
          if (sessionId) {
            setMessages((prev) => {
              void persistMessages(sessionId, prev);
              return prev;
            });
            void localSessions.touchSession(sessionId, { model });
          }

          if (usage) {
            void addTokenUsage(usage);
          }
        },
        onError: (error) => {
          streamingMessageIdRef.current = null;
          setIsStreaming(false);
          appendSystemError(botMessageId, formatChatErrorMessage(error));
        },
      });
    },
    [
      apiKey,
      model,
      thinkingEnabled,
      updateStreamingMessage,
      persistMessages,
      localSessions.touchSession,
      appendSystemError,
      t,
    ]
  );

  const onSend = useCallback(
    (newMessages: AppChatMessage[] = []) => {
      if (!canChat) {
        if (!useMinibotPath) {
          router.push("/(tabs)/settings/api-key");
        } else {
          router.push("/(tabs)/settings/server");
        }
        return;
      }
      if (isStreaming) {
        return;
      }

      const firstUserText = newMessages[0]?.text?.trim();
      if (!firstUserText) {
        return;
      }

      const botMessageId = Math.random().toString(36).substring(7);
      const placeholder: AppChatMessage = {
        _id: botMessageId,
        text: "",
        isPending: true,
        createdAt: new Date(),
        user: BOT_USER,
      };

      void (async () => {
        let sessionId = activeSessionIdRef.current;

        if (useMinibotPath) {
          try {
            if (!sessionId) {
              const created = await remoteSessions.createSession();
              sessionId = created.id;
              activeSessionIdRef.current = sessionId;
            }
          } catch (error) {
            appendSystemError(
              botMessageId,
              error instanceof Error
                ? error.message
                : t("chat.createSessionFailed")
            );
            return;
          }

          if (isDefaultChatTitle(activeSession?.title)) {
            remoteSessions.touchSession(sessionId, {
              title: titleFromUserText(firstUserText, newChatTitle),
            });
          }

          setMessages((prevMessages) => {
            const withUser = GiftedChat.append(prevMessages, newMessages);
            const next = GiftedChat.append(withUser, [placeholder]);
            return next;
          });
          startMinibotReply(sessionId, botMessageId, firstUserText);
          return;
        }

        if (!sessionId) {
          return;
        }

        if (isDefaultChatTitle(activeSession?.title)) {
          void localSessions.touchSession(sessionId, {
            title: titleFromUserText(firstUserText, newChatTitle),
            model,
          });
        }

        setMessages((prevMessages) => {
          const withUser = GiftedChat.append(prevMessages, newMessages);
          const apiMessages = buildChatApiMessages(withUser);
          void startDeepSeekReply(botMessageId, apiMessages);
          const next = GiftedChat.append(withUser, [placeholder]);
          void persistMessages(sessionId!, next);
          return next;
        });
      })();
    },
    [
      canChat,
      useMinibotPath,
      isStreaming,
      activeSession?.title,
      model,
      remoteSessions.createSession,
      remoteSessions.touchSession,
      localSessions.touchSession,
      startMinibotReply,
      startDeepSeekReply,
      persistMessages,
      appendSystemError,
      newChatTitle,
      t,
    ]
  );

  const handleComposerSend = useCallback(() => {
    const trimmed = composerText.trim();
    if (!trimmed || isStreaming) {
      return;
    }
    onSend([
      {
        _id: Math.random().toString(36).substring(7),
        text: trimmed,
        createdAt: new Date(),
        user: { _id: 1 },
      },
    ]);
    setComposerText("");
  }, [composerText, isStreaming, onSend]);

  const handleAbort = useCallback(() => {
    turnControlRef.current?.abort();
  }, []);

  const handleSelectSession = useCallback(
    async (sessionId: string) => {
      if (isStreaming) {
        return;
      }
      setDrawerOpen(false);
      if (sessionId === activeSessionIdRef.current) {
        return;
      }
      setMessagesReady(false);
      if (useMinibotPath) {
        await remoteSessions.selectSession(sessionId);
      } else {
        await localSessions.selectSession(sessionId);
      }
    },
    [isStreaming, useMinibotPath, remoteSessions.selectSession, localSessions.selectSession]
  );

  const handleNewSession = useCallback(async () => {
    if (isStreaming) {
      return;
    }
    setDrawerOpen(false);
    setComposerText("");
    if (useMinibotPath) {
      try {
        const session = await remoteSessions.createSession();
        setMessages(withWelcome([], welcomeText));
        activeSessionIdRef.current = session.id;
        setMessagesReady(true);
      } catch (error) {
        appendSystemError(
          `new_${Date.now()}`,
          error instanceof Error ? error.message : t("chat.createSessionFailed")
        );
      }
      return;
    }
    const session = await localSessions.createSession(model);
    setMessages(withWelcome([], welcomeText));
    activeSessionIdRef.current = session.id;
    setMessagesReady(true);
  }, [
    isStreaming,
    useMinibotPath,
    remoteSessions.createSession,
    localSessions.createSession,
    model,
    appendSystemError,
    welcomeText,
    t,
  ]);

  const renderBubble = useCallback(
    (props: React.ComponentProps<typeof ChatBubble>) => (
      <ChatBubble {...props} colorScheme={colorScheme} isStreaming={isStreaming} />
    ),
    [colorScheme, isStreaming]
  );

  const shouldUpdateMessage = useCallback(
    (
      current: { currentMessage: IMessage },
      next: { currentMessage: IMessage }
    ) => {
      const currentMessage = current.currentMessage as AppChatMessage;
      const nextMessage = next.currentMessage as AppChatMessage;
      return (
        currentMessage.text !== nextMessage.text ||
        currentMessage.reasoningContent !== nextMessage.reasoningContent ||
        currentMessage.isPending !== nextMessage.isPending
      );
    },
    []
  );

  if (isLoading || !sessionsReady || !messagesReady) {
    return (
      <View
        style={[
          styles.centered,
          { paddingTop: insets.top, backgroundColor: theme.background },
        ]}
      >
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  if (!canChat) {
    return (
      <View
        style={[
          styles.centered,
          {
            paddingTop: insets.top,
            paddingBottom: insets.bottom + 100,
            backgroundColor: theme.background,
          },
        ]}
      >
        <View
          style={[
            styles.emptyCard,
            { backgroundColor: theme.card, borderColor: theme.border },
          ]}
        >
          <AppIcon icon={Server} size={40} color={theme.primary} />
          <ThemedText type="defaultSemiBold" style={styles.emptyTitle}>
            {t("chat.noServerTitle")}
          </ThemedText>
          <ThemedText type="secondary" style={styles.emptyText}>
            {t("chat.noServerBody")}
          </ThemedText>
          <Pressable
            accessibilityRole="button"
            onPress={() => router.push("/(tabs)/settings/server")}
            style={({ pressed }) => [
              styles.settingsButton,
              { backgroundColor: theme.primary },
              pressed && styles.buttonPressed,
            ]}
          >
            <ThemedText style={[styles.settingsButtonText, { color: theme.onPrimary }]}>
              {t("chat.connectServer")}
            </ThemedText>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            onPress={() => router.push("/(tabs)/settings/api-key")}
            style={({ pressed }) => [styles.secondaryLink, pressed && styles.buttonPressed]}
          >
            <AppIcon icon={Key} size={16} color={theme.primary} />
            <ThemedText style={[styles.secondaryLinkText, { color: theme.primary }]}>
              {t("chat.configureApiKey")}
            </ThemedText>
          </Pressable>
        </View>
      </View>
    );
  }

  const headerStatus = (() => {
    switch (minibotStatus) {
      case "open":
        return { label: t("chat.minibotConnected"), tone: "ok" as const };
      case "connecting":
        return { label: t("chat.minibotConnecting"), tone: "warn" as const };
      case "reconnecting":
        return { label: t("chat.minibotReconnecting"), tone: "warn" as const };
      case "error":
        return { label: t("chat.minibotFailed"), tone: "off" as const };
      default:
        return { label: t("chat.minibotOffline"), tone: "off" as const };
    }
  })();
  const connectionLabel = useMinibotPath
    ? modelName
      ? `minibot · ${modelName}`
      : headerStatus.label
    : hasApiKey
      ? t("chat.deepseekDirect")
      : headerStatus.label;

  return (
    <ChatSessionDrawer
      open={drawerOpen}
      sessions={sessions}
      activeSessionId={activeSessionId}
      onOpenChange={setDrawerOpen}
      onSelectSession={(sessionId) => void handleSelectSession(sessionId)}
      onNewSession={() => void handleNewSession()}
    >
      <View
        style={[
          styles.chatScreen,
          {
            backgroundColor: theme.background,
            paddingTop: insets.top,
          },
        ]}
      >
        <View style={styles.chatContainer}>
          <ChatHeader
            title={displayChatTitle(activeSession?.title, newChatTitle)}
            onOpenDrawer={() => setDrawerOpen(true)}
            onNewSession={() => void handleNewSession()}
            connectionLabel={connectionLabel}
            connectionTone={
              useMinibotPath ? "ok" : hasApiKey ? "warn" : headerStatus.tone
            }
            onPressConnection={() => router.push("/(tabs)/settings/server")}
          />
          {!useMinibotPath ? <ChatPreferencesBar /> : null}
          <GiftedChat
            messages={messages}
            onSend={onSend}
            user={{ _id: 1 }}
            isTyping={isStreaming}
            isKeyboardInternallyHandled={false}
            renderAvatar={null}
            showAvatarForEveryMessage={false}
            scrollToBottom
            scrollToBottomStyle={[
              styles.scrollToBottomButton,
              {
                bottom: scrollToBottomBottom,
                backgroundColor: theme.card,
                borderColor: theme.border,
              },
              colorScheme === "dark"
                ? styles.scrollToBottomShadowDark
                : styles.scrollToBottomShadowLight,
            ]}
            scrollToBottomComponent={renderScrollToBottom}
            renderInputToolbar={() => null}
            shouldUpdateMessage={shouldUpdateMessage}
            listViewProps={{
              contentContainerStyle: listBottomPadding,
              keyboardShouldPersistTaps: "never",
              keyboardDismissMode:
                Platform.OS === "ios" ? "interactive" : "on-drag",
              extraData: messages,
            }}
            renderSystemMessage={(props) => (
              <SystemMessage
                {...props}
                textStyle={{ color: theme.textSecondary }}
              />
            )}
            renderBubble={renderBubble}
          />
          <FloatingChatComposer
            text={composerText}
            onChangeText={setComposerText}
            onSend={handleComposerSend}
            theme={theme}
            colorScheme={colorScheme}
            isStreaming={isStreaming}
            onAbort={useMinibotPath ? handleAbort : undefined}
          />
        </View>
      </View>
    </ChatSessionDrawer>
  );
}

const styles = StyleSheet.create({
  chatScreen: {
    flex: 1,
  },
  chatContainer: {
    flex: 1,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  emptyCard: {
    width: "100%",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
  },
  emptyTitle: {
    fontSize: 20,
  },
  emptyText: {
    textAlign: "center",
  },
  settingsButton: {
    marginTop: 8,
    borderRadius: 14,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  settingsButtonText: {
    fontWeight: "700",
    fontSize: 16,
  },
  secondaryLink: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 4,
    paddingVertical: 8,
  },
  secondaryLinkText: {
    fontWeight: "600",
  },
  buttonPressed: {
    opacity: 0.88,
  },
  scrollToBottomButton: {
    opacity: 1,
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 999,
  },
  scrollToBottomShadowLight: Platform.select({
    ios: {
      shadowColor: "#000000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 8,
    },
    android: { elevation: 4 },
    default: {},
  }),
  scrollToBottomShadowDark: Platform.select({
    ios: {
      shadowColor: "#000000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.35,
      shadowRadius: 8,
    },
    android: { elevation: 6 },
    default: {},
  }),
});
