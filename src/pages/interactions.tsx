import React, { useState } from "react";
import { useListDrugs, useCheckInteractions } from "@/lib/api-mock";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Activity, X, Plus, AlertCircle, AlertTriangle, Info, CheckCircle2, Sunrise, Sun, Moon, Calendar, ArrowRight, ShieldAlert } from "lucide-react";
import { MedicalDisclaimer } from "@/components/disclaimer";
import { SeverityBadge } from "@/components/severity-badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const TimeIcon = ({ icon, className }: { icon: string, className?: string }) => {
  if (icon === "Sunrise") return <Sunrise className={className} />;
  if (icon === "Sun") return <Sun className={className} />;
  if (icon === "Moon") return <Moon className={className} />;
  return <Activity className={className} />;
};

export default function Interactions() {
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
    <div className="space-y-6 animate-in fade-in duration-700 max-w-6xl mx-auto pb-20">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Is it Safe to Mix?</h1>
        <p className="text-slate-500 mt-1">Check if your medicines are safe to take together.</p>
      </div>

      <MedicalDisclaimer />

      <div className="grid gap-6 md:grid-cols-12">
        {/* Left: Selection */}
        <Card className="md:col-span-5 shadow-xl border-0 rounded-[2rem] overflow-hidden bg-white/80 backdrop-blur-sm h-fit">
          <CardHeader className="pb-4">
            <CardTitle>Pick Your Medicines</CardTitle>
            <CardDescription>Add the pills you are taking recently.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label className="font-bold text-slate-700">How old is the patient?</Label>
              <Input 
                type="number" 
                placeholder="e.g. 65" 
                value={patientAge}
                onChange={(e) => setPatientAge(e.target.value)}
                className="h-12 bg-slate-50/50 rounded-xl"
              />
            </div>

            <div className="space-y-3">
              <Label className="font-bold text-slate-700">Add a Medicine</Label>
              <div className="relative">
                <Input 
                  placeholder="Type name here (e.g. Aspirin)..." 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-12 bg-slate-50/50 rounded-xl"
                />
                {debouncedSearch.length > 0 && searchResults && (
                  <div className="absolute z-[100] w-full mt-2 bg-white rounded-2xl border-2 border-primary/20 shadow-2xl max-h-[300px] overflow-auto animate-in slide-in-from-top-2">
                    {searchResults.length > 0 ? (
                      <ul className="p-2 space-y-1">
                        {searchResults.map((drug: any) => (
                          <li key={drug.id}>
                            <button
                              className="w-full text-left px-4 py-3 rounded-xl hover:bg-primary/5 flex items-center justify-between group transition-colors"
                              onClick={() => handleAddDrug({ id: drug.id, name: drug.name })}
                            >
                              <div className="flex flex-col">
                                <span className="font-bold text-slate-900 group-hover:text-primary">{drug.name}</span>
                                <span className="text-slate-500 text-xs">{drug.category}</span>
                              </div>
                              <Plus className="h-5 w-5 text-slate-400 group-hover:text-primary group-hover:scale-110 transition-all" />
                            </button>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="p-6 text-sm text-slate-500 text-center font-medium">No medicines found. Check the spelling.</div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {selectedDrugs.length > 0 && (
              <div className="space-y-3 pt-2">
                <Label className="font-bold text-slate-900">Your List ({selectedDrugs.length})</Label>
                <div className="flex flex-wrap gap-2">
                  {selectedDrugs.map(drug => (
                    <div key={drug.id} className="flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-black border border-primary/20 animate-in bounce-in">
                      {drug.name}
                      <button onClick={() => handleRemoveDrug(drug.id)} className="hover:bg-primary/20 rounded-full p-0.5">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="pt-2">
            <Button 
              className="w-full h-14 rounded-2xl text-lg font-bold shadow-lg shadow-primary/20" 
              onClick={handleCheck} 
              disabled={selectedDrugs.length < 2 || checkInteractions.isPending}
            >
              {checkInteractions.isPending ? "Analysing Pair..." : "Check Mixing Safety"}
            </Button>
          </CardFooter>
        </Card>

        {/* Right: Results */}
        <div className="md:col-span-7 space-y-6">
          {checkInteractions.isPending ? (
            <Card className="shadow-xl border-0 rounded-[2rem] bg-white py-20 flex flex-col items-center justify-center text-center">
              <Activity className="h-16 w-16 text-primary animate-pulse mb-4" />
              <h3 className="text-2xl font-black text-slate-900">Checking Your Safety</h3>
              <p className="text-slate-500 max-w-xs mt-2 font-medium">Our AI is looking for any dangerous chemical reactions between these pills.</p>
            </Card>
          ) : result ? (
            <div className="space-y-6 animate-in slide-in-from-bottom duration-500">
               <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-black text-slate-900">Mixing Report</h2>
                  <SeverityBadge severity={result.overallSeverity} />
               </div>

               {result.interactions.length > 0 && result.interactions.map((interaction: any, idx: number) => (
                 <div key={idx} className="space-y-6">
                    {/* Warning Card */}
                    <Card className={`border-0 border-l-8 shadow-xl rounded-[2rem] overflow-hidden ${
                      interaction.severity === 'dangerous' ? 'border-l-red-500' : 'border-l-amber-500'
                    }`}>
                      <CardHeader className="bg-slate-50/50 pb-4">
                         <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-black uppercase tracking-widest text-slate-400">Serious Warning</span>
                            <SeverityBadge severity={interaction.severity} />
                         </div>
                         <CardTitle className="text-2xl font-black text-slate-900">
                           {interaction.drug1} <span className="text-slate-300"> + </span> {interaction.drug2}
                         </CardTitle>
                         <div className="flex items-center gap-2 text-red-600 font-bold bg-red-50 w-fit px-3 py-1 rounded-lg mt-2">
                            <ShieldAlert className="h-5 w-5" />
                            <span>{interaction.reactionLabel}</span>
                         </div>
                      </CardHeader>
                      <CardContent className="pt-6 space-y-4">
                        <div className="space-y-2">
                           <h4 className="font-black text-xs uppercase tracking-widest text-slate-400">What happens in your body?</h4>
                           <p className="text-lg font-medium text-slate-800 leading-relaxed">{interaction.explanation}</p>
                        </div>
                        
                        {interaction.alternatives && (
                          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                             <span className="text-xs font-black uppercase text-emerald-700 tracking-widest block mb-2">Safer Way</span>
                             <p className="font-bold text-emerald-900">{interaction.alternatives[0]}</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {/* Recovery Dashboard */}
                    {result.recoveryPlan && (
                      <Card className="border-0 shadow-2xl rounded-[2.5rem] bg-gradient-to-br from-slate-900 to-slate-800 text-white overflow-hidden">
                         <CardHeader className="border-b border-white/10 pb-6">
                            <div className="flex items-center gap-3 mb-2">
                               <div className="p-3 bg-primary rounded-2xl">
                                  <Activity className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                   <CardTitle className="text-2xl font-black">Recovery Plan</CardTitle>
                                   <CardDescription className="text-slate-400">Steps to take if you already mixed them.</CardDescription>
                                </div>
                            </div>
                         </CardHeader>
                         <CardContent className="p-8 space-y-8">
                            <div className="grid grid-cols-2 gap-4">
                               <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                                  <span className="text-xs font-black uppercase text-slate-400 tracking-widest block mb-1">Recovery Pill</span>
                                  <p className="text-xl font-bold">{result.recoveryPlan.recoveryMedicine}</p>
                                  <p className="text-primary font-black mt-1">{result.recoveryPlan.dose}</p>
                               </div>
                               <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                                  <span className="text-xs font-black uppercase text-slate-400 tracking-widest block mb-1">Duration</span>
                                  <p className="text-xl font-bold">{result.recoveryPlan.duration}</p>
                                  <div className="flex items-center gap-2 text-slate-400 text-sm mt-1">
                                     <Calendar className="h-4 w-4" />
                                     <span>Full Course</span>
                                  </div>
                               </div>
                            </div>

                            <div className="space-y-4">
                               <h4 className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                                  <Sun className="h-4 w-4" /> When to take?
                               </h4>
                               <div className="grid grid-cols-3 gap-3">
                                  {result.recoveryPlan.schedule.map((s: any, i: number) => (
                                    <div key={i} className={`p-4 rounded-3xl flex flex-col items-center justify-center text-center transition-all ${
                                      s.taken ? 'bg-primary text-white scale-105 shadow-lg shadow-primary/20' : 'bg-white/5 text-slate-500 grayscale opacity-50'
                                    }`}>
                                       <TimeIcon icon={s.icon} className="h-8 w-8 mb-2" />
                                       <span className="text-[10px] font-black uppercase tracking-tighter mb-1 leading-none">{s.time.split(' ')[0]}</span>
                                       <span className="text-xs font-bold leading-none">{s.timing}</span>
                                    </div>
                                  ))}
                               </div>
                            </div>

                            <div className="bg-white/5 p-4 rounded-2xl flex items-start gap-3 border border-white/5">
                               <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                               <p className="text-sm font-medium text-slate-300 italic">" {result.recoveryPlan.instructions} "</p>
                            </div>
                         </CardContent>
                      </Card>
                    )}
                 </div>
               ))}

               {!result.interactions.length && (
                 <Card className="shadow-xl rounded-[2rem] border-0 bg-emerald-500 text-white py-12 px-8 flex flex-col items-center text-center">
                    <CheckCircle2 className="h-16 w-16 mb-4" />
                    <h3 className="text-2xl font-black">All Good!</h3>
                    <p className="font-medium opacity-90 max-w-xs">No dangerous reactions found between these medicines. You can take them together safely.</p>
                 </Card>
               )}
            </div>
          ) : (
            <div className="h-full min-h-[500px] flex flex-col items-center justify-center text-center p-12 bg-white/50 border-2 border-dashed border-slate-200 rounded-[2.5rem]">
              <div className="w-24 h-24 bg-slate-100 rounded-[2.5rem] flex items-center justify-center mb-6">
                <Activity className="h-12 w-12 text-slate-300" />
              </div>
              <h3 className="text-2xl font-black text-slate-800 mb-2">No Analysis Yet</h3>
              <p className="text-slate-500 max-w-sm mx-auto font-medium leading-relaxed">
                Add two or more medicines on the left and click **Check Mixing Safety** to see if they are safe.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
