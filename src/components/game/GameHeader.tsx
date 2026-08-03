import { GameImage } from "@/components/ui/GameImage";
import { Badge } from "@/components/ui/Badge";
import type { GameDTO } from "@/types/game";

export function GameHeader({ game, hasPromo }: { game: GameDTO; hasPromo: boolean }) {
  return (
    <div className="relative overflow-hidden">
      <div className="relative h-40 w-full sm:h-56">
        <GameImage src={game.banner ?? game.image} alt={game.name} priority sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/60 to-bg/10" />
      </div>

      <div className="mx-auto -mt-14 flex max-w-6xl items-end gap-4 px-4 md:px-8">
        <div className="relative size-24 shrink-0 overflow-hidden rounded-2xl border-2 border-[rgba(201,161,90,0.5)] bg-bg shadow-xl">
          <GameImage src={game.image} alt={game.name} />
        </div>
        <div className="pb-2">
          <h1 className="font-heading text-2xl font-semibold text-text sm:text-3xl">{game.name}</h1>
          <div className="mt-1.5 flex flex-wrap gap-2">
            <Badge variant="info">Proses Instan</Badge>
            {hasPromo && <Badge variant="promo">Promo Aktif</Badge>}
          </div>
        </div>
      </div>

      {game.description && (
        <p className="mx-auto mt-4 max-w-6xl px-4 text-sm leading-relaxed text-text-muted md:px-8">{game.description}</p>
      )}
    </div>
  );
}
