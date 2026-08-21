export type User = {
  id: string;
  name: string;
  user_name: string;
  avatar_url: string | null;
  created_at: string;
};

export type Post = {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  name: string;
  user_name: string;
  avatar_url: string | null;
};
