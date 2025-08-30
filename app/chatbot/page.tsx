"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, MessageSquare, Plus, RefreshCw } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { supportedLanguages } from "@/lib/gemini"
import ReactMarkdown from "react-markdown"

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

export default function ChatbotPage() {
  const [userInput, setUserInput] = useState("")
  const [messages, setMessages] = useState<Message[]>(() => {
    // Load messages from localStorage if available
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("chatHistory")
      return saved ? JSON.parse(saved) : []
    }
    return []
  })
  const [isLoading, setIsLoading] = useState(false)
  const [language, setLanguage] = useState("en")
  const { toast } = useToast()

  // Save messages to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("chatHistory", JSON.stringify(messages))
  }, [messages])

  const handleSubmit = async () => {
    if (!userInput.trim()) {
      toast({
        title: "Empty input",
        description: "Please enter your symptoms or feelings",
        variant: "destructive",
      })
      return
    }

    // Add user message to chat
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: userInput,
      timestamp: new Date().toISOString()
    }
    setMessages(prev => [...prev, userMessage])
    setUserInput("") // Clear input after sending

    setIsLoading(true)
    try {
      const response = await fetch("/api/chatbot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userInput,
          language: supportedLanguages.find((lang) => lang.code === language)?.name || "English",
        }),
      })

      const data = await response.json()

      if (data.success) {
        // Add assistant message to chat
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.data,
          timestamp: new Date().toISOString()
        }
        setMessages(prev => [...prev, assistantMessage])
      } else {
        throw new Error(data.error || "Failed to generate response")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate response. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  const handleNewChat = () => {
    setMessages([])
    localStorage.removeItem("chatHistory")
    toast({
      title: "New chat started",
      description: "Your conversation history has been cleared.",
    })
  }

  const handleRefreshChat = () => {
    // Reload messages from localStorage
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("chatHistory")
      setMessages(saved ? JSON.parse(saved) : [])
    }
    toast({
      title: "Chat refreshed",
      description: "Your conversation history has been reloaded.",
    })
  }

  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="container px-4 py-8">
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Medical Assistant</CardTitle>
                <CardDescription>Chat with our AI medical assistant for empathetic advice and support.</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRefreshChat}
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Refresh
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNewChat}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  New Chat
                </Button>
              </div>
            </div>
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
          </CardHeader>
          <CardContent>
            <div className="flex flex-col h-[600px]">
              <div className="flex-1 overflow-y-auto mb-4 space-y-4 p-4 rounded-lg bg-muted">
                {messages.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">
                    Start a conversation by typing a message below.
                  </div>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.role === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-4 ${
                          message.role === 'user'
                            ? 'bg-primary text-primary-foreground ml-4'
                            : 'bg-secondary text-secondary-foreground mr-4'
                        }`}
                      >
                        <div className="prose prose-sm dark:prose-invert max-w-none">
                          <ReactMarkdown>{message.content}</ReactMarkdown>
                        </div>
                        <div
                          className={`text-xs mt-1 ${
                            message.role === 'user'
                              ? 'text-primary-foreground/80'
                              : 'text-secondary-foreground/80'
                          }`}
                        >
                          {formatTime(message.timestamp)}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="flex gap-2">
                <Textarea
                  placeholder="How are you feeling today?"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  className="min-h-[80px]"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      handleSubmit()
                    }
                  }}
                />
                <Button 
                  onClick={handleSubmit} 
                  disabled={isLoading}
                  className="px-8"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Send
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
} 