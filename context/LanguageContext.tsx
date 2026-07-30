import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { createTranslator, type TranslateFn } from "@/lib/i18n";
import { getCatalog } from "@/lib/i18n";
import type { MessageCatalog } from "@/lib/i18n/messages";
import {
  getAppLanguage,
  setAppLanguage as persistAppLanguage,
  type AppLanguage,
} from "@/lib/languageConfig";

type LanguageContextValue = {
  language: AppLanguage;
  setLanguage: (language: AppLanguage) => Promise<void>;
  t: TranslateFn;
  catalog: MessageCatalog;
  isReady: boolean;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<AppLanguage>("zh");
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    void getAppLanguage().then((savedLanguage) => {
      setLanguageState(savedLanguage);
      setIsReady(true);
    });
  }, []);

  const setLanguage = useCallback(async (nextLanguage: AppLanguage) => {
    setLanguageState(nextLanguage);
    await persistAppLanguage(nextLanguage);
  }, []);

  const t = useMemo(() => createTranslator(language), [language]);
  const catalog = useMemo(() => getCatalog(language), [language]);

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      t,
      catalog,
      isReady,
    }),
    [catalog, isReady, language, setLanguage, t]
  );

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}

/** Shorthand for `useLanguage().t`. */
export function useT(): TranslateFn {
  return useLanguage().t;
}
