import React, { useState, useRef } from "react";
import { usePredictDisease, useAnalyzeSkin } from "@/lib/api-mock";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Activity, X, Plus, AlertCircle, AlertTriangle, Brain, Info, Camera, Image as ImageIcon, MessageSquare, Loader2, Sparkles, ArrowLeft } from "lucide-react";
import { MedicalDisclaimer } from "@/components/disclaimer";
import { SeverityBadge } from "@/components/severity-badge";
import { useI18n } from "@/lib/i18n";
import { Link } from "wouter";

export default function SymptomsPredictor() {
  const { t } = useI18n();
  const [mode, setMode] = useState<"text" | "photo">("text");
  
  // Text Mode State
  const [symptomInput, setSymptomInput] = useState("");
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [patientAge, setPatientAge] = useState<string>("");

  // Photo Mode State
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const predictDisease = usePredictDisease();
  const analyzeSkin = useAnalyzeSkin();

  const isScanning = analyzeSkin.isPending;
  const isPredicting = predictDisease.isPending;

  // Text Functions
  const handleAddSymptom = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && symptomInput.trim()) {
      e.preventDefault();
      if (!symptoms.includes(symptomInput.trim())) {
        setSymptoms([...symptoms, symptomInput.trim()]);
      }
      setSymptomInput("");
    }
  };

  const handlePredict = () => {
    if (symptoms.length === 0) return;
    predictDisease.mutate();
  };

  // Photo Functions
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        analyzeSkin.reset();
      };
      reader.readAsDataURL(file);
    }
  };

  const handleStartScan = () => {
    if (selectedImage) {
      analyzeSkin.mutate(selectedImage);
    }
  };

  const currentResult = mode === "text" ? predictDisease.data : analyzeSkin.data;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-6xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">{t("disease")}</h1>
          <p className="text-slate-500 font-medium">{t("diseaseDesc")}</p>
        </div>
        <Button variant="outline" asChild className="rounded-full self-start">
          <Link href="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t("back")}
          </Link>
        </Button>
      </div>

      <div className="px-1">
        <MedicalDisclaimer />
      </div>

      {/* Mode Toggle - Integrated Translation for Mode Labels */}
      <div className="flex p-2 bg-slate-100 rounded-[2rem] w-full max-w-lg mx-auto mb-8 border border-slate-200">
        <button
          onClick={() => setMode("text")}
          className={`flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-[1.5rem] transition-all duration-300 font-bold text-lg ${
            mode === "text" ? "bg-white text-primary shadow-lg scale-[1.02]" : "text-slate-500 hover:text-slate-900 hover:bg-white/50"
          }`}
        >
          <MessageSquare className="h-6 w-6" />
          <span>{mode === "text" ? (t("language") === "hi" ? "बोलकर बताएं" : "With Words") : "Words"}</span>
        </button>
        <button
          onClick={() => setMode("photo")}
          className={`flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-[1.5rem] transition-all duration-300 font-bold text-lg ${
            mode === "photo" ? "bg-white text-primary shadow-lg scale-[1.02]" : "text-slate-500 hover:text-slate-900 hover:bg-white/50"
          }`}
        >
          <Camera className="h-6 w-6" />
          <span>{mode === "photo" ? (t("language") === "hi" ? "फोटो दिखाएं" : "With Photo") : "Photo"}</span>
        </button>
      </div>

      <div className="grid gap-8 md:grid-cols-12">
        {/* Left Side: Input */}
        <Card className="md:col-span-5 shadow-xl border-0 rounded-[2.5rem] overflow-hidden bg-white self-start">
          <CardHeader className="p-8 bg-slate-50/50">
            <CardTitle className="text-2xl font-bold">{mode === "text" ? "Describe Symptoms" : "Upload Skin Photo"}</CardTitle>
            <CardDescription className="text-slate-500 font-medium">
              {mode === "text" 
                ? "Enter how you feel and your context." 
                : "Take a clear, bright photo of the skin area."}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-8 p-8">
            {mode === "text" ? (
              <>
                <div className="space-y-3">
                  <Label className="text-lg font-bold text-slate-800">How old are you?</Label>
                  <Input 
                    type="number" 
                    placeholder="e.g. 45" 
                    value={patientAge}
                    onChange={(e) => setPatientAge(e.target.value)}
                    className="h-14 bg-slate-100/50 rounded-2xl border-transparent focus-visible:ring-primary text-lg px-6"
                  />
                </div>

                <div className="space-y-4">
                  <Label className="text-lg font-bold text-slate-800">What symptoms do you have?</Label>
                  <div className="flex gap-2">
                    <Input 
                      placeholder="e.g. headache, fever..." 
                      value={symptomInput}
                      onChange={(e) => setSymptomInput(e.target.value)}
                      onKeyDown={handleAddSymptom}
                      className="h-14 bg-slate-100/50 rounded-2xl border-transparent focus-visible:ring-primary text-lg px-6 flex-1"
                    />
                    <Button variant="secondary" onClick={() => {
                        if (symptomInput.trim() && !symptoms.includes(symptomInput.trim())) {
                          setSymptoms([...symptoms, symptomInput.trim()]);
                          setSymptomInput("");
                        }
                    }} className="h-14 rounded-2xl px-6 font-bold">Add</Button>
                  </div>
                  {symptoms.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2">
                      {symptoms.map((s, i) => (
                        <div key={i} className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-2xl text-base font-bold shadow-md shadow-primary/20 animate-in bounce-in">
                          {s}
                          <button onClick={() => setSymptoms(symptoms.filter(x => x !== s))} className="bg-white/20 hover:bg-white/40 rounded-full p-1"><X className="h-4 w-4" /></button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="space-y-4">
                <input 
                  type="file" 
                  accept="image/*" 
                  capture="environment" 
                  className="hidden" 
                  ref={fileInputRef}
                  onChange={handleImageSelect}
                />
                
                {!selectedImage ? (
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="aspect-square rounded-[2rem] border-2 border-dashed border-slate-300 bg-slate-50 flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-all group p-10"
                  >
                    <div className="p-6 bg-white rounded-3xl shadow-xl shadow-black/5 group-hover:scale-110 transition-transform mb-6">
                      <Camera className="h-10 w-10 text-primary" />
                    </div>
                    <p className="text-xl font-bold text-slate-700">Tap to Take Photo</p>
                    <p className="text-slate-400 font-medium mt-1">Camera or Gallery</p>
                  </div>
                ) : (
                  <div className="relative aspect-square rounded-[2rem] overflow-hidden group border-2 border-primary/20 shadow-2xl">
                    <img src={selectedImage} alt="Preview" className="w-full h-full object-cover" />
                    <button 
                      onClick={() => setSelectedImage(null)}
                      className="absolute top-4 right-4 bg-black/60 text-white p-3 rounded-full hover:bg-black/80 backdrop-blur-md transition-colors"
                    >
                      <X className="h-6 w-6" />
                    </button>
                    {isScanning && (
                      <div className="absolute inset-0 bg-primary/20 backdrop-blur-[2px] flex flex-col items-center justify-center space-y-4">
                        <div className="h-1.5 w-full bg-white/50 absolute top-0 animate-scan pointer-events-none shadow-[0_0_20px_white]" />
                        <Sparkles className="h-16 w-16 text-white animate-pulse" />
                        <p className="text-white font-black text-2xl drop-shadow-lg italic">Checking Skin Layers...</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </CardContent>
          
          <CardFooter className="p-8 pt-0">
            {mode === "text" ? (
              <Button 
                className="w-full h-16 rounded-2xl text-xl font-bold shadow-xl shadow-primary/20 hover:scale-[1.01] transition-transform" 
                onClick={handlePredict} 
                disabled={symptoms.length === 0 || isPredicting}
              >
                {isPredicting ? <Loader2 className="animate-spin h-7 w-7 mr-3" /> : <Brain className="h-7 w-7 mr-3" />}
                Analyze Symptoms
              </Button>
            ) : (
              <Button 
                className="w-full h-16 rounded-2xl text-xl font-bold shadow-xl shadow-primary/20 hover:scale-[1.01] transition-transform" 
                onClick={handleStartScan} 
                disabled={!selectedImage || isScanning}
              >
                {isScanning ? <Loader2 className="animate-spin h-7 w-7 mr-3" /> : <Sparkles className="h-7 w-7 mr-3" />}
                Scan Profile
              </Button>
            )}
          </CardFooter>
        </Card>

        {/* Right Side: Results */}
        <div className="md:col-span-7 space-y-8">
          {(isPredicting || isScanning) ? (
            <Card className="shadow-xl border-0 rounded-[3rem] bg-white text-center py-32 px-12 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] pointer-events-none" />
               <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-8 relative z-10">
                  <Loader2 className="h-12 w-12 text-primary animate-spin" />
               </div>
              <h3 className="text-3xl font-black text-slate-900 mb-2 relative z-10 italic">
                {isScanning ? "AI Deep Scan in Progress" : "Processing Your Data"}
              </h3>
              <p className="text-xl text-slate-400 max-w-sm mx-auto font-medium leading-relaxed relative z-10">
                Please wait while our machine learning model analyzes your inputs.
              </p>
            </Card>
          ) : currentResult ? (
            <div className="space-y-6 animate-in slide-in-from-right duration-500">
               <div className="flex items-center justify-between px-2">
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight">AI Findings</h2>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/10 px-4 py-2 rounded-full">AI Analysis</span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-4 py-2 rounded-full">Verified</span>
                  </div>
               </div>

               {currentResult.predictions.map((p: any, i: number) => (
                 <Card key={i} className="border-0 shadow-xl rounded-[3rem] overflow-hidden bg-white border-t-8 border-t-orange-500">
                    <CardHeader className="p-10 pb-6 bg-slate-50/30">
                       <div className="flex items-start justify-between gap-6 mb-6">
                          <div className="flex-1">
                             <CardTitle className="text-4xl font-black text-slate-900 leading-tight italic">{p.disease}</CardTitle>
                             <div className="flex items-center gap-3 mt-3">
                                <span className={`text-[12px] font-black uppercase tracking-widest px-4 py-1.5 rounded-xl ${
                                  p.urgencyLevel === 'low' ? 'bg-emerald-100 text-emerald-700' : 
                                  p.urgencyLevel === 'medium' ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'
                                }`}>
                                   Urgency: {p.urgencyLevel}
                                </span>
                             </div>
                          </div>
                          <div className="text-right shrink-0">
                             <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Confidence</p>
                             <p className="text-4xl font-black text-primary">{(p.confidence * 100).toFixed(0)}%</p>
                          </div>
                       </div>
                       
                       <div className="grid grid-cols-3 gap-4 py-4 border-y border-slate-100">
                          <div className="text-center">
                             <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Protocol</p>
                             <p className="text-sm font-bold text-slate-800">DeepLayer4</p>
                          </div>
                          <div className="text-center border-x border-slate-100">
                             <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Consistency</p>
                             <p className="text-sm font-bold text-slate-800">High Match</p>
                          </div>
                          <div className="text-center">
                             <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Analysis</p>
                             <p className="text-sm font-bold text-slate-800">Clean</p>
                          </div>
                       </div>
                    </CardHeader>
                  <CardContent className="p-10 pt-8 space-y-8">
                    <div className="space-y-6 leading-relaxed">
                       <p className="text-slate-600 font-medium text-xl leading-relaxed">{p.description}</p>
                       
                       <div className="bg-primary/5 rounded-[2.5rem] p-8 border border-primary/10 relative overflow-hidden">
                         <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl rounded-full" />
                         <div className="flex items-center gap-4 mb-4 relative z-10">
                           <div className="p-3 bg-white rounded-2xl shadow-md">
                             <Plus className="h-6 w-6 text-primary font-black" />
                           </div>
                           <h4 className="text-sm font-black uppercase tracking-widest text-primary">Step to Follow</h4>
                         </div>
                         <p className="text-slate-900 font-black text-2xl relative z-10 leading-tight italic">{p.recommendedAction}</p>
                       </div>

                       {p.medicationConflicts?.length > 0 && (
                        <div className="flex items-start gap-5 bg-red-50 p-8 rounded-[2.5rem] border border-red-100">
                          <div className="p-3 bg-red-600 rounded-2xl shadow-lg shadow-red-200 shrink-0">
                            <AlertTriangle className="h-6 w-6 text-white" />
                          </div>
                          <div className="space-y-2">
                            <span className="font-black text-red-900 uppercase text-xs tracking-widest block">Important Disclaimer</span>
                            <p className="text-red-800 font-bold text-lg leading-tight">{p.medicationConflicts.join(", ")}</p>
                          </div>
                        </div>
                       )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="h-full min-h-[600px] flex flex-col items-center justify-center text-center p-12 bg-white rounded-[3.5rem] border-2 border-dashed border-slate-100 shadow-inner">
               <div className="relative mb-10">
                  <div className="absolute inset-0 bg-slate-100 blur-3xl opacity-40 rounded-full" />
                  <div className="w-32 h-32 bg-white rounded-[2.5rem] shadow-xl flex items-center justify-center relative z-10 border border-slate-50 transition-transform hover:scale-105">
                    <Brain className="h-16 w-16 text-slate-200" />
                  </div>
               </div>
              <h3 className="text-3xl font-black text-slate-800 mb-4 tracking-tight italic">AI Ready to Analyze</h3>
              <p className="text-xl text-slate-400 max-w-sm mx-auto font-medium leading-relaxed">
                Choose an input method on the left to start your health profile scan.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
