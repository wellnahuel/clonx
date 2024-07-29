//server logic

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { AuthButton } from "./auth-button-client";

export const dynamic = "force-dynamic";

export async function AuthButtonServer() {
  const supabase = createServerComponentClient({ cookies }); //supabase client
  const {
    data: { session },
  } = await supabase.auth.getSession(); //recover the session

  return <AuthButton session={session} />;
}

//here is the server logic, if exist user session or not
