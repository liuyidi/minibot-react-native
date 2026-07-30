import { Box, Lightbulb, Zap } from "lucide-react-native";
import { useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";

import {
  ChatPreferenceDropdown,
  type ChatDropdownOption,
} from "@/components/chat/ChatPreferenceDropdown";
import { useChatPreferences } from "@/context/ChatPreferencesContext";
import { useT } from "@/context/LanguageContext";
import { MODEL_LABELS, MODEL_OPTIONS } from "@/lib/modelLabels";
import type { DeepSeekModelId } from "@/lib/chatPreferencesConfig";

export function ChatPreferencesBar() {
  const t = useT();
  const {
    model,
    setModel,
    thinkingEnabled,
    setThinkingEnabled,
    isThinkingActive,
  } = useChatPreferences();
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const isReasonerModel = model === "deepseek-reasoner";

  const thinkingOptions = useMemo((): ChatDropdownOption<boolean>[] => {
    const options: ChatDropdownOption<boolean>[] = [
      { value: false, label: t("common.off"), icon: Zap },
      { value: true, label: t("common.on"), icon: Lightbulb },
    ];
    return options.map((option) => ({
      ...option,
      disabled: isReasonerModel && !option.value,
    }));
  }, [isReasonerModel, t]);

  const thinkingLabel = t("prefs.thinkingLabel", {
    state: isThinkingActive ? t("prefs.onShort") : t("prefs.offShort"),
  });

  return (
    <View style={styles.row}>
      <ChatPreferenceDropdown<DeepSeekModelId>
        menuId="model"
        activeMenuId={activeMenuId}
        onMenuChange={setActiveMenuId}
        icon={Box}
        activeIcon={Box}
        label={MODEL_LABELS[model]}
        options={MODEL_OPTIONS.map((option) => ({
          value: option.value,
          label: option.label,
          icon: option.icon,
        }))}
        selected={model}
        onSelect={setModel}
      />

      <ChatPreferenceDropdown<boolean>
        menuId="thinking"
        activeMenuId={activeMenuId}
        onMenuChange={setActiveMenuId}
        icon={Lightbulb}
        activeIcon={Lightbulb}
        label={thinkingLabel}
        options={thinkingOptions}
        selected={isReasonerModel ? true : thinkingEnabled}
        onSelect={setThinkingEnabled}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingBottom: 8,
    zIndex: 10,
  },
});
