"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, MessageSquare } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { supportedLanguages } from "@/lib/gemini"
import ReactMarkdown from "react-markdown"

export default function MedicalTranslatorPage() {
  const [medicalText, setMedicalText] = useState("")
  const [simplifiedText, setSimplifiedText] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [language, setLanguage] = useState("en")
  const { toast } = useToast()

  const handleTranslate = async () => {
    if (!medicalText.trim()) {
      toast({
        title: "Empty input",
        description: "Please enter medical text to translate",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch("/api/simplify-medical", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          medicalText,
          language: supportedLanguages.find((lang) => lang.code === language)?.name || "English",
        }),
      })

      const data = await response.json()

      if (data.success) {
        setSimplifiedText(data.data)
      } else {
        throw new Error(data.error || "Failed to simplify text")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to simplify text",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="container px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-2">Medical Translator</h1>
            <p className="text-muted-foreground">Simplify complex medical terms into easy-to-understand language</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="glass-card glow">
              <CardHeader>
                <CardTitle>Medical Text</CardTitle>
                <CardDescription>Enter medical terms or text you want to understand</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Enter medical terms or text (e.g., The patient presents with hypertension and hyperlipidemia, increasing the risk of myocardial infarction...)"
                  className="min-h-[200px]"
                  value={medicalText}
                  onChange={(e) => setMedicalText(e.target.value)}
                />

                <div className="flex items-center space-x-2">
                  <p className="text-sm font-medium">Output Language:</p>
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

                <Button onClick={handleTranslate} disabled={isLoading || !medicalText.trim()} className="w-full">
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Translating...
                    </>
                  ) : (
                    <>
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Simplify Medical Terms
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            <Card className="glass-card glow">
              <CardHeader>
                <CardTitle>Simplified Explanation</CardTitle>
                <CardDescription>Medical terms explained in simple language</CardDescription>
              </CardHeader>
              <CardContent>
                {simplifiedText ? (
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <ReactMarkdown>{simplifiedText}</ReactMarkdown>
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <p>Simplified explanation will appear here</p>
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
