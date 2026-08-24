import { type Post } from "@/app/types/posts";
import { CardPost } from "./card-post";

export function ListPost({
  posts,
  currentUserId,
  currentUserAvatarUrl,
}: {
  posts: Post[] | null;
  currentUserId?: string | null;
  currentUserAvatarUrl?: string | null;
}) {
  return (
    <>
      {posts?.map((post) => (
        <CardPost
          key={post.id}
          post={post}
          currentUserId={currentUserId}
          currentUserAvatarUrl={currentUserAvatarUrl}
        />
      ))}
    </>
  );
}
