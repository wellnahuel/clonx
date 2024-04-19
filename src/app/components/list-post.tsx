import { type Post } from "@/app/types/posts";
import { CardPost } from "./card-post";

export function ListPost({ posts }: { posts: Post[] | null }) {
  return (
    <>
      {posts?.map((post) => {
        const { id, content, user } = post;

        const {
          avatar_url: avatarUrl,
          name: userFullName,
          user_name: userName,
        } = user;

        return (
          <CardPost
            key={id}
            userName={userName}
            userFullName={userFullName}
            avatarUrl={avatarUrl}
            content={content}
          />
        );
      })}
    </>
  );
}
