import { type Post } from "@/app/types/posts";
import { CardPost } from "./card-post";

export function ListPost({ posts }: { posts: Post[] | null }) {
  return (
    <>
      {posts?.map((post) => {
        const { id, content, avatar_url, name: userFullName, user_name: userName } = post;

        return (
          <CardPost
            key={id}
            userName={userName}
            userFullName={userFullName}
            avatarUrl={avatar_url ?? ""}
            content={content}
          />
        );
      })}
    </>
  );
}
