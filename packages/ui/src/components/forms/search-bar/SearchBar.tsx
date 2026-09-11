import {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { Search, X } from "lucide-react-native";

import { Icon } from "../../foundation/icon";
import { useResolvedTheme } from "../../../theme/ThemeProvider";
import type { UiTheme } from "../../../theme/types";
import { useControllableState } from "../../../utils/useControllableState";

export type SearchBarRef = {
  focus: () => void;
  blur: () => void;
  clear: () => void;
};

export type SearchBarProps = {
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  maxLength?: number;
  /** Show clear button when there is text. @default true */
  clearable?: boolean;
  /** Clear only while focused. @default false */
  onlyShowClearWhenFocus?: boolean;
  /**
   * `true` → show cancel while focused.
   * Function → custom visibility from focus + value.
   * @default false
   */
  showCancelButton?: boolean | ((focus: boolean, value: string) => boolean);
  /** @default "取消" */
  cancelText?: string;
  /** Clear value when cancel is pressed. @default true */
  clearOnCancel?: boolean;
  /** Leading icon; pass `null` to hide. @default Search */
  searchIcon?: ReactNode | null;
  autoFocus?: boolean;
  onChange?: (val: string) => void;
  /** Fired on keyboard search / submit. */
  onSearch?: (val: string) => void;
  onCancel?: () => void;
  onClear?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
  theme?: Partial<UiTheme>;
  style?: StyleProp<ViewStyle>;
};

/**
 * Search input with optional clear / cancel actions.
 */
export const SearchBar = forwardRef<SearchBarRef, SearchBarProps>(
  function SearchBar(
    {
      value: valueProp,
      defaultValue = "",
      placeholder,
      maxLength,
      clearable = true,
      onlyShowClearWhenFocus = false,
      showCancelButton = false,
      cancelText = "取消",
      clearOnCancel = true,
      searchIcon,
      autoFocus,
      onChange,
      onSearch,
      onCancel,
      onClear,
      onFocus,
      onBlur,
      theme: themeOverride,
      style,
    },
    ref,
  ) {
    const palette = useResolvedTheme(themeOverride);
    const inputRef = useRef<TextInput>(null);
    const [value, setValue] = useControllableState(
      valueProp,
      defaultValue,
      onChange,
    );
    const [focused, setFocused] = useState(false);

    useImperativeHandle(ref, () => ({
      focus: () => inputRef.current?.focus(),
      blur: () => inputRef.current?.blur(),
      clear: () => {
        setValue("");
        onClear?.();
      },
    }));

    const showClear =
      clearable && Boolean(value) && (!onlyShowClearWhenFocus || focused);

    let showCancel = false;
    if (typeof showCancelButton === "function") {
      showCancel = showCancelButton(focused, value);
    } else if (showCancelButton) {
      showCancel = focused;
    }

    const iconNode =
      searchIcon === null
        ? null
        : searchIcon === undefined
          ? <Icon icon={Search} size={16} color="muted" />
          : searchIcon;

    return (
      <View style={[styles.root, style]}>
        <View
          style={[
            styles.inputBox,
            {
              backgroundColor: palette.surface,
              borderColor: palette.border,
            },
          ]}
        >
          {iconNode != null ? (
            <View style={styles.iconSlot}>{iconNode}</View>
          ) : null}
          <TextInput
            ref={inputRef}
            value={value}
            onChangeText={setValue}
            placeholder={placeholder}
            placeholderTextColor={palette.muted}
            maxLength={maxLength}
            autoFocus={autoFocus}
            returnKeyType="search"
            clearButtonMode="never"
            style={[styles.input, { color: palette.text }]}
            onFocus={() => {
              setFocused(true);
              onFocus?.();
            }}
            onBlur={() => {
              setFocused(false);
              onBlur?.();
            }}
            onSubmitEditing={() => {
              inputRef.current?.blur();
              onSearch?.(value);
            }}
          />
          {showClear ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="清除"
              hitSlop={8}
              onPress={() => {
                setValue("");
                onClear?.();
              }}
              style={styles.clearBtn}
            >
              <View
                style={[styles.clearDisc, { backgroundColor: palette.muted }]}
              >
                <Icon icon={X} size={10} color="onPrimary" />
              </View>
            </Pressable>
          ) : null}
        </View>
        {showCancel ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={cancelText}
            hitSlop={8}
            // onPressIn: run before TextInput blur unmounts this button
            onPressIn={() => {
              if (clearOnCancel) {
                setValue("");
                onClear?.();
              }
              onCancel?.();
              inputRef.current?.blur();
            }}
            style={styles.cancelBtn}
          >
            <Text style={[styles.cancelText, { color: palette.primary }]}>
              {cancelText}
            </Text>
          </Pressable>
        ) : null}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  root: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    gap: 8,
  },
  inputBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    minHeight: 36,
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 10,
    gap: 6,
  },
  iconSlot: {
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 6,
    margin: 0,
  },
  clearBtn: {
    padding: 2,
  },
  clearDisc: {
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelBtn: {
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  cancelText: {
    fontSize: 15,
  },
});
