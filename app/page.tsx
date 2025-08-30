import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { FileText, Clock, Pill, MessageSquare, User, BarChart, Brain, ArrowRight, AlertTriangle, Upload } from "lucide-react"

export default function Home() {
  const features = [
    {
      title: "Medical Report Analysis",
      description: "Upload medical reports and get simplified explanations",
      icon: FileText,
      color: "from-blue-500 to-cyan-400",
      link: "/report-analysis",
    },
    {
      title: "Medicine Reminder",
      description: "Set reminders for your medications",
      icon: Clock,
      color: "from-green-500 to-emerald-400",
      link: "/medicine-reminder",
    },
    {
      title: "Medicine Alternatives",
      description: "Find cheaper alternatives for your medications",
      icon: Pill,
      color: "from-purple-500 to-indigo-400",
      link: "/medicine-alternatives",
    },
    {
      title: "Medical Translator",
      description: "Simplify complex medical terms in multiple languages",
      icon: MessageSquare,
      color: "from-orange-500 to-amber-400",
      link: "/medical-translator",
    },
    {
      title: "Health Profile",
      description: "Create and manage your health profile",
      icon: User,
      color: "from-pink-500 to-rose-400",
      link: "/health-profile",
    },
    {
      title: "Health Insights",
      description: "Get personalized health insights and recommendations",
      icon: BarChart,
      color: "from-red-500 to-pink-400",
      link: "/health-insights",
    },
    {
      title: "Mental Health Tracker",
      description: "Track your mood and get supportive responses",
      icon: Brain,
      color: "from-violet-500 to-purple-400",
      link: "/mental-health",
    },
    {
      title: "Emergency Health Card",
      description: "Create a shareable emergency medical information card",
      icon: AlertTriangle,
      color: "from-red-500 to-orange-400",
      link: "/emergency-card",
    },
    {
      title: "Chatbot",
      description: "Get empathetic advice for your symptoms or feelings",
      icon: MessageSquare,
      color: "from-blue-500 to-cyan-400",
      link: "/chatbot",
    },
  ]

  return (
    <main className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-background to-background -z-10"></div>
        <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-br from-purple-600/20 to-blue-600/20 blur-3xl -z-10"></div>

        <div className="container px-4 py-16 md:py-24">
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
            <div className="inline-block animate-float">
              <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-blue-500 animate-pulse-slow">
                <div className="absolute inset-2 rounded-full bg-background flex items-center justify-center text-primary font-bold text-2xl">
                  A
                </div>
              </div>
            </div>

            <h1 className="mt-6 text-4xl md:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-blue-500 to-purple-600 animate-gradient">
              Your AI-Powered Health Assistant
            </h1>

            <p className="mt-6 text-xl text-muted-foreground max-w-2xl">
              Arogya simplifies healthcare with AI-powered tools to understand medical reports, manage medications, and
              track your health journey in multiple languages.
            </p>

            <div className="mt-8 flex flex-wrap gap-4 justify-center">
              <Button asChild size="lg" className="rounded-full animate-pulse-slow">
                <Link href="/health-profile">
                  Create Your Health Profile
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full">
                <Link href="/report-analysis">Analyze Medical Report</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Powerful Features for Your Health</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Link key={index} href={feature.link} className="group">
              <div className="h-full glass-card rounded-xl p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg glow">
                <div
                  className={`w-12 h-12 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4`}
                >
                  <feature.icon className="h-6 w-6 text-white" />
                </div>

                <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>

                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Multilingual Support Section */}
      <section className="container px-4 py-16 relative">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-3xl -z-10"></div>

        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1">
            <h2 className="text-3xl font-bold mb-4">Multilingual Support</h2>
            <p className="text-muted-foreground mb-6">
              Breaking language barriers in healthcare. Access all features in multiple Indian languages including
              Tamil, Hindi, Telugu, Malayalam, and Kannada.
            </p>
            <div className="flex flex-wrap gap-2">
              {["English", "தமிழ்", "हिन्दी", "తెలుగు", "മലയാളം", "ಕನ್ನಡ"].map((lang, i) => (
                <div key={i} className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">
                  {lang}
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1 relative">
            <div className="aspect-video rounded-xl overflow-hidden bg-gradient-to-br from-purple-600/20 to-blue-600/20 p-4">
              <div className="glass-card rounded-lg p-4 h-full flex flex-col">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <div className="flex-1 text-center text-xs text-muted-foreground">Medical Translator</div>
                </div>

                <div className="flex-1 flex flex-col gap-4">
                  <div className="glass-card rounded-md p-3 text-sm">
                    <p className="text-muted-foreground text-xs mb-1">English</p>
                    <p>What does hypertension mean?</p>
                  </div>

                  <div className="glass-card rounded-md p-3 text-sm">
                    <p className="text-muted-foreground text-xs mb-1">Response</p>
                    <p>
                      Hypertension is the medical term for high blood pressure. It means that the force of blood pushing
                      against your artery walls is consistently too high.
                    </p>
                  </div>

                  <div className="glass-card rounded-md p-3 text-sm">
                    <p className="text-muted-foreground text-xs mb-1">தமிழ்</p>
                    <p>உயர் இரத்த அழுத்தம் என்றால் என்ன?</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container px-4 py-16">
        <div className="rounded-xl overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/30 to-blue-600/30 -z-10"></div>

          <div className="px-6 py-12 md:py-16 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Start Your Health Journey Today</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Take control of your health with Arogya's AI-powered tools. Create your profile, upload your reports, and
              get personalized insights.
            </p>
            <Button asChild size="lg" className="rounded-full">
              <Link href="/health-profile">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="relative w-6 h-6 rounded-full bg-gradient-to-br from-purple-600 to-blue-500">
                <div className="absolute inset-1 rounded-full bg-background flex items-center justify-center text-primary font-bold text-xs">
                  A
                </div>
              </div>
              <span className="font-bold text-sm bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500">
                Arogya
              </span>
            </div>

            <div className="text-sm text-muted-foreground">© 2025 Arogya. All rights reserved.</div>
          </div>
        </div>
      </footer>
    </main>
  )
}
