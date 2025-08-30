"use client"

import type React from "react"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2, Save, ArrowRight } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

interface HealthProfile {
  personalInfo: {
    name: string
    age: string
    gender: string
    height: string
    weight: string
    bloodType: string
  }
  vitalSigns: {
    bloodPressure: string
    heartRate: string
    bloodSugar: string
    cholesterol: string
  }
  medicalHistory: {
    conditions: string[]
    allergies: string
    medications: string
    surgeries: string
  }
  lifestyle: {
    smoking: string
    alcohol: string
    exercise: string
    diet: string
    sleep: string
  }
}

const initialProfile: HealthProfile = {
  personalInfo: {
    name: "",
    age: "",
    gender: "",
    height: "",
    weight: "",
    bloodType: "",
  },
  vitalSigns: {
    bloodPressure: "",
    heartRate: "",
    bloodSugar: "",
    cholesterol: "",
  },
  medicalHistory: {
    conditions: [],
    allergies: "",
    medications: "",
    surgeries: "",
  },
  lifestyle: {
    smoking: "never",
    alcohol: "never",
    exercise: "sedentary",
    diet: "balanced",
    sleep: "7-8",
  },
}

const medicalConditions = [
  { id: "diabetes", label: "Diabetes" },
  { id: "hypertension", label: "Hypertension" },
  { id: "asthma", label: "Asthma" },
  { id: "heart-disease", label: "Heart Disease" },
  { id: "cancer", label: "Cancer" },
  { id: "arthritis", label: "Arthritis" },
  { id: "thyroid", label: "Thyroid Disorder" },
  { id: "depression", label: "Depression/Anxiety" },
]

