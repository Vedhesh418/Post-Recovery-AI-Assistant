"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Textarea as ShadcnTextarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Brain, SmilePlus, Frown, Meh, Smile, Heart } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { supportedLanguages } from "@/lib/gemini"

const moodOptions = [
  { value: "happy", label: "Happy", icon: Smile },
  { value: "neutral", label: "Neutral", icon: Meh },
  { value: "sad", label: "Sad", icon: Frown },
  { value: "anxious", label: "Anxious", icon: Brain },
  { value: "stressed", label: "Stressed", icon: Brain },
  { value: "tired", label: "Tired", icon: Brain },
]

interface MoodEntry {
  id: string
  date: string
  mood: string
  context: string
  response: string
}

export default function MentalHealthPage() {
  const [selectedMood, setSelectedMood] = useState("")
  const [context, setContext] = useState("")
  const [response, setResponse] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [language, setLanguage] = useState("en")
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([])
  const { toast } = useToast()

  const handleMoodSubmit = async () => {
    if (!selectedMood) {
      toast({
        title: "No mood selected",
        description: "Please select your current mood",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch("/api/mental-health-response", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mood: selectedMood,
          context: context || "No additional context provided",
          language: supportedLanguages.find((lang) => lang.code === language)?.name || "English",
        }),
      })

      const data = await response.json()

      if (data.success) {
        setResponse(data.data)

        // Add to mood entries
        const newEntry: MoodEntry = {
          id: Date.now().toString(),
          date: new Date().toISOString(),
          mood: selectedMood,
          context: context || "No additional context provided",
          response: data.data,
        }

        setMoodEntries([newEntry, ...moodEntries])

        // Save to localStorage
        const savedEntries = localStorage.getItem("moodEntries")
        const entries = savedEntries ? JSON.parse(savedEntries) : []
        localStorage.setItem("moodEntries", JSON.stringify([newEntry, ...entries]))
      } else {
        throw new Error(data.error || "Failed to generate response")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate response",
        variant: "destructive",
      })

      // Simulate response for demo purposes
      const simulatedResponse = `I understand you're feeling ${selectedMood} today. It's completely valid to feel this way, and I appreciate you sharing this with me.

When we're feeling ${selectedMood}, it can be helpful to acknowledge these emotions without judgment. Your feelings are important signals that help you understand yourself better.

Here are a couple of gentle suggestions that might help:

1. Take a few moments for some deep breathing - just 5 minutes of slow, intentional breaths can help create a sense of calm.

2. Consider engaging in a small activity that usually brings you joy or comfort, even if it's just for a short time.

Remember that emotions are temporary states, not permanent conditions. Be kind to yourself today, just as you would be to a good friend experiencing the same feelings.`

      setResponse(simulatedResponse)

      // Add to mood entries
      const newEntry: MoodEntry = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        mood: selectedMood,
        context: context || "No additional context provided",
        response: simulatedResponse,
      }

      setMoodEntries([newEntry, ...moodEntries])

      // Save to localStorage
      const savedEntries = localStorage.getItem("moodEntries")
      const entries = savedEntries ? JSON.parse(savedEntries) : []
      localStorage.setItem("moodEntries", JSON.stringify([newEntry, ...entries]))
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="container px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-2">Mental Health Support</h1>
            <p className="text-muted-foreground">Track your mood and get supportive responses</p>
          </div>

          <Tabs defaultValue="log" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="log">Log Your Mood</TabsTrigger>
              <TabsTrigger value="history">Mood History</TabsTrigger>
            </TabsList>

            <TabsContent value="log" className="space-y-8">
              <Card className="glass-card glow">
                <CardHeader>
                  <CardTitle>How are you feeling today?</CardTitle>
                  <CardDescription>Select your current mood and get a supportive response</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                    {moodOptions.map((mood) => {
                      const MoodIcon = mood.icon
                      return (
                        <Button
                          key={mood.value}
                          variant={selectedMood === mood.value ? "default" : "outline"}
                          className="flex flex-col items-center justify-center h-24 p-2"
                          onClick={() => setSelectedMood(mood.value)}
                        >
                          <MoodIcon className="h-8 w-8 mb-2" />
                          <span>{mood.label}</span>
                        </Button>
                      )
                    })}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Would you like to share more about how you're feeling? (Optional)
                    </label>
                    <ShadcnTextarea
                      placeholder="I'm feeling this way because..."
                      className="min-h-[100px]"
                      value={context}
                      onChange={(e) => setContext(e.target.value)}
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">Language:</span>
                    <Select value={language} onValueChange={setLanguage}>
                      <SelectTrigger className="w-[180px]">
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
                </CardContent>
                <CardFooter>
                  <Button onClick={handleMoodSubmit} disabled={isLoading || !selectedMood} className="w-full">
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <SmilePlus className="mr-2 h-4 w-4" />
                        Submit
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>

              {response && (
                <Card className="glass-card glow border-primary animate-in fade-in-0 slide-in-from-bottom-5">
                  <CardHeader className="pb-2">
                    <div className="flex items-center">
                      <Heart className="h-5 w-5 text-primary mr-2" />
                      <CardTitle className="text-lg">Supportive Response</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      {response.split("\n\n").map((paragraph, i) => (
                        <p key={i} className="mb-4">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="history">
              <Card className="glass-card glow">
                <CardHeader>
                  <CardTitle>Your Mood History</CardTitle>
                  <CardDescription>Track your emotional wellbeing over time</CardDescription>
                </CardHeader>
                <CardContent>
                  {moodEntries.length > 0 ? (
                    <div className="space-y-4">
                      {moodEntries.map((entry) => {
                        const MoodIcon = moodOptions.find((m) => m.value === entry.mood)?.icon || Meh
                        return (
                          <div key={entry.id} className="p-4 rounded-lg bg-card border animate-in fade-in-0">
                            <div className="flex items-center mb-2">
                              <MoodIcon className="h-5 w-5 mr-2" />
                              <span className="font-medium capitalize">{entry.mood}</span>
                              <span className="text-xs text-muted-foreground ml-auto">{formatDate(entry.date)}</span>
                            </div>

                            {entry.context && entry.context !== "No additional context provided" && (
                              <div className="mb-2 text-sm text-muted-foreground">
                                <p>"{entry.context}"</p>
                              </div>
                            )}

                            <div className="mt-2 text-sm border-t pt-2">
                              <p className="font-medium mb-1">Response:</p>
                              <p>{entry.response.split("\n\n")[0]}</p>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No mood entries yet</p>
                      <p className="text-sm">Log your first mood to start tracking</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
