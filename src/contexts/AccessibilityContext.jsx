import { createContext, useContext, useEffect, useReducer, useCallback, useState } from "react";

/* ═══════════════════════════════════════════════════════════════════
   AccessibilityContext
   ───────────────────────────────────────────────────────────────────
   Global state for all accessibility features in Hoà Nhập.
   
   Managed features:
   • fontScale    – Root font-size multiplier (0.8–2.0, step 0.1)
   • darkMode     – Tailwind "dark" class toggle
   • highContrast – Ultra-high-contrast mode (black bg, yellow/white text)
   • screenReader – Browser TTS via Web Speech API
   • keyboardNav  – Enhanced focus indicators for keyboard-only users
   
   Persistence: localStorage key "hoa-nhap-accessibility"
   ═══════════════════════════════════════════════════════════════════ */

// ─── Constants ───────────────────────────────────────────────────
const STORAGE_KEY = "hoa-nhap-accessibility";
const FONT_SCALE_MIN = 0.8;
const FONT_SCALE_MAX = 2.0;
const FONT_SCALE_STEP = 0.1;

// ─── Default State ──────────────────────────────────────────────
const defaultState = {
  fontScale: 1.0,
  darkMode: false,
  highContrast: false,
  screenReader: false,
  keyboardNav: false,
};

// ─── Load persisted state from localStorage ─────────────────────
function loadPersistedState() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        ...defaultState,
        ...parsed,
        // Clamp fontScale to valid range
        fontScale: Math.min(
          FONT_SCALE_MAX,
          Math.max(FONT_SCALE_MIN, parsed.fontScale ?? defaultState.fontScale)
        ),
      };
    }
  } catch (err) {
    console.warn("[AccessibilityContext] Failed to load persisted state:", err);
  }
  return defaultState;
}

// ─── Persist state to localStorage ──────────────────────────────
function persistState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.warn("[AccessibilityContext] Failed to persist state:", err);
  }
}

// ─── Reducer Actions ────────────────────────────────────────────
const ActionTypes = {
  INCREASE_FONT_SCALE: "INCREASE_FONT_SCALE",
  DECREASE_FONT_SCALE: "DECREASE_FONT_SCALE",
  TOGGLE_DARK_MODE: "TOGGLE_DARK_MODE",
  TOGGLE_HIGH_CONTRAST: "TOGGLE_HIGH_CONTRAST",
  TOGGLE_SCREEN_READER: "TOGGLE_SCREEN_READER",
  TOGGLE_KEYBOARD_NAV: "TOGGLE_KEYBOARD_NAV",
  RESET: "RESET",
};

function accessibilityReducer(state, action) {
  switch (action.type) {
    case ActionTypes.INCREASE_FONT_SCALE: {
      const next = Math.min(FONT_SCALE_MAX, +(state.fontScale + FONT_SCALE_STEP).toFixed(1));
      return { ...state, fontScale: next };
    }
    case ActionTypes.DECREASE_FONT_SCALE: {
      const next = Math.max(FONT_SCALE_MIN, +(state.fontScale - FONT_SCALE_STEP).toFixed(1));
      return { ...state, fontScale: next };
    }
    case ActionTypes.TOGGLE_DARK_MODE:
      return { ...state, darkMode: !state.darkMode };
    case ActionTypes.TOGGLE_HIGH_CONTRAST:
      return { ...state, highContrast: !state.highContrast };
    case ActionTypes.TOGGLE_SCREEN_READER:
      return { ...state, screenReader: !state.screenReader };
    case ActionTypes.TOGGLE_KEYBOARD_NAV:
      return { ...state, keyboardNav: !state.keyboardNav };
    case ActionTypes.RESET:
      return { ...defaultState };
    default:
      return state;
  }
}

// ─── Context Creation ───────────────────────────────────────────
const AccessibilityContext = createContext(null);

