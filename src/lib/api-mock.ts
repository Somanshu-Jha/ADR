import { useState } from "react";

export type ChatQueryInputConversationHistoryItem = any;
export type NewAdrReportInputSeverity = any;

const DRUG_DB = [
  // Painkillers & NSAIDs (Non-Steroidal Anti-Inflammatory Drugs)
  { id: "1", name: "Paracetamol", genericName: "Acetaminophen", category: "Pain & Fever", description: "Commonly used for body aches and fever. Gentle on the stomach.", activeIngredients: ["Acetaminophen 500mg"], indications: ["Headache", "Fever", "Muscle Pain"], classes: ["painkiller"] },
  { id: "2", name: "Ibuprofen", genericName: "Ibuprofen", category: "Pain & Inflammation", description: "Reduces pain, swelling, and fever. Should be taken with food.", activeIngredients: ["Ibuprofen 400mg"], indications: ["Body ache", "Swelling", "Fever"], classes: ["nsaid"] },
  { id: "3", name: "Aspirin", genericName: "Acetylsalicylic acid", category: "Pain & Blood Thinner", description: "Relieves pain and also prevents blood clots in low doses.", activeIngredients: ["Aspirin 81mg"], indications: ["Heart protection", "Headache"], classes: ["nsaid", "blood_thinner"] },
  { id: "4", name: "Naproxen", genericName: "Naproxen", category: "Pain & Inflammation", description: "Long-lasting pain relief. Works well for joint pain.", activeIngredients: ["Naproxen 250mg"], indications: ["Joint pain", "Back ache"], classes: ["nsaid"] },
  { id: "5", name: "Diclofenac", genericName: "Diclofenac", category: "Strong Painkiller", description: "Used for severe joint or muscle pain.", activeIngredients: ["Diclofenac 50mg"], indications: ["Severe arthritis", "Muscle injury"], classes: ["nsaid"] },
  { id: "6", name: "Tramadol", genericName: "Tramadol", category: "Strong Painkiller", description: "Prescription pain medicine for moderate to severe pain.", activeIngredients: ["Tramadol 50mg"], indications: ["Severe pain", "Post-surgery pain"], classes: ["opioid", "sedative"] },
  
  // Antibiotics
  { id: "7", name: "Amoxicillin", genericName: "Amoxicillin", category: "Antibiotic", description: "Used to treat many different types of infection caused by bacteria.", activeIngredients: ["Amoxicillin 500mg"], indications: ["Ear infection", "Throat infection"], classes: ["antibiotic"] },
  { id: "8", name: "Ciprofloxacin", genericName: "Ciprofloxacin", category: "Antibiotic", description: "Strong antibiotic used for complex infections.", activeIngredients: ["Ciprofloxacin 500mg"], indications: ["Urinary infections", "Stomach infections"], classes: ["antibiotic"] },
  { id: "9", name: "Azithromycin", genericName: "Azithromycin", category: "Antibiotic", description: "Often given as a Z-Pack for respiratory infections.", activeIngredients: ["Azithromycin 250mg"], indications: ["Chest infection", "Sinus infection"], classes: ["antibiotic"] },
  { id: "10", name: "Doxycycline", genericName: "Doxycycline", category: "Antibiotic", description: "Used for bacterial infections including skin issues and tick bites.", activeIngredients: ["Doxycycline 100mg"], indications: ["Acne", "Lung infections"], classes: ["antibiotic", "sun_sensitive"] },
  { id: "11", name: "Cephalexin", genericName: "Cephalexin", category: "Antibiotic", description: "Commonly used for skin and bone infections.", activeIngredients: ["Cephalexin 500mg"], indications: ["Skin infection", "Wounds"], classes: ["antibiotic"] },

  // Blood Pressure & Heart
  { id: "12", name: "Lisinopril", genericName: "Lisinopril", category: "Blood Pressure", description: "Relaxes blood vessels so blood flows more smoothly.", activeIngredients: ["Lisinopril 10mg"], indications: ["High blood pressure", "Heart protection"], classes: ["blood_pressure"] },
  { id: "13", name: "Amlodipine", genericName: "Amlodipine", category: "Blood Pressure", description: "Calcium channel blocker that helps widen blood vessels.", activeIngredients: ["Amlodipine 5mg"], indications: ["High blood pressure", "Chest pain"], classes: ["blood_pressure"] },
  { id: "14", name: "Losartan", genericName: "Losartan", category: "Blood Pressure", description: "Keeps blood vessels from narrowing, which lowers blood pressure.", activeIngredients: ["Losartan 50mg"], indications: ["High blood pressure"], classes: ["blood_pressure"] },
  { id: "15", name: "Metoprolol", genericName: "Metoprolol", category: "Heart Rate", description: "Beta blocker that slows heart rate and makes it easier for the heart to pump.", activeIngredients: ["Metoprolol 25mg"], indications: ["Fast heart rate", "High blood pressure"], classes: ["blood_pressure", "heart_rate"] },
  { id: "16", name: "Atorvastatin", genericName: "Atorvastatin", category: "Cholesterol", description: "Reduces 'bad' cholesterol and fats in the blood.", activeIngredients: ["Atorvastatin 20mg"], indications: ["High cholesterol"], classes: ["statin"] },
  { id: "17", name: "Warfarin", genericName: "Warfarin", category: "Blood Thinner", description: "Prevents harmful blood clots from forming.", activeIngredients: ["Warfarin 5mg"], indications: ["Prevent strokes", "Clot prevention"], classes: ["blood_thinner"] },
  { id: "18", name: "Clopidogrel", genericName: "Clopidogrel", category: "Blood Thinner", description: "Keeps blood platelets from sticking together to prevent clots.", activeIngredients: ["Clopidogrel 75mg"], indications: ["Heart attack prevention"], classes: ["blood_thinner"] },

  // Diabetes
  { id: "19", name: "Metformin", genericName: "Metformin", category: "Diabetes", description: "Helps control high blood sugar in people with type 2 diabetes.", activeIngredients: ["Metformin 500mg"], indications: ["Type 2 Diabetes", "High blood sugar"], classes: ["antidiabetic"] },
  { id: "20", name: "Glipizide", genericName: "Glipizide", category: "Diabetes", description: "Tells the body to make more insulin to lower blood sugar.", activeIngredients: ["Glipizide 5mg"], indications: ["Type 2 Diabetes"], classes: ["antidiabetic"] },
  { id: "21", name: "Insulin Glargine", genericName: "Insulin", category: "Diabetes", description: "Long-acting insulin to manage blood sugar all day long.", activeIngredients: ["Insulin 100u"], indications: ["Type 1 & 2 Diabetes"], classes: ["antidiabetic"] },

  // Antacids & Digestion
  { id: "22", name: "Omeprazole", genericName: "Omeprazole", category: "Stomach Acid", description: "Decreases the amount of acid made in the stomach.", activeIngredients: ["Omeprazole 20mg"], indications: ["Heartburn", "Acid Reflux"], classes: ["antacid"] },
  { id: "23", name: "Pantoprazole", genericName: "Pantoprazole", category: "Stomach Acid", description: "Treats damage from stomach acid and reduces heartburn.", activeIngredients: ["Pantoprazole 40mg"], indications: ["Heartburn", "Stomach Ulcers"], classes: ["antacid"] },
  { id: "24", name: "Famotidine", genericName: "Famotidine", category: "Stomach Acid", description: "Fast-acting relief for heartburn and indigestion.", activeIngredients: ["Famotidine 20mg"], indications: ["Indigestion", "Heartburn"], classes: ["antacid"] },
  { id: "25", name: "Ondansetron", genericName: "Ondansetron", category: "Anti-Nausea", description: "Blocks the actions of chemicals in the body that can trigger nausea.", activeIngredients: ["Ondansetron 4mg"], indications: ["Nausea", "Vomiting"], classes: ["anti_nausea"] },

  // Allergy & Asthma
  { id: "26", name: "Cetirizine", genericName: "Cetirizine", category: "Allergy", description: "Relieves allergy symptoms like watery eyes, runny nose, and sneezing.", activeIngredients: ["Cetirizine 10mg"], indications: ["Allergies", "Runny Nose"], classes: ["antihistamine"] },
  { id: "27", name: "Loratadine", genericName: "Loratadine", category: "Allergy", description: "Non-drowsy medicine for allergy relief.", activeIngredients: ["Loratadine 10mg"], indications: ["Sneezing", "Allergies"], classes: ["antihistamine"] },
  { id: "28", name: "Diphenhydramine", genericName: "Diphenhydramine", category: "Allergy & Sleep", description: "Treats allergies but often makes people very sleepy.", activeIngredients: ["Diphenhydramine 25mg"], indications: ["Allergies", "Itchy rash", "Trouble sleeping"], classes: ["antihistamine", "sedative"] },
  { id: "29", name: "Albuterol", genericName: "Albuterol", category: "Asthma", description: "Quick-relief inhaler to open breathing passages.", activeIngredients: ["Albuterol Inhaler"], indications: ["Wheezing", "Asthma", "Chest tightness"], classes: ["bronchodilator"] },
  { id: "30", name: "Fluticasone", genericName: "Fluticasone", category: "Allergy/Asthma", description: "Reduces swelling and inflammation in the nose or lungs.", activeIngredients: ["Fluticasone 50mcg"], indications: ["Nasal congestion", "Asthma prevention"], classes: ["steroid"] },

  // Mood & Mental Health
  { id: "31", name: "Sertraline", genericName: "Sertraline", category: "Mental Health", description: "Helps improve mood, sleep, appetite, and energy level.", activeIngredients: ["Sertraline 50mg"], indications: ["Sadness", "Worrying", "Panic attacks"], classes: ["antidepressant", "ssri"] },
  { id: "32", name: "Escitalopram", genericName: "Escitalopram", category: "Mental Health", description: "Restores the balance of serotonin in the brain.", activeIngredients: ["Escitalopram 10mg"], indications: ["General worry", "Sadness"], classes: ["antidepressant", "ssri"] },
  { id: "33", name: "Diazepam", genericName: "Diazepam", category: "Calming", description: "Used to treat severe worry, alcohol withdrawal, and muscle spasms.", activeIngredients: ["Diazepam 5mg"], indications: ["Severe anxiety", "Muscle spasms"], classes: ["sedative"] },
  { id: "34", name: "Alprazolam", genericName: "Alprazolam", category: "Calming", description: "Fast-acting medicine for severe panic and worry.", activeIngredients: ["Alprazolam 0.5mg"], indications: ["Panic attacks", "Extreme worry"], classes: ["sedative"] },
  { id: "35", name: "Zolpidem", genericName: "Zolpidem", category: "Sleep", description: "Helps people fall asleep faster. Can cause extreme grogginess.", activeIngredients: ["Zolpidem 10mg"], indications: ["Trouble sleeping"], classes: ["sedative"] },

  // Others & Supplements
  { id: "36", name: "Levothyroxine", genericName: "Levothyroxine", category: "Thyroid", description: "Replaces a hormone normally produced by your thyroid.", activeIngredients: ["Levothyroxine 50mcg"], indications: ["Low thyroid energy", "Weight gain from thyroid"], classes: ["thyroid"] },
  { id: "37", name: "Prednisone", genericName: "Prednisone", category: "Steroid", description: "Provides relief for inflamed areas of the body. Used for many different conditions.", activeIngredients: ["Prednisone 10mg"], indications: ["Severe allergies", "Skin conditions", "Breathing problems"], classes: ["steroid"] },
  { id: "38", name: "Allopurinol", genericName: "Allopurinol", category: "Gout", description: "Reduces uric acid production in the body.", activeIngredients: ["Allopurinol 100mg"], indications: ["Gout pain", "Kidney stones"], classes: ["gout"] },
  { id: "39", name: "Multivitamin", genericName: "Vitamins", category: "Supplement", description: "Daily vitamin supplement to support general health.", activeIngredients: ["Vitamin A, C, D, E, Zinc"], indications: ["General weakness", "Dietary support"], classes: ["supplement"] },
  { id: "40", name: "Iron Supplement", genericName: "Ferrous Sulfate", category: "Supplement", description: "Used to treat or prevent low blood levels of iron.", activeIngredients: ["Iron 65mg"], indications: ["Tiredness", "Low iron"], classes: ["supplement"] },
  { id: "41", name: "Melatonin", genericName: "Melatonin", category: "Supplement", description: "A natural hormone supplement to help regulate sleep cycles.", activeIngredients: ["Melatonin 5mg"], indications: ["Trouble falling asleep", "Jet lag"], classes: ["sedative"] },
  { id: "42", name: "Calcium + Vitamin D", genericName: "Calcium", category: "Supplement", description: "Strengthens bones and teeth.", activeIngredients: ["Calcium 500mg"], indications: ["Bone health"], classes: ["supplement"] },
  { id: "43", name: "Itraconazole", genericName: "Itraconazole", category: "Antifungal", description: "Treats infections caused by fungus.", activeIngredients: ["Itraconazole 100mg"], indications: ["Fungal infection"], classes: ["antifungal"] },
  { id: "44", name: "Fluconazole", genericName: "Fluconazole", category: "Antifungal", description: "Commonly used for simple yeast infections.", activeIngredients: ["Fluconazole 150mg"], indications: ["Yeast infection"], classes: ["antifungal"] },
  { id: "45", name: "Gabapentin", genericName: "Gabapentin", category: "Nerve Pain", description: "Helps control certain types of seizures and relieves nerve pain.", activeIngredients: ["Gabapentin 300mg"], indications: ["Burning nerve pain", "Shingles pain"], classes: ["sedative", "nerve_pain"] },
  { id: "46", name: "Sildenafil", genericName: "Sildenafil", category: "Blood Flow", description: "Relaxes muscles of the blood vessels and increases blood flow.", activeIngredients: ["Sildenafil 50mg"], indications: ["Blood flow issues"], classes: ["vasodilator"] },
  { id: "47", name: "Diltiazem", genericName: "Diltiazem", category: "Blood Pressure", description: "Calcium channel blocker that relaxes the heart muscle.", activeIngredients: ["Diltiazem 120mg"], indications: ["High blood pressure", "Chest pain"], classes: ["blood_pressure"] },
  { id: "48", name: "Guaifenesin", genericName: "Guaifenesin", category: "Cough", description: "Helps loosen congestion in your chest and throat.", activeIngredients: ["Guaifenesin 400mg"], indications: ["Chest congestion", "Mucus"], classes: ["cough"] },
  { id: "49", name: "Dextromethorphan", genericName: "Dextromethorphan", category: "Cough", description: "Suppresses the urge to cough due to minor throat irritation.", activeIngredients: ["Dextromethorphan 15mg"], indications: ["Dry cough"], classes: ["cough"] },
  { id: "50", name: "Loperamide", genericName: "Loperamide", category: "Digestion", description: "Slows the rhythm of digestion so that the small intestines have more time to absorb fluid.", activeIngredients: ["Loperamide 2mg"], indications: ["Diarrhea"], classes: ["antidiarrheal"] },
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
        mutate: async ({ data: input }: any, options?: any) => {
            setIsPending(true);
            await new Promise(r => setTimeout(r, 1200));
            
            const drugs = (input?.drugs || []).map((name: string) => DRUG_DB.find(db => db.name === name)).filter(Boolean);
            let overallSeverity = "safe";
            let interactions: any[] = [];
            
            const classes = drugs.flatMap((d: any) => d.classes || []);
            const hasClass = (c: string) => classes.includes(c);
            const countClass = (c: string) => classes.filter((x: string) => x === c).length;

            if (hasClass("blood_thinner") && hasClass("nsaid")) {
                overallSeverity = "dangerous";
                interactions.push({
                   severity: "dangerous",
                   drug1: "Blood Thinner (Aspirin/Warfarin)",
                   drug2: "Common Painkiller (Ibuprofen)",
                   reactionLabel: "Internal Bleeding",
                   explanation: "Combining a blood thinner with strong painkillers damages the stomach lining and prevents blood clotting, leading to severe internal bleeding.",
                   alternatives: ["Use Acetaminophen (Paracetamol) for safe pain relief instead."]
                });
            }
            
            if (countClass("sedative") >= 2) {
                overallSeverity = "dangerous";
                interactions.push({
                   severity: "dangerous",
                   drug1: "Sleep Aid/Anxiety Pill",
                   drug2: "Allergy/Pain Medicine",
                   reactionLabel: "Extreme Drowsiness & Breathing Risk",
                   explanation: "Taking multiple medicines that cause sleepiness can dangerously slow down your breathing and make you dizzy enough to fall.",
                   alternatives: ["Space these medicines far apart or ask your doctor to lower the doses."]
                });
            }

            if (hasClass("statin") && hasClass("antifungal")) {
                 overallSeverity = "dangerous";
                 interactions.push({
                   severity: "dangerous",
                   drug1: "Cholesterol Pill",
                   drug2: "Anti-Fungal Medicine",
                   reactionLabel: "Severe Muscle Damage",
                   explanation: "The anti-fungal medicine stops the body from clearing the cholesterol pill, leading to toxic levels that destroy muscle tissue.",
                   alternatives: null
                });
            }

            if (countClass("blood_pressure") >= 2) {
                 overallSeverity = "moderate";
                 interactions.push({
                   severity: "moderate",
                   drug1: "Blood Pressure Med 1",
                   drug2: "Blood Pressure Med 2",
                   reactionLabel: "Dangerous Blood Pressure Drop",
                   explanation: "You are combining multiple medicines that lower blood pressure. It may drop too low, causing you to faint when standing up.",
                   alternatives: ["Monitor your blood pressure daily and stand up slowly."]
                });
            }

            if (hasClass("antacid") && hasClass("antibiotic")) {
                 overallSeverity = "moderate";
                 interactions.push({
                   severity: "moderate",
                   drug1: "Stomach Acid Pill",
                   drug2: "Antibiotic",
                   reactionLabel: "Blocked Antibiotic",
                   explanation: "The stomach pill stops the antibiotic from absorbing properly into your body, making the antibiotic completely useless against your infection.",
                   alternatives: ["Take the stomach pill at least 2 hours apart from the antibiotic."]
                });
            }

            if (countClass("nsaid") >= 2) {
                 overallSeverity = "dangerous";
                 interactions.push({
                   severity: "dangerous",
                   drug1: "Painkiller (Ibuprofen)",
                   drug2: "Painkiller (Naproxen)",
                   reactionLabel: "Stomach Ulcer Risk",
                   explanation: "Taking two different strong painkillers together massively increases the chance of bleeding stomach ulcers without providing extra pain relief.",
                   alternatives: ["Stick to only one painkiller, or alternate with Paracetamol instead."]
                });
            }

            if (hasClass("ssri") && hasClass("nsaid")) {
                 overallSeverity = "moderate";
                 interactions.push({
                   severity: "moderate",
                   drug1: "Mood Medicine",
                   drug2: "Painkiller",
                   reactionLabel: "Increased Bleeding",
                   explanation: "Combining emotional mood stabilizers with strong painkillers can upset the stomach and increase the chance of bleeding easily.",
                   alternatives: ["Consider switching the painkiller to Paracetamol."]
                });
            }

            const resultingData = {
                overallSeverity,
                interactions,
                warnings: [],
                recommendations: [],
                recoveryPlan: overallSeverity === "dangerous" ? {
                   steps: ["Stop taking the less critical medicine immediately.", "Call your doctor or local clinic for advice.", "Do not drive if you feel dizzy or very sleepy."],
                   urgency: "High"
                } : null
            };

            setData(resultingData);
            setIsPending(false);
            if (options?.onSuccess) options.onSuccess(resultingData);
        },
        data,
        isPending,
        reset: () => setData(null)
    };
};

