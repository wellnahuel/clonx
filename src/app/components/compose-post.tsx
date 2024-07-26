//import { Avatar } from "@nextui-org/react";
"use client";
import Image from "next/image";
import { useRef } from "react";
import { addPost } from "../actions/add-post-action";
import { ComposePostButton } from "./compose-post-button";

interface Props {
  userAvatarUrl: string;
}

export function ComposePost({ userAvatarUrl }: Props): JSX.Element {
  const formRef = useRef<HTMLFormElement>(null);
  return (
    <form
      action={async (formData: FormData) => {
        await addPost(formData);
        formRef.current?.reset();
      }}
      className="flex flex-row gap-x-4 w-full p-3 border-b border-white/20"
      ref={formRef}
    >
      <Image
        src={userAvatarUrl}
        alt="User Avatar"
        width={48}
        height={48}
        className="rounded-full w-10 h-10 object-contain"
      />
      <div className="flex flex-1 flex-col gap-y-4">
        <textarea
          name="post"
          id="post"
          rows={4}
          className="w-full text-2xl bg-black placeholder-gray-500 p-2"
          placeholder="What is happening?!"
        />
        <ComposePostButton />
      </div>
    </form>
  );
}
