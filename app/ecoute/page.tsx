"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Check, X, RefreshCw, AlertCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { numbers } from "@/lib/data"
import { useToast } from "@/components/ui/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AudioPlayer } from "@/components/audio-player"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function ListeningExercisePage() {
  const [currentAudioIndex, setCurrentAudioIndex] = useState<number | null>(null)
  const [options, setOptions] = useState<typeof numbers>([])
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [score, setScore] = useState(0)
  const [totalQuestions, setTotalQuestions] = useState(0)
  const [audioError, setAudioError] = useState(false)
  const [audioUnavailable, setAudioUnavailable] = useState(false)
  const { toast } = useToast()
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  const getNumbersByCategory = (category: string) => {
    switch (category) {
      case "unites":
        return numbers.filter((n) => n.value >= 0 && n.value <= 10)
      case "dizaines":
        return numbers.filter((n) => n.value >= 11 && n.value <= 19)
      case "centaines":
        return numbers.filter((n) => n.value >= 20 && n.value <= 100)
      default:
        return numbers
    }
  }

  // Generate a new question
  const generateQuestion = () => {
    // Reset audio error state
    setAudioError(false)

    // Filtrer les nombres selon la catégorie
    const filteredNumbers = getNumbersByCategory(selectedCategory)

    // Select a random number for the audio
    const randomIndex = Math.floor(Math.random() * filteredNumbers.length)
    const selectedNumber = filteredNumbers[randomIndex]

    // Trouver l'index de ce nombre dans le tableau complet
    const fullIndex = numbers.findIndex((n) => n.value === selectedNumber.value)
    setCurrentAudioIndex(fullIndex)

    // Generate 4 options including the correct one
    const correctOption = selectedNumber
    const otherOptions = [...filteredNumbers]
      .filter((n) => n.value !== selectedNumber.value)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)

    // Combine and shuffle options
    const allOptions = [correctOption, ...otherOptions].sort(() => 0.5 - Math.random())
    setOptions(allOptions)

    // Reset state for new question
    setSelectedOption(null)
    setIsCorrect(null)
  }

  // Initialize first question
  useEffect(() => {
    generateQuestion()

    // Check if audio is available in this environment
    const checkAudioAvailability = async () => {
      try {
        // Try to fetch the first audio file to check if audio files are accessible
        const response = await fetch(numbers[0].audio)
        if (!response.ok) {
          setAudioUnavailable(true)
        }
      } catch (error) {
        console.error("Error checking audio availability:", error)
        setAudioUnavailable(true)
      }
    }

    checkAudioAvailability()
  }, [])

  const handleOptionSelect = (index: number) => {
    if (selectedOption !== null || currentAudioIndex === null) return

    setSelectedOption(index)
    const correct = options[index].value === numbers[currentAudioIndex].value
    setIsCorrect(correct)

    if (correct) {
      setScore((prev) => prev + 1)
    }
    setTotalQuestions((prev) => prev + 1)

    // Move to next question after a delay
    setTimeout(() => {
      generateQuestion()
    }, 1500)
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
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Exercices d'Écoute</h1>
        <p className="max-w-[700px] text-gray-500 md:text-xl">
          {audioUnavailable
            ? "Mode simulation: lisez le nombre affiché et sélectionnez la bonne réponse"
            : "Écoutez le nombre prononcé et sélectionnez la bonne réponse"}
        </p>
      </div>

      <div className="max-w-md mx-auto mt-4 mb-4">
        <Select
          value={selectedCategory}
          onValueChange={(value) => {
            setSelectedCategory(value)
            generateQuestion()
            setScore(0)
            setTotalQuestions(0)
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Choisir une catégorie" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les nombres</SelectItem>
            <SelectItem value="unites">Unités (0-10)</SelectItem>
            <SelectItem value="dizaines">De 11 à 19</SelectItem>
            <SelectItem value="centaines">Dizaines et 100</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {audioUnavailable && (
        <Alert className="max-w-2xl mx-auto mt-6 bg-amber-50 border-amber-200">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          <AlertTitle className="text-amber-800">Mode simulation activé</AlertTitle>
          <AlertDescription className="text-amber-700">
            Les fichiers audio ne sont pas disponibles dans cet environnement. Le nombre à identifier sera affiché à la
            place.
          </AlertDescription>
        </Alert>
      )}

      <div className="max-w-2xl mx-auto mt-12">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Identifiez le nombre</CardTitle>
              <div className="text-sm font-medium">
                Score: {score}/{totalQuestions}
              </div>
            </div>
            {totalQuestions > 0 && <Progress value={(score / totalQuestions) * 100} className="h-2" />}
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="flex flex-col items-center justify-center space-y-4">
              {audioUnavailable ? (
                <div className="h-24 w-24 rounded-full flex items-center justify-center bg-muted">
                  <span className="text-2xl font-bold">
                    {currentAudioIndex !== null ? numbers[currentAudioIndex].value : "?"}
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="h-24 w-24 rounded-full flex items-center justify-center bg-muted">
                    <AudioPlayer
                      key={currentAudioIndex} // Ajouter cette clé pour forcer la recréation du composant
                      src={currentAudioIndex !== null ? numbers[currentAudioIndex].audio : undefined}
                      className="h-12 w-12"
                    />
                  </div>
                </div>
              )}
              <CardDescription>
                {audioUnavailable
                  ? currentAudioIndex !== null
                    ? `Nombre à identifier: ${numbers[currentAudioIndex].french} (${numbers[currentAudioIndex].value})`
                    : "Cliquez pour afficher un nombre"
                  : "Cliquez sur l'icône pour écouter, puis sélectionnez le nombre correspondant"}
              </CardDescription>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {options.map((option, index) => {
                const isCorrectOption = currentAudioIndex !== null && option.value === numbers[currentAudioIndex].value
                const showAsCorrect = isCorrectOption && selectedOption !== null && !isCorrect

                return (
                  <Button
                    key={index}
                    variant={
                      selectedOption === index
                        ? isCorrect
                          ? "default"
                          : "destructive"
                        : showAsCorrect
                          ? "default"
                          : "outline"
                    }
                    className={`h-24 relative ${showAsCorrect ? "border-green-500 border-2" : ""}`}
                    onClick={() => handleOptionSelect(index)}
                    disabled={selectedOption !== null}
                  >
                    <div className="flex flex-col items-center">
                      <span className="text-3xl mb-1">{option.eastern}</span>
                      <span className="text-sm">{option.western}</span>
                    </div>
                    {selectedOption === index && isCorrect && (
                      <Check className="absolute right-2 top-2 h-5 w-5 text-green-500" />
                    )}
                    {selectedOption === index && isCorrect === false && (
                      <X className="absolute right-2 top-2 h-5 w-5 text-red-500" />
                    )}
                    {showAsCorrect && <Check className="absolute right-2 top-2 h-5 w-5 text-green-500" />}
                  </Button>
                )
              })}
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button variant="outline" onClick={generateQuestion} className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              Nouvelle question
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
