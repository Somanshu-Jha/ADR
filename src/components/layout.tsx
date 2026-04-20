import React from "react";
import { Link, useLocation } from "wouter";
import { Shield, Home, Globe } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { language, setLanguage, t } = useI18n();

  const languages = [
    { code: "en", label: "English" },
    { code: "hi", label: "हिंदी (Hindi)" },
    { code: "mr", label: "मराठी (Marathi)" },
  ];

  const currentLangLabel = languages.find(l => l.code === language)?.label || "English";

  return (
    <div className="flex flex-col min-h-screen bg-background w-full">
      {/* Decorative MD3 Background Blurs */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[5%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-3xl mix-blend-multiply" />
        <div className="absolute top-[20%] right-[-10%] w-[40%] h-[50%] rounded-[100px] bg-secondary/20 blur-[100px] mix-blend-multiply" />
        <div className="absolute bottom-[-10%] left-[20%] w-[50%] h-[40%] rounded-full bg-accent/10 blur-[120px] mix-blend-multiply" />
      </div>

      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
        <div className="container flex h-16 items-center justify-between px-4 md:px-8 max-w-7xl mx-auto">
          <Link href="/" className="flex items-center gap-3 group transition-transform hover:scale-105">
            <div className="bg-primary p-2 rounded-xl shadow-lg shadow-primary/20">
              <Shield className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold tracking-tight text-foreground sm:inline-block hidden">
              {t("safetyShield")}
            </span>
          </Link>

          <div className="flex items-center gap-2 md:gap-4">
            {location !== "/" && (
              <Button variant="ghost" size="sm" asChild className="rounded-full font-medium">
                <Link href="/">
                  <Home className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">{t("home")}</span>
                </Link>
              </Button>
            )}

            <div className="relative group">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Globe className="h-4 w-4 text-primary group-hover:scale-110 transition-transform" />
              </div>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as any)}
                className="appearance-none bg-white/50 border border-primary/20 text-slate-800 text-sm rounded-full focus:ring-primary focus:border-primary block w-full pl-9 pr-8 py-2 font-bold cursor-pointer hover:bg-primary/5 transition-colors shadow-sm"
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code} className="font-medium text-slate-900 bg-white">
                    {lang.label}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                <svg className="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 flex-1 flex flex-col items-center w-full min-w-0">
        <div className="w-full max-w-7xl px-4 py-6 md:px-8 md:py-10">
          {children}
        </div>
      </main>

      <footer className="relative z-10 w-full border-t border-border bg-muted/30 py-8">
        <div className="container flex flex-col items-center text-center gap-4 px-4 max-w-7xl mx-auto">
          <p className="text-sm text-muted-foreground font-medium">
            © 2025 ADR Shield Systems • Building a safer future
          </p>
        </div>
      </footer>
    </div>
  );
}
