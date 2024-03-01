import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";

export default function ProtectedRoutes() {
  const {user} = useContext(AuthContext) 
  return user ? <Outlet /> : <Navigate to="home-page/" />;
}
