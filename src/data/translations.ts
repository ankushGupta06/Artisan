import type { Language } from "@/types";

export const translations = {
  en: {
    home: "Home",
    products: "Products",
    addProduct: "Add Product",
    marketplace: "Marketplace",
    orders: "Orders",
    assistant: "AI Assistant",
    profile: "Profile",
    enquiries: "Enquiries",
    goodMorning: "Good morning",
    subtitleHome: "Here's how your business is doing today.",
    viewInsights: "View Insights",
    askAI: "Ask AI",
    quickActions: "Quick Actions",
    recentOrders: "Recent Orders",
    notifications: "Notifications",
    myProducts: "My Products",
    checkPrice: "Check Price",
    settings: "Settings",
    schemes: "Government Support",
    switchToBuyer: "Switch to Buyer",
    switchToArtisan: "Switch to Artisan",
    logout: "Logout",
  },
  hi: {
    home: "होम",
    products: "उत्पाद",
    addProduct: "उत्पाद जोड़ें",
    marketplace: "बाज़ार",
    orders: "ऑर्डर",
    assistant: "एआई सहायक",
    profile: "प्रोफ़ाइल",
    enquiries: "पूछताछ",
    goodMorning: "सुप्रभात",
    subtitleHome: "आज आपका व्यवसाय कैसा चल रहा है।",
    viewInsights: "जानकारी देखें",
    askAI: "एआई से पूछें",
    quickActions: "त्वरित कार्य",
    recentOrders: "हाल के ऑर्डर",
    notifications: "सूचनाएं",
    myProducts: "मेरे उत्पाद",
    checkPrice: "कीमत जांचें",
    settings: "सेटिंग्स",
    schemes: "सरकारी सहायता",
    switchToBuyer: "खरीदार में बदलें",
    switchToArtisan: "कारीगर में बदलें",
    logout: "लॉग आउट",
  },
} as const satisfies Record<Language, Record<string, string>>;

export type TranslationKey = keyof (typeof translations)["en"];

export function t(lang: Language, key: TranslationKey): string {
  return translations[lang][key] ?? translations.en[key] ?? key;
}
