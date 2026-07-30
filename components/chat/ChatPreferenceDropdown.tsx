import type { LucideIcon } from "lucide-react-native";
import { CircleCheck, ChevronDown, ChevronUp } from "lucide-react-native";
import { useCallback } from "react";
import {
  Keyboard,
  Modal,
  Pressable,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppIcon } from "@/components/ui/AppIcon";
import { ThemedText } from "@/components/ThemedText";
import { useAppTheme } from "@/hooks/useAppTheme";

export type ChatDropdownOption<T> = {
  value: T;
  label: string;
  icon?: LucideIcon;
  disabled?: boolean;
};

type ChatPreferenceDropdownProps<T> = {
  menuId: string;
  activeMenuId: string | null;
  onMenuChange: (menuId: string | null) => void;
  icon: LucideIcon;
  activeIcon?: LucideIcon;
  label: string;
  options: ChatDropdownOption<T>[];
  selected: T;
  onSelect: (value: T) => void | Promise<void>;
  triggerStyle?: StyleProp<ViewStyle>;
};

function isSelected<T>(selected: T, value: T): boolean {
  return selected === value;
}

export function ChatPreferenceDropdown<T>({
  menuId,
  activeMenuId,
  onMenuChange,
  icon,
  activeIcon,
  label,
  options,
  selected,
  onSelect,
  triggerStyle,
}: ChatPreferenceDropdownProps<T>) {
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();
  const isOpen = activeMenuId === menuId;
  const displayIcon = isOpen && activeIcon ? activeIcon : icon;

  const openMenu = useCallback(() => {
    Keyboard.dismiss();
    onMenuChange(isOpen ? null : menuId);
  }, [isOpen, menuId, onMenuChange]);

  const closeMenu = useCallback(() => {
    onMenuChange(null);
  }, [onMenuChange]);

  const handleSelect = useCallback(
    (value: T, disabled?: boolean) => {
      if (disabled) {
        return;
      }
      void Promise.resolve(onSelect(value)).finally(closeMenu);
    },
    [closeMenu, onSelect]
  );

  return (
    <>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ expanded: isOpen }}
        onPress={openMenu}
        style={({ pressed }) => [
          styles.chip,
          triggerStyle,
          {
            backgroundColor: theme.card,
            borderColor: isOpen ? theme.primary : theme.border,
          },
          pressed && styles.pressed,
        ]}
      >
        <AppIcon
          icon={displayIcon}
          size={14}
          color={isOpen ? theme.primary : theme.textSecondary}
        />
        <ThemedText type="defaultSemiBold" style={styles.chipText}>
          {label}
        </ThemedText>
        <AppIcon
          icon={isOpen ? ChevronUp : ChevronDown}
          size={14}
          color={theme.textSecondary}
        />
      </Pressable>

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={closeMenu}
      >
        <Pressable style={styles.backdrop} onPress={closeMenu}>
          <Pressable
            onPress={() => {
              // 阻止点击菜单时关闭
            }}
            style={[
              styles.menu,
              {
                top: insets.top + 48,
                backgroundColor: theme.card,
                borderColor: theme.border,
              },
            ]}
          >
            {options.map((option, index) => {
              const selectedOption = isSelected(selected, option.value);
              const isLast = index === options.length - 1;

              return (
                <Pressable
                  key={String(option.label)}
                  accessibilityRole="button"
                  accessibilityState={{
                    selected: selectedOption,
                    disabled: option.disabled,
                  }}
                  disabled={option.disabled}
                  onPress={() => handleSelect(option.value, option.disabled)}
                  style={({ pressed }) => [
                    styles.optionRow,
                    !isLast && {
                      borderBottomWidth: StyleSheet.hairlineWidth,
                      borderBottomColor: theme.border,
                    },
                    (pressed || option.disabled) && styles.pressed,
                  ]}
                >
                  {option.icon ? (
                    <View
                      style={[
                        styles.optionIcon,
                        { backgroundColor: theme.background },
                      ]}
                    >
                      <AppIcon
                        icon={option.icon}
                        size={18}
                        color={
                          selectedOption ? theme.primary : theme.textSecondary
                        }
                      />
                    </View>
                  ) : null}
                  <ThemedText
                    type="defaultSemiBold"
                    style={[
                      styles.optionLabel,
                      option.disabled ? { color: theme.textSecondary } : undefined,
                    ]}
                  >
                    {option.label}
                  </ThemedText>
                  {selectedOption ? (
                    <AppIcon
                      icon={CircleCheck}
                      size={20}
                      color={theme.primary}
                    />
                  ) : (
                    <View
                      style={[styles.radioOuter, { borderColor: theme.border }]}
                    />
                  )}
                </Pressable>
              );
            })}
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  chipText: {
    fontSize: 13,
  },
  pressed: {
    opacity: 0.72,
  },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.25)",
  },
  menu: {
    position: "absolute",
    left: 16,
    right: 16,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: "hidden",
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 13,
  },
  optionIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  optionLabel: {
    flex: 1,
    fontSize: 15,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
  },
});
