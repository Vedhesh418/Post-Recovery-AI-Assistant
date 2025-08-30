import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable"

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

export function generateHealthDigestPDF(profile: HealthProfile, insights: string): Blob {
  // Create a new jsPDF instance
  const doc = new jsPDF()

  // Add title
  doc.setFontSize(20)
  doc.setTextColor(128, 0, 128) // Purple color
  doc.text("Arogya Health Digest", 105, 15, { align: "center" })

  doc.setFontSize(12)
  doc.setTextColor(100, 100, 100)
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, 22, { align: "center" })

  // Add personal info
  doc.setFontSize(16)
  doc.setTextColor(0, 0, 0)
  doc.text("Personal Information", 14, 35)

  doc.setFontSize(10)
  doc.text(`Name: ${profile.personalInfo.name}`, 14, 45)
  doc.text(`Age: ${profile.personalInfo.age}`, 14, 50)
  doc.text(`Gender: ${profile.personalInfo.gender}`, 14, 55)
  doc.text(`Height: ${profile.personalInfo.height} cm`, 14, 60)
  doc.text(`Weight: ${profile.personalInfo.weight} kg`, 14, 65)
  doc.text(`Blood Type: ${profile.personalInfo.bloodType}`, 14, 70)

  // Add vital signs
  doc.setFontSize(16)
  doc.text("Vital Signs", 14, 85)

  // Create a table for vital signs
  const vitalSignsData = [
    ["Blood Pressure", profile.vitalSigns.bloodPressure || "N/A"],
    ["Heart Rate", profile.vitalSigns.heartRate ? `${profile.vitalSigns.heartRate} bpm` : "N/A"],
    ["Blood Sugar", profile.vitalSigns.bloodSugar ? `${profile.vitalSigns.bloodSugar} mg/dL` : "N/A"],
    ["Cholesterol", profile.vitalSigns.cholesterol ? `${profile.vitalSigns.cholesterol} mg/dL` : "N/A"],
  ]

  // Add the table to the PDF
  autoTable(doc, {
    startY: 90,
    head: [["Metric", "Value"]],
    body: vitalSignsData,
    theme: "grid",
    headStyles: { fillColor: [128, 0, 128] },
  })

  // Add medical history
  doc.setFontSize(16)
  doc.text("Medical History", 14, doc.lastAutoTable.finalY + 15)

  // Create a table for medical conditions
  const conditionsText =
    profile.medicalHistory.conditions.length > 0 ? profile.medicalHistory.conditions.join(", ") : "None reported"

  const medicalHistoryData = [
    ["Medical Conditions", conditionsText],
    ["Allergies", profile.medicalHistory.allergies || "None reported"],
    ["Current Medications", profile.medicalHistory.medications || "None reported"],
    ["Past Surgeries", profile.medicalHistory.surgeries || "None reported"],
  ]

  // Add the table to the PDF
  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 20,
    head: [["Category", "Details"]],
    body: medicalHistoryData,
    theme: "grid",
    headStyles: { fillColor: [128, 0, 128] },
  })

  // Add lifestyle information
  doc.setFontSize(16)
  doc.text("Lifestyle", 14, doc.lastAutoTable.finalY + 15)

  const lifestyleData = [
    ["Smoking", profile.lifestyle.smoking],
    ["Alcohol", profile.lifestyle.alcohol],
    ["Exercise", profile.lifestyle.exercise],
    ["Diet", profile.lifestyle.diet],
    ["Sleep", profile.lifestyle.sleep],
  ]

  // Add the table to the PDF
  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 20,
    head: [["Category", "Status"]],
    body: lifestyleData,
    theme: "grid",
    headStyles: { fillColor: [128, 0, 128] },
  })

  // Add a new page for insights
  doc.addPage()

  // Add insights
  doc.setFontSize(16)
  doc.setTextColor(128, 0, 128)
  doc.text("Health Insights & Recommendations", 105, 15, { align: "center" })

  // Format and add the insights text
  doc.setFontSize(10)
  doc.setTextColor(0, 0, 0)

  const insightsLines = insights.split("\n")
  let y = 30

  for (const line of insightsLines) {
    if (line.startsWith("#")) {
      // Handle headings
      doc.setFontSize(14)
      doc.setTextColor(128, 0, 128)
      doc.text(line.replace(/^#+\s/, ""), 14, y)
      doc.setFontSize(10)
      doc.setTextColor(0, 0, 0)
      y += 8
    } else if (line.trim() === "") {
      // Handle empty lines
      y += 5
    } else {
      // Handle regular text with word wrapping
      const textLines = doc.splitTextToSize(line, 180)
      for (const textLine of textLines) {
        doc.text(textLine, 14, y)
        y += 5
      }
    }

    // Add a new page if we're near the bottom
    if (y > 270) {
      doc.addPage()
      y = 20
    }
  }

  // Add footer
  const pageCount = doc.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.setTextColor(150, 150, 150)
    doc.text(`Arogya Health Digest - Page ${i} of ${pageCount}`, 105, 290, { align: "center" })
  }

  return doc.output("blob")
}
