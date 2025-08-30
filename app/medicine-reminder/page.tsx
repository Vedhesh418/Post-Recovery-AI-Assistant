"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, Plus, Trash2, Bell, Check, X } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface Medication {
  id: string
  name: string
  dosage: string
  frequency: string
  time: string
  days: string[]
}

const daysOfWeek = [
  { value: "monday", label: "Mon" },
  { value: "tuesday", label: "Tue" },
  { value: "wednesday", label: "Wed" },
  { value: "thursday", label: "Thu" },
  { value: "friday", label: "Fri" },
  { value: "saturday", label: "Sat" },
  { value: "sunday", label: "Sun" },
]

export default function MedicineReminderPage() {
  const [medications, setMedications] = useState<Medication[]>([])
  const [newMedication, setNewMedication] = useState<Medication>({
    id: "",
    name: "",
    dosage: "",
    frequency: "daily",
    time: "08:00",
    days: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"],
  })
  const [activeTab, setActiveTab] = useState("all")
  const [showNotification, setShowNotification] = useState(false)
  const [notificationMed, setNotificationMed] = useState<Medication | null>(null)
  const { toast } = useToast()

  // Load medications from localStorage on component mount
  useEffect(() => {
    const savedMedications = localStorage.getItem("medications")
    if (savedMedications) {
      setMedications(JSON.parse(savedMedications))
    }

    // Set up notification check interval
    const interval = setInterval(checkForDueReminders, 60000)

    // Check once on load
    checkForDueReminders()

    return () => clearInterval(interval)
  }, [])

  // Save medications to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("medications", JSON.stringify(medications))
  }, [medications])

  // Fix the checkForDueReminders function to use proper date formatting
  const checkForDueReminders = () => {
    const now = new Date()
    // Get day of week in lowercase using a safer approach
    const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]
    const currentDay = days[now.getDay()]
    const currentTime = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false })

    // Find medications due within the next 5 minutes
    const dueReminders = medications.filter((med) => {
      if (!med.days.includes(currentDay)) return false

      const medTime = med.time
      const [medHour, medMinute] = medTime.split(":").map(Number)
      const [nowHour, nowMinute] = currentTime.split(":").map(Number)

      // Calculate time difference in minutes
      const medTimeInMinutes = medHour * 60 + medMinute
      const nowTimeInMinutes = nowHour * 60 + nowMinute
      const diff = medTimeInMinutes - nowTimeInMinutes

      // Due if time difference is between 0 and 5 minutes
      return diff >= 0 && diff <= 5
    })

    if (dueReminders.length > 0) {
      setNotificationMed(dueReminders[0])
      setShowNotification(true)

      // Request notification permission and show browser notification
      if (Notification.permission === "granted") {
        new Notification(`Time to take ${dueReminders[0].name}`, {
          body: `Dosage: ${dueReminders[0].dosage}`,
          icon: "/favicon.ico",
        })
      } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then((permission) => {
          if (permission === "granted") {
            new Notification(`Time to take ${dueReminders[0].name}`, {
              body: `Dosage: ${dueReminders[0].dosage}`,
              icon: "/favicon.ico",
            })
          }
        })
      }
    }
  }

  const handleAddMedication = () => {
    if (!newMedication.name || !newMedication.dosage) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    const updatedMedications = [...medications, { ...newMedication, id: Date.now().toString() }]

    setMedications(updatedMedications)

    // Reset form
    setNewMedication({
      id: "",
      name: "",
      dosage: "",
      frequency: "daily",
      time: "08:00",
      days: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"],
    })

    toast({
      title: "Medication added",
      description: `Reminder set for ${newMedication.name}`,
    })
  }

  const handleDeleteMedication = (id: string) => {
    setMedications(medications.filter((med) => med.id !== id))

    toast({
      title: "Medication removed",
      description: "The medication reminder has been deleted",
    })
  }

  const handleDayToggle = (day: string) => {
    if (newMedication.days.includes(day)) {
      setNewMedication({
        ...newMedication,
        days: newMedication.days.filter((d) => d !== day),
      })
    } else {
      setNewMedication({
        ...newMedication,
        days: [...newMedication.days, day],
      })
    }
  }

  const handleFrequencyChange = (value: string) => {
    if (value === "daily") {
      setNewMedication({
        ...newMedication,
        frequency: value,
        days: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"],
      })
    } else {
      setNewMedication({
        ...newMedication,
        frequency: value,
        days: [],
      })
    }
  }

  const getTodaysMedications = () => {
    const today = new Date()
    const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]
    const currentDay = days[today.getDay()]

    return medications.filter((med) => med.days.includes(currentDay))
  }

  const filteredMedications = activeTab === "all" ? medications : getTodaysMedications()

  return (
    <div className="min-h-screen">
      <Navbar />

      {showNotification && notificationMed && (
        <div className="fixed top-20 right-4 z-50 w-80 animate-in slide-in-from-right">
          <Card className="border-primary">
            <CardHeader className="bg-primary text-primary-foreground py-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Bell className="h-4 w-4 mr-2" />
                  <CardTitle className="text-sm">Medication Reminder</CardTitle>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-primary-foreground"
                  onClick={() => setShowNotification(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="py-3">
              <p className="font-medium">{notificationMed.name}</p>
              <p className="text-sm text-muted-foreground">Dosage: {notificationMed.dosage}</p>
              <p className="text-sm text-muted-foreground">Time: {notificationMed.time}</p>
            </CardContent>
            <CardFooter className="py-2 flex justify-end">
              <Button size="sm" variant="outline" className="mr-2" onClick={() => setShowNotification(false)}>
                Snooze
              </Button>
              <Button size="sm" onClick={() => setShowNotification(false)}>
                <Check className="h-4 w-4 mr-1" /> Taken
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}

      <div className="container px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-2">Medicine Reminder</h1>
            <p className="text-muted-foreground">Set up reminders for your medications and never miss a dose</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="glass-card glow md:col-span-1">
              <CardHeader>
                <CardTitle>Add Medication</CardTitle>
                <CardDescription>Create a new medication reminder</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="med-name">Medication Name</Label>
                  <Input
                    id="med-name"
                    placeholder="e.g., Aspirin"
                    value={newMedication.name}
                    onChange={(e) => setNewMedication({ ...newMedication, name: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="med-dosage">Dosage</Label>
                  <Input
                    id="med-dosage"
                    placeholder="e.g., 1 tablet"
                    value={newMedication.dosage}
                    onChange={(e) => setNewMedication({ ...newMedication, dosage: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="med-frequency">Frequency</Label>
                  <Select value={newMedication.frequency} onValueChange={handleFrequencyChange}>
                    <SelectTrigger id="med-frequency">
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="custom">Custom days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {newMedication.frequency === "custom" && (
                  <div className="space-y-2">
                    <Label>Days of Week</Label>
                    <div className="flex flex-wrap gap-2">
                      {daysOfWeek.map((day) => (
                        <Button
                          key={day.value}
                          type="button"
                          size="sm"
                          variant={newMedication.days.includes(day.value) ? "default" : "outline"}
                          onClick={() => handleDayToggle(day.value)}
                          className="flex-1 min-w-[3rem]"
                        >
                          {day.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="med-time">Time</Label>
                  <Input
                    id="med-time"
                    type="time"
                    value={newMedication.time}
                    onChange={(e) => setNewMedication({ ...newMedication, time: e.target.value })}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleAddMedication} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Medication
                </Button>
              </CardFooter>
            </Card>

            <Card className="glass-card glow md:col-span-2">
              <CardHeader>
                <CardTitle>Your Medications</CardTitle>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="all">All Medications</TabsTrigger>
                    <TabsTrigger value="today">Today's Medications</TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardHeader>
              <CardContent>
                {filteredMedications.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No medications added yet</p>
                    <p className="text-sm">Add your first medication to get started</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredMedications.map((med) => (
                      <div
                        key={med.id}
                        className="flex items-center justify-between p-4 rounded-lg bg-card border animate-in fade-in-0"
                      >
                        <div>
                          <h3 className="font-medium">{med.name}</h3>
                          <p className="text-sm text-muted-foreground">{med.dosage}</p>
                          <div className="flex items-center mt-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3 mr-1" />
                            <span>{med.time}</span>
                            <span className="mx-2">•</span>
                            <span>
                              {med.frequency === "daily" ? "Every day" : med.days.map((d) => d.slice(0, 3)).join(", ")}
                            </span>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteMedication(med.id)}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
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
