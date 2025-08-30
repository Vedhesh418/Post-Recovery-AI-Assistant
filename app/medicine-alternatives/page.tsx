"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Search } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { supportedLanguages } from "@/lib/gemini"
import ReactMarkdown from "react-markdown"

export default function MedicineAlternativesPage() {
  const [medicineName, setMedicineName] = useState("")
  const [alternatives, setAlternatives] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [language, setLanguage] = useState("en")
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    // Load recent searches from localStorage if available
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("recentMedicineSearches")
      return saved ? JSON.parse(saved) : []
    }
    return []
  })
  const { toast } = useToast()

  const handleSearch = async () => {
    if (!medicineName.trim()) {
      toast({
        title: "Empty input",
        description: "Please enter a medicine name",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch("/api/medicine-alternatives", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          medicineName,
          language: supportedLanguages.find((lang) => lang.code === language)?.name || "English",
        }),
      })

      const data = await response.json()

      if (data.success) {
        setAlternatives(data.data)

        // Add to recent searches if not already there
        if (!recentSearches.includes(medicineName)) {
          const updatedSearches = [medicineName, ...recentSearches].slice(0, 5)
          setRecentSearches(updatedSearches)
          // Save to localStorage
          localStorage.setItem("recentMedicineSearches", JSON.stringify(updatedSearches))
        }
      } else {
        throw new Error(data.error || "Failed to find alternatives")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to find alternatives",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRecentSearch = (medicine: string) => {
    setMedicineName(medicine)
    setTimeout(() => handleSearch(), 100)
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="container px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-2">Medicine Alternatives</h1>
            <p className="text-muted-foreground">Find cheaper alternatives for your medications</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="glass-card glow">
              <CardHeader>
                <CardTitle>Find Alternatives</CardTitle>
                <CardDescription>Enter a medicine name to find cheaper alternatives</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex space-x-2">
                  <div className="flex-1">
                    <Input
                      placeholder="Enter medicine name (e.g., Lipitor)"
                      value={medicineName}
                      onChange={(e) => setMedicineName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSearch()
                      }}
                    />
                  </div>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="Language" />
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

                <Button onClick={handleSearch} disabled={isLoading || !medicineName.trim()} className="w-full">
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Searching...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4" />
                      Find Alternatives
                    </>
                  )}
                </Button>

                {recentSearches.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-medium mb-2">Recent Searches</p>
                    <div className="flex flex-wrap gap-2">
                      {recentSearches.map((medicine, index) => (
                        <Button key={index} variant="outline" size="sm" onClick={() => handleRecentSearch(medicine)}>
                          {medicine}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="glass-card glow">
              <CardHeader>
                <CardTitle>Alternatives</CardTitle>
                <CardDescription>Cheaper alternatives for your medication</CardDescription>
              </CardHeader>
              <CardContent>
                {alternatives ? (
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <ReactMarkdown>{alternatives}</ReactMarkdown>
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <p>Search for a medicine to see alternatives</p>
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
