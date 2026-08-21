"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { sql } from "@/lib/neon";

const dynamic = "force-dynamic";

export const addPost = async (formData: FormData) => {
  const content = formData.get("post") as string;

  if (content === null) return;

  const session = await auth();
  if (!session?.user?.id) return;

  await sql`
    INSERT INTO posts (id, content, user_id)
    VALUES (gen_random_uuid(), ${content}, ${session.user.id})`;

  revalidatePath("/");
};
