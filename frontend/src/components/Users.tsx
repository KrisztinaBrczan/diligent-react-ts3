import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

interface User {
  id: number;
  name: string;
  email: string;
}

const Users = () => {
  const queryClient = useQueryClient();

  const [userName, setUserName] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("");

  const { data: users } = useQuery<User[]>({
    queryFn: async () =>
      fetch("http://localhost:3000/users").then((res) => res.json()),
    queryKey: ["users"],
  });

  return (
    <>
      <input
        type="text"
        placeholder="user"
        name="user"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
      />
      <input
        type="text"
        placeholder="email"
        name="email"
        value={userEmail}
        onChange={(e) => setUserEmail(e.target.value)}
      />
      <button>Create User</button>
      {users &&
        users.map((user) => (
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
