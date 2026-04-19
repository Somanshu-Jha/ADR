import { useState } from "react";

export type ChatQueryInputConversationHistoryItem = any;
export type NewAdrReportInputSeverity = any;

const DRUG_DB = [
  { 
    id: "1", name: "Paracetamol", genericName: "Acetaminophen", category: "Pain & Fever", 
    description: "Commonly used for body aches and fever. Gentle on the stomach.", 
    manufacturer: "HealthPlus Pharma",
    activeIngredients: ["Acetaminophen 500mg"],
    indications: ["Headache", "Fever", "Muscle Pain"],
    contraindications: ["Severe Liver issues", "Alcohol abuse"],
    sideEffects: ["Nausea", "Sleepiness", "Rash"]
  },
  { 
    id: "2", name: "Amoxicillin", genericName: "Amoxicillin", category: "Antibiotic", 
    description: "Used to treat bacterial infections. Must finish the full course.", 
    manufacturer: "BioMed Labs",
    activeIngredients: ["Amoxicillin 250mg"],
    indications: ["Ear infection", "Throat infection", "Skin infection"],
    contraindications: ["Penicillin allergy"],
    sideEffects: ["Vomiting", "Diarrhea", "Minor rash"]
  }
];

const safeMockData = (data: any, isLoading = false) => ({
  data,
  isLoading,
  isPending: false,
  isError: false,
  error: null,
  mutate: (vars: any) => { console.log('Mock Mutate:', vars); },
  mutateAsync: async (vars: any) => { 
    console.log('Mock Mutate Async:', vars);
    return data;
  },
});

export const useListDrugs = (params?: { search?: string }) => {
  const searchTerm = params?.search?.toLowerCase() || "";
  const filtered = DRUG_DB.filter(d => 
    d.name.toLowerCase().includes(searchTerm) || 
    d.genericName.toLowerCase().includes(searchTerm) ||
    d.category.toLowerCase().includes(searchTerm)
  );
  return safeMockData(filtered);
};

export const useGetDrug = (id: string | undefined) => {
  const drug = DRUG_DB.find(d => d.id === id) || DRUG_DB[0];
  return safeMockData(drug);
};

export const getGetDrugQueryKey = (id: string | undefined) => ['drug', id];

export const useCheckInteractions = () => {
    const [data, setData] = useState<any>(null);
    const [isPending, setIsPending] = useState(false);

    return {
        mutate: async ({ data: input }: any) => {
            setIsPending(true);
            await new Promise(r => setTimeout(r, 1200));
            setData({
                overallSeverity: "safe",
                interactions: [],
                warnings: ["Always talk to a doctor before mixing medicines."],
                recommendations: ["Take with a full glass of water."],
                recoveryPlan: null
            });
            setIsPending(false);
        },
        data,
        isPending,
        reset: () => setData(null)
    };
};

export const usePredictDisease = () => {
  const [data, setData] = useState<any>(null);
  const [isPending, setIsPending] = useState(false);
  return {
      mutate: async () => {
          setIsPending(true);
          await new Promise(r => setTimeout(r, 1200));
          setData({ predictions: [], analysisNotes: "No predictions." });
          setIsPending(false);
      },
      data,
      isPending
  };
};

export const useAnalyzeSkin = () => {
    const [data, setData] = useState<any>(null);
    const [isPending, setIsPending] = useState(false);
    return {
        mutate: async () => {
            setIsPending(true);
            await new Promise(r => setTimeout(r, 1500));
            setData({ predictions: [] });
            setIsPending(false);
        },
        data,
        isPending,
        reset: () => setData(null)
    };
};

export const useGetDashboardStats = () => safeMockData({ totalReports: 0 });
export const useGetRecentReports = () => safeMockData([]);

const BOT_DATA: any = {
  en: {
    greeting: "Hello!",
    response: "I can help you understand your medicine.",
    placeholder: "Type here..."
  }
};

const KNOWLEDGE_BASE: any = {
  fever: { en: "Rest and drink fluids." }
};

const findBestAIResponse = (query: string, lang: string) => {
  const q = query.toLowerCase();
  if (q.includes("fever")) return KNOWLEDGE_BASE.fever[lang] || KNOWLEDGE_BASE.fever.en;
  return null;
};

export const useSendChatMessage = () => {
    const [isPending, setIsPending] = useState(false);
    return {
        mutateAsync: async (input: any) => {
            setIsPending(true);
            await new Promise(r => setTimeout(r, 1500));
            const lang = input.language || 'en';
            const aiResponse = findBestAIResponse(input.message, lang);
            const data = BOT_DATA[lang] || BOT_DATA.en;
            setIsPending(false);
            return { message: aiResponse || data.response, greeting: data.greeting };
        },
        isPending,
        getGreeting: (lang: string) => BOT_DATA[lang]?.greeting || BOT_DATA.en.greeting,
        getPlaceholder: (lang: string) => BOT_DATA[lang]?.placeholder || BOT_DATA.en.placeholder
    }
};

export const useCreateAdrReport = () => ({
  mutate: async () => { alert("Reported!"); },
  isPending: false,
  isSuccess: true
});
