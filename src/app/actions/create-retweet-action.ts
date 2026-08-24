"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { sql } from "@/lib/neon";

export const createRetweet = async (originalPostId: string, content?: string) => {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  await sql`
    INSERT INTO posts (id, content, user_id, retweet_of_id)
    VALUES (gen_random_uuid(), ${content ?? ""}, ${session.user.id}, ${originalPostId}::uuid)`;

  revalidatePath("/");
};