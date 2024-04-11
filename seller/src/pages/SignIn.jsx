import { Link, Navigate, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Spinner } from "flowbite-react";
import { useDispatch, useSelector } from "react-redux";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../redux/user/userSlice";

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart());
      const res = await fetch("/api/user/admin-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.emailsignin,
          password: formData.passwordsignin,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        dispatch(signInSuccess(data));
        navigate("/dashboard?page=profile");
      } else {
        dispatch(signInFailure(data.message));
        return;
      }
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };
  return (
    <header className="bg-white shadow-md">
      <div className="flex sm:flex-row flex-col items-center gap-2 sm:mx-auto max-w-7xl pb-3 pt-3 sm:pt-0 mx-2 sm:px-2">
        <div className="py-4 flex-1 flex gap-1 items-center">
          <img
            src="https://i.postimg.cc/52W50GD4/download.png"
            alt="PB-Celler-center"
            className="h-10 object-cover"
          />
          <span className="font-bold text-orange-400 text-2xl">
            Seller Login
          </span>
        </div>
        <div className="flex-1 my-2 w-full">
          <form
            className="flex flex-col items-center sm:flex-row w-full gap-3 px-3"
            onSubmit={handleSubmit}
          >
            <div className="flex flex-col w-full">
              <span className="text-sm">Email*</span>
              <input
                type="text"
                id="emailsignin"
                placeholder="email"
                className="sm:w-full"
                onChange={handleChange}
              />
            </div>
            <div className="flex flex-col w-full">
              <span className="text-sm">Password*</span>
              <input
                type="password"
                id="passwordsignin"
                placeholder="password"
                className="sm:w-full"
                onChange={handleChange}
              />
            </div>
            <div className="flex flex-col ">
              <button type="submit" className="button">
                Sign in
              </button>
            </div>
          </form>
          <div className="flex justify-between mt-2 px-3">
            <span className="text-xs underline text-blue-500 ">
              <Link to={"/reset-password"}>Forgot Password ?</Link>
            </span>
            {error && <p className="text-xs text-red-500">{error}</p>}
          </div>
        </div>
      </div>
    </header>
  );
}
