import { Dropdown, TextInput } from "flowbite-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { HiPlusCircle } from "react-icons/hi";
import { BsEmojiSmile } from "react-icons/bs";
import { IoLogOutOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { signoutSuccess } from "../redux/user/userSlice.js";
import { useEffect, useState } from "react";

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const [role, setRole] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const roleFromUrl = urlParams.get("role");
    if (roleFromUrl) {
      setRole(roleFromUrl);
    }
  }, [location.search]);

  const handleLogOut = async () => {
    try {
      const res = await fetch("/api/user/logout", {
        method: "GET",
      });
      const data = await res.json();

      if (res.ok) {
        dispatch(signoutSuccess());
        navigate("/");
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <>
      {currentUser && (
        <header className="bg-orange-500 text-white shadow-md">
          <div className="flex-col gap-2 sm:mx-auto max-w-6xl pb-3 pt-3 sm:pt-0 mx-2 sm:px-2 items-center">
            <div className="flex gap-5 items-center py-4 justify-evenly">
              <div>
                <img
                  src="https://i.postimg.cc/3N7SXc2s/logo-no-background.png"
                  alt="PrimeBazaar"
                  className="w-52 hidden md:inline"
                />
                <img
                  src="https://i.postimg.cc/s28k0Skm/logo-only-no-background.png"
                  alt="PB"
                  className="p-1 w-10 md:hidden inline"
                />
              </div>

              <div className="flex">
                <div>
                  <img
                    src={currentUser.profilePic}
                    alt="ProfilePic"
                    className="w-9 h-9 object-cover rounded-full"
                  />
                </div>
                <div>
                  <Dropdown
                    label={`Hello, ${currentUser.firstName}`}
                    size="sm"
                    color=""
                    className="py-3"
                  >
                    <Link to={"/dashboard?page=profile"}>
                      <Dropdown.Item className="flex gap-3 px-8 py-3">
                        <BsEmojiSmile size={20} className="span mr-4" />
                        <span className="span text-md">Manage My Account</span>
                      </Dropdown.Item>
                    </Link>

                    <Dropdown.Item
                      className="flex gap-3 px-8 py-3"
                      onClick={handleLogOut}
                    >
                      <IoLogOutOutline size={20} className="span mr-4" />
                      <span className="span text-md">Log out</span>
                    </Dropdown.Item>
                  </Dropdown>
                </div>
              </div>
              <Link to={"/dashboard?page=create-product"}>
                <div className="flex items-center gap-2">
                  <HiPlusCircle size={20} />
                  <span>Add Product</span>
                </div>
              </Link>
            </div>
          </div>
        </header>
      )}
    </>
  );
}
