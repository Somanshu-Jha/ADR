// Comprehensive Village-Friendly Mock API
import { useState } from "react";

// Types
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
  },
  { 
    id: "3", name: "Aspirin", genericName: "Acetylsalicylic acid", category: "Blood Thinner / Pain", 
    description: "Used for pain and to prevent heart issues. Avoid if you have stomach ulcers.", 
    manufacturer: "Global Care",
    activeIngredients: ["Acetylsalicylic acid 75mg"],
    indications: ["Heart health", "Mild pain", "Inflammation"],
    contraindications: ["Stomach ulcers", "Bleeding disorders"],
    sideEffects: ["Stomach pain", "Easy bruising", "Heartburn"]
  },
  { 
    id: "4", name: "Metformin", genericName: "Metformin", category: "Diabetes", 
    description: "Helps control blood sugar levels for people with Type 2 Diabetes.", 
    manufacturer: "StayFit Pharma",
    activeIngredients: ["Metformin HCl 500mg"],
    indications: ["Type 2 Diabetes"],
    contraindications: ["Kidney failure", "Lactic acidosis history"],
    sideEffects: ["Metallic taste", "Gas", "Belly pain"]
  },
  { 
    id: "5", name: "Lisinopril", genericName: "Lisinopril", category: "Blood Pressure", 
    description: "Helps lower high blood pressure and protect your heart.", 
    manufacturer: "HeartSafe Inc",
    activeIngredients: ["Lisinopril 10mg"],
    indications: ["High Blood Pressure", "Heart Failure"],
    contraindications: ["Pregnancy", "Angioedema history"],
    sideEffects: ["Dry cough", "Dizziness", "Headache"]
  },
  { 
    id: "6", name: "Warfarin", genericName: "Warfarin", category: "Blood Thinner", 
    description: "Used to prevent blood clots. Requires regular blood tests.", 
    manufacturer: "ClotStop",
    activeIngredients: ["Warfarin Sodium 5mg"],
    indications: ["Blood clot prevention"],
    contraindications: ["Severe bleeding", "Recent surgery"],
    sideEffects: ["Bruising", "Nosebleeds"]
  },
  { 
    id: "7", name: "Ibuprofen", genericName: "Ibuprofen", category: "Pain & Swelling", 
    description: "Relieves pain and reduces swelling from injury or arthritis.", 
    manufacturer: "Relief Pharm",
    activeIngredients: ["Ibuprofen 400mg"],
    indications: ["Swelling", "Mild to Moderate Pain"],
    contraindications: ["Kidney issues", "Stomach ulcers"],
    sideEffects: ["Belly pain", "Nausea"]
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

// SEARCHABLE DRUGS
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

// INTERACTION LOGIC
export const useCheckInteractions = () => {
    const [data, setData] = useState<any>(null);
    const [isPending, setIsPending] = useState(false);

    return {
        mutate: async ({ data: input }: any) => {
            setIsPending(true);
            await new Promise(r => setTimeout(r, 1200));
            
            const drugNames = input.drugs.map((n: string) => n.toLowerCase());
            let result = {
                overallSeverity: "safe",
                interactions: [] as any[],
                warnings: ["Always talk to a doctor before mixing medicines."],
                recommendations: ["Take with a full glass of water."],
                recoveryPlan: null as any
            };

            // Enhanced Logic for demonstration (Aspirin + Warfarin)
            if (drugNames.includes("aspirin") && drugNames.includes("warfarin")) {
                result.overallSeverity = "dangerous";
                result.interactions.push({
                    drug1: "Aspirin", 
                    drug2: "Warfarin", 
                    severity: "dangerous",
                    reactionLabel: "Dangerous Blood Thinning (Internal Bleeding)",
                    explanation: "If you take these together, your blood becomes too thin. This can cause dangerous bleeding inside your body that you cannot see.",
                    alternatives: ["Consult your doctor for a safer heart medicine."]
                });
                
                // Detailed Recovery Plan
                result.recoveryPlan = {
                    problem: "Aspirin + Warfarin Toxicity",
                    composition: "High Salicylate & Anticoagulant Overload",
                    recoveryMedicine: "Vitamin K1 (Phytonadione)",
                    dose: "2.5mg Tablet",
                    duration: "3 days",
                    instructions: "Take with a small snack or milk.",
                    schedule: [
                        { time: "Morning (Breakfast)", icon: "Sunrise", taken: true, timing: "After Food" },
                        { time: "Afternoon (Lunch)", icon: "Sun", taken: false, timing: "No Dose" },
                        { time: "Night (Dinner)", icon: "Moon", taken: false, timing: "No Dose" }
                    ]
                };
            } else if (drugNames.includes("ibuprofen") && drugNames.includes("aspirin")) {
              result.overallSeverity = "moderate";
              result.interactions.push({
                  drug1: "Ibuprofen", 
                  drug2: "Aspirin", 
                  severity: "moderate",
                  reactionLabel: "Heart Protection Interference",
                  explanation: "Ibuprofen can block Aspirin from protecting your heart. Taking them together makes the heart protection weaker.",
                  alternatives: ["Take Ibuprofen 8 hours before or 30 minutes after Aspirin."]
              });

              result.recoveryPlan = {
                  problem: "NSAID Mixture Issues",
                  composition: "Reduced Antiplatelet Efficacy",
                  recoveryMedicine: "Acetaminophen (Paracetamol)",
                  dose: "500mg",
                  duration: "As needed for pain",
                  instructions: "Use this instead of Ibuprofen for simple pain.",
                  schedule: [
                      { time: "Morning (Breakfast)", icon: "Sunrise", taken: true, timing: "After Food" },
                      { time: "Afternoon (Lunch)", icon: "Sun", taken: true, timing: "After Food" },
                      { time: "Night (Dinner)", icon: "Moon", taken: true, timing: "After Food" }
                  ]
              };
            }

            setData(result);
            setIsPending(false);
        },
        data,
        isPending,
        reset: () => setData(null)
    };
};

// SYMPTOM LOGIC
export const usePredictDisease = () => {
  const [data, setData] = useState<any>(null);
  const [isPending, setIsPending] = useState(false);

  return {
      mutate: async () => {
          setIsPending(true);
          await new Promise(r => setTimeout(r, 1200));
          setData({
              predictions: [
                  { 
                    disease: "Simple Cold or Allergy", 
                    urgencyLevel: "low", 
                    confidence: 0.85, 
                    description: "Your symptoms look like a simple cough or cold. Usually goes away with rest.",
                    recommendedAction: "Rest, drink warm water, and keep yourself warm.",
                    medicationConflicts: ["Do not take strong antibiotics without a doctor."]
                  }
              ],
              analysisNotes: "This is a simple guide. If you feel very sick, please see a real doctor immediately."
          });
          setIsPending(false);
      },
      data,
      isPending
  };
};

// SKIN SCAN LOGIC
const SKIN_RESULTS = [
    { 
        disease: "Eczema (Dry/Itchy Patch)", 
        urgencyLevel: "low", 
        confidence: 0.92, 
        description: "This looks like a patch of very dry, itchy skin. It often happens when skin is sensitive to soap or cold weather.",
        recommendedAction: "Apply plain moisturizing cream 3 times a day. Avoid strong soaps.",
        medicationConflicts: ["Avoid using harsh chemical lotions on this area."]
    },
    { 
        disease: "Hives (Allergic Rash)", 
        urgencyLevel: "medium", 
        confidence: 0.88, 
        description: "These look like itchy, raised red bumps. Usually caused by an allergy to food or something you touched.",
        recommendedAction: "Take a simple allergy pill (Antihistamine) and use a cool cloth on the area.",
        medicationConflicts: ["Check if you recently started any new pills."]
    }
];

export const useAnalyzeSkin = () => {
    const [data, setData] = useState<any>(null);
    const [isPending, setIsPending] = useState(false);
  
    return {
        mutate: async (image: string) => {
            setIsPending(true);
            // Simulate deep AI scanning
            await new Promise(r => setTimeout(r, 2500));
            // Randomly pick a result for demo
            const result = SKIN_RESULTS[Math.floor(Math.random() * SKIN_RESULTS.length)];
            setData({ predictions: [result] });
            setIsPending(false);
        },
        data,
        isPending,
        reset: () => setData(null)
    };
};

// DASHBOARD
export const useGetDashboardStats = () => safeMockData({ 
  totalReports: 142, 
  pendingReview: 12, 
  activeAlerts: 3,
  totalDrugs: DRUG_DB.length,
  severeReports: 2,
  dangerousInteractionsChecked: 45,
  severityBreakdown: { mild: 100, moderate: 30, severe: 12 }
});

export const useGetRecentReports = () => safeMockData([
  { id: 1, drugName: 'Paracetamol', reaction: 'Itchy skin', severity: 'MILD', reportedAt: '2025-04-10' },
  { id: 2, drugName: 'Amoxicillin', reaction: 'Stomach Ache', severity: 'MODERATE', reportedAt: '2025-04-12' },
]);

// MULTILINGUAL DATA
const BOT_DATA: any = {
  en: {
    greeting: "Hello! I am your health friend. I can help you understand your medicine. Ask me anything like 'Is Aspirin safe for children?'",
    response: "That is a great question! For **medicine safety**, always remember:\n\n* **Check the dose** printed on the box.\n* **Do not share** pills with others.\n* **Talk to a doctor** if you feel dizzy.",
    placeholder: "Type your health question here..."
  },
  hi: {
    greeting: "नमस्ते! मैं आपका स्वास्थ्य मित्र हूँ। मैं आपको आपकी दवा समझने में मदद कर सकता हूँ। मुझसे कुछ भी पूछें जैसे 'क्या एस्पिरिन बच्चों के लिए सुरक्षित है?'",
    response: "यह एक बेहतरीन सवाल है! **दवा की सुरक्षा** के लिए, हमेशा याद रखें:\n\n* बॉक्स पर छपी **खुराक की जाँच** करें।\n* दूसरों के साथ गोलियां **साझा न करें**।\n* अगर आपको चक्कर आते हैं तो **डॉक्टर से बात करें**।",
    placeholder: "अपनी स्वास्थ्य संबंधी समस्या यहाँ लिखें..."
  },
  bn: {
    greeting: "নমস্কার! আমি আপনার স্বাস্থ্য বন্ধু। আমি আপনাকে আপনার ওষুধ বুঝতে সাহায্য করতে পারি। আমাকে যেকোনো কিছু জিজ্ঞাসা করুন যেমন 'অ্যাসপিরিন কি শিশুদের জন্য নিরাপদ?'",
    response: "এটি একটি চমৎকার প্রশ্ন! **ওষুধের নিরাপত্তার** জন্য, সর্বদা মনে রাখবেন:\n\n* বক্সের ওপর লেখা **ডোজ পরীক্ষা করুন**।\n* অন্যদের সাথে ওষুধ **শেয়ার করবেন না**।\n* আপনার মাথা ঘুরলে **ডাক্তারের সাথে কথা বলুন**।",
    placeholder: "আপনার স্বাস্থ্য প্রশ্ন এখানে লিখুন..."
  },
  te: {
    greeting: "నమస్కారం! నేను మీ ఆరోగ్య మిత్రుడిని. మీ మందుల గురించి మీకు అర్థమయ్యేలా చేయడంలో నేను సహాయపడతాను. 'పిల్లలకు ఆస్పిరిన్ సురక్షితమేనా?' వంటి ఏదైనా నన్ను అడగండి.",
    response: "అది ఒక మంచి ప్రశ్న! **మందుల భద్రత** కోసం, ఎల్లప్పుడూ గుర్తుంచుకోండి:\n\n* బాక్స్‌పై ముద్రించిన **మోతాదును తనిఖీ చేయండి**.\n* ఇతరులతో మాత్రలను **పంచుకోకండి**.\n* మీకు ఏవైనా ఇబ్బందులు అనిపిస్తే **వైద్యుడిని సంప్రదించండి**.",
    placeholder: "మీ ఆరోగ్య సమాచారాన్ని ఇక్కడ అడగండి..."
  },
  mr: {
    greeting: "नमस्कार! मी तुमचा आरोग्य मित्र आहे. मी तुम्हाला तुमचे औषध समजून घेण्यास मदत करू शकतो. मला काहीही विचारा जसे की 'अॅस्पिरिन मुलांसाठी सुरक्षित आहे का?'",
    response: "हा एक खूप चांगला प्रश्न आहे! **औषध सुरक्षेसाठी**, नेहमी लक्षात ठेवा:\n\n* बॉक्सवर छापलेला **डोस तपासा**.\n* इतरांस�  anemia: {
    en: "**Weak Blood (Anemia/Kamjori)**:\n* **Food**: Eat green leafy vegetables, Jaggery (Gur), and Chana.\n* **Pills**: Take Iron-Folic Acid tablets once weekly.\n* **Check**: Visit ASHA worker for Blood Check.",
    hi: "**खून की कमी (कमजोरी/Anemia)**:\n* **भोजन**: हरी पत्तेदार सब्जियां, गुड़ और चना खाएं।\n* **गोलियां**: सप्ताह में एक बार आयरन-फोलिक एसिड की गोली लें।\n* **जांच**: जांच के लिए आशा (ASHA) कार्यकर्ता से मिलें।",
    bn: "**রক্তাল্পতা (উইক ব্লাড)**:\n* **খাবার**: সবুজ শাকসবজি, গুড় এবং ছোলা খান।\n* **ট্যাবলেট**: সপ্তাহে একবার আয়রন-ফলিক অ্যাসিড ট্যাবলেট নিন।\n* **পরীক্ষা**: পরীক্ষার জন্য আশা (ASHA) কর্মীর সাথে দেখা করুন।",
    te: "**రక్తహీనత (Anemia)**:\n* **ఆహారం**: ఆకుకూరలు, బెల్లం మరియు శనగలు తినండి.\n* **మాత్రలు**: వారానికి ఒకసారి ఐరన్-ఫోలిక్ యాసిడ్ టాబ్లెట్ తీసుకోండి.\n* **పరిక్ష**: రక్త పరీక్ష కోసం ఆశా కార్యకర్తను సంప్రదించండి.",
    mr: "**रक्ताची कमतरता (Anemia)**:\n* **अन्न**: हिरव्या पालेभाज्या, गूळ आणि हरभरा खा।\n* **गोळ्या**: आठवड्यातून एकदा लोह-फॉलिक ॲसिडची गोळी घ्या।\n* **तपासणी**: तपासणीसाठी आशा (ASHA) कार्यकर्त्याला भेटा।"
  },
  cough: {
    en: "**Cough & Cold**:\n* **Care**: Drink warm water and do salt-water gargle.\n* **Medicine**: Tulsi-ginger tea or simple cough syrup.\n* **Alert**: If cough has **Blood** or lasts 2 weeks, check for TB.",
    hi: "**खांसी और जुकाम**:\n* **देखभाल**: गुनगुना पानी पिएं और नमक के पानी से गरारे करें।\n* **दवा**: तुलसी-अदरक की चाय या साधारण कफ सिरप।\n* **चेतावनी**: यदि खांसी में **खून** आए या 2 सप्ताह तक रहे, तो टीबी (TB) की जांच कराएं।",
    bn: "**কাশি ও সর্দি**:\n* **যত্ন**: হালকা গরম জল পান করুন এবং নুন জল দিয়ে গার্গল করুন।\n* **ওষুধ**: তুলসী-আদা চা বা সাধারণ কফ সিরাপ।\n* **সতর্কতা**: কাশিতে **রক্ত** থাকলে বা ২ সপ্তাহ থাকলে টিবি (TB) পরীক্ষা করান।",
    te: "**దగ్గు మరియు జలబు**:\n* **రక్షణ**: గోరువెచ్చని నీరు త్రాగండి మరియు ఉప్పు నీటితో పుక్కిలించండి.\n* **మందు**: తులసి-అల్లం టీ లేదా సాధారణ దగ్గు సిరప్.\n* **హెచ్చరిక**: దగ్గులో **రక్తం** పడినా లేదా 2 వారాల కంటే ఎక్కువ ఉన్నా టిబి (TB) పరీక్ష చేయించుకోండి.",
    mr: "**खोकला आणि सर्दी**:\n* **काळजी**: कोमट पाणी प्या आणि मिठाच्या पाण्याने गुळण्या करा।\n* **औषध**: तुळस-आले चहा किंवा साधा कफ सिरप।\n* **इशारा**: खोकल्यातून **रक्त** पडल्यास किंवा २ आठवडे खोकला राहिल्यास टीबी (TB) तपासा।"
  },
  snake_bite: {
    en: "🚨 **SNAKE BITE EMERGENCY!**\n1. Keep the bitten area **STILL & BELOW HEART LEVEL**.\n2. Do NOT cut the wound or try to suck venom.\n3. **GO TO THE HOSPITAL IMMEDIATELY** for Anti-Venom.",
    hi: "🚨 **सांप काटने की इमरजेंसी!**\n1. कटे हुए हिस्से को **स्थिर और हृदय स्तर से नीचे** रखें।\n2. घाव को काटें नहीं या जहर चूसने की कोशिश न करें।\n3. एंटी-वेनम के लिए **तुरंत अस्पताल जाएं**।",
    bn: "🚨 **সাপ কামড়ানোর জরুরি অবস্থা!**\n১. কামড়ানো স্থানটি **স্থির এবং হার্ট লেভেলের নিচে** রাখুন।\n২. ক্ষত কাটবেন না বা বিষ চুষে বের করার চেষ্টা করবেন না।\n৩. অ্যান্টি-ভেনামের জন্য **অবিলম্বে হাসপাতালে যান**।",
    te: "🚨 **పాము కాటు అత్యవసర పరిస్థితి!**\n1. కరిచిన చోట **కదలకుండా గుండె కంటే తక్కువ ఎత్తులో** ఉంచండి.\n2. గాయాన్ని కోయకండి లేదా విషాన్ని పీల్చడానికి ప్రయత్నించకండి.\n3. యాంటీ వీనమ్ కోసం **వెంటనే ఆసుపత్రికి వెళ్లండి**.",
    mr: "🚨 **साप चावल्याची आणीबाणी!**\n१. चावलेला भाग **स्थिर आणि हृदयाच्या पातळीखाली** ठेवा।\n२. जखमेवर काप उभा करू नका किंवा विष चोखण्याचा प्रयत्न करू नका।\n३. प्रतिबंधात्मक लसीसाठी **ताबडतोब रुग्णालयात जा**।"
  }
};

const findBestAIResponse = (query: string, lang: string) => {
  const q = query.toLowerCase();
  let intent = "";

  // Improved Intent Engine with Romanized (English characters) local words
  if (q.includes("fever") || q.includes("bukhar") || q.includes("बुखार") || q.includes("জ্বর") || q.includes("జ్వరం") || q.includes("ताप")) intent = "fever";
  if (q.includes("motion") || q.includes("loose") || q.includes("diarrhea") || q.includes("दस्त") || q.includes("পায়খানা") || q.includes("విరేచనం") || q.includes("जुलाब")) intent = "loose_motion";
  if (q.includes("blood") || q.includes("weak") || q.includes("anemia") || q.includes("kamjori") || q.includes("कमजोरी") || q.includes("রক্ত") || q.includes("బలహీనత") || q.includes("अशक्तपणा")) intent = "anemia";
  if (q.includes("cough") || q.includes("khansi") || q.includes("kashi") || q.includes("daggu") || q.includes("khokla") || q.includes("खोकला")) intent = "cough";
  if (q.includes("snake") || q.includes("bite") || q.includes("saap") || q.includes("saapan") || q.includes("పాము") || q.includes("साप")) intent = "snake_bite";
  if (q.includes("sugar") || q.includes("diabetes") || q.includes("metformin")) intent = "diabetes";
  if (q.includes("chest") || q.includes("breath") || q.includes("emergency") || q.includes("dard")) intent = "emergency";

  if (intent && KNOWLEDGE_BASE[intent]) {
    return KNOWLEDGE_BASE[intent][lang] || KNOWLEDGE_BASE[intent].en;
  }
  return null;
};
�ాలు (Loose Motion)**:\n* **ORS**: 1 లీటరు నీటిలో 1 ప్యాకెట్ కలిపి మెల్లగా త్రాగాలి.\n* **ఆహారం**: గంజి, అన్నం నీరు లేదా పెరుగు తినండి.\n* **ప్రమాదం**: రోగి చాలా బలహీనంగా ఉంటే, క్లినిక్ కి వెళ్లండి.",
    mr: "**जुलाब (Diarrhea)**:\n* **ORS**: १ लिटर पाण्यात १ पाकीट मिसळून हळूहळू प्या।\n* **अन्न**: कांजी, भाताचे पाणी किंवा दही खा।\n* **धोका**: रुग्ण खूप अशक्त झाल्यास क्लिनिकमध्ये जा।"
  },
  anemia: {
    en: "**Weak Blood (Anemia/Kamjori)**:\n* **Food**: Eat green leafy vegetables, Jaggery (Gur), and Chana.\n* **Pills**: Take Iron-Folic Acid tablets once weekly.\n* **Check**: Visit ASHA worker for Blood Check.",
    hi: "**खून की कमी (कमजोरी/Anemia)**:\n* **भोजन**: हरी पत्तेदार सब्जियां, गुड़ और चना खाएं।\n* **गोलियां**: सप्ताह में एक बार आयरन-फोलिक एसिड की गोली लें।\n* **जांच**: जांच के लिए आशा (ASHA) कार्यकर्ता से मिलें।",
    bn: "**রক্তাল্পতা (উইক ব্লাড)**:\n* **খাবার**: সবুজ শাকসবজি, গুড় এবং ছোলা খান।\n* **ট্যাবলেট**: সপ্তাহে একবার আয়রন-ফলিক অ্যাসিড ট্যাবলেট নিন।\n* **পরীক্ষা**: পরীক্ষার জন্য আশা (ASHA) কর্মীর সাথে দেখা করুন।",
    te: "**రక్తహీనత (Anemia)**:\n* **ఆహారం**: ఆకుకూరలు, బెల్లం మరియు శనగలు తినండి.\n* **మాత్రలు**: వారానికి ఒకసారి ఐరన్-ఫోలిక్ యాసిడ్ టాబ్లెట్ తీసుకోండి.\n* **పరీక్ష**: రక్త పరీక్ష కోసం ఆశా కార్యకర్తను సంప్రదించండి.",
    mr: "**रक्ताची कमतरता (Anemia)**:\n* **अन्न**: हिरव्या पालेभाज्या, गूळ आणि हरभरा खा।\n* **गोळ्या**: आठवड्यातून एकदा लोह-फॉलिक ॲसिडची गोळी घ्या।\n* **तपासणी**: तपासणीसाठी आशा (ASHA) कार्यकर्त्याला भेटा।"
  },
  snake_bite: {
    en: "🚨 **SNAKE BITE EMERGENCY!**\n1. Keep the bitten area **STILL & BELOW HEART LEVEL**.\n2. Do NOT cut the wound or try to suck venom.\n3. **GO TO THE HOSPITAL IMMEDIATELY** for Anti-Venom.",
    hi: "🚨 **सांप काटने की इमरजेंसी!**\n1. कटे हुए हिस्से को **स्थिर और हृदय स्तर से नीचे** रखें।\n2. घाव को काटें नहीं या जहर चूसने की कोशिश न करें।\n3. एंटी-वेनम के लिए **तुरंत अस्पताल जाएं**।",
    bn: "🚨 **সাপ কামড়ানোর জরুরি অবস্থা!**\n১. কামড়ানো স্থানটি **স্থির এবং হার্ট লেভেলের নিচে** রাখুন।\n২. ক্ষত কাটবেন না বা বিষ চুষে বের করার চেষ্টা করবেন না।\n৩. অ্যান্টি-ভেনামের জন্য **অবিলম্বে হাসপাতালে যান**।",
    te: "🚨 **పాము కాటు అత్యవసర పరిస్థితి!**\n1. కరిచిన చోట **కదలకుండా గుండె కంటే తక్కువ ఎత్తులో** ఉంచండి.\n2. గాయాన్ని కోయకండి లేదా విషాన్ని పీల్చడానికి ప్రయత్నించకండి.\n3. యాంటీ వీనమ్ కోసం **వెంటనే ఆసుపత్రికి వెళ్లండి**.",
    mr: "🚨 **साप चावल्याची आणीबाणी!**\n१. चावलेला भाग **स्थिर आणि हृदयाच्या पातळीखाली** ठेवा।\n२. जखमेवर काप उभा करू नका किंवा विष चोखण्याचा प्रयत्न करू नका।\n३. प्रतिबंधात्मक लसीसाठी **ताबडतोब रुग्णालयात जा**।"
  }
};

