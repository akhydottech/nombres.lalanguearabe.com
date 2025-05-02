"use client"

import { useState, useRef, useEffect } from "react"
import { Volume2, Pause, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface AudioPlayerProps {
  src?: string
  className?: string
}

export function AudioPlayer({ src, className }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [hasError, setHasError] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
      }
    }
  }, [])

  useEffect(() => {
    // Reset error state when src changes
    setHasError(false)

    // Check if the audio file is accessible
    if (src) {
      fetch(src)
        .then((response) => {
          if (!response.ok) {
            setHasError(true)
          }
        })
        .catch(() => {
          setHasError(true)
        })
    }
  }, [src])

  const togglePlay = () => {
    if (!src || hasError) return

    try {
      if (!audioRef.current) {
        const audio = new Audio()
        audio.src = src
        audioRef.current = audio

        audio.onended = () => setIsPlaying(false)
        audio.onerror = () => {
          console.error("Audio error:", audio.error)
          setHasError(true)
          setIsPlaying(false)
        }
      }

      if (isPlaying) {
        audioRef.current.pause()
        setIsPlaying(false)
      } else {
        audioRef.current.currentTime = 0

        // Use a try-catch block for the play() method
        try {
          const playPromise = audioRef.current.play()

          if (playPromise !== undefined) {
            playPromise
              .then(() => {
                setIsPlaying(true)
              })
              .catch((error) => {
                console.error("Play error:", error)
                setHasError(true)
                setIsPlaying(false)
              })
          }
        } catch (error) {
          console.error("Play attempt error:", error)
          setHasError(true)
          setIsPlaying(false)
        }
      }
    } catch (error) {
      console.error("Audio player error:", error)
      setHasError(true)
      setIsPlaying(false)
    }
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" className={className} onClick={togglePlay} disabled={!src || hasError}>
            {hasError ? (
              <AlertCircle className="h-5 w-5 text-destructive" />
            ) : isPlaying ? (
              <Pause className="h-5 w-5 text-primary" />
            ) : (
              <Volume2 className={`h-5 w-5 ${!src ? "text-muted-foreground opacity-50" : ""}`} />
            )}
            <span className="sr-only">
              {hasError ? "Audio non disponible" : isPlaying ? "Pause" : "Écouter la prononciation"}
            </span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          {hasError ? "Audio non disponible" : isPlaying ? "Pause" : "Écouter la prononciation"}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
