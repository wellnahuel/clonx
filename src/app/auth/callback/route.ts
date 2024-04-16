import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";

export const dynamic = "force-dynamic"; // this is for avoid to cache the route - is an option of nextjs

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code"); //this code is from the url

  if (code) {
    const supabase = createRouteHandlerClient({ cookies }); //create supabase client
    await supabase.auth.exchangeCodeForSession(code); //this return us the user session
  }

  return NextResponse.redirect(requestUrl.origin); //could be just '/' inside the ()
}
