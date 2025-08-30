"use client"

import type React from "react"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileUp, Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { supportedLanguages } from "@/lib/gemini"
// Removed simulateOCR import as fallback logic is removed for now
import ReactMarkdown from "react-markdown"
// Removed pdfjs import

// Removed PDF.js worker initialization

export default function ReportAnalysisPage() {
  const [reportText, setReportText] = useState("")
  const [analysis, setAnalysis] = useState("")
  const [isLoading, setIsLoading] = useState(false) // For analysis API call
  const [isProcessingPdf, setIsProcessingPdf] = useState(false) // For PDF extraction API call
  const [language, setLanguage] = useState("en")
  const [activeTab, setActiveTab] = useState("text")
  const [fileName, setFileName] = useState("")
  const { toast } = useToast()

  // Removed extractTextFromPdf function

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("handleFileUpload triggered.");

    const file = e.target.files?.[0]
    if (!file) {
      console.log("No file selected.");
      return
    }

    console.log(`File object received: name=${file.name}, size=${file.size}, type=${file.type}`);
    setFileName(file.name)
    setReportText("") // Clear previous report text
    setAnalysis("") // Clear previous analysis

    if (file.type !== "application/pdf") {
      console.warn("Invalid file type uploaded.");
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF file",
        variant: "destructive",
      })
      return
    }

    // Check file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload a PDF file smaller than 10MB",
        variant: "destructive",
      })
      return
    }

    // Call API to extract text from PDF
    console.log("Setting PDF processing state to true.");
    setIsProcessingPdf(true)
    const formData = new FormData();
    formData.append('file', file);

    console.log("Calling /api/extract-pdf-text API...");
    try {
      const response = await fetch('/api/extract-pdf-text', {
        method: 'POST',
        body: formData,
      });

      console.log(`Received response status from extraction API: ${response.status}`);
      const result = await response.json();

      if (response.ok && result.success) {
        console.log("PDF text extraction API call successful.");
        setReportText(result.text);
        setActiveTab("text"); // Switch to text tab to show extracted text
        toast({
          title: "PDF processed successfully",
          description: `Extracted text from ${file.name}. Click 'Analyze Report'.`,
        });
      } else {
        console.error("PDF text extraction API call failed:", result.error);
        throw new Error(result.error || `Failed to extract text (status ${response.status})`);
      }
    } catch (error) {
      console.error("Error during PDF upload/extraction API call:", error);
      toast({
        title: "Error processing PDF",
        description: error instanceof Error ? error.message : "Failed to extract text via API",
        variant: "destructive",
      })
      setReportText("") // Clear report text on error
    } finally {
      console.log("Setting PDF processing state to false.");
      setIsProcessingPdf(false) // Reset PDF processing state
      // Clear the file input value so the same file can be selected again if needed
      e.target.value = '';
    }
  }

  const analyzeReport = async () => {
    // ... existing analyzeReport function remains the same ...
    if (!reportText.trim()) {
      console.warn("Analyze report called with empty text.");
      toast({
        title: "Empty report",
        description: "Please enter or upload a medical report",
        variant: "destructive",
      })
      return
    }

    console.log("Starting report analysis API call.");
    console.time("analyzeReportApiCall");
    setIsLoading(true) // Use isLoading for analysis
    setAnalysis("") // Clear previous analysis before starting new one
    try {
      const selectedLanguageName = supportedLanguages.find((lang) => lang.code === language)?.name || "English";
      console.log(`Sending request to /api/analyze-report with language: ${selectedLanguageName}`);
      const response = await fetch("/api/analyze-report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reportText,
          language: selectedLanguageName,
        }),
      })
      console.log(`Received response status: ${response.status}`);
      // Add log before parsing JSON
      console.log("Attempting to parse response JSON...");
      const data = await response.json()
      console.log("Response JSON parsed.");


      if (response.ok && data.success) { // Check response.ok as well
        console.log("API call successful, setting analysis data.");
        setAnalysis(data.data)
      } else {
         // Log the raw response text if JSON parsing failed or success is false
        const errorText = await response.text();
        console.error("API call failed or returned error:", data?.error || errorText);
        throw new Error(data?.error || `Request failed with status ${response.status}`);
      }
    } catch (error) {
      console.error("Error during analyzeReport fetch/processing:", error);
      toast({
        title: "Analysis Error",
        description: error instanceof Error ? error.message : "Failed to analyze report",
        variant: "destructive",
      })
      setAnalysis("") // Clear analysis on error
    } finally {
      console.timeEnd("analyzeReportApiCall");
      console.log("Analysis attempt finished. Setting loading state to false."); // Log finally block execution
      setIsLoading(false) // Reset analysis loading state
    }
  }

  return (
    // ... The rest of the component's JSX remains the same ...
    <div className="min-h-screen">
      <Navbar />

      <div className="container px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-2">Medical Report Analysis</h1>
            <p className="text-muted-foreground">
              Upload your medical reports and get simplified explanations in your preferred language
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="glass-card glow">
              <CardHeader>
                <CardTitle>Your Medical Report</CardTitle>
                <CardDescription>Upload a PDF or paste the text of your medical report</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-4">
                    <TabsTrigger value="text">Paste Text</TabsTrigger>
                    <TabsTrigger value="upload">Upload PDF</TabsTrigger>
                  </TabsList>

                  <TabsContent value="text" className="space-y-4">
                    <Textarea
                      placeholder="Paste your medical report text here..."
                      className="min-h-[300px]"
                      value={reportText}
                      onChange={(e) => setReportText(e.target.value)}
                    />
                  </TabsContent>

                  <TabsContent value="upload" className="space-y-4">
                    <div 
                      className="border-2 border-dashed border-muted-foreground/20 rounded-lg p-8 text-center cursor-pointer"
                      onClick={() => document.getElementById('file-upload')?.click()}
                    >
                      <input
                        type="file"
                        id="file-upload"
                        className="hidden"
                        accept=".pdf"
                        onChange={handleFileUpload}
                      />
                      <div className="flex flex-col items-center justify-center">
                        <FileUp className="h-12 w-12 text-muted-foreground mb-4" />
                        <p className="text-lg font-medium mb-1">Upload PDF Report</p>
                        <p className="text-sm text-muted-foreground mb-4">Drag and drop or click to browse</p>
                        <Button 
                          variant="outline" 
                          onClick={(e) => {
                            e.stopPropagation();
                            document.getElementById('file-upload')?.click();
                          }}
                        >
                          Select File
                        </Button>
                      </div>
                    </div>

                    {fileName && !isProcessingPdf && (
                      <div className="mt-2 text-center">
                        <p className="text-sm font-medium">Uploaded: {fileName}</p>
                      </div>
                    )}

                    {isProcessingPdf && (
                      <div className="flex items-center justify-center">
                        <Loader2 className="h-6 w-6 animate-spin mr-2" />
                        <span>Processing PDF...</span>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>

                <div className="mt-4 space-y-4">
                  <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium">Language:</p>
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

                  {/* Disable button if PDF is processing OR analysis is loading OR no text */}
                  <Button onClick={analyzeReport} disabled={isProcessingPdf || isLoading || !reportText.trim()} className="w-full">
                    {isLoading ? ( // Show analysis loading indicator based on isLoading
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      "Analyze Report"
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card glow">
              <CardHeader>
                <CardTitle>Simplified Explanation</CardTitle>
                <CardDescription>AI-generated explanation of your medical report</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading && !analysis && ( // Show loading placeholder only when analysis is loading AND no previous analysis exists
                   <div className="text-center py-12 text-muted-foreground">
                     <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                     <p>Generating explanation...</p>
                   </div>
                )}
                {!isLoading && analysis && ( // Show analysis only when not loading and analysis exists
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <ReactMarkdown>{analysis}</ReactMarkdown>
                  </div>
                )}
                {!isLoading && !analysis && ( // Show initial placeholder only when not loading and no analysis exists
                  <div className="text-center py-12 text-muted-foreground">
                    <p>Your analysis will appear here after processing</p>
                  </div>
                )}
                 {/* Note: If isLoading is true but analysis already exists (e.g., re-analyzing), the old analysis remains visible until the new one arrives. */}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
