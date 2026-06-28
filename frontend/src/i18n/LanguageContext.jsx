import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { DEFAULT_LANGUAGE, LANGUAGES, dictionaries } from "./translations";

const LanguageContext = createContext({
  lang: DEFAULT_LANGUAGE,
  setLang: () => {},
  t: (text) => text,
  languages: LANGUAGES,
});

function readStoredLang() {
  try {
    return localStorage.getItem("catedral_lang") || DEFAULT_LANGUAGE;
  } catch {
    return DEFAULT_LANGUAGE;
  }
}

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(readStoredLang);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const value = useMemo(() => {
    const dict = dictionaries[lang] || null;

    function t(text) {
      if (text === undefined || text === null) return text;
      if (!dict) return text; // pt-BR ou idioma sem dicionario -> mostra original
      return dict[text] || text;
    }

    function setLang(next) {
      setLangState(next);
      try {
        localStorage.setItem("catedral_lang", next);
      } catch {
        // ignora se o navegador bloquear o storage
      }
    }

    return { lang, setLang, t, languages: LANGUAGES };
  }, [lang]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useT() {
  return useContext(LanguageContext);
}
