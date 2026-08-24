"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { sql } from "@/lib/neon";

const dynamic = "force-dynamic";

export const addPost = async (
  formData: FormData,
  replyToId?: string,
) => {
  const content = formData.get("post") as string;

  if (content === null || content.trim() === "") return;

  const session = await auth();
  if (!session?.user?.id) return;

  if (replyToId) {
    await sql`
      INSERT INTO posts (id, content, user_id, reply_to_id)
      VALUES (gen_random_uuid(), ${content}, ${session.user.id}, ${replyToId}::uuid)`;
  } else {
    await sql`
      INSERT INTO posts (id, content, user_id)
      VALUES (gen_random_uuid(), ${content}, ${session.user.id})`;
  }

  revalidatePath("/");
};
