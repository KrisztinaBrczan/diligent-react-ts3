import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

interface Post {
  id?: number;
  title: string;
  content: string;
}

const Posts = () => {
  const queryClient = useQueryClient();

  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");

  const { data: posts } = useQuery<Post[]>({
    queryFn: async () =>
      fetch("http://localhost:3000/posts").then((res) => res.json()),
    queryKey: ["posts"],
  });

  const createPostMutation = useMutation({
    mutationFn: async (newPost: Post) => {
      await fetch("http://localhost:3000/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPost),
      }).then((res) => res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["posts"],
      });
    },
  });

  const deletePostMutation = useMutation({
    mutationFn: async (id: number) => {
      await fetch(`http://localhost:3000/posts/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["posts"],
      });
    },
  });

  const handleCreatePost = () => {
    createPostMutation.mutate({ title, content });
    console.log("haho");
    setTitle("");
    setContent("");
  };

  const handleDeletePost = (id: number) => {
    console.log("id", id);
    deletePostMutation.mutate(id);
  };

  return (
    <>
      <input
        type="text"
        placeholder="title"
        name="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="text"
        placeholder="content"
        name="content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <button onClick={handleCreatePost}>Create Post</button>
      {posts &&
        posts.map((post) => (
          <div key={post.id}>
            <h2>{post.title}</h2>
            <p>{post.content}</p>
            <button onClick={() => handleDeletePost(Number(post.id))}>
              DELETE
            </button>
          </div>
        ))}
    </>
  );
};

export default Posts;
