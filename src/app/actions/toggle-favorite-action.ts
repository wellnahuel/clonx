"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { sql } from "@/lib/neon";

export const toggleFavorite = async (postId: string) => {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const inserted = await sql`
    INSERT INTO favorites (post_id, user_id)
    VALUES (${postId}::uuid, ${session.user.id}::uuid)
    ON CONFLICT (post_id, user_id) DO NOTHING
    RETURNING 1`;

  if (inserted.length === 0) {
    await sql`
      DELETE FROM favorites
      WHERE post_id = ${postId}::uuid AND user_id = ${session.user.id}::uuid`;
  }

  revalidatePath("/");
};