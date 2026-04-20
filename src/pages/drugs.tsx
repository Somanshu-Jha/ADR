import React, { useState } from "react";
import { useListDrugs } from "@/lib/api-mock";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Pill, Building, ArrowLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { MedicalDisclaimer } from "@/components/disclaimer";
import { useI18n } from "@/lib/i18n";

export default function DrugsList() {
  const { t } = useI18n();
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const { data: drugs, isLoading } = useListDrugs({ search: debouncedSearch || undefined });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">{t("findMed")}</h1>
          <p className="text-slate-500 font-medium">{t("findMedDesc")}</p>
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

      <div className="relative w-full">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
        <Input 
          placeholder={t("searchPlaceholder")} 
          className="pl-12 h-14 bg-white border-primary/20 focus-visible:ring-primary rounded-2xl text-lg shadow-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 pt-2">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="shadow-sm border-0 bg-white/50 rounded-[2rem]">
              <CardHeader className="p-6 pb-2">
                <Skeleton className="h-7 w-3/4 mb-2 rounded-lg" />
                <Skeleton className="h-4 w-1/2 rounded-lg" />
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <Skeleton className="h-4 w-full mb-2 rounded-lg" />
                <Skeleton className="h-4 w-full mb-6 rounded-lg" />
                <Skeleton className="h-12 w-full rounded-xl" />
              </CardContent>
            </Card>
          ))
        ) : drugs && drugs.length > 0 ? (
          drugs.map((drug: any) => (
            <Card key={drug.id} className="group overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 rounded-[2rem] bg-white flex flex-col">
              <CardHeader className="p-6 pb-2">
                <CardTitle className="flex items-start justify-between gap-4">
                  <span className="text-xl font-bold text-slate-900 group-hover:text-primary transition-colors line-clamp-1">{drug.name}</span>
                  <div className="p-2 bg-primary/10 rounded-xl">
                    <Pill className="h-5 w-5 text-primary shrink-0" />
                  </div>
                </CardTitle>
                <CardDescription className="text-sm font-medium text-slate-400">{drug.genericName}</CardDescription>
              </CardHeader>
              <CardContent className="p-6 pt-0 flex-1 flex flex-col justify-between gap-6">
                <div className="space-y-4">
                  <div className="text-sm text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="font-bold text-slate-800">Category: </span>
                    {drug.category}
                  </div>
                  {drug.manufacturer && (
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 px-1">
                      <Building className="h-3 w-3" />
                      <span className="uppercase tracking-wider">{drug.manufacturer}</span>
                    </div>
                  )}
                </div>
                <Button asChild size="lg" className="w-full rounded-2xl font-bold shadow-lg shadow-primary/20 group-hover:scale-[1.02] transition-transform">
                  <Link href={`/drugs/${drug.id}`}>View Safety Details</Link>
                </Button>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full py-20 text-center bg-white rounded-[3rem] border border-dashed border-slate-200">
            <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
               <Pill className="h-10 w-10 text-slate-300" />
            </div>
            <p className="text-xl font-bold text-slate-700">No drugs found</p>
            <p className="text-slate-400 font-medium">Try searching for simple names like "Aspirin" or "Paracetamol".</p>
          </div>
        )}
      </div>
    </div>
  );
}
