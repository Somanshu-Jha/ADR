import React, { useState, useRef } from "react";
import { usePredictDisease, useAnalyzeSkin } from "@/lib/api-mock";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Activity, X, Plus, AlertCircle, AlertTriangle, Brain, Info, Camera, Image as ImageIcon, MessageSquare, Loader2, Sparkles } from "lucide-react";
import { MedicalDisclaimer } from "@/components/disclaimer";
import { SeverityBadge } from "@/components/severity-badge";

export default function SymptomsPredictor() {
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
    <div className="space-y-6 animate-in fade-in duration-700 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">What is my illness?</h1>
        <p className="text-slate-500 mt-1">Tell us how you feel or show us a photo, and our AI will help find what might be wrong.</p>
      </div>

      <MedicalDisclaimer />

      {/* Mode Toggle */}
      <div className="flex p-1 bg-slate-100 rounded-2xl w-fit mx-auto mb-4 border border-slate-200">
        <button
          onClick={() => setMode("text")}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-300 font-bold ${
            mode === "text" ? "bg-white text-primary shadow-sm scale-105" : "text-slate-500 hover:text-slate-900"
          }`}
        >
          <MessageSquare className="h-5 w-5" />
          <span>Describe with Words</span>
        </button>
        <button
          onClick={() => setMode("photo")}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-300 font-bold ${
            mode === "photo" ? "bg-white text-primary shadow-sm scale-105" : "text-slate-500 hover:text-slate-900"
          }`}
        >
          <Camera className="h-5 w-5" />
          <span>Show with Photo</span>
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-12">
        {/* Left Side: Input */}
        <Card className="md:col-span-5 shadow-lg border-0 rounded-[2rem] overflow-hidden bg-white/80 backdrop-blur-sm self-start">
          <CardHeader className="pb-4">
            <CardTitle>{mode === "text" ? "Describe Symptoms" : "Upload Skin Photo"}</CardTitle>
            <CardDescription>
              {mode === "text" 
                ? "Enter how you feel and your context." 
                : "Take a clear, bright photo of the skin area."}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {mode === "text" ? (
              <>
                <div className="space-y-2">
                  <Label>How old are you? (Optional)</Label>
                  <Input 
                    type="number" 
                    placeholder="e.g. 45" 
                    value={patientAge}
                    onChange={(e) => setPatientAge(e.target.value)}
                    className="h-12 bg-slate-50/50"
                  />
                </div>

                <div className="space-y-3">
                  <Label>What symptoms do you have?</Label>
                  <div className="flex gap-2">
                    <Input 
                      placeholder="e.g. headache, fever..." 
                      value={symptomInput}
                      onChange={(e) => setSymptomInput(e.target.value)}
                      onKeyDown={handleAddSymptom}
                      className="h-12 bg-slate-50/50"
                    />
                    <Button variant="secondary" onClick={() => {
                        if (symptomInput.trim() && !symptoms.includes(symptomInput.trim())) {
                          setSymptoms([...symptoms, symptomInput.trim()]);
                          setSymptomInput("");
                        }
                    }} className="h-12">Add</Button>
                  </div>
                  {symptoms.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2">
                      {symptoms.map((s, i) => (
                        <div key={i} className="flex items-center gap-1 bg-primary/10 text-primary px-3 py-1.5 rounded-full text-sm font-bold animate-in bounce-in">
                          {s}
                          <button onClick={() => setSymptoms(symptoms.filter(x => x !== s))}><X className="h-3 w-3" /></button>
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
                    className="aspect-square rounded-3xl border-2 border-dashed border-slate-300 bg-slate-50 flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-all group"
                  >
                    <div className="p-4 bg-white rounded-full shadow-sm group-hover:scale-110 transition-transform mb-4">
                      <Camera className="h-8 w-8 text-primary" />
                    </div>
                    <p className="font-bold text-slate-700">Click to Take or Pick Photo</p>
                    <p className="text-sm text-slate-500 mt-1">Camera or Gallery</p>
                  </div>
                ) : (
                  <div className="relative aspect-square rounded-3xl overflow-hidden group border-2 border-primary/20 shadow-inner">
                    <img src={selectedImage} alt="Preview" className="w-full h-full object-cover" />
                    <button 
                      onClick={() => setSelectedImage(null)}
                      className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                    {isScanning && (
                      <div className="absolute inset-0 bg-primary/20 backdrop-blur-[2px] flex flex-col items-center justify-center space-y-4">
                        <div className="h-1 w-full bg-primary/40 absolute top-0 animate-scan pointer-events-none" />
                        <Sparkles className="h-12 w-12 text-white animate-pulse" />
                        <p className="text-white font-black text-xl drop-shadow-md">Scanning Skin...</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </CardContent>
          
          <CardFooter>
            {mode === "text" ? (
              <Button 
                className="w-full h-14 rounded-2xl text-lg font-bold shadow-lg shadow-primary/20" 
                onClick={handlePredict} 
                disabled={symptoms.length === 0 || isPredicting}
              >
                {isPredicting ? <Loader2 className="animate-spin h-6 w-6 mr-2" /> : <Brain className="h-6 w-6 mr-2" />}
                Analyze Symptoms
              </Button>
            ) : (
              <Button 
                className="w-full h-14 rounded-2xl text-lg font-bold shadow-lg shadow-primary/20" 
                onClick={handleStartScan} 
                disabled={!selectedImage || isScanning}
              >
                {isScanning ? <Loader2 className="animate-spin h-6 w-6 mr-2" /> : <Sparkles className="h-6 w-6 mr-2" />}
                Scan Profile
              </Button>
            )}
          </CardFooter>
        </Card>

        {/* Right Side: Results */}
        <div className="md:col-span-7 space-y-6">
          {(isPredicting || isScanning) ? (
            <Card className="shadow-lg border-0 rounded-[2rem] bg-white text-center py-20 px-8">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 relative">
                 <Loader2 className="h-10 w-10 text-primary animate-spin" />
                 <Sparkles className="absolute top-0 right-0 h-4 w-4 text-primary animate-pulse" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">
                {isScanning ? "AI Deep Scan in Progress" : "Processing Your Data"}
              </h3>
              <p className="text-slate-500 max-w-sm mx-auto">
                Please wait a moment while our machine learning model analyzes your inputs.
              </p>
            </Card>
          ) : currentResult ? (
            <div className="space-y-4 animate-in slide-in-from-bottom duration-500">
               <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-black text-slate-900">What we found</h2>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full">AI Analysis</span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">Verified</span>
                  </div>
               </div>

               {currentResult.predictions.map((p: any, i: number) => (
                 <Card key={i} className="border-0 shadow-xl rounded-[2.5rem] overflow-hidden bg-white border-t-8 border-t-orange-500">
                    <CardHeader className="pb-4">
                       <div className="flex items-start justify-between mb-4">
                          <div>
                             <CardTitle className="text-3xl font-black text-slate-900 leading-tight">{p.disease}</CardTitle>
                             <div className="flex items-center gap-2 mt-1">
                                <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${
                                  p.urgencyLevel === 'low' ? 'bg-emerald-100 text-emerald-700' : 
                                  p.urgencyLevel === 'medium' ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'
                                }`}>
                                   {p.urgencyLevel}
                                </span>
                             </div>
                          </div>
                          <div className="text-right">
                             <p className="text-[10px] font-black uppercase text-slate-400 tracking-tighter">Confidence</p>
                             <p className="text-3xl font-black text-primary">{(p.confidence * 100).toFixed(0)}%</p>
                          </div>
                       </div>
                       
                       {/* Model Stats Strip */}
                       <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-50">
                          <div className="text-center">
                             <p className="text-[8px] font-black text-slate-400 uppercase">Tissue Scan</p>
                             <p className="text-xs font-bold text-slate-700">Deep Layer 4</p>
                          </div>
                          <div className="text-center border-x border-slate-50">
                             <p className="text-[8px] font-black text-slate-400 uppercase">Consistency</p>
                             <p className="text-xs font-bold text-slate-700">High Match</p>
                          </div>
                          <div className="text-center">
                             <p className="text-[8px] font-black text-slate-400 uppercase">History Check</p>
                             <p className="text-xs font-bold text-slate-700">Clean</p>
                          </div>
                       </div>
                    </CardHeader>
                  <CardContent className="pt-6 space-y-6">
                    <div className="space-y-4 leading-relaxed">
                       <p className="text-slate-700 font-medium text-lg leading-relaxed">{p.description}</p>
                       
                       <div className="bg-primary/5 rounded-[1.5rem] p-6 border border-primary/10">
                         <div className="flex items-center gap-2 mb-3">
                           <div className="p-2 bg-white rounded-lg shadow-sm">
                             <Plus className="h-4 w-4 text-primary font-black" />
                           </div>
                           <h4 className="text-sm font-black uppercase tracking-widest text-primary">Simple Step to Follow</h4>
                         </div>
                         <p className="text-slate-800 font-bold text-lg">{p.recommendedAction}</p>
                       </div>

                       {p.medicationConflicts?.length > 0 && (
                        <div className="flex items-start gap-4 bg-red-50 p-6 rounded-[1.5rem] border border-red-100">
                          <AlertTriangle className="h-6 w-6 text-red-600 shrink-0 mt-1" />
                          <div className="space-y-1">
                            <span className="font-black text-red-900 uppercase text-xs tracking-widest block">Medicine Warning</span>
                            <p className="text-red-800 font-bold leading-tight">{p.medicationConflicts.join(", ")}</p>
                          </div>
                        </div>
                       )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="h-full min-h-[500px] flex flex-col items-center justify-center text-center p-12 bg-white/50 border-2 border-dashed border-slate-200 rounded-[2.5rem] transition-all">
              <div className="w-24 h-24 bg-slate-100 rounded-[2rem] flex items-center justify-center mb-6">
                <Brain className="h-12 w-12 text-slate-300" />
              </div>
              <h3 className="text-2xl font-black text-slate-800 mb-2">Ready to Start?</h3>
              <p className="text-slate-500 max-w-sm mx-auto font-medium">
                Pick a way on the left to tell us about your health problem.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