export default function HealthProfilePage() {
  const [profile, setProfile] = useState<HealthProfile>(() => {
    // Load profile from localStorage if available
    if (typeof window !== "undefined") {
      const savedProfile = localStorage.getItem("healthProfile")
      return savedProfile ? JSON.parse(savedProfile) : initialProfile
    }
    return initialProfile
  })

  const [activeTab, setActiveTab] = useState("personal")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const handlePersonalInfoChange = (field: string, value: string) => {
    setProfile({
      ...profile,
      personalInfo: {
        ...profile.personalInfo,
        [field]: value,
      },
    })
  }

  const handleVitalSignsChange = (field: string, value: string) => {
    setProfile({
      ...profile,
      vitalSigns: {
        ...profile.vitalSigns,
        [field]: value,
      },
    })
  }

  const handleMedicalHistoryChange = (field: string, value: string) => {
    setProfile({
      ...profile,
      medicalHistory: {
        ...profile.medicalHistory,
        [field]: value,
      },
    })
  }

  const handleConditionToggle = (condition: string) => {
    const conditions = profile.medicalHistory.conditions

    if (conditions.includes(condition)) {
      setProfile({
        ...profile,
        medicalHistory: {
          ...profile.medicalHistory,
          conditions: conditions.filter((c) => c !== condition),
        },
      })
    } else {
      setProfile({
        ...profile,
        medicalHistory: {
          ...profile.medicalHistory,
          conditions: [...conditions, condition],
        },
      })
    }
  }

  const handleLifestyleChange = (field: string, value: string) => {
    setProfile({
      ...profile,
      lifestyle: {
        ...profile.lifestyle,
        [field]: value,
      },
    })
  }

  const handleSaveProfile = () => {
    // Validate required fields
    if (!profile.personalInfo.name || !profile.personalInfo.age) {
      toast({
        title: "Missing information",
        description: "Please fill in at least your name and age",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    // Save to localStorage
    localStorage.setItem("healthProfile", JSON.stringify(profile))

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "Profile saved",
        description: "Your health profile has been saved successfully",
      })

      // Navigate to insights page
      router.push("/health-insights")
    }, 1500)
  }

  const handleNextTab = () => {
    if (activeTab === "personal") setActiveTab("vitals")
    else if (activeTab === "vitals") setActiveTab("medical")
    else if (activeTab === "medical") setActiveTab("lifestyle")
  }

  const handlePrevTab = () => {
    if (activeTab === "lifestyle") setActiveTab("medical")
    else if (activeTab === "medical") setActiveTab("vitals")
    else if (activeTab === "vitals") setActiveTab("personal")
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="container px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-2">Health Profile</h1>
            <p className="text-muted-foreground">
              Create your health profile to get personalized insights and recommendations
            </p>
          </div>

          <Card className="glass-card glow">
            <CardHeader>
              <CardTitle>Your Health Information</CardTitle>
              <CardDescription>Fill in your health details to get personalized insights</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-4 mb-8">
                  <TabsTrigger value="personal">Personal</TabsTrigger>
                  <TabsTrigger value="vitals">Vital Signs</TabsTrigger>
                  <TabsTrigger value="medical">Medical History</TabsTrigger>
                  <TabsTrigger value="lifestyle">Lifestyle</TabsTrigger>
                </TabsList>

                <TabsContent value="personal" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        placeholder="John Doe"
                        value={profile.personalInfo.name}
                        onChange={(e) => handlePersonalInfoChange("name", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="age">Age</Label>
                      <Input
                        id="age"
                        type="number"
                        placeholder="35"
                        value={profile.personalInfo.age}
                        onChange={(e) => handlePersonalInfoChange("age", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="gender">Gender</Label>
                      <Select
                        value={profile.personalInfo.gender}
                        onValueChange={(value) => handlePersonalInfoChange("gender", value)}
                      >
                        <SelectTrigger id="gender">
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="blood-type">Blood Type</Label>
                      <Select
                        value={profile.personalInfo.bloodType}
                        onValueChange={(value) => handlePersonalInfoChange("bloodType", value)}
                      >
                        <SelectTrigger id="blood-type">
                          <SelectValue placeholder="Select blood type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="A+">A+</SelectItem>
                          <SelectItem value="A-">A-</SelectItem>
                          <SelectItem value="B+">B+</SelectItem>
                          <SelectItem value="B-">B-</SelectItem>
                          <SelectItem value="AB+">AB+</SelectItem>
                          <SelectItem value="AB-">AB-</SelectItem>
                          <SelectItem value="O+">O+</SelectItem>
                          <SelectItem value="O-">O-</SelectItem>
                          <SelectItem value="unknown">Don't Know</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="height">Height (cm)</Label>
                      <Input
                        id="height"
                        type="number"
                        placeholder="175"
                        value={profile.personalInfo.height}
                        onChange={(e) => handlePersonalInfoChange("height", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="weight">Weight (kg)</Label>
                      <Input
                        id="weight"
                        type="number"
                        placeholder="70"
                        value={profile.personalInfo.weight}
                        onChange={(e) => handlePersonalInfoChange("weight", e.target.value)}
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="vitals" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="blood-pressure">Blood Pressure (mmHg)</Label>
                      <Input
                        id="blood-pressure"
                        placeholder="120/80"
                        value={profile.vitalSigns.bloodPressure}
                        onChange={(e) => handleVitalSignsChange("bloodPressure", e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">Format: Systolic/Diastolic (e.g., 120/80)</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="heart-rate">Heart Rate (bpm)</Label>
                      <Input
                        id="heart-rate"
                        type="number"
                        placeholder="72"
                        value={profile.vitalSigns.heartRate}
                        onChange={(e) => handleVitalSignsChange("heartRate", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="blood-sugar">Blood Sugar (mg/dL)</Label>
                      <Input
                        id="blood-sugar"
                        placeholder="95"
                        value={profile.vitalSigns.bloodSugar}
                        onChange={(e) => handleVitalSignsChange("bloodSugar", e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">Fasting blood glucose level</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cholesterol">Total Cholesterol (mg/dL)</Label>
                      <Input
                        id="cholesterol"
                        placeholder="180"
                        value={profile.vitalSigns.cholesterol}
                        onChange={(e) => handleVitalSignsChange("cholesterol", e.target.value)}
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="medical" className="space-y-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Medical Conditions</Label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {medicalConditions.map((condition) => (
                          <div key={condition.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={condition.id}
                              checked={profile.medicalHistory.conditions.includes(condition.id)}
                              onCheckedChange={() => handleConditionToggle(condition.id)}
                            />
                            <Label htmlFor={condition.id} className="text-sm font-normal">
                              {condition.label}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="allergies">Allergies</Label>
                      <Textarea
                        id="allergies"
                        placeholder="List any allergies you have"
                        value={profile.medicalHistory.allergies}
                        onChange={(e) => handleMedicalHistoryChange("allergies", e.target.value)}
                        className="min-h-[80px]"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="medications">Current Medications</Label>
                      <Textarea
                        id="medications"
                        placeholder="List any medications you're currently taking"
                        value={profile.medicalHistory.medications}
                        onChange={(e) => handleMedicalHistoryChange("medications", e.target.value)}
                        className="min-h-[80px]"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="surgeries">Past Surgeries</Label>
                      <Textarea
                        id="surgeries"
                        placeholder="List any surgeries you've had"
                        value={profile.medicalHistory.surgeries}
                        onChange={(e) => handleMedicalHistoryChange("surgeries", e.target.value)}
                        className="min-h-[80px]"
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="lifestyle" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="smoking">Smoking</Label>
                      <Select
                        value={profile.lifestyle.smoking}
                        onValueChange={(value) => handleLifestyleChange("smoking", value)}
                      >
                        <SelectTrigger id="smoking">
                          <SelectValue placeholder="Select option" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="never">Never smoked</SelectItem>
                          <SelectItem value="former">Former smoker</SelectItem>
                          <SelectItem value="occasional">Occasional smoker</SelectItem>
                          <SelectItem value="regular">Regular smoker</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="alcohol">Alcohol Consumption</Label>
                      <Select
                        value={profile.lifestyle.alcohol}
                        onValueChange={(value) => handleLifestyleChange("alcohol", value)}
                      >
                        <SelectTrigger id="alcohol">
                          <SelectValue placeholder="Select option" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="never">Never</SelectItem>
                          <SelectItem value="occasional">Occasional (1-2 drinks/week)</SelectItem>
                          <SelectItem value="moderate">Moderate (3-7 drinks/week)</SelectItem>
                          <SelectItem value="heavy">Heavy (8+ drinks/week)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="exercise">Physical Activity</Label>
                      <Select
                        value={profile.lifestyle.exercise}
                        onValueChange={(value) => handleLifestyleChange("exercise", value)}
                      >
                        <SelectTrigger id="exercise">
                          <SelectValue placeholder="Select option" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sedentary">Sedentary (little to no exercise)</SelectItem>
                          <SelectItem value="light">Light (1-3 days/week)</SelectItem>
                          <SelectItem value="moderate">Moderate (3-5 days/week)</SelectItem>
                          <SelectItem value="active">Active (6-7 days/week)</SelectItem>
                          <SelectItem value="very-active">Very active (twice daily)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="diet">Diet</Label>
                      <Select
                        value={profile.lifestyle.diet}
                        onValueChange={(value) => handleLifestyleChange("diet", value)}
                      >
                        <SelectTrigger id="diet">
                          <SelectValue placeholder="Select option" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="balanced">Balanced diet</SelectItem>
                          <SelectItem value="vegetarian">Vegetarian</SelectItem>
                          <SelectItem value="vegan">Vegan</SelectItem>
                          <SelectItem value="keto">Keto/Low-carb</SelectItem>
                          <SelectItem value="paleo">Paleo</SelectItem>
                          <SelectItem value="mediterranean">Mediterranean</SelectItem>
                          <SelectItem value="unhealthy">Mostly processed foods</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="sleep">Sleep (hours/night)</Label>
                      <Select
                        value={profile.lifestyle.sleep}
                        onValueChange={(value) => handleLifestyleChange("sleep", value)}
                      >
                        <SelectTrigger id="sleep">
                          <SelectValue placeholder="Select option" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="<5">Less than 5 hours</SelectItem>
                          <SelectItem value="5-6">5-6 hours</SelectItem>
                          <SelectItem value="7-8">7-8 hours</SelectItem>
                          <SelectItem value="9+">9+ hours</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="flex justify-between">
              {activeTab !== "personal" && (
                <Button variant="outline" onClick={handlePrevTab}>
                  Previous
                </Button>
              )}

              {activeTab !== "lifestyle" ? (
                <Button onClick={handleNextTab} className="ml-auto">
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button onClick={handleSaveProfile} disabled={isLoading} className="ml-auto">
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Profile
                    </>
                  )}
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}

function Textarea({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={`flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    />
  )
}
