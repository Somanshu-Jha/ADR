import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, Home, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";

export default function NotFound() {
  const { t } = useI18n();

  return (
    <div className="flex-1 w-full flex items-center justify-center p-4">
      <Card className="w-full max-w-xl shadow-2xl border-0 rounded-[3rem] bg-white overflow-hidden text-center">
        <CardContent className="p-12 md:p-20 space-y-8">
          <div className="mx-auto w-24 h-24 bg-red-100 text-red-600 rounded-[2rem] flex items-center justify-center mb-6 shadow-lg shadow-red-500/10 rotate-12 transition-transform hover:rotate-0">
            <AlertCircle className="h-12 w-12" />
          </div>
          <div className="space-y-4">
             <h1 className="text-4xl font-black text-slate-900 tracking-tight italic">Page Not Found</h1>
             <p className="text-xl text-slate-400 font-medium leading-relaxed">
               Sorry, we couldn't find the page you are looking for. It might have been moved or doesn't exist.
             </p>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
             <Button asChild size="lg" className="rounded-2xl px-10 h-16 text-lg font-bold shadow-xl shadow-primary/20 w-full sm:w-auto">
               <Link href="/">
                 <Home className="mr-2 h-5 w-5" />
                 {t("backToHome")}
               </Link>
             </Button>
             <Button asChild variant="ghost" size="lg" className="rounded-2xl px-10 h-16 text-lg font-bold text-slate-400 w-full sm:w-auto">
               <button onClick={() => window.history.back()}>
                 <ArrowLeft className="mr-2 h-5 w-5" />
                 {t("back")}
               </button>
             </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