// ─── Provider Component ─────────────────────────────────────────
export function AccessibilityProvider({ children }) {
  const [state, dispatch] = useReducer(accessibilityReducer, null, loadPersistedState);
  
  // Voices state to hold loaded browser voices
  const [voices, setVoices] = useState([]);

  // ── Load voices asynchronously on mount ──
  useEffect(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      const loadVoices = () => {
        setVoices(window.speechSynthesis.getVoices());
      };
      
      loadVoices();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = loadVoices;
      }
    }
  }, []);

  // ── Persist state to localStorage on every change ──
  useEffect(() => {
    persistState(state);
  }, [state]);

  // ── Apply font scale to <html> via CSS variable ──
  useEffect(() => {
    document.documentElement.style.setProperty("--font-scale", state.fontScale);
  }, [state.fontScale]);

  // ── Apply dark mode class to <html> ──
  useEffect(() => {
    const cl = document.documentElement.classList;
    if (state.darkMode) {
      cl.add("dark");
    } else {
      cl.remove("dark");
    }
  }, [state.darkMode]);

  // ── Apply high-contrast class to <html> ──
  useEffect(() => {
    const cl = document.documentElement.classList;
    if (state.highContrast) {
      cl.add("high-contrast");
    } else {
      cl.remove("high-contrast");
    }
  }, [state.highContrast]);

  // ── Apply keyboard-nav class to <html> ──
  useEffect(() => {
    const cl = document.documentElement.classList;
    if (state.keyboardNav) {
      cl.add("keyboard-nav");
    } else {
      cl.remove("keyboard-nav");
    }
  }, [state.keyboardNav]);

  // ── Stop speaking ──
  const stopSpeaking = useCallback(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }, []);

  // ── Cancel TTS when screenReader is toggled off ──
  useEffect(() => {
    if (!state.screenReader) {
      stopSpeaking();
    }
  }, [state.screenReader, stopSpeaking]);

  // ── Voice Selection Helper ──
  const getVietnameseVoice = useCallback(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return null;
    const voicesList = window.speechSynthesis.getVoices();
    
    // 1. Google vi-VN (Google Tiếng Việt on Chrome/Android)
    let voice = voicesList.find(
      (v) => (v.lang === "vi-VN" || v.lang === "vi_VN") && v.name.toLowerCase().includes("google")
    );
    
    // 2. Any native vi-VN (Microsoft An on Windows, Linh/Mai on macOS/iOS)
    if (!voice) {
      voice = voicesList.find((v) => v.lang === "vi-VN" || v.lang === "vi_VN");
    }
    
    return voice || null;
  }, []);

  // ── TTS: speakText(text) ──────────────────────────────────────
  // Uses the browser's native Web Speech API (SpeechSynthesis).
  // Ensures clean narration by cancelling active speech before speaking.
  const speakText = useCallback(
    (text) => {
      if (!text || typeof window === "undefined" || !window.speechSynthesis) return;

      // Interrupt any current speech
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "vi-VN";
      
      const voice = getVietnameseVoice();
      if (voice) {
        utterance.voice = voice;
      }

      utterance.rate = 0.9; // Slightly slower for clarity
      utterance.pitch = 1.0;

      window.speechSynthesis.speak(utterance);
    },
    [getVietnameseVoice]
  );

  // ── Dispatch helpers ──────────────────────────────────────────
  const increaseFontScale = useCallback(
    () => dispatch({ type: ActionTypes.INCREASE_FONT_SCALE }),
    []
  );
  const decreaseFontScale = useCallback(
    () => dispatch({ type: ActionTypes.DECREASE_FONT_SCALE }),
    []
  );
  const toggleDarkMode = useCallback(
    () => dispatch({ type: ActionTypes.TOGGLE_DARK_MODE }),
    []
  );
  const toggleHighContrast = useCallback(
    () => dispatch({ type: ActionTypes.TOGGLE_HIGH_CONTRAST }),
    []
  );
  const toggleScreenReader = useCallback(
    () => dispatch({ type: ActionTypes.TOGGLE_SCREEN_READER }),
    []
  );
  const toggleKeyboardNav = useCallback(
    () => dispatch({ type: ActionTypes.TOGGLE_KEYBOARD_NAV }),
    []
  );
  const resetAccessibility = useCallback(
    () => dispatch({ type: ActionTypes.RESET }),
    []
  );

  const value = {
    state,
    increaseFontScale,
    decreaseFontScale,
    toggleDarkMode,
    toggleHighContrast,
    toggleScreenReader,
    toggleKeyboardNav,
    resetAccessibility,
    speakText,
    stopSpeaking,
  };

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
}

// ─── Custom Hook ────────────────────────────────────────────────
export function useAccessibility() {
  const ctx = useContext(AccessibilityContext);
  if (!ctx) {
    throw new Error(
      "useAccessibility() must be used within an <AccessibilityProvider>."
    );
  }
  return ctx;
}

export default AccessibilityContext;
