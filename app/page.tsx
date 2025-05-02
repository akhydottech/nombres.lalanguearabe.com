import Link from "next/link"
import { ArrowRight, Volume2, Construction } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AudioPlayer } from "@/components/audio-player"
import { numbers } from "@/lib/data"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function Home() {
  // Grouper les nombres par catégories
  const unites = numbers.filter((n) => n.value >= 0 && n.value <= 10)
  const dizaines = numbers.filter((n) => n.value >= 11 && n.value <= 19)
  const centaines = numbers.filter((n) => n.value >= 20 && n.value <= 100)

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col items-center justify-center space-y-8 text-center">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">Apprenez les Nombres Arabes</h1>
        <p className="max-w-[700px] text-gray-500 md:text-xl">
          Une application interactive pour apprendre les nombres arabes et leurs translittérations
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button asChild size="lg">
            <Link href="/apprendre">
              Commencer à apprendre
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/quiz">Tester vos connaissances</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/ecoute">
              Exercices d'écoute
              <Volume2 className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/construire">
              Construire des nombres
              <Construction className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 mt-16">
        <Card>
          <CardHeader>
            <CardTitle>Nombres Arabes</CardTitle>
            <CardDescription>Les nombres en arabe avec leurs translittérations</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="unites" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="unites">Unités (0-10)</TabsTrigger>
                <TabsTrigger value="dizaines">De 11 à 19</TabsTrigger>
                <TabsTrigger value="centaines">Dizaines et 100</TabsTrigger>
              </TabsList>
              <TabsContent value="unites" className="mt-4">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="py-2 px-4 text-left">Valeur</th>
                        <th className="py-2 px-4 text-left">Chiffre Oriental</th>
                        <th className="py-2 px-4 text-left">Chiffre Occidental</th>
                        <th className="py-2 px-4 text-left">Nom en Arabe</th>
                        <th className="py-2 px-4 text-left">Translittération</th>
                        <th className="py-2 px-4 text-left">Nom en Français</th>
                        <th className="py-2 px-4 text-left">Audio</th>
                      </tr>
                    </thead>
                    <tbody>
                      {unites.map((number) => (
                        <tr key={number.value} className="border-b hover:bg-muted/50">
                          <td className="py-3 px-4">{number.value}</td>
                          <td className="py-3 px-4 text-xl">{number.eastern}</td>
                          <td className="py-3 px-4">{number.western}</td>
                          <td className="py-3 px-4 text-xl" dir="rtl">
                            {number.arabic}
                          </td>
                          <td className="py-3 px-4">{number.transliteration}</td>
                          <td className="py-3 px-4">{number.french}</td>
                          <td className="py-3 px-4">
                            <AudioPlayer src={number.audio} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent>
              <TabsContent value="dizaines" className="mt-4">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="py-2 px-4 text-left">Valeur</th>
                        <th className="py-2 px-4 text-left">Chiffre Oriental</th>
                        <th className="py-2 px-4 text-left">Chiffre Occidental</th>
                        <th className="py-2 px-4 text-left">Nom en Arabe</th>
                        <th className="py-2 px-4 text-left">Translittération</th>
                        <th className="py-2 px-4 text-left">Nom en Français</th>
                        <th className="py-2 px-4 text-left">Audio</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dizaines.map((number) => (
                        <tr key={number.value} className="border-b hover:bg-muted/50">
                          <td className="py-3 px-4">{number.value}</td>
                          <td className="py-3 px-4 text-xl">{number.eastern}</td>
                          <td className="py-3 px-4">{number.western}</td>
                          <td className="py-3 px-4 text-xl" dir="rtl">
                            {number.arabic}
                          </td>
                          <td className="py-3 px-4">{number.transliteration}</td>
                          <td className="py-3 px-4">{number.french}</td>
                          <td className="py-3 px-4">
                            <AudioPlayer src={number.audio} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent>
              <TabsContent value="centaines" className="mt-4">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="py-2 px-4 text-left">Valeur</th>
                        <th className="py-2 px-4 text-left">Chiffre Oriental</th>
                        <th className="py-2 px-4 text-left">Chiffre Occidental</th>
                        <th className="py-2 px-4 text-left">Nom en Arabe</th>
                        <th className="py-2 px-4 text-left">Translittération</th>
                        <th className="py-2 px-4 text-left">Nom en Français</th>
                        <th className="py-2 px-4 text-left">Audio</th>
                      </tr>
                    </thead>
                    <tbody>
                      {centaines.map((number) => (
                        <tr key={number.value} className="border-b hover:bg-muted/50">
                          <td className="py-3 px-4">{number.value}</td>
                          <td className="py-3 px-4 text-xl">{number.eastern}</td>
                          <td className="py-3 px-4">{number.western}</td>
                          <td className="py-3 px-4 text-xl" dir="rtl">
                            {number.arabic}
                          </td>
                          <td className="py-3 px-4">{number.transliteration}</td>
                          <td className="py-3 px-4">{number.french}</td>
                          <td className="py-3 px-4">
                            <AudioPlayer src={number.audio} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter>
            <p className="text-sm text-muted-foreground">
              Cliquez sur l'icône du haut-parleur pour écouter la prononciation de chaque nombre.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
