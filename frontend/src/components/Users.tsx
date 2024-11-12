import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

interface User {
  id?: number;
  name: string;
  email: string;
}

const Users = () => {
  const queryClient = useQueryClient();

  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  const { data: users } = useQuery<User[]>({
    queryFn: async () =>
      fetch("http://localhost:3000/users").then((res) => res.json()),
    queryKey: ["users"],
  });

  const createUserMutation = useMutation({
    mutationFn: async (newUser: User) => {
      fetch("http://localhost:3000/users", {
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

  const handleCreateUser = () => {
    createUserMutation.mutate({ name, email });
    setName("");
    setEmail("");
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
        <div key={user.id}>
          <h2>{user.name}</h2>
          <p>{user.email}</p>
          <button>DELETE</button>
        </div>
      ))}
    </>
  );
};

export default Users;
