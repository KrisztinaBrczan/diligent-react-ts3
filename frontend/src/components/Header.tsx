import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  return (
    <div>
      <h2 onClick={() => navigate("posts")}>POSTS</h2>
      <h2 onClick={() => navigate("users")}>USERS</h2>
    </div>
  );
};

export default Header;
