"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, Home, FileText, Clock, Pill, MessageSquare, User, BarChart, Brain, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"

const routes = [
  {
    name: "Dashboard",
    path: "/",
    icon: Home,
  },
  {
    name: "Report Analysis",
    path: "/report-analysis",
    icon: FileText,
  },
  {
    name: "Medicine Reminder",
    path: "/medicine-reminder",
    icon: Clock,
  },
  {
    name: "Medicine Alternatives",
    path: "/medicine-alternatives",
    icon: Pill,
  },
  {
    name: "Medical Translator",
    path: "/medical-translator",
    icon: MessageSquare,
  },
  {
    name: "Health Profile",
    path: "/health-profile",
    icon: User,
  },
  {
    name: "Health Insights",
    path: "/health-insights",
    icon: BarChart,
  },
  {
    name: "Mental Health",
    path: "/mental-health",
    icon: Brain,
  },
  {
    name: "Emergency Card",
    path: "/emergency-card",
    icon: AlertTriangle,
  },
]

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b">
        <div className="flex items-center justify-between p-4">
          <Link href="/" className="flex items-center space-x-2">
            <div className="relative w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-blue-500 animate-pulse-slow">
              <div className="absolute inset-1 rounded-full bg-background flex items-center justify-center text-primary font-bold">
                A
              </div>
            </div>
            <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500">
              Arogya
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            {routes.map((route) => (
              <Link
                key={route.path}
                href={route.path}
                className={cn(
                  "flex items-center space-x-1 text-sm font-medium transition-colors hover:text-primary",
                  pathname === route.path ? "text-primary" : "text-muted-foreground",
                )}
              >
                <route.icon className="w-4 h-4" />
                <span>{route.name}</span>
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-2">
            <ModeToggle />
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm md:hidden">
          <div className="flex flex-col h-full p-4">
            <div className="flex items-center justify-between mb-8">
              <Link href="/" className="flex items-center space-x-2">
                <div className="relative w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-blue-500">
                  <div className="absolute inset-1 rounded-full bg-background flex items-center justify-center text-primary font-bold">
                    A
                  </div>
                </div>
                <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500">
                  Arogya
                </span>
              </Link>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                <X className="h-6 w-6" />
                <span className="sr-only">Close menu</span>
              </Button>
            </div>

            <div className="flex flex-col space-y-4">
              {routes.map((route) => (
                <Link
                  key={route.path}
                  href={route.path}
                  className={cn(
                    "flex items-center space-x-2 p-2 rounded-md transition-colors",
                    pathname === route.path ? "bg-primary/10 text-primary" : "hover:bg-primary/5 text-muted-foreground",
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  <route.icon className="w-5 h-5" />
                  <span>{route.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Spacer for fixed navbar */}
      <div className="h-16"></div>
    </>
  )
}
