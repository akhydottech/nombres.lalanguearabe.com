"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AudioPlayer } from "@/components/audio-player"
import { numbers, conjunctions, getDizaines, getUnites } from "@/lib/data"
import { useToast } from "@/components/ui/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AudioSequencePlayer } from "@/components/audio-sequence-player"

export default function ConstruirePage() {
  const [selectedDizaine, setSelectedDizaine] = useState<string | null>(null)
  const [selectedUnite, setSelectedUnite] = useState<string | null>(null)
  const [audioUnavailable, setAudioUnavailable] = useState(false)
  const { toast } = useToast()

  const dizaines = getDizaines()
  const unites = getUnites()

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

  // Calculer le nombre composé
  const composedNumber =
    selectedDizaine && selectedUnite ? Number.parseInt(selectedDizaine) + Number.parseInt(selectedUnite) : null
  const composedEastern =
    selectedDizaine && selectedUnite
      ? dizaines.find((n) => n.value.toString() === selectedDizaine)?.eastern.slice(0, -1) +
        unites.find((n) => n.value.toString() === selectedUnite)?.eastern
      : null

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
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Construire des Nombres</h1>
        <p className="max-w-[700px] text-gray-500 md:text-xl">
          Apprenez à construire et prononcer des nombres composés en arabe
        </p>
      </div>

      {audioUnavailable && (
        <Alert className="max-w-3xl mx-auto mt-6 mb-6 bg-amber-50 border-amber-200">
          <AlertTitle className="text-amber-800">Audio non disponible</AlertTitle>
          <AlertDescription className="text-amber-700">
            Les fichiers audio ne sont pas disponibles dans cet environnement. La fonction d'écoute est désactivée.
          </AlertDescription>
        </Alert>
      )}

      <div className="max-w-3xl mx-auto mt-12">
        <Card className="border-2">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Construire un nombre composé</CardTitle>
            <CardDescription>
              Sélectionnez une dizaine et une unité pour former un nombre composé (ex: 34 = 30 + 4)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              {/* Sélection de la dizaine */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Dizaine</label>
                <Select value={selectedDizaine || ""} onValueChange={setSelectedDizaine}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    {dizaines.map((dizaine) => (
                      <SelectItem key={dizaine.value} value={dizaine.value.toString()}>
                        {dizaine.value} - {dizaine.arabic}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedDizaine && (
                  <div className="flex items-center justify-center mt-2">
                    <div className="text-2xl font-bold mr-2">
                      {dizaines.find((n) => n.value.toString() === selectedDizaine)?.eastern}
                    </div>
                    {!audioUnavailable && (
                      <AudioPlayer
                        src={dizaines.find((n) => n.value.toString() === selectedDizaine)?.audio}
                        className="h-8 w-8"
                      />
                    )}
                  </div>
                )}
              </div>

              {/* Conjonction "wa" (et) */}
              <div className="flex flex-col items-center justify-center">
                <div className="text-xl font-bold mb-2" dir="rtl">
                  {conjunctions.wa.arabic}
                </div>
                <div className="text-sm">{conjunctions.wa.transliteration}</div>
                {!audioUnavailable && <AudioPlayer src={conjunctions.wa.audio} className="mt-2" />}
              </div>

              {/* Sélection de l'unité */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Unité</label>
                <Select value={selectedUnite || ""} onValueChange={setSelectedUnite}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    {unites.map((unite) => (
                      <SelectItem key={unite.value} value={unite.value.toString()}>
                        {unite.value} - {unite.arabic}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedUnite && (
                  <div className="flex items-center justify-center mt-2">
                    <div className="text-2xl font-bold mr-2">
                      {unites.find((n) => n.value.toString() === selectedUnite)?.eastern}
                    </div>
                    {!audioUnavailable && (
                      <AudioPlayer
                        src={unites.find((n) => n.value.toString() === selectedUnite)?.audio}
                        className="h-8 w-8"
                      />
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Résultat */}
            {composedNumber && (
              <div className="mt-8 p-6 bg-muted rounded-lg">
                <div className="text-center space-y-4">
                  <h3 className="text-xl font-semibold">Nombre composé</h3>
                  <div className="flex flex-col md:flex-row items-center justify-center gap-8">
                    <div className="text-center">
                      <div className="text-sm font-medium mb-1">Occidental</div>
                      <div className="text-4xl font-bold">{composedNumber}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-medium mb-1">Oriental</div>
                      <div className="text-4xl font-bold">{composedEastern}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-medium mb-1">Prononciation</div>
                      <div className="flex items-center justify-center">
                        {selectedDizaine && selectedUnite && (
                          <AudioSequencePlayer
                            audioSources={[
                              dizaines.find((n) => n.value.toString() === selectedDizaine)?.audio || "",
                              conjunctions.wa.audio,
                              unites.find((n) => n.value.toString() === selectedUnite)?.audio || "",
                            ]}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-center mt-4">
                    <p className="text-sm text-muted-foreground">
                      En arabe, {composedNumber} se dit{" "}
                      <span className="font-medium">
                        {dizaines.find((n) => n.value.toString() === selectedDizaine)?.arabic} {conjunctions.wa.arabic}{" "}
                        {unites.find((n) => n.value.toString() === selectedUnite)?.arabic}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-muted-foreground">
              En arabe, les nombres composés (21-99) se forment en disant d'abord la dizaine, puis la conjonction "wa"
              (et), puis l'unité.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
