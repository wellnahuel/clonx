import { auth } from "@/auth";
import { AuthButton } from "./auth-button-client";

export const dynamic = "force-dynamic";

export async function AuthButtonServer() {
  const session = await auth();

  return <AuthButton session={session} />;
}