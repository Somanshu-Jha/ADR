import React, { useState } from "react";
import { usePredictDisease, useCheckInteractions } from "@/lib/api-mock";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Stethoscope, Activity, FileText, CheckCircle2, ShieldAlert, ArrowLeft, AlertCircle } from "lucide-react";
import { MedicalDisclaimer } from "@/components/disclaimer";
import { SeverityBadge } from "@/components/severity-badge";
import { useI18n } from "@/lib/i18n";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";

export default function DoctorMode() {
  const { t } = useI18n();
  const [patientData, setPatientData] = useState({
    id: "PT-8842-A",
    age: "62",
    sex: "Male",
    weight: "84kg",
    medicalHistory: "Hypertension, Type 2 Diabetes, Mild Osteoarthritis",
    currentMeds: "Lisinopril, Metformin",
    newSymptoms: "Dizziness upon standing, mild nausea, muscle weakness",
    proposedTreatment: "Amlodipine"
  });

  const predictDisease = usePredictDisease();
  const checkInteractions = useCheckInteractions();
  
  const [analysisComplete, setAnalysisComplete] = useState(false);

  const runComprehensiveAnalysis = () => {
    const symptoms = patientData.newSymptoms.split(',').map(s => s.trim());
    const meds = patientData.currentMeds.split(',').map(s => s.trim());
    const allMeds = [...meds, patientData.proposedTreatment].filter(Boolean);

    // @ts-ignore
    predictDisease.mutate({
      data: {
        symptoms,
        currentMedications: meds,
        patientAge: parseInt(patientData.age)
      }
    });

    if (allMeds.length >= 2) {
      // @ts-ignore
      checkInteractions.mutate({
        data: {
          drugs: allMeds,
          patientAge: parseInt(patientData.age),
          conditions: patientData.medicalHistory.split(',').map(s => s.trim())
        }
      });
    }

    setAnalysisComplete(true);
  };

  const isAnalyzing = predictDisease.isPending || checkInteractions.isPending;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-7xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary rounded-2xl shadow-xl shadow-primary/20">
            <Stethoscope className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Clinical Workstation</h1>
            <p className="text-slate-500 font-medium">Expert diagnostic and safety support for doctors.</p>
          </div>
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

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Left: Data Entry */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="shadow-xl border-0 rounded-[2.5rem] overflow-hidden bg-white">
            <CardHeader className="p-8 bg-slate-50/50 border-b border-slate-100">
              <CardTitle className="text-lg font-bold flex items-center justify-between">
                Patient Intake
                <span className="text-[10px] font-black bg-white px-3 py-1 rounded-full border border-slate-200 uppercase tracking-widest text-slate-400">UUID: {patientData.id}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase text-slate-400 tracking-widest">Age</Label>
                  <Input value={patientData.age} onChange={e => setPatientData({...patientData, age: e.target.value})} className="h-10 bg-slate-100/50 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase text-slate-400 tracking-widest">Sex</Label>
                  <Input value={patientData.sex} onChange={e => setPatientData({...patientData, sex: e.target.value})} className="h-10 bg-slate-100/50 rounded-xl" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase text-slate-400 tracking-widest">Medical History</Label>
                <Textarea 
                  value={patientData.medicalHistory} 
                  onChange={e => setPatientData({...patientData, medicalHistory: e.target.value})} 
                  className="min-h-[80px] bg-slate-100/50 rounded-xl p-4 text-sm font-medium" 
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-black uppercase text-slate-400 tracking-widest">Current Medications</Label>
                <Textarea 
                  value={patientData.currentMeds} 
                  onChange={e => setPatientData({...patientData, currentMeds: e.target.value})} 
                  className="min-h-[80px] bg-slate-100/50 rounded-xl p-4 text-sm font-medium" 
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-black uppercase text-slate-400 tracking-widest">Symptoms</Label>
                <Textarea 
                  value={patientData.newSymptoms} 
                  onChange={e => setPatientData({...patientData, newSymptoms: e.target.value})} 
                  className="min-h-[80px] bg-amber-50/50 border-amber-100 rounded-xl p-4 text-sm font-medium" 
                />
              </div>

              <div className="space-y-2 pt-4 border-t border-slate-100">
                <Label className="text-xs font-black uppercase text-primary tracking-widest">Proposed Regimen</Label>
                <Input 
                  value={patientData.proposedTreatment} 
                  onChange={e => setPatientData({...patientData, proposedTreatment: e.target.value})} 
                  className="h-12 border-primary/20 bg-primary/5 rounded-xl font-bold" 
                />
              </div>

              <Button onClick={runComprehensiveAnalysis} className="w-full h-14 rounded-2xl font-bold text-lg shadow-lg shadow-primary/20 group hover:scale-[1.02] transition-transform" disabled={isAnalyzing}>
                {isAnalyzing ? "Processing AI..." : "Run clinical audit"}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right: Analysis Results */}
        <div className="lg:col-span-8">
          {analysisComplete ? (
            <Tabs defaultValue="interactions" className="w-full space-y-6">
              <TabsList className="bg-slate-100 p-1.5 rounded-[2rem] w-full h-auto grid grid-cols-2">
                <TabsTrigger value="interactions" className="rounded-[1.8rem] py-4 font-bold text-lg data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-xl">
                  Medicine Safety
                </TabsTrigger>
                <TabsTrigger value="diagnosis" className="rounded-[1.8rem] py-4 font-bold text-lg data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-xl">
                  Differential Diagnosis
                </TabsTrigger>
              </TabsList>

              <TabsContent value="interactions" className="space-y-6 animate-in slide-in-from-right duration-500">
                {checkInteractions.isPending ? (
                  <Skeleton className="h-[500px] w-full rounded-[3rem]" />
                ) : checkInteractions.data ? (
                  <Card className="shadow-2xl border-0 rounded-[3rem] overflow-hidden bg-white">
                    <CardHeader className="p-10 border-b border-slate-50 bg-slate-50/30">
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <CardTitle className="text-3xl font-black italic tracking-tight">Audit Report</CardTitle>
                          <CardDescription className="text-slate-400 font-medium text-lg mt-1">Combination audit for polypharmacy management.</CardDescription>
                        </div>
                        <SeverityBadge severity={checkInteractions.data.overallSeverity} />
                      </div>
                    </CardHeader>
                    <CardContent className="p-10 space-y-10">
                      {checkInteractions.data.interactions.length > 0 ? (
                        <div className="space-y-6">
                          <h3 className="text-xs font-black uppercase text-slate-300 tracking-[0.3em] pl-1">Flagged Interactions</h3>
                          {checkInteractions.data.interactions.map((interaction: any, i: number) => (
                            <div key={i} className="flex gap-6 p-8 rounded-[2rem] bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                              <div className="shrink-0">
                                {interaction.severity === 'dangerous' ? 
                                  <div className="p-3 bg-red-100 rounded-2xl"><ShieldAlert className="h-6 w-6 text-red-500" /></div> : 
                                  <div className="p-3 bg-amber-100 rounded-2xl"><AlertCircle className="h-6 w-6 text-amber-500" /></div>
                                }
                              </div>
                              <div className="flex-1 space-y-3">
                                <div className="flex flex-wrap items-center gap-3">
                                  <span className="text-xl font-bold text-slate-900">{interaction.drug1}</span>
                                  <span className="text-slate-300 text-xs font-black">X</span>
                                  <span className="text-xl font-bold text-slate-900">{interaction.drug2}</span>
                                  <SeverityBadge severity={interaction.severity} />
                                </div>
                                <p className="text-lg font-medium text-slate-600 leading-relaxed">{interaction.explanation}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex items-center gap-5 p-8 bg-emerald-50 text-emerald-900 rounded-[2.5rem] border border-emerald-100">
                          <CheckCircle2 className="h-8 w-8 text-emerald-600" />
                          <p className="text-xl font-bold italic">No critical interactions detected in proposed regimen.</p>
                        </div>
                      )}

                      {checkInteractions.data.warnings?.length > 0 && (
                        <div className="pt-6 border-t border-slate-50 space-y-6">
                          <h3 className="text-xs font-black uppercase text-slate-300 tracking-[0.3em] pl-1">Clinical Observations</h3>
                          <ul className="grid md:grid-cols-2 gap-4">
                            {checkInteractions.data.warnings.map((w: string, i: number) => (
                              <li key={i} className="text-base font-medium text-slate-500 bg-slate-50 p-5 rounded-2xl flex items-start gap-3">
                                <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
                                {w}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ) : null}
              </TabsContent>

              <TabsContent value="diagnosis" className="space-y-6 animate-in slide-in-from-right duration-500">
                {predictDisease.isPending ? (
                  <Skeleton className="h-[500px] w-full rounded-[3rem]" />
                ) : predictDisease.data ? (
                  <div className="space-y-6">
                    {predictDisease.data.predictions.map((p: any, i: number) => (
                      <Card key={i} className="shadow-xl rounded-[3rem] border-0 overflow-hidden bg-white group">
                        <CardHeader className="p-8 pb-4 border-b border-slate-50 group-hover:bg-primary/5 transition-colors">
                          <div className="flex justify-between items-center">
                            <CardTitle className="text-2xl font-extrabold italic">{p.disease}</CardTitle>
                            <div className="flex items-center gap-3">
                              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Confidence: {(p.confidence * 100).toFixed(0)}%</span>
                              <SeverityBadge severity={p.urgencyLevel} />
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="p-8 space-y-6">
                          <p className="text-xl font-medium text-slate-600 leading-relaxed">{p.description}</p>
                          <div className="bg-primary shadow-lg shadow-primary/20 rounded-[2rem] p-8 text-white relative overflow-hidden">
                             <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl rounded-full" />
                             <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60 block mb-3">Therapeutic Recommendation</span>
                             <span className="text-2xl font-black italic leading-tight">{p.recommendedAction}</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : null}
              </TabsContent>
            </Tabs>
          ) : (
            <div className="h-full min-h-[600px] bg-white rounded-[3.5rem] border-2 border-dashed border-slate-100 shadow-inner flex flex-col items-center justify-center text-center p-16">
              <div className="relative mb-10">
                <div className="absolute inset-0 bg-primary/5 blur-3xl rounded-full animate-pulse" />
                <div className="w-32 h-32 bg-white rounded-[2.5rem] shadow-2xl flex items-center justify-center relative z-10 border border-slate-50 transition-transform hover:rotate-12">
                   <FileText className="h-16 w-16 text-slate-200" />
                </div>
              </div>
              <h3 className="text-3xl font-black text-slate-800 mb-4 tracking-tight italic">Workstation Idle</h3>
              <p className="text-xl text-slate-400 max-w-sm mx-auto font-medium leading-relaxed">
                Provide intake details to calculate pharmacokinetic risks and differential profiles.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
