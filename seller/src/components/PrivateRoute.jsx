import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";

export function PrivateRouteSeller() {
  const { currentUser } = useSelector((state) => state.user);
  return currentUser && currentUser.role === "admin" ? (
    <Outlet />
  ) : (
    <Navigate to="/" />
  );
}
