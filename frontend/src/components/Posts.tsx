import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import Post from "./Post";

export interface Post {
  id: number;
  title: string;
  content: string;
}

interface NewPost {
  title: string;
  content: string;
}

const Posts = () => {
  const queryClient = useQueryClient();

  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [ editId, setEditId ] = useState<number>(0);

  const { data: posts } = useQuery<Post[]>({
    queryFn: async () =>
      fetch("http://localhost:3000/posts").then((res) => res.json()),
    queryKey: ["posts"],
  });

  const createPostMutation = useMutation({
    mutationFn: async (newPost: NewPost) => {
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

  const updatePostMutation = useMutation({
    mutationFn: async (updatedPost: Post) => {
      await fetch(`http://localhost:3000/posts/${updatedPost.id}`, {
        method: "PUT",
        headers: {"Content-Type" : "application/json"},
        body: JSON.stringify({title: updatedPost.title, content: updatedPost.content})
      }).then((res) => res.json())
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["posts"]
      })
    }
  })

  const handleCreatePost = () => {
    createPostMutation.mutate({ title, content });
    setTitle("");
    setContent("");
  };

  const handleDeletePost = (id: number) => {
    deletePostMutation.mutate(id);
  };

  const handleSavePost = (updatedPost: Post) => {
    updatePostMutation.mutate(updatedPost)
    setEditId(0)
  }

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
          <Post 
            key={post.id} 
            post={post} 
            handleDeletePost={handleDeletePost} 
            editId = {editId}
            setEditId = {setEditId}
            handleSavePost = {handleSavePost}
          />
        ))}
    </>
  );
};

export default Posts;
