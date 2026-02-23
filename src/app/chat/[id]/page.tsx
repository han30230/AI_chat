import { notFound } from "next/navigation";
import { getCharacterById } from "@/data/characters";
import { ChatWindow } from "@/components/ChatWindow";
import { Avatar } from "@/components/Avatar";

export default async function ChatPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const character = getCharacterById(id);
  if (!character) notFound();

  return (
    <main className="min-h-screen bg-zinc-950 flex flex-col md:flex-row">
      <aside className="md:w-64 md:min-h-screen md:border-r border-zinc-800 flex-shrink-0 order-2 md:order-1 flex flex-col items-center py-6 px-4 bg-zinc-950">
        <div className="relative w-40 h-40 md:w-52 md:h-52 rounded-full overflow-hidden bg-zinc-800 ring-2 ring-zinc-700">
          <Avatar
            src={character.avatar}
            alt={character.name}
            className="object-cover w-full h-full"
          />
        </div>
        <h2 className="mt-4 text-lg font-semibold text-zinc-100">
          {character.name}
        </h2>
        <p className="text-sm text-zinc-400 text-center mt-1">
          {character.tagline}
        </p>
      </aside>
      <section className="relative flex-1 flex flex-col min-h-[60vh] md:min-h-screen order-1 md:order-2 overflow-hidden">
        {/* 캐릭터 사진 전체 배경 (잘리지 않고 전부 보이게) */}
        <div
          className="absolute inset-0 bg-zinc-900 bg-contain bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${character.avatar})` }}
        />
        {/* 어두운 오버레이: 채팅 가독용 */}
        <div className="absolute inset-0 bg-black/55" />
        <div className="relative z-10 flex flex-col flex-1 min-h-0">
          <ChatWindow character={character} />
        </div>
      </section>
    </main>
  );
}
