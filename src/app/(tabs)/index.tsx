import { useChatSessions } from "@/hooks/useChatSessions";
import { useMinibotSessions } from "@/hooks/useMinibotSessions";
import {
  loadSessionMessages,
  saveSessionMessages,
} from "@/lib/chat/session/storage";
import {
  titleFromUserText,
  toAppMessages,
  toStoredMessages,
  displayChatTitle,
  isDefaultChatTitle,
} from "@/lib/chat/session/types";
import { BOT_USER } from "@/lib/minibot/threadMessages";
import { startWsTurn } from "@/lib/minibot/wsTurn";
import { ChevronDown } from "lucide-react-native";
import React, { useState, useCallback, useEffect, useRef } from "react";
import {
  ActivityIndicator,
  Platform,
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
import { ApprovalCard } from "@/components/chat/ApprovalCard";
import { ChatBubble } from "@/components/chat/ChatBubble";
import {
  ChatHeader,
  ChatSessionDrawer,
} from "@/components/chat/ChatSessionDrawer";
import {
  FloatingChatComposer,
  useChatComposerLayout,
} from "@/components/chat/FloatingChatComposer";
import { useLanguage } from "@/context/LanguageContext";
import { useMinibot } from "@/context/MinibotClientContext";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useColorScheme } from "@/hooks/useColorScheme";
import type { PendingApproval } from "@/lib/minibot/wsTurn";
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
  const [pendingApproval, setPendingApproval] = useState<PendingApproval | null>(
    null
  );
  const streamingMessageIdRef = useRef<string | null>(null);
  const activeSessionIdRef = useRef<string | null>(null);
  const persistTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const turnControlRef = useRef<{ abort: () => void; dispose: () => void } | null>(
    null
  );
  const insets = useSafeAreaInsets();
  const theme = useAppTheme();
  const colorScheme = useColorScheme() ?? "light";
  const {
    client,
    status: minibotStatus,
    isConnected,
  } = useMinibot();
  const useMinibotPath = isConnected && Boolean(client);
  const canChat = useMinibotPath;
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
        onToolProgress: (lines) => {
          updateStreamingMessage(botMessageId, {
            toolLines: lines,
            isPending: false,
          });
        },
        onApprovalRequired: (approval) => {
          setPendingApproval(approval);
        },
        onComplete: () => {
          turnControlRef.current = null;
          streamingMessageIdRef.current = null;
          setPendingApproval(null);
          setIsStreaming(false);
          setMessages((prev) => {
            const current = prev.find((m) => String(m._id) === String(botMessageId));
            if (
              current &&
              !current.text?.trim() &&
              !current.reasoningContent?.trim() &&
              !(current.toolLines?.length)
            ) {
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
          setPendingApproval(null);
          setIsStreaming(false);
          appendSystemError(botMessageId, detail);
        },
      });
      turnControlRef.current = control;
    },
    [client, updateStreamingMessage, remoteSessions.touchSession, appendSystemError, t]
  );

  const onSend = useCallback(
    (newMessages: AppChatMessage[] = []) => {
      if (!canChat || isStreaming) {
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
      })();
    },
    [
      canChat,
      isStreaming,
      activeSession?.title,
      remoteSessions.createSession,
      remoteSessions.touchSession,
      startMinibotReply,
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
    setPendingApproval(null);
  }, []);

  const respondToApproval = useCallback(
    (decision: "approve" | "reject") => {
      if (!client || !pendingApproval) {
        return;
      }
      try {
        client.ws.send({
          type: "approval_response",
          approval_id: pendingApproval.id,
          decision,
        });
      } catch (error) {
        appendSystemError(
          `approval_${Date.now()}`,
          error instanceof Error ? error.message : "approval failed"
        );
      }
      setPendingApproval(null);
    },
    [client, pendingApproval, appendSystemError]
  );

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
    const session = await localSessions.createSession();
    setMessages(withWelcome([], welcomeText));
    activeSessionIdRef.current = session.id;
    setMessagesReady(true);
  }, [
    isStreaming,
    useMinibotPath,
    remoteSessions.createSession,
    localSessions.createSession,
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
        currentMessage.toolLines !== nextMessage.toolLines ||
        currentMessage.isPending !== nextMessage.isPending
      );
    },
    []
  );

  if (!sessionsReady || !messagesReady) {
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
            connectionLabel={headerStatus.label}
            connectionTone={headerStatus.tone}
          />
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
          {pendingApproval ? (
            <ApprovalCard
              approval={pendingApproval}
              onApprove={() => respondToApproval("approve")}
              onReject={() => respondToApproval("reject")}
            />
          ) : null}
          <FloatingChatComposer
            text={composerText}
            onChangeText={setComposerText}
            onSend={handleComposerSend}
            theme={theme}
            colorScheme={colorScheme}
            isStreaming={isStreaming}
            onAbort={handleAbort}
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
