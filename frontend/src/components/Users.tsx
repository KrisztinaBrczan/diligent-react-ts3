import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import User from "./User";

export interface User {
  id?: number;
  name: string;
  email: string;
}

const Users = () => {
  const queryClient = useQueryClient();

  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [editingsId, setEditingsId] = useState<number>(0);

  const { data: users } = useQuery<User[]>({
    queryFn: async () =>
      fetch("http://localhost:3000/users").then((res) => res.json()),
    queryKey: ["users"],
  });

  const createUserMutation = useMutation({
    mutationFn: async (newUser: User) => {
      return fetch("http://localhost:3000/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      }).then((res) => res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (id: number) => {
      return fetch(`http://localhost:3000/users/${id}`, {
        method: "Delete",
        headers: { "Content-Type": "application/json" },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: (updatedUser: User) => {
      return fetch(`http://localhost:3000/users/${updatedUser.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedUser),
      }).then((res) => {
        return res.json();
      });
    },
    onSuccess: () => {
      console.log("onsuccess");
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
    },
  });

  const handleCreateUser = () => {
    createUserMutation.mutate({ name, email });
    setName("");
    setEmail("");
  };

  const handleDeleteUser = (id: number) => {
    deleteUserMutation.mutate(id);
  };

  const handleSaveUser = (updatedUser: User) => {
    setEditingsId(0);
    updateUserMutation.mutate(updatedUser);
  };

  return (
    <>
      <input
        type="text"
        placeholder="user"
        name="user"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="text"
        placeholder="email"
        name="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={handleCreateUser}>Create User</button>
      {users?.map((user) => (
        <User
          user={user}
          key={user.id}
          handleDeleteUser={handleDeleteUser}
          handleSaveUser={handleSaveUser}
          editingsId={editingsId}
          setEditingsId={setEditingsId}
        />
      ))}
    </>
  );
};

export default Users;
