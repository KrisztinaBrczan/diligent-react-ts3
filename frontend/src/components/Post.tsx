import { useState } from "react";
import { Post as PostType } from "./Posts";

interface PostPropsType {
  post: PostType,
  handleDeletePost: (id: number ) => void,
  editId: number,
  setEditId: (id: number) => void,
  handleSavePost: (updatedPost: PostType) => void
}

const Post = ({ post, handleDeletePost, editId, setEditId, handleSavePost }: PostPropsType) => {

  const [updatedPost, setUpdatedPost] = useState({
    id: post.id,
    title: post.title,
    content: post.content
  })

  return (
    <>
      {
        editId === post.id ?
          <div key={post.id}>
            <input 
              value={updatedPost.title} 
              onChange={(e) => setUpdatedPost({...updatedPost, title: e.target.value})} 
            />
            <input 
              value={updatedPost.content} 
              onChange={(e) => setUpdatedPost({...updatedPost, content: e.target.value})} 
            />
            <button onClick={() => setEditId(0)}>CANCEL</button>
            <button onClick={() => handleSavePost(updatedPost)}>SAVE</button>
          </div>
          :
          <div key={post.id}>
            <h2>{post.title}</h2>
            <p>{post.content}</p>
            <button onClick={() => setEditId(post.id)}>EDIT</button>
            <button onClick={() => handleDeletePost(post.id)}>
              DELETE
            </button>
          </div>
      }
    </>
  )
}

export default Post;