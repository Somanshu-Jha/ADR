import React from "react";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { MedicalDisclaimer } from "@/components/disclaimer";
import { ArrowRight } from "lucide-react";

// Import local images
import shelfImg from "@/assets/shelf.png";
import shieldImg from "@/assets/shield.png";
import chatImg from "@/assets/chat.png";
import reportImg from "@/assets/report.png";

export default function Dashboard() {
  return (
    <div className="space-y-8 animate-in fade-in duration-700 max-w-5xl mx-auto">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 drop-shadow-sm">
          Welcome to ADR Shield
        </h1>
        <p className="text-lg text-slate-500 font-medium max-w-2xl mx-auto">
          We help you stay safe with your medicines. Pick an option below to get started.
        </p>
      </div>

      <MedicalDisclaimer />

      <div className="grid gap-8 md:grid-cols-2">
        {/* Medicine Guide */}
        <Link href="/drugs">
          <Card className="group cursor-pointer overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 rounded-[2.5rem] bg-white active:scale-95">
            <CardContent className="p-0 flex flex-col items-center">
              <div className="w-full h-56 bg-gradient-to-br from-purple-50 to-indigo-50 flex items-center justify-center p-8 overflow-hidden">
                <img 
                  src={shelfImg} 
                  alt="Medicine Shelf" 
                  className="w-full h-full object-contain transform group-hover:scale-110 transition-transform duration-700"
                />
              </div>
              <div className="p-8 w-full text-center space-y-3 bg-gradient-to-b from-transparent to-purple-50/30">
                <h3 className="text-2xl font-bold text-slate-900 group-hover:text-primary transition-colors">
                  Find Your medicine
                </h3>
                <p className="text-slate-500 text-base leading-relaxed">
                  Search for your pills and learn how to take them safely.
                </p>
                <div className="flex items-center justify-center gap-2 text-primary font-bold pt-2">
                  <span>Start Searching</span>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-2 transition-transform" />
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Mix Checker */}
        <Link href="/interactions">
          <Card className="group cursor-pointer overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 rounded-[2.5rem] bg-white active:scale-95">
            <CardContent className="p-0 flex flex-col items-center">
              <div className="w-full h-56 bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-8 overflow-hidden">
                <img 
                  src={shieldImg} 
                  alt="Safety Shield" 
                  className="w-full h-full object-contain transform group-hover:scale-110 transition-transform duration-700"
                />
              </div>
              <div className="p-8 w-full text-center space-y-3 bg-gradient-to-b from-transparent to-green-50/30">
                <h3 className="text-2xl font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                  Is it Safe to Mix?
                </h3>
                <p className="text-slate-500 text-base leading-relaxed">
                  Taking two different pills? Check if they are safe to use together.
                </p>
                <div className="flex items-center justify-center gap-2 text-emerald-600 font-bold pt-2">
                  <span>Check Now</span>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-2 transition-transform" />
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Talk to Helper */}
        <Link href="/chatbot">
          <Card className="group cursor-pointer overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 rounded-[2.5rem] bg-white active:scale-95">
            <CardContent className="p-0 flex flex-col items-center">
              <div className="w-full h-56 bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center p-8 overflow-hidden">
                <img 
                  src={chatImg} 
                  alt="Doctor Assistant" 
                  className="w-full h-full object-contain transform group-hover:scale-110 transition-transform duration-700"
                />
              </div>
              <div className="p-8 w-full text-center space-y-3 bg-gradient-to-b from-transparent to-blue-50/30">
                <h3 className="text-2xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  Talk to Our AI Friend
                </h3>
                <p className="text-slate-500 text-base leading-relaxed">
                  Have a quick question? Our helpful AI is here to answer 24/7.
                </p>
                <div className="flex items-center justify-center gap-2 text-blue-600 font-bold pt-2">
                  <span>Start Chatting</span>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-2 transition-transform" />
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Report Problem */}
        <Link href="/adr-report">
          <Card className="group cursor-pointer overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 rounded-[2.5rem] bg-white active:scale-95">
            <CardContent className="p-0 flex flex-col items-center">
              <div className="w-full h-56 bg-gradient-to-br from-rose-50 to-pink-50 flex items-center justify-center p-8 overflow-hidden">
                <img 
                  src={reportImg} 
                  alt="Report Symptom" 
                  className="w-full h-full object-contain transform group-hover:scale-110 transition-transform duration-700"
                />
              </div>
              <div className="p-8 w-full text-center space-y-3 bg-gradient-to-b from-transparent to-rose-50/30">
                <h3 className="text-2xl font-bold text-slate-900 group-hover:text-rose-600 transition-colors">
                  Tell us a Problem
                </h3>
                <p className="text-slate-500 text-base leading-relaxed">
                  Feeling unwell after taking medicine? Tell us so we can help others.
                </p>
                <div className="flex items-center justify-center gap-2 text-rose-600 font-bold pt-2">
                  <span>Report Now</span>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-2 transition-transform" />
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      <div className="pt-8 pb-12 text-center">
         <p className="text-sm text-slate-400">
           Building a safer future, one pill at a time.
         </p>
      </div>
    </div>
  );
}
