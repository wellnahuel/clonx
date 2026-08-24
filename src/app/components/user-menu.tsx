"use client";

import { Avatar } from "@heroui/react";
import { IconDoorExit } from "@tabler/icons-react";
import { signOut } from "next-auth/react";
import type { Session } from "next-auth";

export function UserMenu({ session }: { session: Session }) {
  const user = session.user;

  const handleSignOut = () => {
    signOut({ callbackUrl: "/login" });
  };

  return (
    <div className="flex items-center gap-3">
      <a
        href={`https://github.com/${user.userName}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2"
        title={`Ver perfil de ${user.userName} en GitHub`}
      >
        <Avatar size="sm" className="w-8 rounded-full">
          <Avatar.Image src={user.avatarUrl ?? ""} />
        </Avatar>
        <span className="hidden sm:inline text-sm font-semibold text-default-700">
          {user.name}
        </span>
      </a>
      <button
        type="button"
        onClick={handleSignOut}
        aria-label="Cerrar sesión"
        title="Cerrar sesión"
        className="flex items-center gap-1.5 p-2 rounded-full text-default-500 hover:text-red-500 hover:bg-red-500/10 transition"
      >
        <IconDoorExit className="w-5 h-5" />
        <span className="hidden sm:inline text-sm font-medium">Sign out</span>
      </button>
    </div>
  );
}
