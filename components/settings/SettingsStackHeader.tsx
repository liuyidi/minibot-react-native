import type { NativeStackHeaderProps } from "@react-navigation/native-stack";
import { ChevronLeft } from "lucide-react-native";
import { Pressable, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppIcon } from "@/components/ui/AppIcon";
import { ThemedText } from "@/components/ThemedText";
import { useLanguage } from "@/context/LanguageContext";
import { useAppTheme } from "@/hooks/useAppTheme";

function SettingsStackHeaderComponent({
  navigation,
  options,
  route,
}: NativeStackHeaderProps) {
  const insets = useSafeAreaInsets();
  const theme = useAppTheme();
  const { t } = useLanguage();
  const title = typeof options.title === "string" ? options.title : route.name;

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top,
          backgroundColor: theme.card,
          borderBottomColor: theme.border,
        },
      ]}
    >
      <View style={styles.bar}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t("common.back")}
          hitSlop={12}
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <AppIcon icon={ChevronLeft} size={24} color={theme.text} />
        </Pressable>
        <ThemedText style={styles.title}>{title}</ThemedText>
      </View>
    </View>
  );
}

export function renderSettingsStackHeader(props: NativeStackHeaderProps) {
  return <SettingsStackHeaderComponent {...props} />;
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  bar: {
    height: 44,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    gap: 8,
  },
  backButton: {
    padding: 4,
  },
  title: {
    flex: 1,
    fontSize: 17,
    fontWeight: "600",
  },
});
