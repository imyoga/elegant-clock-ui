import { WallClock } from "@/components/wall-clock"

export default function Page() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-8 p-8">
      <WallClock />
      <p className="text-muted-foreground text-sm tracking-widest uppercase font-light">Time in motion</p>
    </main>
  )
}
