"use client";

import { Avatar, Card, Link } from "@heroui/react";
import {
  IconHeart,
  IconHeartFilled,
  IconMessage,
  IconRepeat,
  IconX,
} from "@tabler/icons-react";
import { useEffect, useRef, useState, useTransition } from "react";
import { addPost } from "../actions/add-post-action";
import { createRetweet } from "../actions/create-retweet-action";
import { toggleFavorite } from "../actions/toggle-favorite-action";
import type { Post } from "@/app/types/posts";

export function CardPost({
  post,
  currentUserId,
  currentUserAvatarUrl,
}: {
  post: Post;
  currentUserId?: string | null;
  currentUserAvatarUrl?: string | null;
}) {
  const [isPending, startTransition] = useTransition();
  const [optimistic, setOptimistic] = useState<{
    liked: boolean;
    count: number;
  } | null>(null);
  const [replying, setReplying] = useState(false);
  const replyFormRef = useRef<HTMLFormElement>(null);

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

  const handleReplySubmit = async (formData: FormData) => {
    await addPost(formData, post.id);
    setReplying(false);
    replyFormRef.current?.reset();
  };

  const replyCount = post.replies?.length ?? 0;

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
          className="flex items-center gap-2 group"
        >
          <Avatar size="sm" className="rounded-full">
            <Avatar.Image src={author.avatar_url ?? ""} />
          </Avatar>
          <div className="flex flex-col gap-1 items-start justify-center">
            <h4 className="text-small font-semibold leading-none text-default-600 transition-colors group-hover:text-default-900">
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
          className="flex items-center gap-1.5 text-default-500 transition-colors hover:text-red-500 disabled:opacity-40 disabled:pointer-events-none"
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
          className="flex items-center gap-1.5 text-default-500 transition-colors hover:text-green-500 disabled:opacity-40 disabled:pointer-events-none"
        >
          <IconRepeat className="w-5 h-5" />
        </button>
        <button
          type="button"
          onClick={() => setReplying((v) => !v)}
          disabled={!interactive}
          aria-label="Responder"
          className={`flex items-center gap-1.5 text-default-500 transition-colors hover:text-sky-500 disabled:opacity-40 disabled:pointer-events-none ${
            replying ? "text-sky-500" : ""
          }`}
        >
          <IconMessage className="w-5 h-5" />
          {replyCount > 0 ? <span className="text-xs">{replyCount}</span> : null}
        </button>
      </div>
      {replying ? (
        <form
          ref={replyFormRef}
          action={handleReplySubmit}
          className="mt-3 flex gap-3 items-start border rounded-2xl p-3 border-black/15 dark:border-white/20"
        >
          <Avatar size="sm" className="rounded-full">
            <Avatar.Image src={currentUserAvatarUrl ?? ""} />
          </Avatar>
          <textarea
            name="post"
            rows={2}
            autoFocus
            placeholder="Escribe tu respuesta..."
            className="flex-1 bg-transparent text-sm text-black dark:text-white placeholder-gray-500 p-1 resize-none outline-none"
          />
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setReplying(false)}
              aria-label="Cerrar"
              className="text-default-400 hover:text-default-600 transition-colors"
            >
              <IconX className="w-5 h-5" />
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="bg-sky-500 hover:bg-sky-600 active:bg-sky-700 text-white text-xs font-bold rounded-full px-4 py-1.5 disabled:opacity-40 transition-colors"
            >
              {isPending ? "Enviando..." : "Responder"}
            </button>
          </div>
        </form>
      ) : null}
      {replyCount > 0 ? (
        <div className="mt-3 flex flex-col">
          {post.replies.map((reply) => (
            <div
              key={reply.id}
              className="flex gap-3 border-l-2 border-l-sky-300 dark:border-l-sky-700 ml-4 pl-3 py-2"
            >
              <Link
                href={`https://github.com/${reply.user_name}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Avatar size="sm" className="rounded-full">
                  <Avatar.Image src={reply.avatar_url ?? ""} />
                </Avatar>
              </Link>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <Link
                    href={`https://github.com/${reply.user_name}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold text-default-600 hover:text-default-900"
                  >
                    {reply.name}
                  </Link>
                  <span className="text-xs text-default-400">
                    @{reply.user_name}
                  </span>
                </div>
                <p className="text-sm text-black dark:text-white">
                  {reply.content}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </Card>
  );
}