const findBestAIResponse = (query: string, lang: string) => {
  const q = query.toLowerCase();
  let intent = "";

  // Enhanced Intent Engine Mapping
  if (q.includes("fever") || q.includes("बुखार") || q.includes("জ্বর") || q.includes("జ్వరం") || q.includes("ताप")) intent = "fever";
  if (q.includes("motion") || q.includes("loose") || q.includes("diarrhea") || q.includes("दस्त") || q.includes("পায়খানা") || q.includes("విరేచనం") || q.includes("जुलाब")) intent = "loose_motion";
  if (q.includes("blood") || q.includes("weak") || q.includes("anemia") || q.includes("कमजोरी") || q.includes("রক্ত") || q.includes("బలహీనత") || q.includes("अशक्तपणा")) intent = "anemia";
  if (q.includes("snake") || q.includes("bite") || q.includes("सांप") || q.includes("সাপ") || q.includes("పాము") || q.includes("साप")) intent = "snake_bite";
  if (q.includes("sugar") || q.includes("diabetes") || q.includes("मधुमेह") || q.includes("షుగర్") || q.includes("साखर")) intent = "diabetes";
  if (q.includes("chest") || q.includes("breath") || q.includes("emergency") || q.includes("आपातकाल") || q.includes("জরুরি")) intent = "emergency";

  if (intent && KNOWLEDGE_BASE[intent]) {
    return KNOWLEDGE_BASE[intent][lang] || KNOWLEDGE_BASE[intent].en;
  }
  return null;
};

export const useSendChatMessage = () => {
    const [isPending, setIsPending] = useState(false);
    return {
        mutateAsync: async (input: any) => {
            setIsPending(true);
            await new Promise(r => setTimeout(r, 1500));
            const lang = input.language || 'en';
            
            // Intelligence Layer Check
            const aiResponse = findBestAIResponse(input.message, lang);
            const data = BOT_DATA[lang] || BOT_DATA.en;
            
            setIsPending(false);
            return { 
                message: aiResponse || data.response,
                greeting: data.greeting
            };
        },
        isPending,
        getGreeting: (lang: string) => BOT_DATA[lang]?.greeting || BOT_DATA.en.greeting,
        getPlaceholder: (lang: string) => BOT_DATA[lang]?.placeholder || BOT_DATA.en.placeholder
    }
};

export const useCreateAdrReport = () => ({
  mutate: async () => { alert("Thank you! We have received your report."); },
  isPending: false,
  isSuccess: true
});
