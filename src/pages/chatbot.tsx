import React, { useState, useRef, useEffect } from "react";
import { useSendChatMessage } from "@/lib/api-mock";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Shield, Send, User, Bot, Languages, AlertCircle, Sparkles } from "lucide-react";

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  isDisclaimer?: boolean;
};

const LANGUAGES = [
  { id: 'en', label: 'English' },
  { id: 'hi', label: 'हिंदी' },
  { id: 'bn', label: 'বাংলা' },
  { id: 'te', label: 'తెలుగు' },
  { id: 'mr', label: 'मराठी' },
];

export default function Chatbot() {
  const [lang, setLang] = useState('en');
  const [input, setInput] = useState("");
  const chatHook = useSendChatMessage();
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: chatHook.getGreeting('en')
    }
  ]);

  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Handle language change
  const handleLangChange = (newLang: string) => {
    setLang(newLang);
    setMessages([{
      id: Date.now().toString(),
      role: "assistant",
      content: chatHook.getGreeting(newLang)
    }]);
  };

  const formatText = (text: string) => {
    // Simple formatter for Bold and Bullets for the demo
    return text.split('\n').map((line, i) => {
      let content: React.ReactNode = line;
      
      // Handle Bold **text**
      if (line.includes('**')) {
        const parts = line.split('**');
        content = parts.map((part, index) => index % 2 === 1 ? <strong key={index} className="text-slate-900 font-black">{part}</strong> : part);
      }

      // Handle Bullets *
      if (line.trim().startsWith('*')) {
        return <li key={i} className="ml-4 list-disc mb-1">{line.replace('*', '').trim()}</li>;
      }

      return <p key={i} className="mb-2 leading-relaxed">{content}</p>;
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
      language: lang 
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
    <div className="h-[calc(100vh-8rem)] flex flex-col animate-in fade-in duration-700 max-w-4xl mx-auto w-full pb-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Health Friend AI</h1>
          <p className="text-slate-500 mt-1 font-medium italic">Your 24/7 medicine helper in your local language.</p>
        </div>

        {/* Language Selector */}
        <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 overflow-x-auto no-scrollbar shadow-inner">
          {LANGUAGES.map((l) => (
            <button
              key={l.id}
              onClick={() => handleLangChange(l.id)}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all whitespace-nowrap ${
                lang === l.id 
                  ? 'bg-white text-primary shadow-sm scale-105' 
                  : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>

      <Card className="flex-1 flex flex-col shadow-2xl border-0 rounded-[2.5rem] overflow-hidden bg-white/80 backdrop-blur-sm border-slate-200">
        <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-4 px-8">
          <CardTitle className="flex items-center gap-2 text-sm font-black text-slate-500 uppercase tracking-widest">
            <Shield className="h-4 w-4 text-primary" />
            Safe Chat Session
          </CardTitle>
        </CardHeader>
        
        <CardContent className="flex-1 overflow-hidden p-0 relative">
          <div 
            ref={scrollRef}
            className="absolute inset-0 overflow-y-auto p-8 space-y-8 no-scrollbar"
          >
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} max-w-[85%] ${msg.role === 'user' ? 'ml-auto' : ''}`}
              >
                <div className={`flex items-center gap-2 mb-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                   <div className={`h-8 w-8 rounded-full flex items-center justify-center shadow-sm
                    ${msg.role === 'user' ? 'bg-primary text-white' : 'bg-white border border-slate-200 text-primary animate-pulse-slow'}`}
                  >
                    {msg.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                  </div>
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-tighter">
                    {msg.role === 'user' ? 'You' : 'Health Friend'}
                  </span>
                </div>

                <div className={`rounded-[2rem] px-6 py-4 shadow-sm border
                  ${msg.role === 'user' 
                    ? 'bg-primary text-white border-primary rounded-tr-none text-right' 
                    : 'bg-white text-slate-600 border-slate-100 rounded-tl-none text-left'
                  }`}
                >
                  <div className="text-lg font-medium leading-relaxed">
                    {formatText(msg.content)}
                  </div>
                </div>
              </div>
            ))}
            
            {chatHook.isPending && (
              <div className="flex flex-col items-start max-w-[80%] animate-in fade-in">
                <div className="flex items-center gap-2 mb-2">
                   <div className="h-8 w-8 rounded-full bg-white border border-slate-200 text-primary flex items-center justify-center">
                    <Bot className="h-4 w-4 animate-bounce" />
                  </div>
                </div>
                <div className="bg-slate-50 text-slate-400 rounded-[2rem] rounded-tl-none px-6 py-4 flex items-center gap-2 border border-slate-100">
                  <Sparkles className="h-4 w-4 animate-spin-slow" />
                  <span className="text-xs font-black uppercase tracking-widest">Thinking...</span>
                </div>
              </div>
            )}
          </div>
        </CardContent>
        
        <CardFooter className="p-6 bg-white border-t border-slate-100">
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }} 
            className="flex w-full gap-3 bg-slate-50 p-2 rounded-[2rem] border border-slate-100 ring-offset-4 ring-primary focus-within:ring-2 transition-all shadow-inner"
          >
            <Input 
              placeholder={chatHook.getPlaceholder(lang)} 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={chatHook.isPending}
              className="flex-1 bg-transparent border-0 focus-visible:ring-0 text-lg px-4 h-12"
            />
            <Button type="submit" disabled={!input.trim() || chatHook.isPending} className="h-12 w-12 rounded-full shadow-lg shadow-primary/20">
              <Send className="h-5 w-5" />
            </Button>
          </form>
        </CardFooter>
      </Card>
      <div className="text-center mt-4">
        <span className="text-xs font-black text-slate-300 uppercase tracking-widest">AI responses are NOT medical advice. Talk to a doctor first.</span>
      </div>
    </div>
  );
}
