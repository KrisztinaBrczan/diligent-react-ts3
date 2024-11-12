import { useState } from "react";
import { User as UserType } from "./Users";

interface ReceivedProps {
  user: UserType;
  handleDeleteUser: (id: number) => void;
  editingsId: number;
  setEditingsId: (id: number) => void;
  handleSaveUser: (updatedUser: UserType) => void;
}

const User = ({
  user,
  handleDeleteUser,
  handleSaveUser,
  editingsId,
  setEditingsId,
}: ReceivedProps) => {
  const [updatedUser, setUpdatedUser] = useState<UserType>({
    id: user.id,
    name: user.name,
    email: user.email,
  });

  const handleEditUser = (id: number) => {
    setEditingsId(id);
  };

  const handleCancelUser = () => {
    setEditingsId(0);
  };

  return (
    <>
      {editingsId === user.id ? (
        <div key={user.id}>
          <input
            placeholder={user.name}
            value={updatedUser.name}
            onChange={(e) =>
              setUpdatedUser({ ...updatedUser, name: e.target.value })
            }
          />
          <input
            placeholder={user.email}
            value={updatedUser.email}
            onChange={(e) =>
              setUpdatedUser({ ...updatedUser, email: e.target.value })
            }
          />
          <button onClick={() => handleSaveUser(updatedUser)}>Save</button>
          <button onClick={handleCancelUser}>Cancel</button>
        </div>
      ) : (
        <div key={user.id}>
          <h2>{user.name}</h2>
          <p>{user.email}</p>
          <button onClick={() => handleDeleteUser(Number(user.id))}>
            DELETE
          </button>
          <button onClick={() => handleEditUser(Number(user.id))}>EDIT</button>
        </div>
      )}
    </>
  );
};

export default User;
