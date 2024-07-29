import { AuthButtonServer } from "@/app/components/auth-button-server";

export const dynamic = "force-dynamic";

export default async function Login() {
  const AuthButtonComponent = await AuthButtonServer();

  return (
    <section className="grid place-content-center min-h-screen">
      <h1 className="text-xl font-bold mb-2">Inicia sesión en ClonX</h1>
      {AuthButtonComponent}
    </section>
  );
}
