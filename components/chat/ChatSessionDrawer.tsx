import { Menu, MessageSquarePlus, X } from "lucide-react-native";
import { useCallback, useEffect } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppIcon } from "@/components/ui/AppIcon";
import { ThemedText } from "@/components/ThemedText";
import { useLanguage } from "@/context/LanguageContext";
import { useAppTheme } from "@/hooks/useAppTheme";
import type { ChatSession } from "@/lib/chatSession/types";
import { displayChatTitle } from "@/lib/chatSession/types";

const SPRING = { damping: 26, stiffness: 260, mass: 0.9 };
/** Left-edge strip width to start an open swipe when drawer is closed. */
const EDGE_WIDTH = 28;
const OPEN_THRESHOLD = 0.32;
const OPEN_VELOCITY = 550;

function getDrawerWidth(screenWidth: number): number {
  return Math.min(Math.round(screenWidth * 0.78), 320);
}

function formatSessionTime(timestamp: number, locale: string): string {
  const date = new Date(timestamp);
  const now = new Date();
  const sameDay =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate();

  if (sameDay) {
    return date.toLocaleTimeString(locale, {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  const sameYear = date.getFullYear() === now.getFullYear();
  return date.toLocaleDateString(locale, {
    month: "numeric",
    day: "numeric",
    ...(sameYear ? {} : { year: "numeric" }),
  });
}

type SessionPanelProps = {
  width: number;
  sessions: ChatSession[];
  activeSessionId: string | null;
  onClose: () => void;
  onSelectSession: (sessionId: string) => void;
  onNewSession: () => void;
};

function SessionPanel({
  width,
  sessions,
  activeSessionId,
  onClose,
  onSelectSession,
  onNewSession,
}: SessionPanelProps) {
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();
  const { t, language } = useLanguage();
  const locale = language === "en" ? "en-US" : "zh-CN";
  const newChatTitle = t("chat.newChat");

  return (
    <View
      style={[
        styles.panel,
        {
          width,
          paddingTop: insets.top + 8,
          paddingBottom: insets.bottom + 16,
          backgroundColor: theme.background,
        },
      ]}
    >
      <View style={styles.panelHeader}>
        <ThemedText type="defaultSemiBold" style={styles.headerTitle}>
          {t("drawer.sessions")}
        </ThemedText>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t("drawer.close")}
          hitSlop={10}
          onPress={onClose}
          style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}
        >
          <AppIcon icon={X} size={20} color={theme.textSecondary} />
        </Pressable>
      </View>

      <Pressable
        accessibilityRole="button"
        onPress={onNewSession}
        style={({ pressed }) => [
          styles.newButton,
          {
            backgroundColor: theme.card,
            borderColor: theme.border,
          },
          pressed && styles.pressed,
        ]}
      >
        <AppIcon icon={MessageSquarePlus} size={18} color={theme.primary} />
        <ThemedText
          type="defaultSemiBold"
          style={[styles.newButtonText, { color: theme.primary }]}
        >
          {newChatTitle}
        </ThemedText>
      </Pressable>

      <ThemedText type="secondary" style={styles.sectionLabel}>
        {t("drawer.history")}
      </ThemedText>

      <ScrollView
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {sessions.length === 0 ? (
          <ThemedText type="secondary" style={styles.empty}>
            {t("drawer.empty")}
          </ThemedText>
        ) : (
          sessions.map((session) => {
            const isActive = session.id === activeSessionId;
            return (
              <Pressable
                key={session.id}
                accessibilityRole="button"
                accessibilityState={{ selected: isActive }}
                onPress={() => onSelectSession(session.id)}
                style={({ pressed }) => [
                  styles.row,
                  {
                    backgroundColor: isActive
                      ? theme.primary + "14"
                      : theme.card,
                    borderColor: isActive ? theme.primary + "40" : theme.border,
                  },
                  pressed && styles.pressed,
                ]}
              >
                <View style={styles.rowBody}>
                  <ThemedText
                    type="defaultSemiBold"
                    numberOfLines={1}
                    style={[
                      styles.rowTitle,
                      isActive ? { color: theme.primary } : undefined,
                    ]}
                  >
                    {displayChatTitle(session.title, newChatTitle)}
                  </ThemedText>
                  <ThemedText type="secondary" style={styles.rowTime}>
                    {formatSessionTime(session.updatedAt, locale)}
                  </ThemedText>
                </View>
              </Pressable>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

type ChatSessionDrawerProps = {
  open: boolean;
  sessions: ChatSession[];
  activeSessionId: string | null;
  onOpenChange: (open: boolean) => void;
  onSelectSession: (sessionId: string) => void;
  onNewSession: () => void;
  children: React.ReactNode;
};

/** Push-style drawer: edge swipe L→R opens; swipe R→L on dim (or tap) closes. */
export function ChatSessionDrawer({
  open,
  sessions,
  activeSessionId,
  onOpenChange,
  onSelectSession,
  onNewSession,
  children,
}: ChatSessionDrawerProps) {
  const theme = useAppTheme();
  const { t } = useLanguage();
  const { width: screenWidth } = useWindowDimensions();
  const drawerWidth = getDrawerWidth(screenWidth);
  const progress = useSharedValue(open ? 1 : 0);
  const dragStart = useSharedValue(0);
  const drawerWidthSV = useSharedValue(drawerWidth);

  useEffect(() => {
    drawerWidthSV.value = drawerWidth;
  }, [drawerWidth, drawerWidthSV]);

  useEffect(() => {
    progress.value = withSpring(open ? 1 : 0, SPRING);
  }, [open, progress]);

  const commitOpen = useCallback(
    (next: boolean) => {
      onOpenChange(next);
    },
    [onOpenChange]
  );

  const finishWithVelocity = useCallback(
    (velocityX: number) => {
      "worklet";
      const projected =
        progress.value +
        (velocityX > OPEN_VELOCITY ? 0.5 : velocityX < -OPEN_VELOCITY ? -0.5 : 0);
      const shouldOpen = projected > OPEN_THRESHOLD;
      const next = shouldOpen ? 1 : 0;
      progress.value = withSpring(next, SPRING);
      runOnJS(commitOpen)(next === 1);
    },
    [commitOpen, progress]
  );

  const edgeOpenGesture = Gesture.Pan()
    .activeOffsetX(12)
    .failOffsetY([-18, 18])
    .onBegin(() => {
      dragStart.value = progress.value;
    })
    .onUpdate((event) => {
      const next = dragStart.value + event.translationX / drawerWidthSV.value;
      progress.value = Math.min(1, Math.max(0, next));
    })
    .onEnd((event) => {
      finishWithVelocity(event.velocityX);
    });

  const closeGesture = Gesture.Pan()
    .activeOffsetX([-12, 12])
    .failOffsetY([-18, 18])
    .onBegin(() => {
      dragStart.value = progress.value;
    })
    .onUpdate((event) => {
      const next = dragStart.value + event.translationX / drawerWidthSV.value;
      progress.value = Math.min(1, Math.max(0, next));
    })
    .onEnd((event) => {
      finishWithVelocity(event.velocityX);
    });

  const chatStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      progress.value,
      [0, 1],
      [0, drawerWidthSV.value],
      Extrapolation.CLAMP
    );
    const radius = interpolate(progress.value, [0, 1], [0, 16], Extrapolation.CLAMP);
    return {
      transform: [{ translateX }],
      borderTopLeftRadius: radius,
      borderBottomLeftRadius: radius,
      shadowOpacity: interpolate(progress.value, [0, 1], [0, 0.22], Extrapolation.CLAMP),
      elevation: interpolate(progress.value, [0, 1], [0, 16], Extrapolation.CLAMP),
    };
  });

  const dimStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 1], [0, 0.28], Extrapolation.CLAMP),
  }));

  const dimOverlay = (
    <Animated.View
      pointerEvents={open ? "auto" : "none"}
      style={[styles.dimOverlay, dimStyle]}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t("drawer.closeList")}
        style={StyleSheet.absoluteFill}
        onPress={() => onOpenChange(false)}
      />
    </Animated.View>
  );

  return (
    <GestureHandlerRootView style={[styles.shell, { backgroundColor: theme.background }]}>
      <View style={styles.panelLayer} pointerEvents={open ? "auto" : "none"}>
        <SessionPanel
          width={drawerWidth}
          sessions={sessions}
          activeSessionId={activeSessionId}
          onClose={() => onOpenChange(false)}
          onSelectSession={onSelectSession}
          onNewSession={onNewSession}
        />
      </View>

      <Animated.View
        style={[
          styles.chatLayer,
          {
            backgroundColor: theme.card,
            shadowColor: "#000000",
            shadowOffset: { width: -8, height: 0 },
            shadowRadius: 18,
          },
          chatStyle,
        ]}
      >
        <View style={styles.chatClip}>{children}</View>
        {open ? (
          <GestureDetector gesture={closeGesture}>{dimOverlay}</GestureDetector>
        ) : (
          dimOverlay
        )}
      </Animated.View>

      {!open ? (
        <GestureDetector gesture={edgeOpenGesture}>
          <View
            style={styles.edgeHit}
            accessibilityLabel={t("drawer.edgeOpen")}
          />
        </GestureDetector>
      ) : null}
    </GestureHandlerRootView>
  );
}

