"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Download, CheckCircle, Activity, Heart, Droplet, Scale, Utensils, Moon } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { supportedLanguages } from "@/lib/gemini"
import { generateHealthDigestPDF } from "@/lib/pdf-utils"
import ReactMarkdown from "react-markdown"

export default function HealthInsightsPage() {
  const [profile, setProfile] = useState<any>(null)
  const [insights, setInsights] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)
  const [language, setLanguage] = useState("en")
  const [bmi, setBmi] = useState({ value: 0, category: "" })
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    // Load profile from localStorage
    const savedProfile = localStorage.getItem("healthProfile")
    if (savedProfile) {
      const parsedProfile = JSON.parse(savedProfile)
      setProfile(parsedProfile)

      // Calculate BMI if height and weight are available
      if (parsedProfile.personalInfo.height && parsedProfile.personalInfo.weight) {
        const height = Number.parseFloat(parsedProfile.personalInfo.height) / 100 // convert cm to m
        const weight = Number.parseFloat(parsedProfile.personalInfo.weight)
        const bmiValue = weight / (height * height)

        let category = ""
        if (bmiValue < 18.5) category = "Underweight"
        else if (bmiValue < 25) category = "Normal weight"
        else if (bmiValue < 30) category = "Overweight"
        else category = "Obese"

        setBmi({ value: bmiValue, category })
      }
    } else {
      // Redirect to profile page if no profile exists
      toast({
        title: "Profile not found",
        description: "Please create your health profile first",
        variant: "destructive",
      })
      router.push("/health-profile")
    }
  }, [router, toast])

  const generateInsights = async () => {
    if (!profile) return

    setIsLoading(true)
    try {
      const response = await fetch("/api/analyze-health-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          profileData: profile,
          language: supportedLanguages.find((lang) => lang.code === language)?.name || "English",
        }),
      })

      const data = await response.json()

      if (data.success) {
        setInsights(data.data)
      } else {
        throw new Error(data.error || "Failed to generate insights")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate insights",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const generateWeeklyDigest = async () => {
    if (!profile) {
      toast({
        title: "Missing profile",
        description: "Please complete your health profile first",
        variant: "destructive",
      })
      return
    }

    setIsGeneratingPDF(true)
    toast({
      title: "Generating PDF",
      description: "Your weekly health digest is being generated",
    })

    try {
      // Generate PDF with profile data and insights
      const pdfBlob = generateHealthDigestPDF(profile, insights || "No insights generated yet.")

      // Create a download link
      const url = URL.createObjectURL(pdfBlob)
      const link = document.createElement("a")
      link.href = url
      link.download = `Arogya_Health_Digest_${new Date().toISOString().split("T")[0]}.pdf`

      // Trigger download
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast({
        title: "PDF Generated",
        description: "Your weekly health digest has been downloaded",
      })
    } catch (error) {
      console.error("Error generating PDF:", error)
      toast({
        title: "Error",
        description: "Failed to generate PDF report",
        variant: "destructive",
      })
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  if (!profile) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container px-4 py-16 flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Loading Profile</CardTitle>
              <CardDescription>Please wait while we load your health profile</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center py-6">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="container px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-2">Health Insights</h1>
            <p className="text-muted-foreground">
              Get personalized insights and recommendations based on your health profile
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-6">
              <Card className="glass-card glow">
                <CardHeader>
                  <CardTitle>Profile Summary</CardTitle>
                  <CardDescription>
                    {profile.personalInfo.name}, {profile.personalInfo.age} years
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">BMI</span>
                      <span className="text-sm">
                        {bmi.value.toFixed(1)} - {bmi.category}
                      </span>
                    </div>
                    <Progress value={Math.min((bmi.value / 40) * 100, 100)} className="h-2" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col items-center justify-center p-3 rounded-lg bg-primary/10">
                      <Heart className="h-5 w-5 text-primary mb-1" />
                      <span className="text-xs font-medium">Blood Pressure</span>
                      <span className="text-sm">{profile.vitalSigns.bloodPressure || "N/A"}</span>
                    </div>

                    <div className="flex flex-col items-center justify-center p-3 rounded-lg bg-primary/10">
                      <Activity className="h-5 w-5 text-primary mb-1" />
                      <span className="text-xs font-medium">Heart Rate</span>
                      <span className="text-sm">{profile.vitalSigns.heartRate || "N/A"} bpm</span>
                    </div>

                    <div className="flex flex-col items-center justify-center p-3 rounded-lg bg-primary/10">
                      <Droplet className="h-5 w-5 text-primary mb-1" />
                      <span className="text-xs font-medium">Blood Sugar</span>
                      <span className="text-sm">{profile.vitalSigns.bloodSugar || "N/A"} mg/dL</span>
                    </div>

                    <div className="flex flex-col items-center justify-center p-3 rounded-lg bg-primary/10">
                      <Scale className="h-5 w-5 text-primary mb-1" />
                      <span className="text-xs font-medium">Cholesterol</span>
                      <span className="text-sm">{profile.vitalSigns.cholesterol || "N/A"} mg/dL</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Utensils className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Diet: {profile.lifestyle.diet}</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Activity className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Exercise: {profile.lifestyle.exercise}</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Moon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Sleep: {profile.lifestyle.sleep} hours</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-2">
                  <div className="flex items-center space-x-2 w-full">
                    <span className="text-sm font-medium">Language:</span>
                    <Select value={language} onValueChange={setLanguage} className="flex-1">
                      <SelectTrigger>
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        {supportedLanguages.map((lang) => (
                          <SelectItem key={lang.code} value={lang.code}>
                            {lang.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button onClick={generateInsights} disabled={isLoading} className="w-full">
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      "Generate Health Insights"
                    )}
                  </Button>
                </CardFooter>
              </Card>

              <Card className="glass-card glow">
                <CardHeader>
                  <CardTitle>Weekly Health Digest</CardTitle>
                  <CardDescription>Download a comprehensive report of your health data</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Get a detailed PDF report with your health metrics, insights, and personalized recommendations.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={generateWeeklyDigest}
                    disabled={isGeneratingPDF}
                  >
                    {isGeneratingPDF ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating PDF...
                      </>
                    ) : (
                      <>
                        <Download className="mr-2 h-4 w-4" />
                        Download PDF Report
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </div>

            <Card className="glass-card glow lg:col-span-2">
              <CardHeader>
                <CardTitle>Health Insights</CardTitle>
                <CardDescription>AI-generated insights based on your health profile</CardDescription>
              </CardHeader>
              <CardContent>
                {insights ? (
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <ReactMarkdown>{insights}</ReactMarkdown>
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <div className="flex flex-col items-center justify-center">
                      <Activity className="h-16 w-16 mb-4 opacity-50" />
                      <p className="text-lg font-medium mb-2">No insights generated yet</p>
                      <p className="text-sm max-w-md mb-6">
                        Click the "Generate Health Insights" button to get personalized health recommendations based on
                        your profile.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-lg">
                        <div className="flex items-start space-x-2 p-4 rounded-lg bg-card border">
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                          <div>
                            <h3 className="text-sm font-medium">Risk Assessment</h3>
                            <p className="text-xs text-muted-foreground">
                              Identify potential health risks based on your profile
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start space-x-2 p-4 rounded-lg bg-card border">
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                          <div>
                            <h3 className="text-sm font-medium">Personalized Tips</h3>
                            <p className="text-xs text-muted-foreground">
                              Get actionable recommendations to improve your health
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
