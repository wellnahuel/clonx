"use client";
import { Avatar, Card, Link } from "@heroui/react";
import { IconHeart, IconMessage, IconRepeat } from "@tabler/icons-react";
import { useState } from "react";

export function CardPost({
  userName,
  avatarUrl,
  userFullName,
  content,
}: {
  userName: string;
  avatarUrl: string;
  userFullName: string;
  content: string;
}) {
  const [isFollowed, setIsFollowed] = useState(false);

  return (
    <Card className=" shadow-none bg-transparent hover:bg-slate-800 transition border-b rounded-none cursor-pointer border-white/20 p-5">
      <Card.Header className="justify-between">
        <div className="flex gap-2">
          <Link href={`/${userName}`}>
            <Avatar size="sm" className="w-10">
              <Avatar.Image src={avatarUrl} className="rounded-full" />
            </Avatar>
          </Link>
          <div className="flex flex-col gap-1 items-start justify-center">
            <h4 className="text-small font-semibold leading-none text-default-600">
              {userFullName}
            </h4>
            <h5 className="text-xs tracking-tight text-default-400">
              {userName}
            </h5>
          </div>
        </div>
      </Card.Header>
      <Card.Content className="px-3 py-0 text-small text-white bg-transparent">
        <p>{content}</p>
      </Card.Content>
      <Card.Footer className="gap-3">
        <IconMessage className="w-5 h-5" />
        <IconHeart className="w-5 h-5" />
        <IconRepeat className="w-5 h-5" />
      </Card.Footer>
    </Card>
  );
}
