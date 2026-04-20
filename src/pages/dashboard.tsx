import React from "react";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MedicalDisclaimer } from "@/components/disclaimer";
import { ArrowRight, Pill, ShieldAlert, BadgeInfo, MessageCircle, Bug, HeartPulse } from "lucide-react";
import { useI18n } from "@/lib/i18n";

// Import local images as icons/visuals
import shelfImg from "@/assets/shelf.png";
import shieldImg from "@/assets/shield.png";
import chatImg from "@/assets/chat.png";
import reportImg from "@/assets/report.png";

export default function Dashboard() {
  const { t } = useI18n();

  const NAV_ACTIONS = [
    {
      id: "drugs",
      title: t("findMed"),
      desc: t("findMedDesc"),
      url: "/drugs",
      image: shelfImg,
      icon: Pill,
      color: "bg-purple-50",
      accent: "text-purple-600",
      gradient: "from-purple-500/10 to-transparent",
    },
    {
      id: "interactions",
      title: t("safeToMix"),
      desc: t("safeToMixDesc"),
      url: "/interactions",
      image: shieldImg,
      icon: ShieldAlert,
      color: "bg-emerald-50",
      accent: "text-emerald-600",
      gradient: "from-emerald-500/10 to-transparent",
    },
    {
      id: "symptoms",
      title: t("disease"),
      desc: t("diseaseDesc"),
      url: "/symptoms",
      icon: HeartPulse,
      color: "bg-amber-50",
      accent: "text-amber-600",
      gradient: "from-amber-500/10 to-transparent",
    },
    {
      id: "chatbot",
      title: t("helper"),
      desc: t("helperDesc"),
      url: "/chatbot",
      image: chatImg,
      icon: MessageCircle,
      color: "bg-blue-50",
      accent: "text-blue-600",
      gradient: "from-blue-500/10 to-transparent",
    },
    {
      id: "report",
      title: t("report"),
      desc: t("reportDesc"),
      url: "/adr-report",
      image: reportImg,
      icon: Bug,
      color: "bg-rose-50",
      accent: "text-rose-600",
      gradient: "from-rose-500/10 to-transparent",
    },
  ];

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-4xl mx-auto pb-20">
      {/* Hero Section */}
      <div className="text-center space-y-4 px-4">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
          {t("welcome")}
        </h1>
        <p className="text-lg md:text-xl text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed">
          {t("tagline")}
        </p>
      </div>

      <div className="px-4">
        <MedicalDisclaimer />
      </div>

      {/* Action Navigation - Vertical List as requested */}
      <nav className="flex flex-col gap-6 px-4">
        {NAV_ACTIONS.map((action, index) => (
          <Link key={action.id} href={action.url}>
            <Card 
              className={`group cursor-pointer overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-500 rounded-[2rem] bg-white active:scale-[0.98] relative p-1`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${action.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />
              
              <CardContent className="p-0 flex items-center h-44 md:h-52 gap-4">
                {/* Visual Area */}
                <div className={`w-32 md:w-48 h-full flex items-center justify-center p-4 md:p-6 shrink-0 relative z-10 rounded-l-[1.8rem] ${action.color}`}>
                  {action.image ? (
                    <img 
                      src={action.image} 
                      alt={action.title} 
                      width={160}
                      height={160}
                      className="w-full h-full object-contain transform group-hover:scale-110 transition-transform duration-700 drop-shadow-md"
                    />
                  ) : (
                    <action.icon className={`w-16 h-16 md:w-20 md:h-20 ${action.accent} opacity-90 group-hover:scale-110 transition-transform duration-700`} />
                  )}
                </div>

                {/* Content Area */}
                <div className="flex-1 p-4 md:p-8 flex flex-col justify-center space-y-2 relative z-10 text-left">
                  <h3 className={`text-2xl md:text-3xl font-bold text-slate-900 group-hover:${action.accent} transition-colors leading-tight`}>
                    {action.title}
                  </h3>
                  <p className="text-slate-500 text-sm md:text-base font-medium line-clamp-2 md:line-clamp-none max-w-md">
                    {action.desc}
                  </p>
                  
                  <div className={`flex items-center gap-2 ${action.accent} font-bold text-sm md:text-base pt-1 md:pt-3 transform group-hover:translate-x-1 transition-transform`}>
                    <span>{t("checkNow")}</span>
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </nav>

      {/* Secondary Doctor Access */}
      <div className="pt-8 px-4 flex justify-center">
        <Link href="/doctor">
          <Button variant="ghost" className="text-slate-400 hover:text-primary transition-colors text-xs font-semibold uppercase tracking-widest gap-2 py-6 px-10 rounded-full border border-dashed border-slate-200">
             {t("doctor")}
          </Button>
        </Link>
      </div>
    </div>
  );
}
