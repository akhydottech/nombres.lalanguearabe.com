"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Check, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { numbers } from "@/lib/data"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type QuizQuestion = {
  question: string
  options: string[]
  correctAnswer: string
}

// Ajouter cette fonction pour filtrer les nombres par catégorie
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

export default function QuizPage() {
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [score, setScore] = useState(0)
  const [quizCompleted, setQuizCompleted] = useState(false)

  // Ajouter un état pour la catégorie sélectionnée
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  // Modifier la fonction generateQuestions pour utiliser une catégorie
  const generateQuestions = (category = "all") => {
    const allQuestions: QuizQuestion[] = []
    const filteredNumbers = getNumbersByCategory(category)

    // Questions about eastern to western numerals
    filteredNumbers.forEach((number) => {
      allQuestions.push({
        question: `Quel est le chiffre occidental correspondant à ${number.eastern} ?`,
        options: shuffleArray([
          number.western,
          ...getRandomOptions(
            filteredNumbers.map((n) => n.western),
            number.western,
            3,
          ),
        ]),
        correctAnswer: number.western,
      })
    })

    // Questions about arabic names to numerals
    filteredNumbers.forEach((number) => {
      allQuestions.push({
        question: `Quel est le chiffre correspondant au mot arabe "${number.arabic}" ?`,
        options: shuffleArray([
          number.western,
          ...getRandomOptions(
            filteredNumbers.map((n) => n.western),
            number.western,
            3,
          ),
        ]),
        correctAnswer: number.western,
      })
    })

    // Questions about transliteration to arabic
    filteredNumbers.forEach((number) => {
      allQuestions.push({
        question: `Quelle est l'écriture arabe de "${number.transliteration}" ?`,
        options: shuffleArray([
          number.arabic,
          ...getRandomOptions(
            filteredNumbers.map((n) => n.arabic),
            number.arabic,
            3,
          ),
        ]),
        correctAnswer: number.arabic,
      })
    })

    return shuffleArray(allQuestions).slice(0, 10)
  }

  // Modifier useEffect pour utiliser la catégorie
  useEffect(() => {
    setQuestions(generateQuestions(selectedCategory))
  }, [selectedCategory])

  const getRandomOptions = (allOptions: string[], correctOption: string, count: number) => {
    const filteredOptions = allOptions.filter((option) => option !== correctOption)
    return shuffleArray(filteredOptions).slice(0, count)
  }

  const shuffleArray = <T,>(array: T[]): T[] => {
    const newArray = [...array]
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[newArray[i], newArray[j]] = [newArray[j], newArray[i]]
    }
    return newArray
  }

  const handleOptionSelect = (option: string) => {
    if (selectedOption !== null) return // Prevent multiple selections

    setSelectedOption(option)
    const correct = option === questions[currentQuestionIndex].correctAnswer
    setIsCorrect(correct)
    if (correct) {
      setScore((prev) => prev + 1)
    }

    // Move to next question after a delay
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1)
        setSelectedOption(null)
        setIsCorrect(null)
      } else {
        setQuizCompleted(true)
      }
    }, 1500)
  }

  const restartQuiz = () => {
    setQuestions(generateQuestions(selectedCategory))
    setCurrentQuestionIndex(0)
    setSelectedOption(null)
    setIsCorrect(null)
    setScore(0)
    setQuizCompleted(false)
  }

  if (questions.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center items-center">
        <p>Chargement du quiz...</p>
      </div>
    )
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
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Quiz des Nombres Arabes</h1>
        <p className="max-w-[700px] text-gray-500 md:text-xl">Testez vos connaissances sur les nombres arabes</p>
      </div>

      {/* Ajouter un sélecteur de catégorie dans l'interface */}
      {/* Ajouter après le titre et avant la carte du quiz */}
      <div className="max-w-md mx-auto mt-4 mb-8">
        <Select
          value={selectedCategory}
          onValueChange={(value) => {
            setSelectedCategory(value)
            setCurrentQuestionIndex(0)
            setSelectedOption(null)
            setIsCorrect(null)
            setScore(0)
            setQuizCompleted(false)
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

      <div className="max-w-2xl mx-auto mt-12">
        {!quizCompleted ? (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>
                  Question {currentQuestionIndex + 1}/{questions.length}
                </CardTitle>
                <div className="text-sm font-medium">
                  Score: {score}/{currentQuestionIndex}
                </div>
              </div>
              <Progress value={(currentQuestionIndex / questions.length) * 100} className="h-2" />
            </CardHeader>
            <CardContent className="space-y-6">
              <CardDescription className="text-xl font-medium text-center">
                {questions[currentQuestionIndex].question}
              </CardDescription>
              <div className="grid grid-cols-2 gap-4">
                {questions[currentQuestionIndex].options.map((option, index) => (
                  <Button
                    key={index}
                    variant={selectedOption === option ? (isCorrect ? "default" : "destructive") : "outline"}
                    className="h-16 text-xl relative"
                    onClick={() => handleOptionSelect(option)}
                    disabled={selectedOption !== null}
                  >
                    <span
                      dir={
                        option === questions[currentQuestionIndex].correctAnswer &&
                        questions[currentQuestionIndex].correctAnswer.match(/[\u0600-\u06FF]/)
                          ? "rtl"
                          : "ltr"
                      }
                    >
                      {option}
                    </span>
                    {selectedOption === option && isCorrect && (
                      <Check className="absolute right-2 h-5 w-5 text-green-500" />
                    )}
                    {selectedOption === option && isCorrect === false && (
                      <X className="absolute right-2 h-5 w-5 text-red-500" />
                    )}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Quiz Terminé!</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 text-center">
              <div className="text-4xl font-bold">
                {score}/{questions.length}
              </div>
              <CardDescription className="text-xl">
                {score === questions.length
                  ? "Parfait! Vous avez tout bon!"
                  : score >= questions.length * 0.7
                    ? "Très bien! Vous maîtrisez presque les nombres arabes."
                    : "Continuez à pratiquer pour améliorer votre score!"}
              </CardDescription>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button onClick={restartQuiz}>Recommencer le Quiz</Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  )
}
