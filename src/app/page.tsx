import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { sql } from "@/lib/neon";
import { AuthButtonServer } from "./components/auth-button-server";
import { ComposePost } from "./components/compose-post";
import { ListPost } from "./components/list-post";
import { type Post } from "./types/posts";

export const dynamic = "force-dynamic";

export default async function Home() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const rows = await sql`
    SELECT p.id, p.content, p.created_at, p.user_id,
           u.name, u.user_name, u.avatar_url
    FROM posts p
    JOIN users u ON u.id = p.user_id
    ORDER BY p.created_at DESC`;

  const posts: Post[] = rows as unknown as Post[];

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <section className="max-w-[900px] w-full mx-auto border-l border-r border-white/20 min-h-screen">
        <ComposePost userAvatarUrl={session.user.avatarUrl ?? ""} />
        <ListPost posts={posts} />
      </section>
      <AuthButtonServer />
    </main>
  );
}
