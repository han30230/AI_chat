import Link from "next/link";
import { characters } from "@/data/characters";
import { CharacterCard } from "@/components/CharacterCard";

function StarIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

export default function CharactersPage() {
  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-8">
      <header className="text-center mb-8 md:mb-10">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center justify-center gap-2">
          <StarIcon className="w-7 h-7 text-violet-500" />
          현실보다 더 설레는 대화
          <StarIcon className="w-7 h-7 text-violet-500" />
        </h1>
        <p className="text-gray-600 mt-7 text-sm md:text-base max-w-md mx-auto leading-relaxed">
          각 캐릭터는 저마다 다른 매력을 가지고 있습니다.
        </p>
        <p className="text-gray-500 mt-4 text-sm md:text-base max-w-md mx-auto leading-relaxed">
          그녀와 특별한 대화를 시작해보세요.
        </p>
      </header>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 max-w-5xl mx-auto">
        {characters.map((c) => (
          <Link key={c.id} href={`/chat/${c.id}`} className="block">
            <CharacterCard character={c} />
          </Link>
        ))}
      </div>
    </main>
  );
}