type ChatHeaderProps = {
  title: string;
  onOpenDrawer: () => void;
  onNewSession: () => void;
  /** Minibot WS connection hint, e.g. "已连接" / "未连接" */
  connectionLabel?: string;
  connectionTone?: "ok" | "warn" | "off";
  onPressConnection?: () => void;
};

export function ChatHeader({
  title,
  onOpenDrawer,
  onNewSession,
  connectionLabel,
  connectionTone = "off",
  onPressConnection,
}: ChatHeaderProps) {
  const theme = useAppTheme();
  const { t } = useLanguage();
  const newChatTitle = t("chat.newChat");
  const dotColor =
    connectionTone === "ok"
      ? theme.green
      : connectionTone === "warn"
        ? theme.yellow
        : theme.textSecondary;

  return (
    <View style={[styles.chatHeader, { borderBottomColor: theme.border }]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t("drawer.openList")}
        hitSlop={10}
        onPress={onOpenDrawer}
        style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}
      >
        <AppIcon icon={Menu} size={22} color={theme.text} />
      </Pressable>
      <View style={styles.chatTitleBlock}>
        <ThemedText type="defaultSemiBold" numberOfLines={1} style={styles.chatTitle}>
          {displayChatTitle(title, newChatTitle)}
        </ThemedText>
        {connectionLabel ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t("drawer.serverStatus", { label: connectionLabel })}
            onPress={onPressConnection}
            hitSlop={6}
            style={({ pressed }) => [
              styles.connectionRow,
              pressed && onPressConnection && styles.pressed,
            ]}
          >
            <View style={[styles.connectionDot, { backgroundColor: dotColor }]} />
            <ThemedText type="secondary" style={styles.connectionLabel} numberOfLines={1}>
              {connectionLabel}
            </ThemedText>
          </Pressable>
        ) : null}
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={newChatTitle}
        hitSlop={10}
        onPress={onNewSession}
        style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}
      >
        <AppIcon icon={MessageSquarePlus} size={22} color={theme.text} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    flex: 1,
    overflow: "hidden",
  },
  panelLayer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
  panel: {
    flex: 1,
    paddingHorizontal: 14,
  },
  panelHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
    paddingHorizontal: 2,
  },
  headerTitle: {
    fontSize: 20,
  },
  chatLayer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 2,
    overflow: "hidden",
  },
  chatClip: {
    flex: 1,
  },
  edgeHit: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: EDGE_WIDTH,
    zIndex: 5,
  },
  dimOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#000000",
    zIndex: 20,
  },
  iconButton: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  newButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 16,
  },
  newButtonText: {
    fontSize: 15,
  },
  sectionLabel: {
    fontSize: 12,
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  list: {
    flex: 1,
  },
  listContent: {
    gap: 6,
    paddingBottom: 24,
  },
  empty: {
    paddingHorizontal: 4,
    paddingTop: 8,
  },
  row: {
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  rowBody: {
    gap: 4,
  },
  rowTitle: {
    fontSize: 15,
  },
  rowTime: {
    fontSize: 12,
  },
  pressed: {
    opacity: 0.72,
  },
  chatHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 10,
    paddingBottom: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  chatTitleBlock: {
    flex: 1,
    alignItems: "center",
    minWidth: 0,
  },
  chatTitle: {
    fontSize: 16,
    textAlign: "center",
    width: "100%",
  },
  connectionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 2,
  },
  connectionDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  connectionLabel: {
    fontSize: 11,
  },
});
