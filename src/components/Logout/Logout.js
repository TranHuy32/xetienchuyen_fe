import { useNavigate } from "react-router-dom";
import { useSignOut } from "react-auth-kit";

export default function Logout() {
  const singOut = useSignOut();
  const navigate = useNavigate();

  const logout = () => {
    singOut();
    navigate("/");
  };
  return <button onClick={logout}>Logout</button>;
}
