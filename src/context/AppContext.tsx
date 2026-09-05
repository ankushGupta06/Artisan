import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { INITIAL_PRODUCTS } from "@/data/products";
import { INITIAL_ORDERS } from "@/data/orders";
import { INITIAL_NOTIFICATIONS } from "@/data/notifications";
import { INITIAL_ENQUIRIES } from "@/data/enquiries";
import { CURRENT_USER, BUYER_USER } from "@/data/users";
import { t as translate, type TranslationKey } from "@/data/translations";
import type {
  AppMode,
  AppNotification,
  AppSettings,
  Enquiry,
  Language,
  Order,
  OrderStatus,
  Product,
  ProductDraft,
} from "@/types";

const STORAGE_KEY = "artisanai_state_v1";

interface PersistedState {
  products: Product[];
  orders: Order[];
  favorites: string[];
  enquiries: Enquiry[];
  notifications: AppNotification[];
  settings: AppSettings;
  language: Language;
  mode: AppMode;
  isLoggedIn: boolean;
}

const DEFAULT_SETTINGS: AppSettings = {
  notifications: true,
  darkMode: false,
  dataSaver: false,
  offlineMode: false,
  sound: true,
};

function defaultState(): PersistedState {
  return {
    products: INITIAL_PRODUCTS,
    orders: INITIAL_ORDERS,
    favorites: [],
    enquiries: INITIAL_ENQUIRIES,
    notifications: INITIAL_NOTIFICATIONS,
    settings: DEFAULT_SETTINGS,
    language: "en",
    mode: "artisan",
    isLoggedIn: false,
  };
}

function loadState(): PersistedState {
  if (typeof window === "undefined") return defaultState();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw) as Partial<PersistedState>;
    const base = defaultState();
    return {
      products: parsed.products ?? base.products,
      orders: parsed.orders ?? base.orders,
      favorites: parsed.favorites ?? base.favorites,
      enquiries: parsed.enquiries ?? base.enquiries,
      notifications: parsed.notifications ?? base.notifications,
      settings: { ...base.settings, ...parsed.settings },
      language: parsed.language ?? base.language,
      mode: parsed.mode ?? base.mode,
      isLoggedIn: parsed.isLoggedIn ?? base.isLoggedIn,
    };
  } catch {
    return defaultState();
  }
}

export interface ToastItem {
  id: string;
  message: string;
  tone: "success" | "error" | "info";
}

interface AppContextValue {
  language: Language;
  mode: AppMode;
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
  user: typeof CURRENT_USER;
  buyerProfile: typeof BUYER_USER;
  products: Product[];
  orders: Order[];
  favorites: string[];
  enquiries: Enquiry[];
  notifications: AppNotification[];
  settings: AppSettings;
  toasts: ToastItem[];
  unreadCount: number;

  tr: (key: TranslationKey) => string;
  setLanguage: (lang: Language) => void;
  setMode: (mode: AppMode) => void;
  toggleMode: () => void;

  addProduct: (product: Product) => void;
  updateProduct: (id: string, patch: Partial<Product>) => void;
  deleteProduct: (id: string) => void;

  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;

  updateOrderStatus: (id: string, status: OrderStatus) => void;

  addEnquiry: (enquiry: Enquiry) => void;

  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;

  updateSettings: (patch: Partial<AppSettings>) => void;

  showToast: (message: string, tone?: ToastItem["tone"]) => void;
  dismissToast: (id: string) => void;

  draft: ProductDraft;
  updateDraft: (patch: ProductDraft) => void;
  resetDraft: () => void;

