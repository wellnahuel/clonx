import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { sql } from "@/lib/neon";
import { AuthButtonServer } from "./components/auth-button-server";
import { ComposePost } from "./components/compose-post";
import { ListPost } from "./components/list-post";
import { ThemeToggle } from "./components/theme-toggle";
import { type Post } from "./types/posts";

export const dynamic = "force-dynamic";

type FeedRow = {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  name: string;
  user_name: string;
  avatar_url: string | null;
  favorite_count: string | number;
  liked_by_me: boolean;
  retweet_of_id: string | null;
  retweet_of_content: string | null;
  retweet_of_created_at: string | null;
  retweet_of_user_id: string | null;
  retweet_of_name: string | null;
  retweet_of_user_name: string | null;
  retweet_of_avatar_url: string | null;
};

export default async function Home() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const uid = session.user.id;

  const rows = (await sql`
    SELECT p.id, p.content, p.created_at, p.user_id,
           u.name, u.user_name, u.avatar_url,
           (SELECT count(*) FROM favorites f WHERE f.post_id = p.id) AS favorite_count,
           EXISTS(SELECT 1 FROM favorites f
                  WHERE f.post_id = p.id AND f.user_id = ${uid}::uuid) AS liked_by_me,
           rp.id AS retweet_of_id, rp.content AS retweet_of_content,
           rp.created_at AS retweet_of_created_at,
           ru.id AS retweet_of_user_id, ru.name AS retweet_of_name,
           ru.user_name AS retweet_of_user_name, ru.avatar_url AS retweet_of_avatar_url
    FROM posts p
    JOIN users u ON u.id = p.user_id
    LEFT JOIN posts rp ON rp.id = p.retweet_of_id
    LEFT JOIN users ru ON ru.id = rp.user_id
    ORDER BY p.created_at DESC`) as unknown as FeedRow[];

  const posts: Post[] = rows.map((row) => ({
    id: row.id,
    content: row.content,
    created_at: row.created_at,
    user_id: row.user_id,
    name: row.name,
    user_name: row.user_name,
    avatar_url: row.avatar_url,
    favorite_count: Number(row.favorite_count ?? 0),
    liked_by_me: Boolean(row.liked_by_me),
    retweet_of: row.retweet_of_id
      ? {
          id: row.retweet_of_id,
          content: row.retweet_of_content ?? "",
          created_at: row.retweet_of_created_at ?? "",
          user_id: row.retweet_of_user_id ?? "",
          name: row.retweet_of_name ?? "",
          user_name: row.retweet_of_user_name ?? "",
          avatar_url: row.retweet_of_avatar_url,
        }
      : null,
  }));

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <div className="w-full max-w-[900px] mx-auto flex items-center justify-end gap-2 p-3 border-b border-black/15 dark:border-white/20">
        <ThemeToggle />
      </div>
      <section className="max-w-[900px] w-full mx-auto border-l border-r border-black/15 dark:border-white/20 min-h-screen">
        <ComposePost userAvatarUrl={session.user.avatarUrl ?? ""} />
        <ListPost posts={posts} currentUserId={uid} />
      </section>
      <AuthButtonServer />
    </main>
  );
}