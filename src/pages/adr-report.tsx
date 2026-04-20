import React, { useState } from "react";
import { useCreateAdrReport } from "@/lib/api-mock";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield, CheckCircle2, AlertTriangle, ArrowLeft, Bug } from "lucide-react";
import { MedicalDisclaimer } from "@/components/disclaimer";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useI18n } from "@/lib/i18n";
import { Link } from "wouter";

export default function AdrReportForm() {
  const { t } = useI18n();
  const { toast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const createReport = useCreateAdrReport();

  const [formData, setFormData] = useState({
    drugName: "",
    reaction: "",
    severity: "moderate",
    patientAge: "",
    description: "",
    outcome: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.drugName || !formData.reaction || !formData.description) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    // @ts-ignore - Mock implementation
    createReport.mutate({
      data: {
        ...formData,
        patientAge: formData.patientAge ? parseInt(formData.patientAge) : undefined,
      }
    });
    
    setIsSubmitted(true);
    toast({
      title: "Report Submitted",
      description: "Your report has been received.",
    });
  };

  if (isSubmitted) {
    return (
      <div className="max-w-3xl mx-auto mt-12 animate-in fade-in zoom-in-95 duration-700">
        <Card className="text-center shadow-2xl border-0 rounded-[3rem] bg-white overflow-hidden">
          <CardContent className="pt-16 pb-16 space-y-8 px-10">
            <div className="mx-auto w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/10 animate-bounce">
              <CheckCircle2 className="h-12 w-12" />
            </div>
            <h2 className="text-4xl font-black text-slate-900 italic tracking-tight">Report Received!</h2>
            <p className="text-xl text-slate-500 max-w-md mx-auto font-medium leading-relaxed">
              Thank you for telling us. This helps keep everyone in the village safe. Our medical team will check this information.
            </p>
            <div className="pt-8">
              <Button 
                size="lg"
                className="rounded-2xl px-10 py-8 text-xl font-bold"
                onClick={() => {
                setIsSubmitted(false);
                setFormData({
                  drugName: "",
                  reaction: "",
                  severity: "moderate",
                  patientAge: "",
                  description: "",
                  outcome: ""
                });
              }}>
                Submit Another Problem
              </Button>
            </div>
            <div className="pt-2">
              <Button asChild variant="ghost" className="text-slate-400 font-bold">
                 <Link href="/">Go to Home</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">{t("report")}</h1>
          <p className="text-slate-500 font-medium">{t("reportDesc")}</p>
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

      <Alert className="bg-red-50 border-red-200 text-red-900 rounded-[2rem] p-8">
        <AlertTriangle className="h-6 w-6 text-red-600 mb-2" />
        <AlertTitle className="text-xl font-black italic">Medical Emergency?</AlertTitle>
        <AlertDescription className="text-lg font-medium opacity-80 leading-snug pt-1">
          If you are feeling very sick right now, please **go to the hospital immediately**! This form is only for reporting.
        </AlertDescription>
      </Alert>

      <form onSubmit={handleSubmit}>
        <Card className="shadow-2xl border-0 rounded-[3rem] overflow-hidden bg-white">
          <CardHeader className="p-10 bg-slate-50/50 pb-6 border-b border-slate-100">
            <CardTitle className="flex items-center gap-3 text-2xl font-black italic">
              <div className="p-3 bg-primary rounded-2xl shadow-lg shadow-primary/20">
                 <Bug className="h-6 w-6 text-white" />
              </div>
              Tell us what happened
            </CardTitle>
            <CardDescription className="text-lg font-medium text-slate-400">Everything you say here is private and safe.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-10 p-10">
            <div className="grid gap-8 md:grid-cols-2">
              <div className="space-y-3">
                <Label htmlFor="drugName" className="text-lg font-bold text-slate-800">Which medicine caused it? <span className="text-red-500">*</span></Label>
                <Input 
                  id="drugName" 
                  placeholder="e.g. Paracetamol" 
                  className="h-14 bg-slate-100/50 rounded-2xl border-transparent focus-visible:ring-primary text-lg px-6 shadow-sm"
                  value={formData.drugName}
                  onChange={e => setFormData({...formData, drugName: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="reaction" className="text-lg font-bold text-slate-800">What happened? <span className="text-red-500">*</span></Label>
                <Input 
                  id="reaction" 
                  placeholder="e.g. Itchy skin, Stomach pain" 
                  className="h-14 bg-slate-100/50 rounded-2xl border-transparent focus-visible:ring-primary text-lg px-6 shadow-sm"
                  value={formData.reaction}
                  onChange={e => setFormData({...formData, reaction: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
              <div className="space-y-3">
                <Label htmlFor="severity" className="text-lg font-bold text-slate-800">How bad was it? <span className="text-red-500">*</span></Label>
                <Select 
                  value={formData.severity} 
                  onValueChange={(v: any) => setFormData({...formData, severity: v})}
                >
                  <SelectTrigger id="severity" className="h-14 bg-slate-100/50 rounded-2xl border-transparent focus-visible:ring-primary text-lg px-6 shadow-sm">
                    <SelectValue placeholder="Select severity" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl p-2 shadow-2xl">
                    <SelectItem value="mild" className="rounded-xl py-3 font-medium">Mild (Went away quickly)</SelectItem>
                    <SelectItem value="moderate" className="rounded-xl py-3 font-medium">Moderate (Needed to see a doctor)</SelectItem>
                    <SelectItem value="severe" className="rounded-xl py-3 font-medium text-red-600">Severe (Went to hospital)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-3">
                <Label htmlFor="patientAge" className="text-lg font-bold text-slate-800">Age of patient</Label>
                <Input 
                  id="patientAge" 
                  type="number" 
                  placeholder="e.g. 50" 
                  className="h-14 bg-slate-100/50 rounded-2xl border-transparent focus-visible:ring-primary text-lg px-6 shadow-sm"
                  value={formData.patientAge}
                  onChange={e => setFormData({...formData, patientAge: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="description" className="text-lg font-bold text-slate-800">Write details here <span className="text-red-500">*</span></Label>
              <Textarea 
                id="description" 
                placeholder="Explain what happened in detail..." 
                className="min-h-[160px] bg-slate-100/50 rounded-[2rem] border-transparent focus-visible:ring-primary text-lg p-8 shadow-sm"
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                required
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="outcome" className="text-lg font-bold text-slate-800">How do you feel now?</Label>
              <Input 
                id="outcome" 
                placeholder="e.g. Better now, Still hurting" 
                className="h-14 bg-slate-100/50 rounded-2xl border-transparent focus-visible:ring-primary text-lg px-6 shadow-sm"
                value={formData.outcome}
                onChange={e => setFormData({...formData, outcome: e.target.value})}
              />
            </div>
          </CardContent>
          <CardFooter className="p-10 bg-slate-50 flex items-center justify-between gap-6">
            <span className="text-sm font-bold text-slate-400 italic">Please fill everything.</span>
            <Button 
              type="submit" 
              size="lg"
              className="h-16 rounded-2xl font-black bg-primary px-10 shadow-xl shadow-primary/20 hover:scale-[1.02] transition-transform"
              disabled={createReport.isPending}
            >
              {createReport.isPending ? "Sending..." : "Submit Problem Now"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