  resetDemo: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PersistedState>(loadState);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const toastTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
  const [draft, setDraft] = useState<ProductDraft>({});

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // storage full or unavailable — the demo should never crash over this
    }
  }, [state]);

  useEffect(() => {
    document.documentElement.dataset.theme = state.settings.darkMode ? "dark" : "light";
  }, [state.settings.darkMode]);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((tItem) => tItem.id !== id));
    clearTimeout(toastTimers.current[id]);
    delete toastTimers.current[id];
  }, []);

  const showToast = useCallback(
    (message: string, tone: ToastItem["tone"] = "success") => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      setToasts((prev) => [...prev, { id, message, tone }]);
      toastTimers.current[id] = setTimeout(() => {
        setToasts((prev) => prev.filter((tItem) => tItem.id !== id));
      }, 3200);
    },
    [],
  );

  const setLanguage = useCallback((language: Language) => {
    setState((prev) => ({ ...prev, language }));
  }, []);

  const setMode = useCallback((mode: AppMode) => {
    setState((prev) => ({ ...prev, mode }));
  }, []);

  const toggleMode = useCallback(() => {
    setState((prev) => ({ ...prev, mode: prev.mode === "artisan" ? "buyer" : "artisan" }));
  }, []);

  const addProduct = useCallback((product: Product) => {
    setState((prev) => ({ ...prev, products: [product, ...prev.products] }));
  }, []);

  const updateProduct = useCallback((id: string, patch: Partial<Product>) => {
    setState((prev) => ({
      ...prev,
      products: prev.products.map((p) => (p.id === id ? { ...p, ...patch } : p)),
    }));
  }, []);

  const deleteProduct = useCallback((id: string) => {
    setState((prev) => ({ ...prev, products: prev.products.filter((p) => p.id !== id) }));
  }, []);

  const toggleFavorite = useCallback((id: string) => {
    setState((prev) => {
      const has = prev.favorites.includes(id);
      return {
        ...prev,
        favorites: has ? prev.favorites.filter((f) => f !== id) : [...prev.favorites, id],
      };
    });
  }, []);

  const isFavorite = useCallback((id: string) => state.favorites.includes(id), [state.favorites]);

  const updateOrderStatus = useCallback((id: string, status: OrderStatus) => {
    setState((prev) => ({
      ...prev,
      orders: prev.orders.map((o) => (o.id === id ? { ...o, status } : o)),
    }));
  }, []);

  const addEnquiry = useCallback((enquiry: Enquiry) => {
    setState((prev) => ({
      ...prev,
      enquiries: [enquiry, ...prev.enquiries],
      notifications: [
        {
          id: `n-${Date.now()}`,
          type: "enquiry",
          title: "New B2B enquiry",
          message: `${enquiry.buyerName} wants ${enquiry.quantity} × ${enquiry.productName}.`,
          date: new Date().toISOString(),
          read: false,
          link: "/orders",
        },
        ...prev.notifications,
      ],
    }));
  }, []);

  const markNotificationRead = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
    }));
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setState((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) => ({ ...n, read: true })),
    }));
  }, []);

  const updateSettings = useCallback((patch: Partial<AppSettings>) => {
    setState((prev) => ({ ...prev, settings: { ...prev.settings, ...patch } }));
  }, []);

  const login = useCallback(() => {
    setState((prev) => ({ ...prev, isLoggedIn: true }));
  }, []);

  const logout = useCallback(() => {
    setState((prev) => ({ ...prev, isLoggedIn: false }));
  }, []);

  const updateDraft = useCallback((patch: ProductDraft) => {
    setDraft((prev) => ({ ...prev, ...patch }));
  }, []);

  const resetDraft = useCallback(() => setDraft({}), []);

  const resetDemo = useCallback(() => {
    window.localStorage.removeItem(STORAGE_KEY);
    setState({ ...defaultState(), isLoggedIn: true });
    setToasts([]);
    setDraft({});
  }, []);

  const unreadCount = useMemo(
    () => state.notifications.filter((n) => !n.read).length,
    [state.notifications],
  );

  const tr = useCallback((key: TranslationKey) => translate(state.language, key), [state.language]);

  const value: AppContextValue = {
    language: state.language,
    mode: state.mode,
    isLoggedIn: state.isLoggedIn,
    login,
    logout,
    user: CURRENT_USER,
    buyerProfile: BUYER_USER,
    products: state.products,
    orders: state.orders,
    favorites: state.favorites,
    enquiries: state.enquiries,
    notifications: state.notifications,
    settings: state.settings,
    toasts,
    unreadCount,
    tr,
    setLanguage,
    setMode,
    toggleMode,
    addProduct,
    updateProduct,
    deleteProduct,
    toggleFavorite,
    isFavorite,
    updateOrderStatus,
    addEnquiry,
    markNotificationRead,
    markAllNotificationsRead,
    updateSettings,
    showToast,
    dismissToast,
    draft,
    updateDraft,
    resetDraft,
    resetDemo,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