export const useCreateAdrReport = () => {
    const [isPending, setIsPending] = useState(false);
    return {
        mutate: async (data: any, options?: any) => {
            setIsPending(true);
            await new Promise(r => setTimeout(r, 1000));
            setIsPending(false);
            if (options?.onSuccess) options.onSuccess({ id: "REP-" + Math.floor(Math.random()*1000) });
        },
        isPending
    };
};

export const useSendChatMessage = () => {
    const [isPending, setIsPending] = useState(false);
    return {
        mutate: async (data: any, options?: any) => {
            setIsPending(true);
            await new Promise(r => setTimeout(r, 1000));
            setIsPending(false);
            if (options?.onSuccess) options.onSuccess({
                id: "MSG-" + Math.floor(Math.random()*1000),
                content: "This is a simulated AI response. If you have severe symptoms, please contact a doctor immediately.",
                role: "assistant",
                timestamp: new Date().toISOString()
            });
        },
        isPending
    };
};

export const useAnalyzeSkin = () => {
    const [isPending, setIsPending] = useState(false);
    return {
        mutate: async (data: any, options?: any) => {
            setIsPending(true);
            await new Promise(r => setTimeout(r, 2000));
            setIsPending(false);
            if (options?.onSuccess) options.onSuccess({
                prediction: "Eczema / Contact Dermatitis",
                confidence: 85,
                recommendations: ["Avoid harsh soaps", "Apply unscented moisturizer", "Consider a mild hydrocortisone cream if it persists"],
                requiresUrgentCare: false
            });
        },
        isPending
    };
};

export const usePredictDisease = () => {
    const [isPending, setIsPending] = useState(false);
    return {
        mutate: async (data: any, options?: any) => {
            setIsPending(true);
            await new Promise(r => setTimeout(r, 1500));
            setIsPending(false);
            if (options?.onSuccess) options.onSuccess({
                diseases: [
                    { name: "Common Cold", probability: 70 },
                    { name: "Allergic Rhinitis", probability: 55 },
                    { name: "Influenza", probability: 30 }
                ],
                recommendations: ["Rest safely", "Drink plenty of water", "Take over-the-counter fever reducers if needed"],
                severity: "Low"
            });
        },
        isPending
    };
};
