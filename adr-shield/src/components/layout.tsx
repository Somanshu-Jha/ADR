import React from "react";
import { Link, useLocation } from "wouter";
import { Shield, LayoutDashboard, Pill, Activity, AlertTriangle, MessageSquare, Stethoscope } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  SidebarFooter,
} from "@/components/ui/sidebar";

const NAV_ITEMS = [
  { title: "Home", url: "/", icon: LayoutDashboard },
  { title: "Medicine Guide", url: "/drugs", icon: Pill },
  { title: "Is it Safe to Mix?", url: "/interactions", icon: Activity },
  { title: "What is my illness?", url: "/symptoms", icon: Activity },
  { title: "Tell us a Problem", url: "/adr-report", icon: AlertTriangle },
  { title: "Talk to Helper", url: "/chatbot", icon: MessageSquare },
  { title: "For Doctors", url: "/doctor", icon: Stethoscope },
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-background w-full">
        <Sidebar className="border-r border-border bg-sidebar text-sidebar-foreground">
          <SidebarHeader className="p-4 flex flex-row items-center gap-2 border-b border-sidebar-border">
            <Shield className="h-6 w-6 text-primary" />
            <span className="text-lg font-semibold tracking-tight">ADR Shield AI</span>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-medium text-sidebar-foreground/60 uppercase tracking-wider mb-2">Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {NAV_ITEMS.map((item) => (
                    <SidebarMenuItem key={item.url}>
                      <SidebarMenuButton
                        asChild
                        isActive={location === item.url || (item.url !== "/" && location.startsWith(item.url))}
                        className="transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground active:bg-sidebar-accent"
                      >
                        <Link href={item.url} className="flex items-center gap-3">
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter className="p-4 text-xs text-sidebar-foreground/40 border-t border-sidebar-border">
            © 2025 ADR Shield Systems
          </SidebarFooter>
        </Sidebar>

        <main className="relative flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
          {/* Decorative MD3 Background Blurs */}
          <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-[10%] -left-[5%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-3xl mix-blend-multiply" />
            <div className="absolute top-[20%] right-[-10%] w-[40%] h-[50%] rounded-[100px] bg-secondary/30 blur-[100px] mix-blend-multiply" />
            <div className="absolute bottom-[-10%] left-[20%] w-[50%] h-[40%] rounded-full bg-accent/10 blur-[120px] mix-blend-multiply" />
          </div>

          <div className="flex h-14 items-center border-b border-border px-4 lg:hidden sticky top-0 bg-background/80 backdrop-blur-md z-20">
            <SidebarTrigger />
            <div className="flex items-center gap-2 ml-4">
              <Shield className="h-5 w-5 text-primary" />
              <span className="font-semibold">ADR Shield AI</span>
            </div>
          </div>
          <div className="relative z-10 flex-1 p-6 lg:p-8 max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
