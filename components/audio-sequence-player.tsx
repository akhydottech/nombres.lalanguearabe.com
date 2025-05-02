"use client"

// Ajouter un nouveau composant pour gérer la lecture séquentielle d'audio

import { useState, useEffect, useRef } from "react"
import { Play, Volume2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"

interface AudioSequencePlayerProps {
  audioSources: string[]
  onComplete?: () => void
  className?: string
}

export function AudioSequencePlayer({ audioSources, onComplete, className }: AudioSequencePlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [audioUnavailable, setAudioUnavailable] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const { toast } = useToast()

  // Vérifier si les fichiers audio sont disponibles
  useEffect(() => {
    const checkAudioAvailability = async () => {
      try {
        // Vérifier si tous les fichiers audio sont accessibles
        const checkPromises = audioSources.map((src) => fetch(src).catch(() => ({ ok: false })))

        const results = await Promise.all(checkPromises)
        const allAvailable = results.every((result) => result.ok)

        if (!allAvailable) {
          setAudioUnavailable(true)
        }
      } catch (error) {
        console.error("Error checking audio availability:", error)
        setAudioUnavailable(true)
      }
    }

    if (audioSources.length > 0) {
      checkAudioAvailability()
    }
  }, [audioSources])

  // Nettoyer l'audio lors du démontage
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  const playNextInSequence = async () => {
    if (currentIndex >= audioSources.length) {
      setIsPlaying(false)
      setCurrentIndex(0)
      if (onComplete) onComplete()
      return
    }

    try {
      if (audioRef.current) {
        audioRef.current.pause()
      }

      audioRef.current = new Audio(audioSources[currentIndex])

      audioRef.current.onended = () => {
        setCurrentIndex((prev) => prev + 1)
      }

      audioRef.current.onerror = (e) => {
        console.error("Audio error:", e)
        setAudioUnavailable(true)
        setIsPlaying(false)
        toast({
          title: "Erreur audio",
          description: "Impossible de lire le fichier audio.",
          variant: "destructive",
        })
      }

      await audioRef.current.play()
    } catch (error) {
      console.error("Error playing audio:", error)
      setAudioUnavailable(true)
      setIsPlaying(false)
      toast({
        title: "Erreur audio",
        description: "Impossible de lire le fichier audio.",
        variant: "destructive",
      })
    }
  }

  // Surveiller les changements d'index pour jouer le prochain audio
  useEffect(() => {
    if (isPlaying) {
      playNextInSequence()
    }
  }, [currentIndex, isPlaying])

  const handlePlay = () => {
    if (audioUnavailable) return

    setCurrentIndex(0)
    setIsPlaying(true)
  }

  if (audioUnavailable) {
    return (
      <div className={`text-sm text-muted-foreground p-2 bg-muted/50 rounded-md ${className}`}>
        Mode simulation: audio non disponible
      </div>
    )
  }

  return (
    <Button
      variant="outline"
      size="lg"
      className={`flex items-center gap-2 ${className}`}
      onClick={handlePlay}
      disabled={isPlaying}
    >
      {isPlaying ? <Volume2 className="h-5 w-5 animate-pulse" /> : <Play className="h-5 w-5" />}
      {isPlaying ? "Lecture en cours..." : "Écouter la prononciation"}
    </Button>
  )
}
