"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, ArrowRight, AlertCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AudioPlayer } from "@/components/audio-player"
import { numbers } from "@/lib/data"
import { useToast } from "@/components/ui/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function LearnPage() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [audioUnavailable, setAudioUnavailable] = useState(false)
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const { toast } = useToast()

  // Filtrer les nombres selon la catégorie sélectionnée
  const filteredNumbers = (() => {
    switch (categoryFilter) {
      case "unites":
        return numbers.filter((n) => n.value >= 0 && n.value <= 10)
      case "dizaines":
        return numbers.filter((n) => n.value >= 11 && n.value <= 19)
      case "centaines":
        return numbers.filter((n) => n.value >= 20 && n.value <= 100)
      default:
        return numbers
    }
  })()

  const currentNumber = filteredNumbers[currentIndex] || numbers[0]

  useEffect(() => {
    // Réinitialiser l'index quand on change de catégorie
    setCurrentIndex(0)
  }, [categoryFilter])

  useEffect(() => {
    // Check if audio is available in this environment
    const checkAudioAvailability = async () => {
      try {
        // Try to fetch the first audio file to check if audio files are accessible
        const response = await fetch(numbers[0].audio)
        if (!response.ok) {
          setAudioUnavailable(true)
          toast({
            title: "Audio non disponible",
            description: "Les fichiers audio ne sont pas disponibles dans cet environnement.",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Error checking audio availability:", error)
        setAudioUnavailable(true)
      }
    }

    checkAudioAvailability()
  }, [toast])

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : prev))
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev < filteredNumbers.length - 1 ? prev + 1 : prev))
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex items-center mb-8">
        <Button variant="ghost" asChild>
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour à l'accueil
          </Link>
        </Button>
      </div>

      <div className="flex flex-col items-center justify-center space-y-8 text-center">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Apprendre les Nombres</h1>
        <p className="max-w-[700px] text-gray-500 md:text-xl">
          Explorez chaque nombre et ses différentes représentations
        </p>

        <div className="w-full max-w-xs">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filtrer par catégorie" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les nombres</SelectItem>
              <SelectItem value="unites">Unités (0-10)</SelectItem>
              <SelectItem value="dizaines">De 11 à 19</SelectItem>
              <SelectItem value="centaines">Dizaines et 100</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {audioUnavailable && (
        <Alert className="max-w-3xl mx-auto mt-6 mb-6 bg-amber-50 border-amber-200">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          <AlertTitle className="text-amber-800">Audio non disponible</AlertTitle>
          <AlertDescription className="text-amber-700">
            Les fichiers audio ne sont pas disponibles dans cet environnement. La fonction d'écoute est désactivée.
          </AlertDescription>
        </Alert>
      )}

      <div className="max-w-3xl mx-auto mt-12">
        <Card className="border-2">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Nombre {currentNumber.value}</CardTitle>
            <CardDescription>Représentations et translittérations</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
              <div className="space-y-6">
                <div className="text-center">
                  <p className="text-sm font-medium mb-2">Chiffre Oriental</p>
                  <div className="flex items-center justify-center h-24 w-24 mx-auto bg-muted rounded-lg text-6xl font-bold">
                    {currentNumber.eastern}
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium mb-2">Chiffre Occidental</p>
                  <div className="flex items-center justify-center h-24 w-24 mx-auto bg-muted rounded-lg text-6xl font-bold">
                    {currentNumber.western}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="text-center">
                  <p className="text-sm font-medium mb-2">Nom en Arabe</p>
                  <div
                    className="flex items-center justify-center h-24 w-full mx-auto bg-muted rounded-lg text-4xl font-bold"
                    dir="rtl"
                  >
                    {currentNumber.arabic}
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium mb-2">Translittération</p>
                  <div className="flex items-center justify-center h-24 w-full mx-auto bg-muted rounded-lg text-4xl font-bold">
                    {currentNumber.transliteration}
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center">
              <p className="text-xl font-medium">En français: {currentNumber.french}</p>
              {!audioUnavailable && (
                <AudioPlayer key={currentNumber.value} src={currentNumber.audio} className="mt-2" />
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button onClick={goToPrevious} disabled={currentIndex === 0}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Précédent
            </Button>
            <Button onClick={goToNext} disabled={currentIndex === filteredNumbers.length - 1}>
              Suivant
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>

        <div className="flex justify-center mt-8">
          <div className="flex flex-wrap gap-2 justify-center max-w-3xl">
            {filteredNumbers.map((_, index) => (
              <Button
                key={index}
                variant={index === currentIndex ? "default" : "outline"}
                size="icon"
                className="w-10 h-10"
                onClick={() => setCurrentIndex(index)}
              >
                {filteredNumbers[index].value}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
