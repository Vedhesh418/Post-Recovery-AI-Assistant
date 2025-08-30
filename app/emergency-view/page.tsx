"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function EmergencyViewPage() {
  const searchParams = useSearchParams()
  const [profile, setProfile] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const id = searchParams.get("id")

    if (!id) {
      setError("No emergency profile ID provided")
      return
    }

    try {
      // Decode the profile data from the ID
      const decodedData = JSON.parse(atob(id))
      setProfile(decodedData)
    } catch (err) {
      console.error("Error decoding profile:", err)
      setError("Invalid emergency profile data")
    }
  }, [searchParams])

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Error</CardTitle>
            <CardDescription>Could not load emergency profile</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">{error}</p>
            <Button asChild>
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-500 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-white rounded-full w-6 h-6 flex items-center justify-center">
                <span className="text-purple-600 font-bold text-xs">A</span>
              </div>
              <CardTitle className="ml-2">Emergency Health Information</CardTitle>
            </div>
            <AlertTriangle className="h-5 w-5" />
          </div>
          <CardDescription className="text-white/80">
            Critical medical information for emergency responders
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          {profile ? (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Name</h3>
                <p className="text-lg font-semibold">{profile.name}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Blood Type</h3>
                <p className="text-lg font-semibold">{profile.bloodType || "Unknown"}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Medical Conditions</h3>
                <p className="font-medium">
                  {profile.conditions && profile.conditions.length > 0
                    ? profile.conditions.join(", ")
                    : "None reported"}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Allergies</h3>
                <p className="font-medium">{profile.allergies || "None reported"}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Current Medications</h3>
                <p className="font-medium">{profile.medications || "None reported"}</p>
              </div>

              {profile.emergency_contact && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Emergency Contact</h3>
                  <p className="font-medium">{profile.emergency_contact}</p>
                </div>
              )}

              <div className="pt-4">
                <Button asChild variant="outline" className="w-full">
                  <Link href="/">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Home
                  </Link>
                </Button>
              </div>
            </div>
          ) : (
            <div className="py-8 text-center">
              <p>Loading emergency information...</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
