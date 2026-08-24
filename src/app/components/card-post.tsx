"use client";

import { Avatar, Card, Link } from "@heroui/react";
import {
  IconHeart,
  IconHeartFilled,
  IconMessage,
  IconRepeat,
} from "@tabler/icons-react";
import { useEffect, useState, useTransition } from "react";
import { createRetweet } from "../actions/create-retweet-action";
import { toggleFavorite } from "../actions/toggle-favorite-action";
import type { Post } from "@/app/types/posts";

export function CardPost({
  post,
  currentUserId,
}: {
  post: Post;
  currentUserId?: string | null;
}) {
  const [isPending, startTransition] = useTransition();
  const [optimistic, setOptimistic] = useState<{
    liked: boolean;
    count: number;
  } | null>(null);

  useEffect(() => {
    if (!isPending) setOptimistic(null);
  }, [isPending]);

  const liked = optimistic?.liked ?? post.liked_by_me;
  const favoriteCount = optimistic?.count ?? post.favorite_count;
  const interactive = currentUserId != null;

  const author = post.retweet_of ?? post;

  const handleToggleFavorite = () => {
    if (!interactive) return;
    startTransition(async () => {
      setOptimistic({
        liked: !liked,
        count: favoriteCount + (liked ? -1 : 1),
      });
      await toggleFavorite(post.id);
    });
  };

  const handleRetweet = () => {
    if (!interactive) return;
    startTransition(async () => {
      await createRetweet(post.id);
    });
  };

  return (
    <Card className="shadow-none bg-transparent hover:bg-zinc-100 dark:hover:bg-zinc-800 transition border-b rounded-none border-black/15 dark:border-white/20 p-5">
      {post.retweet_of ? (
        <div className="flex items-center gap-2 pb-3 text-xs text-default-400">
          <IconRepeat className="w-4 h-4" />
          <Link
            href={`https://github.com/${post.user_name}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-default-500"
          >
            {post.name} retweeted
          </Link>
        </div>
      ) : null}
      <div className="flex gap-2">
        <Link
          href={`https://github.com/${author.user_name}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2"
        >
          <Avatar size="sm" className="w-10 rounded-full">
            <Avatar.Image src={author.avatar_url ?? ""} />
          </Avatar>
          <div className="flex flex-col gap-1 items-start justify-center">
            <h4 className="text-small font-semibold leading-none text-default-600">
              {author.name}
            </h4>
            <h5 className="text-xs tracking-tight text-default-400">
              @{author.user_name}
            </h5>
          </div>
        </Link>
      </div>
      <div className="px-1 py-3 text-small text-black dark:text-white">
        <p>{post.retweet_of?.content ?? post.content}</p>
      </div>
      <div className="flex items-center gap-6">
        <button
          type="button"
          onClick={handleToggleFavorite}
          disabled={!interactive || isPending}
          aria-label={liked ? "Quitar de favoritos" : "Marcar como favorito"}
          className="flex items-center gap-1.5 transition hover:opacity-80 disabled:opacity-40 disabled:pointer-events-none"
        >
          {liked ? (
            <IconHeartFilled className="w-5 h-5 text-red-500" />
          ) : (
            <IconHeart className="w-5 h-5" />
          )}
          <span className="text-xs">{favoriteCount}</span>
        </button>
        <button
          type="button"
          onClick={handleRetweet}
          disabled={!interactive || isPending}
          aria-label="Retweetear"
          className="flex items-center gap-1.5 transition hover:opacity-80 disabled:opacity-40 disabled:pointer-events-none"
        >
          <IconRepeat className="w-5 h-5" />
        </button>
        <IconMessage className="w-5 h-5" />
      </div>
    </Card>
  );
}
