"use client"

import { useState, useRef, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertTriangle, Download, Share2, QrCode, Printer, Copy, Check } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import html2canvas from "html2canvas"
// No need to import QR code library now

export default function EmergencyCardPage() {
  const [profile, setProfile] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("digital")
  const [copied, setCopied] = useState(false)
  const [shareSupported, setShareSupported] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  // Fix: Using useEffect for side effects
  useEffect(() => {
    // Check if Web Share API is supported - fixed TypeScript warning
    if (typeof navigator !== "undefined" && 'share' in navigator) {
      setShareSupported(true)
    }
    
    // Load profile from localStorage on component mount
    if (typeof window !== "undefined") {
      const savedProfile = localStorage.getItem("healthProfile")
      if (savedProfile) {
        try {
          setProfile(JSON.parse(savedProfile))
        } catch (e) {
          console.error("Error parsing profile:", e)
        }
      }
    }
  }, [])

  // Function to generate QR code URL
  const getQRCodeUrl = (data: string) => {
    const encodedData = encodeURIComponent(data)
    return `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodedData}`
  }

  const handleDownload = async () => {
    if (!cardRef.current) return

    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        backgroundColor: null,
      })

      const image = canvas.toDataURL("image/png")
      const link = document.createElement("a")
      link.href = image
      link.download = "emergency-health-card.png"
      link.click()

      toast({
        title: "Card downloaded",
        description: "Your emergency health card has been downloaded",
      })
    } catch (error) {
      console.error("Error generating image:", error)
      toast({
        title: "Error",
        description: "Failed to download emergency card",
        variant: "destructive",
      })
    }
  }

  const handleShare = async () => {
    if (!cardRef.current) return

    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        backgroundColor: null,
      })

      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => {
          resolve(blob as Blob)
        }, "image/png")
      })

      if (typeof navigator !== "undefined" && 'share' in navigator) {
        await navigator.share({
          title: "My Emergency Health Card",
          text: "Here's my emergency health information",
          files: [new File([blob], "emergency-health-card.png", { type: "image/png" })],
        })

        toast({
          title: "Card shared",
          description: "Your emergency health card has been shared",
        })
      }
    } catch (error) {
      console.error("Error sharing:", error)
      toast({
        title: "Error",
        description: "Failed to share emergency card",
        variant: "destructive",
      })
    }
  }

  const handlePrint = () => {
    window.print()
  }

  const handleCopyLink = () => {
    // Create a unique ID for the profile
    const profileId = btoa(
      JSON.stringify({
        name: profile?.personalInfo?.name,
        bloodType: profile?.personalInfo?.bloodType,
        conditions: profile?.medicalHistory?.conditions,
        allergies: profile?.medicalHistory?.allergies,
        medications: profile?.medicalHistory?.medications,
        emergency_contact: "Add emergency contact in profile",
      }),
    )

    // Create a shareable link
    const shareableLink = `${window.location.origin}/emergency-view?id=${encodeURIComponent(profileId)}`

    navigator.clipboard.writeText(shareableLink)
    setCopied(true)

    toast({
      title: "Link copied",
      description: "Emergency card link copied to clipboard",
    })

    setTimeout(() => setCopied(false), 2000)
  }

  if (!profile) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container px-4 py-16">
          <Card>
            <CardHeader>
              <CardTitle>Health Profile Required</CardTitle>
              <CardDescription>You need to create a health profile first</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Please create your health profile to generate an emergency card.</p>
            </CardContent>
            <CardFooter>
              <Button asChild>
                <a href="/health-profile">Create Health Profile</a>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    )
  }

  // Create QR code data
  const qrCodeData = JSON.stringify({
    name: profile.personalInfo.name,
    bloodType: profile.personalInfo.bloodType,
    conditions: profile.medicalHistory.conditions,
    allergies: profile.medicalHistory.allergies,
    medications: profile.medicalHistory.medications,
  })

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="container px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-2">Emergency Health Card</h1>
            <p className="text-muted-foreground">
              Create a shareable emergency card with your critical health information
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="digital">Digital Card</TabsTrigger>
              <TabsTrigger value="print">Printable Card</TabsTrigger>
            </TabsList>

            <TabsContent value="digital">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <Card className="glass-card glow">
                    <CardHeader>
                      <CardTitle>Digital Emergency Card</CardTitle>
                      <CardDescription>Share your critical health information digitally</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div
                          ref={cardRef}
                          className="bg-gradient-to-br from-purple-600/20 to-blue-600/20 p-4 rounded-lg"
                        >
                          <div className="bg-background/80 backdrop-blur-sm border rounded-lg p-4">
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center">
                                <div className="relative w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-blue-500">
                                  <div className="absolute inset-1 rounded-full bg-background flex items-center justify-center text-primary font-bold">
                                    A
                                  </div>
                                </div>
                                <span className="font-bold ml-2">Arogya Emergency Card</span>
                              </div>
                              <AlertTriangle className="h-5 w-5 text-red-500" />
                            </div>

                            <div className="space-y-3">
                              <div>
                                <p className="text-xs text-muted-foreground">Name</p>
                                <p className="font-medium">{profile.personalInfo.name}</p>
                              </div>

                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <p className="text-xs text-muted-foreground">Blood Type</p>
                                  <p className="font-medium">{profile.personalInfo.bloodType || "Unknown"}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-muted-foreground">Age</p>
                                  <p className="font-medium">{profile.personalInfo.age}</p>
                                </div>
                              </div>

                              <div>
                                <p className="text-xs text-muted-foreground">Medical Conditions</p>
                                <p className="font-medium">
                                  {profile.medicalHistory.conditions.length > 0
                                    ? profile.medicalHistory.conditions.join(", ")
                                    : "None reported"}
                                </p>
                              </div>

                              <div>
                                <p className="text-xs text-muted-foreground">Allergies</p>
                                <p className="font-medium">{profile.medicalHistory.allergies || "None reported"}</p>
                              </div>

                              <div>
                                <p className="text-xs text-muted-foreground">Current Medications</p>
                                <p className="font-medium">{profile.medicalHistory.medications || "None reported"}</p>
                              </div>

                              <div className="flex justify-center mt-2">
                                {/* Using QR code API instead of QRCodeReact */}
                                <img 
                                  src={getQRCodeUrl(qrCodeData)}
                                  alt="Emergency information QR code"
                                  width={100}
                                  height={100}
                                  className="rounded"
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <Button onClick={handleDownload} variant="outline" size="sm" className="flex-1">
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>

                          {shareSupported && (
                            <Button onClick={handleShare} variant="outline" size="sm" className="flex-1">
                              <Share2 className="h-4 w-4 mr-2" />
                              Share
                            </Button>
                          )}

                          <Button onClick={handleCopyLink} variant="outline" size="sm" className="flex-1">
                            {copied ? (
                              <>
                                <Check className="h-4 w-4 mr-2" />
                                Copied
                              </>
                            ) : (
                              <>
                                <Copy className="h-4 w-4 mr-2" />
                                Copy Link
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div>
                  <Card className="glass-card glow">
                    <CardHeader>
                      <CardTitle>Why Have an Emergency Card?</CardTitle>
                      <CardDescription>Critical information when you need it most</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-start space-x-3">
                          <div className="bg-primary/10 p-2 rounded-full">
                            <AlertTriangle className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-medium">Quick Medical Response</h3>
                            <p className="text-sm text-muted-foreground">
                              Emergency responders can quickly access your critical health information when every second
                              counts.
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start space-x-3">
                          <div className="bg-primary/10 p-2 rounded-full">
                            <QrCode className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-medium">Scannable QR Code</h3>
                            <p className="text-sm text-muted-foreground">
                              The QR code contains your vital health information that can be scanned by medical
                              professionals.
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start space-x-3">
                          <div className="bg-primary/10 p-2 rounded-full">
                            <Share2 className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-medium">Easy to Share</h3>
                            <p className="text-sm text-muted-foreground">
                              Share your emergency card with family members, caregivers, or emergency contacts.
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="print">
              <Card className="glass-card glow">
                <CardHeader>
                  <CardTitle>Printable Emergency Card</CardTitle>
                  <CardDescription>Print a physical card to carry in your wallet</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="print-card border-2 border-dashed border-muted-foreground/20 p-6 rounded-lg">
                      <div className="max-w-md mx-auto">
                        <div className="border rounded-lg overflow-hidden">
                          {/* Front of card */}
                          <div className="bg-gradient-to-r from-purple-600 to-blue-500 p-4 text-white">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <div className="bg-white rounded-full w-6 h-6 flex items-center justify-center">
                                  <span className="text-purple-600 font-bold text-xs">A</span>
                                </div>
                                <span className="font-bold ml-2">Arogya Emergency Card</span>
                              </div>
                              <AlertTriangle className="h-5 w-5" />
                            </div>
                          </div>

                          {/* Card content */}
                          <div className="bg-white p-4 dark:bg-gray-900">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-xs text-muted-foreground">Name</p>
                                <p className="font-medium">{profile.personalInfo.name}</p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">Blood Type</p>
                                <p className="font-medium">{profile.personalInfo.bloodType || "Unknown"}</p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">Age</p>
                                <p className="font-medium">{profile.personalInfo.age}</p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">Gender</p>
                                <p className="font-medium">{profile.personalInfo.gender || "Not specified"}</p>
                              </div>
                            </div>

                            <div className="mt-4">
                              <p className="text-xs text-muted-foreground">Medical Conditions</p>
                              <p className="font-medium">
                                {profile.medicalHistory.conditions.length > 0
                                  ? profile.medicalHistory.conditions.join(", ")
                                  : "None reported"}
                              </p>
                            </div>

                            <div className="mt-2">
                              <p className="text-xs text-muted-foreground">Allergies</p>
                              <p className="font-medium">{profile.medicalHistory.allergies || "None reported"}</p>
                            </div>

                            <div className="mt-2">
                              <p className="text-xs text-muted-foreground">Current Medications</p>
                              <p className="font-medium">{profile.medicalHistory.medications || "None reported"}</p>
                            </div>

                            <div className="flex justify-center mt-4">
                              {/* Using QR code API for printable card too */}
                              <img 
                                src={getQRCodeUrl(qrCodeData)}
                                alt="Emergency information QR code"
                                width={80}
                                height={80}
                                className="rounded"
                              />
                            </div>

                            <div className="mt-2 text-center text-xs text-muted-foreground">
                              <p>Scan for complete medical information</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-center">
                      <Button onClick={handlePrint} className="w-full max-w-xs">
                        <Printer className="h-4 w-4 mr-2" />
                        Print Emergency Card
                      </Button>
                    </div>

                    <div className="text-center text-sm text-muted-foreground">
                      <p>Print this card, cut it out, and keep it in your wallet or purse for emergency situations.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}