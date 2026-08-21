import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { sql } from "@/lib/neon";

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user, profile }) {
      if (user) {
        const userName = profile?.login ?? user.name ?? "";
        const email = user.email ?? null;
        const avatarUrl = user.image ?? profile?.avatar_url ?? null;

        const [existing] = await sql`
          SELECT id FROM users WHERE user_name = ${userName}
            OR (${email} IS NOT NULL AND email = ${email}) LIMIT 1`;

        let id: string;
        if (existing) {
          id = existing.id;
          await sql`
            UPDATE users SET name = ${user.name}, avatar_url = ${avatarUrl},
              email = COALESCE(email, ${email}) WHERE id = ${id}`;
        } else {
          const [inserted] = await sql`
            INSERT INTO users (id, name, user_name, avatar_url, email)
            VALUES (gen_random_uuid(), ${user.name}, ${userName}, ${avatarUrl}, ${email})
            ON CONFLICT (user_name) DO UPDATE
              SET name = EXCLUDED.name, avatar_url = EXCLUDED.avatar_url,
                email = COALESCE(users.email, EXCLUDED.email)
            RETURNING id`;
          id = inserted.id;
        }

        token.sub = id;
        token.userName = userName;
        token.name = user.name;
        token.avatarUrl = avatarUrl;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.sub as string;
      session.user.userName = token.userName as string;
      session.user.name = token.name as string;
      session.user.avatarUrl = (token.avatarUrl as string) ?? null;
      return session;
    },
  },
});