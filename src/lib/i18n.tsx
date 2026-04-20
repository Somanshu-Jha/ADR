import React, { createContext, useContext, useState, ReactNode } from "react";

export type Language = "en" | "hi" | "mr";

interface Translations {
  [key: string]: {
    [K in Language]: string;
  };
}

export const TRANSLATIONS: Translations = {
  // Common
  home: { en: "Home", hi: "मुख्य पृष्ठ", mr: "मुख्य पृष्ठ" },
  back: { en: "Back", hi: "पीछे", mr: "मागे" },
  backToHome: { en: "Back to Home", hi: "मुख्य पृष्ठ पर लौटें", mr: "मुख्यपृष्ठावर परत जा" },
  safetyShield: { en: "ADR Shield", hi: "ADR शील्ड", mr: "ADR शील्ड" },
  
  // Dashboard Labels
  welcome: { en: "Welcome to ADR Shield", hi: "ADR शील्ड में आपका स्वागत है", mr: "ADR शील्डमध्ये आपले स्वागत आहे" },
  tagline: { en: "We help you stay safe with your medicines. Pick an option below to get started.", hi: "हम आपको अपनी दवाओं के साथ सुरक्षित रहने में मदद करते हैं। शुरू करने के लिए नीचे एक विकल्प चुनें।", mr: "आम्ही तुम्हाला तुमच्या औषधांसह सुरक्षित राहण्यास मदत करतो. सुरू करण्यासाठी खालीलपैकी एक पर्याय निवडा." },
  
  // Action Blocks
  findMed: { en: "Find Your Medicine", hi: "अपनी दवा खोजें", mr: "तुमचे औषध शोधा" },
  findMedDesc: { en: "Search for your pills and learn how to take them safely.", hi: "अपनी गोलियां खोजें और उन्हें सुरक्षित रूप से लेने का तरीका जानें।", mr: "तुमच्या गोळ्या शोधा आणि त्या कशा सुरक्षितपणे घ्याव्यात ते शिका." },
  
  safeToMix: { en: "Is it Safe to Mix?", hi: "क्या इन्हें मिलाना सुरक्षित है?", mr: "एकापेक्षा जास्त औषधे घेणे सुरक्षित आहे का?" },
  safeToMixDesc: { en: "Taking two different pills? Check if they are safe to use together.", hi: "दो अलग-अलग गोलियां ले रहे हैं? जांचें कि क्या वे एक साथ उपयोग करने के लिए सुरक्षित हैं।", mr: "दोन वेगवेगळ्या गोळ्या घेत आहात? त्या एकत्र वापरण्यास सुरक्षित आहेत का ते तपासा." },
  
  helper: { en: "Talk to AI Friend", hi: "AI मित्र से बात करें", mr: "AI मित्राशी बोला" },
  helperDesc: { en: "Have a quick question? Our helpful AI is here to help you 24/7.", hi: "कोई प्रश्न है? हमारा मददगार AI आपकी सहायता के लिए 24/7 यहाँ है।", mr: "काही प्रश्न आहे का? आमचे मदतीसाठी AI २४/७ येथे आहे." },
  
  report: { en: "Tell us a Problem", hi: "हमें समस्या बताएं", mr: "आम्हाला समस्या सांगा" },
  reportDesc: { en: "Feeling unwell after taking medicine? Tell us so we can help others.", hi: "दवा लेने के बाद अस्वस्थ महसूस कर रहे हैं? हमें बताएं ताकि हम दूसरों की मदद कर सकें।", mr: "औषध घेतल्यावर अस्वस्थ वाटतेय? आम्हाला सांगा जेणेकरून आम्ही इतरांना मदत करू शकू." },
  
  disease: { en: "What is my illness?", hi: "मेरी बीमारी क्या है?", mr: "मला कोणता आजार आहे?" },
  diseaseDesc: { en: "Describe your signs (like fever or cough) to know what could be wrong.", hi: "अपनी बीमारी के लक्षणों (जैसे बुखार या खांसी) का वर्णन करें।", mr: "तुमच्या लक्षणांचे (जसे की ताप किंवा खोकला) वर्णन करा." },

  doctor: { en: "For Doctors", hi: "डॉक्टरों के लिए", mr: "डॉक्टरांसाठी" },
  doctorDesc: { en: "Advanced tools for healthcare workers.", hi: "स्वास्थ्य कर्मियों के लिए उन्नत उपकरण।", mr: "आरोग्य कर्मचाऱ्यांसाठी प्रगत साधने." },

  // Shared UI
  searchPlaceholder: { en: "Search medicine name...", hi: "दवा का नाम खोजें...", mr: "औषधाचे नाव शोधा..." },
  startSearching: { en: "Start Searching", hi: "खोजना शुरू करें", mr: "शोध सुरू करा" },
  checkNow: { en: "Check Now", hi: "अभी जांचें", mr: "आता तपासा" },
  startChatting: { en: "Start Chatting", hi: "बातचीत शुरू करें", mr: "गप्पा मारा" },
  reportNow: { en: "Report Now", hi: "अभी रिपोर्ट करें", mr: "आता कळवा" },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");

  const t = (key: string) => {
    if (TRANSLATIONS[key]) {
      return TRANSLATIONS[key][language];
    }
    return key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useI18n must be used within a LanguageProvider");
  }
  return context;
}
