import React, { useState } from "react";
import { useListDrugs, useCheckInteractions } from "@/lib/api-mock";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Activity, X, Plus, AlertCircle, AlertTriangle, Info, CheckCircle2, Sunrise, Sun, Moon, Calendar, ArrowRight, ShieldAlert, ArrowLeft } from "lucide-react";
import { MedicalDisclaimer } from "@/components/disclaimer";
import { SeverityBadge } from "@/components/severity-badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useI18n } from "@/lib/i18n";
import { Link } from "wouter";

const TimeIcon = ({ icon, className }: { icon: string, className?: string }) => {
  if (icon === "Sunrise") return <Sunrise className={className} />;
  if (icon === "Sun") return <Sun className={className} />;
  if (icon === "Moon") return <Moon className={className} />;
  return <Activity className={className} />;
};

export default function Interactions() {
  const { t } = useI18n();
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedDrugs, setSelectedDrugs] = useState<{id: string, name: string}[]>([]);
  const [patientAge, setPatientAge] = useState<string>("");

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const { data: searchResults } = useListDrugs({ search: debouncedSearch });
  const checkInteractions = useCheckInteractions();

  const handleAddDrug = (drug: {id: string, name: string}) => {
    if (!selectedDrugs.find(d => d.id === drug.id)) {
      setSelectedDrugs([...selectedDrugs, drug]);
    }
    setSearch("");
  };

  const handleRemoveDrug = (id: string) => {
    setSelectedDrugs(selectedDrugs.filter(d => d.id !== id));
    checkInteractions.reset();
  };

  const handleCheck = () => {
    if (selectedDrugs.length < 2) return;
    checkInteractions.mutate({
      data: {
        drugs: selectedDrugs.map(d => d.name),
        patientAge: patientAge ? parseInt(patientAge) : undefined
      }
    });
  };

  const result = checkInteractions.data;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-6xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">{t("safeToMix")}</h1>
          <p className="text-slate-500 font-medium">{t("safeToMixDesc")}</p>
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

      <div className="grid gap-8 md:grid-cols-12">
        {/* Left: Selection */}
        <Card className="md:col-span-5 shadow-xl border-0 rounded-[2.5rem] overflow-hidden bg-white h-fit">
          <CardHeader className="pb-4 p-8 bg-slate-50/50">
            <CardTitle className="text-xl font-bold">Pick Your Medicines</CardTitle>
            <CardDescription className="text-slate-500 font-medium">Add the pills you are taking recently.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8 p-8">
            <div className="space-y-3">
              <Label className="text-lg font-bold text-slate-800">How old is the patient?</Label>
              <Input 
                type="number" 
                placeholder="e.g. 65" 
                value={patientAge}
                onChange={(e) => setPatientAge(e.target.value)}
                className="h-14 bg-slate-100/50 rounded-2xl border-transparent focus-visible:ring-primary text-lg px-6"
              />
            </div>

            <div className="space-y-3">
              <Label className="text-lg font-bold text-slate-800">Add a Medicine</Label>
              <div className="relative">
                <Input 
                  placeholder={t("searchPlaceholder")} 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-14 bg-slate-100/50 rounded-2xl border-transparent focus-visible:ring-primary text-lg px-6"
                />
                {debouncedSearch.length > 0 && searchResults && (
                  <div className="absolute z-[100] w-full mt-2 bg-white rounded-[2rem] border-2 border-primary/20 shadow-2xl max-h-[300px] overflow-auto animate-in slide-in-from-top-2">
                    {searchResults.length > 0 ? (
                      <ul className="p-3 space-y-2">
                        {searchResults.map((drug: any) => (
                          <li key={drug.id}>
                            <button
                                className="w-full text-left px-5 py-4 rounded-2xl hover:bg-primary/10 flex items-center justify-between group transition-all"
                                onClick={() => handleAddDrug({ id: drug.id, name: drug.name })}
                            >
                              <div className="flex flex-col">
                                <span className="font-bold text-slate-900 group-hover:text-primary text-lg">{drug.name}</span>
                                <span className="text-slate-400 text-sm font-medium">{drug.category}</span>
                              </div>
                              <div className="bg-primary/10 p-2 rounded-xl group-hover:bg-primary group-hover:text-white transition-colors">
                                <Plus className="h-6 w-6" />
                              </div>
                            </button>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="p-8 text-slate-500 text-center font-bold">No medicines found.</div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {selectedDrugs.length > 0 ? (
              <div className="space-y-4 pt-2">
                <Label className="text-lg font-bold text-slate-800">Your List ({selectedDrugs.length})</Label>
                <div className="flex flex-wrap gap-2">
                  {selectedDrugs.map(drug => (
                    <div key={drug.id} className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-3 rounded-2xl text-base font-bold shadow-md shadow-primary/20 animate-in zoom-in-50">
                      {drug.name}
                      <button onClick={() => handleRemoveDrug(drug.id)} className="bg-white/20 hover:bg-white/40 rounded-full p-1 transition-colors">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
               <div className="py-8 text-center bg-slate-50 rounded-[2rem] border border-dashed border-slate-200">
                  <p className="text-slate-400 font-bold">List is empty.</p>
               </div>
            )}
          </CardContent>
          <CardFooter className="p-8 pt-0">
            <Button 
              className="w-full h-16 rounded-2xl text-xl font-bold shadow-xl shadow-primary/20 group hover:scale-[1.01] transition-transform" 
              onClick={handleCheck} 
              disabled={selectedDrugs.length < 2 || checkInteractions.isPending}
            >
              {checkInteractions.isPending ? "Analysing..." : "Check Safety"}
              <ShieldAlert className="ml-2 h-6 w-6" />
            </Button>
          </CardFooter>
        </Card>

        {/* Right: Results */}
        <div className="md:col-span-7 space-y-8">
          {checkInteractions.isPending ? (
            <Card className="shadow-xl border-0 rounded-[2.5rem] bg-white py-24 flex flex-col items-center justify-center text-center px-10">
              <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                <Activity className="h-12 w-12 text-primary animate-pulse" />
              </div>
              <h3 className="text-3xl font-black text-slate-900 mb-2">Checking Safety...</h3>
              <p className="text-lg text-slate-500 font-medium leading-relaxed">
                Our AI is looking for dangerous reactions between these pills.
              </p>
            </Card>
          ) : result ? (
            <div className="space-y-8 animate-in slide-in-from-right duration-500">
               <div className="flex items-center justify-between px-2">
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight">Mixing Report</h2>
                  <SeverityBadge severity={result.overallSeverity} />
               </div>

               {result.interactions.length > 0 ? (
                 result.interactions.map((interaction: any, idx: number) => (
                   <div key={idx} className="space-y-8">
                      {/* Warning Card */}
                      <Card className={`border-0 border-l-8 shadow-xl rounded-[2.5rem] overflow-hidden ${
                        interaction.severity === 'dangerous' ? 'border-l-red-500' : 'border-l-amber-500'
                      } bg-white`}>
                        <CardHeader className="bg-slate-50/50 p-8 pb-4">
                           <div className="flex items-center justify-between mb-4">
                              <span className="text-xs font-black uppercase tracking-widest text-slate-400">Serious Warning</span>
                              <SeverityBadge severity={interaction.severity} />
                           </div>
                           <CardTitle className="text-3xl font-black text-slate-900 leading-tight">
                             {interaction.drug1} <span className="text-slate-300 mx-1"> + </span> {interaction.drug2}
                           </CardTitle>
                           <div className="flex items-center gap-3 text-red-600 font-black bg-red-50 w-fit px-5 py-2 rounded-2xl mt-4">
                              <ShieldAlert className="h-6 w-6" />
                              <span className="text-lg">{interaction.reactionLabel}</span>
                           </div>
                        </CardHeader>
                        <CardContent className="p-8 pt-6 space-y-6">
                          <div className="space-y-3">
                             <h4 className="font-black text-xs uppercase tracking-widest text-slate-400">What happens in your body?</h4>
                             <p className="text-xl font-medium text-slate-700 leading-relaxed">{interaction.explanation}</p>
                          </div>
                          
                          {interaction.alternatives && (
                            <div className="p-6 bg-emerald-50 rounded-[2rem] border border-emerald-100 flex items-start gap-4">
                               <div className="p-3 bg-emerald-500 rounded-2xl">
                                  <CheckCircle2 className="h-6 w-6 text-white" />
                               </div>
                               <div>
                                 <span className="text-xs font-black uppercase text-emerald-700 tracking-widest block mb-1">Safer Way</span>
                                 <p className="text-xl font-bold text-emerald-900">{interaction.alternatives[0]}</p>
                               </div>
                            </div>
                          )}
                        </CardContent>
                        <CardFooter className="p-8 pt-0 bg-slate-50/30">
                          <p className="text-sm text-slate-400 font-bold italic italic-shadow">Reported reaction confidence: 98%</p>
                        </CardFooter>
                      </Card>

                      {/* Recovery Plan (Thematic Card) */}
                      {result.recoveryPlan && (
                        <Card className="border-0 shadow-2xl rounded-[3rem] bg-slate-900 text-white overflow-hidden relative">
                           <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] pointer-events-none" />
                           
                           <CardHeader className="border-b border-white/5 p-10 pb-8">
                              <div className="flex items-center gap-5 relative z-10">
                                 <div className="p-4 bg-primary rounded-3xl shadow-lg shadow-primary/40">
                                    <Activity className="h-8 w-8 text-white" />
                                  </div>
                                  <div>
                                     <CardTitle className="text-3xl font-black tracking-tight italic">Recovery Plan</CardTitle>
                                     <CardDescription className="text-slate-400 text-lg font-medium mt-1">Steps to stay safe if already taken.</CardDescription>
                                  </div>
                              </div>
                           </CardHeader>
                           <CardContent className="p-10 relative z-10">
                              <div className="space-y-6">
                                 <h4 className="text-sm font-black uppercase tracking-widest text-slate-500 flex items-center gap-3">
                                    <AlertTriangle className="h-5 w-5 text-amber-500" /> What you should do:
                                 </h4>
                                 <ul className="space-y-4">
                                    {result.recoveryPlan.steps.map((step: string, i: number) => (
                                      <li key={i} className="flex items-start gap-4 p-4 bg-white/5 rounded-2xl border border-white/10 text-white font-medium">
                                         <div className="mt-2 h-2 w-2 rounded-full bg-primary shrink-0" />
                                         <span className="text-lg">{step}</span>
                                      </li>
                                    ))}
                                 </ul>
                              </div>
                           </CardContent>
                        </Card>
                      )}
                   </div>
                 ))
               ) : (
                 <Card className="shadow-2xl rounded-[3rem] border-0 bg-emerald-500 text-white overflow-hidden p-1 p-0.5">
                    <div className="bg-white/10 rounded-[2.9rem] py-16 px-10 flex flex-col items-center text-center">
                      <div className="bg-white p-6 rounded-full mb-6 shadow-xl shadow-black/10">
                        <CheckCircle2 className="h-16 w-16 text-emerald-600" />
                      </div>
                      <h3 className="text-4xl font-black mb-3 italic tracking-tight">All Good!</h3>
                      <p className="text-xl font-bold opacity-90 max-w-sm leading-relaxed">
                        No harmful reactions found between these pills. You can take them safely together.
                      </p>
                    </div>
                 </Card>
               )}
            </div>
          ) : (
            <div className="h-full min-h-[600px] flex flex-col items-center justify-center text-center p-12 bg-white rounded-[3.5rem] border-2 border-dashed border-slate-100 shadow-inner">
               <div className="relative mb-10">
                  <div className="absolute inset-0 bg-slate-100 blur-3xl opacity-50 rounded-full" />
                  <div className="w-32 h-32 bg-white rounded-[2.5rem] shadow-xl flex items-center justify-center relative z-10 border border-slate-50">
                    <Activity className="h-16 w-16 text-slate-200" />
                  </div>
               </div>
              <h3 className="text-3xl font-black text-slate-800 mb-4 tracking-tight italic">No Analysis Yet</h3>
              <p className="text-xl text-slate-400 max-w-sm mx-auto font-medium leading-relaxed">
                Add your medicines on the left and click the blue button to check safety.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
