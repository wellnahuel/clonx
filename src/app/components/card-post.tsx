"use client";
import {
  Avatar,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Link,
} from "@nextui-org/react";
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
    <Card className="shadow-none bg-transparent hover:bg-slate-800 transition border-b rounded-none cursor-pointer border-white/20">
      <CardHeader className="justify-between">
        <div className="flex gap-2">
          <Link href={`/${userName}`}>
            <Avatar radius="full" size="sm" src={avatarUrl} />
          </Link>
          <div className="flex flex-col gap-1 items-start justify-center">
            <h4 className="text-small font-semibold leading-none text-default-600">
              {userFullName}
            </h4>
            <h5 className="text-small tracking-tight text-default-400">
              {userName}
            </h5>
          </div>
        </div>
      </CardHeader>
      <CardBody className="px-3 py-0 text-small text-white bg-transparent">
        <p>{content}</p>
      </CardBody>
      <CardFooter className="gap-3"></CardFooter>
    </Card>
  );
}
