import React, { useState, useRef, useEffect } from "react";
import { useSendChatMessage } from "@/lib/api-mock";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Shield, Send, User, Bot, Languages, AlertCircle, Sparkles, ArrowLeft } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { Link } from "wouter";

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  isDisclaimer?: boolean;
};

export default function Chatbot() {
  const { language: globalLang, t } = useI18n();
  const [input, setInput] = useState("");
  const chatHook = useSendChatMessage();
  
  // Initialize with greeting in the global language
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: chatHook.getGreeting(globalLang)
    }
  ]);

  // Synchronize initial message when global language changes
  useEffect(() => {
    if (messages.length === 1 && messages[0].id === "welcome") {
       setMessages([{
         id: "welcome",
         role: "assistant",
         content: chatHook.getGreeting(globalLang)
       }]);
    }
  }, [globalLang]);

  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const formatText = (text: string) => {
    return text.split('\n').map((line, i) => {
      let content: React.ReactNode = line;
      if (line.includes('**')) {
        const parts = line.split('**');
        content = parts.map((part, index) => index % 2 === 1 ? <strong key={index} className="text-slate-900 font-extrabold">{part}</strong> : part);
      }
      if (line.trim().startsWith('*')) {
        return <li key={i} className="ml-5 list-disc mb-2 text-lg font-medium">{line.replace('*', '').trim()}</li>;
      }
      return <p key={i} className="mb-3 leading-relaxed text-lg font-medium">{content}</p>;
    });
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput("");

    chatHook.mutateAsync({ 
      message: userMsg.content,
      language: globalLang 
    }).then((response) => {
        setMessages(prev => [
          ...prev, 
          {
            id: Date.now().toString() + "-resp",
            role: "assistant",
            content: response.message
          }
        ]);
    });
  };

  return (
    <div className="h-[calc(100vh-10rem)] md:h-[calc(100vh-12rem)] flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-4xl mx-auto w-full pb-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 px-2">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">{t("helper")}</h1>
          <p className="text-slate-500 font-medium italic">{t("helperDesc")}</p>
        </div>
        <Button variant="outline" asChild className="rounded-full self-start">
          <Link href="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t("back")}
          </Link>
        </Button>
      </div>

      <Card className="flex-1 flex flex-col shadow-2xl border-0 rounded-[3rem] overflow-hidden bg-white relative">
        <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 blur-[80px] pointer-events-none" />
        
        <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-6 px-10 relative z-10">
          <CardTitle className="flex items-center gap-3 text-xs font-black text-slate-400 uppercase tracking-[0.2em]">
            <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse" />
            Safe Chat Connected
          </CardTitle>
        </CardHeader>
        
        <CardContent className="flex-1 overflow-hidden p-0 relative z-10">
          <div 
            ref={scrollRef}
            className="absolute inset-0 overflow-y-auto p-8 md:p-10 space-y-10 no-scrollbar scroll-smooth"
          >
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} max-w-[90%] md:max-w-[80%] ${msg.role === 'user' ? 'ml-auto' : ''}`}
              >
                <div className={`flex items-center gap-3 mb-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                   <div className={`h-10 w-10 rounded-2xl flex items-center justify-center shadow-md transition-transform hover:scale-110
                    ${msg.role === 'user' ? 'bg-primary text-white' : 'bg-white border border-slate-100 text-primary'}`}
                  >
                    {msg.role === 'user' ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
                  </div>
                  <span className="text-[10px] font-black uppercase text-slate-300 tracking-widest px-1">
                    {msg.role === 'user' ? 'You' : 'Health Friend'}
                  </span>
                </div>

                <div className={`rounded-[2.5rem] px-8 py-6 shadow-sm border text-left
                  ${msg.role === 'user' 
                    ? 'bg-primary text-white border-primary rounded-tr-none shadow-primary/20' 
                    : 'bg-white text-slate-700 border-slate-100 rounded-tl-none shadow-slate-200/50'
                  }`}
                >
                  <div className="relative">
                    {formatText(msg.content)}
                  </div>
                </div>
              </div>
            ))}
            
            {chatHook.isPending && (
              <div className="flex flex-col items-start max-w-[80%] animate-in fade-in">
                <div className="flex items-center gap-3 mb-3">
                   <div className="h-10 w-10 rounded-2xl bg-white border border-slate-100 text-primary flex items-center justify-center shadow-sm">
                    <Bot className="h-5 w-5 animate-bounce" />
                  </div>
                </div>
                <div className="bg-slate-50 text-slate-400 rounded-[2.5rem] rounded-tl-none px-8 py-6 flex items-center gap-3 border border-slate-100 shadow-inner">
                  <Sparkles className="h-5 w-5 animate-spin-slow text-primary/40" />
                  <span className="text-sm font-black uppercase tracking-widest italic opacity-50">AI is thinking...</span>
                </div>
              </div>
            )}
          </div>
        </CardContent>
        
        <CardFooter className="p-8 bg-white border-t border-slate-100 relative z-10">
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }} 
            className="flex w-full gap-4 bg-slate-100/50 p-3 rounded-[2.5rem] border border-slate-100 ring-offset-8 ring-primary/20 focus-within:ring-4 transition-all shadow-inner"
          >
            <Input 
              placeholder={chatHook.getPlaceholder(globalLang)} 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={chatHook.isPending}
              className="flex-1 bg-transparent border-0 focus-visible:ring-0 text-xl px-6 h-14 font-medium"
            />
            <Button type="submit" disabled={!input.trim() || chatHook.isPending} className="h-14 w-14 rounded-full shadow-xl shadow-primary/30 active:scale-90 transition-transform">
              <Send className="h-6 w-6" />
            </Button>
          </form>
        </CardFooter>
      </Card>
      
      <div className="text-center mt-6">
        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] max-w-sm mx-auto line-height-relaxed px-4">
          Always talk to a real doctor in person. This AI is only for fast help.
        </p>
      </div>
    </div>
  );
}
