import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"; // Creando un cliente de supabase en un componente de servidor
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AuthButtonServer } from "./components/auth-button-server";
import { ListPost } from "./components/list-post";
import { type Database } from "./types/database";

export default async function Home() {
  const supabase = createServerComponentClient<Database>({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const { data: posts } = await supabase
    .from("posts")
    .select("*, user:users(*)");

  console.log(posts);

  if (session === null) {
    redirect("/login");
  }

  /* const contentList = posts?.map((post) => (
    <div key={post.id}>{post.content}</div>
  )); */
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <section className="max-w-[900px] mx-auto border-l border-r border-white/20 min-h-screen">
        <AuthButtonServer />
        <ListPost posts={posts} />
      </section>
    </main>
  );
}

//Se ve un array vacio porque no le hemos dado permisos a supabase para que el usuario tenga accceso a estos posts

/* 
1. page.tsx
Este archivo es una página en Next.js y tiene la siguiente función:

Home: Es la página principal de la aplicación. Al cargar esta página, realiza lo siguiente:
Crea un cliente de Supabase para el servidor (createServerComponentClient) utilizando las cookies del cliente.
Obtiene todos los "posts" de la base de datos de Supabase.
Muestra un botón de autenticación (AuthButtonServer) y luego muestra los "posts" en formato JSON.
2. auth-button-client.tsx
Este archivo es un componente de React y se encarga de mostrar un botón para iniciar sesión o cerrar sesión, dependiendo del estado de la sesión del usuario. Aquí está lo que hace:

AuthButton: Recibe el estado de la sesión (session) como prop.
Utiliza el hook useRouter de Next.js para manejar la navegación.
Tiene funciones handleSignIn y handleSignOut para iniciar sesión y cerrar sesión respectivamente.
Muestra un botón que cambia entre "Sign in with Github" y "Sign out with Github" según el estado de la sesión.
3. auth-button-server.tsx
Este archivo también es un componente de React, pero está destinado a ser renderizado en el servidor, no en el cliente. Su función es la siguiente:

AuthButtonServer:
Crea un cliente de Supabase para el servidor (createServerComponentClient) utilizando las cookies del cliente.
Recupera la sesión del usuario (session) utilizando supabase.auth.getSession().
Retorna el componente AuthButton, pasando la sesión como prop.
4. route.ts
Este archivo define una función para manejar una ruta específica de la aplicación. En este caso, maneja una solicitud GET en una ruta dinámica y se usa para procesar el código de autorización después de que el usuario inicia sesión con proveedor OAuth (en este caso, Github). Aquí está lo que hace:

GET:
Extrae el código de autorización (code) de la URL de la solicitud.
Si hay un código, crea un cliente de Supabase para el manejador de rutas (createRouteHandlerClient) utilizando las cookies.
Intercambia el código por una sesión de usuario utilizando supabase.auth.exchangeCodeForSession(code).
Redirige al usuario de nuevo al origen de la solicitud (la raíz de la aplicación).
Estos componentes y el archivo de ruta trabajan juntos para permitir la autenticación de usuarios con Supabase en una aplicación Next.js, manejando tanto el lado del cliente como del servidor.

*/
