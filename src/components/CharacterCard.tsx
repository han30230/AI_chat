"use client";

import type { Character } from "@/lib/types";
import { Avatar } from "./Avatar";

const STATUS_COLORS = [
  "bg-violet-500",
  "bg-red-500",
  "bg-emerald-500",
  "bg-blue-500",
  "bg-amber-500",
  "bg-rose-500",
] as const;

function StatusBadge({ characterId }: { characterId: string }) {
  const index =
    characterId.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) %
    STATUS_COLORS.length;
  return (
    <span
      className={`absolute bottom-0 right-0 w-6 h-6 rounded-full border-2 border-white ${STATUS_COLORS[index]} ring-2 ring-gray-100`}
      aria-hidden
    />
  );
}

export function CharacterCard({ character }: { character: Character }) {
  return (
    <article className="group h-full rounded-2xl bg-white p-4 shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 border border-gray-100">
      <div className="flex flex-col items-center text-center">
        <div className="relative mb-3">
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden bg-gray-100 ring-2 ring-gray-100">
            <Avatar
              src={character.avatar}
              alt={character.name}
              className="w-full h-full object-cover"
            />
          </div>
          <StatusBadge characterId={character.id} />
        </div>
        <h3 className="font-bold text-gray-900 text-base md:text-lg">
          {character.name}
        </h3>
        <p className="text-gray-600 text-xs md:text-sm mt-1 line-clamp-2 leading-snug">
          {character.personality}
        </p>
      </div>
    </article>
  );
}
