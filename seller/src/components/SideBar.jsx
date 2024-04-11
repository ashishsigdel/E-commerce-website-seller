import { Sidebar } from "flowbite-react";
import { useEffect, useState } from "react";
import {
  HiFolderAdd,
  HiOutlineBriefcase,
  HiPlusCircle,
  HiShoppingBag,
  HiTrash,
  HiUser,
} from "react-icons/hi";
import { MdOutlineDiscount } from "react-icons/md";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
} from "../redux/user/userSlice";

export default function SideBar() {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const location = useLocation();
  const [page, setPage] = useState("");
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  console.log(orders);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/user/order/get-orders");
        const data = await res.json();
        if (res.ok) {
          setOrders(data);
        } else {
          console.log(data.message);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    if (currentUser.role === "admin") {
      fetchOrders();
    }
  }, [currentUser._id]);

  let count = 0;
  for (let i = 0; i < orders.length; i++) {
    if (
      orders[i].orderStatus !== "Delivered" &&
      orders[i].orderStatus !== "Cancelled"
    ) {
      count++;
    }
  }

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const pageFromUrl = urlParams.get("page");
    if (pageFromUrl) {
      setPage(pageFromUrl);
    }
  }, [location.search]);

  const handleDeleteUser = async () => {
    dispatch(deleteUserStart());
    try {
      const res = await fetch(`/api/user/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(deleteUserFailure(data.message));
      } else {
        dispatch(deleteUserSuccess(data));
      }
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleDeleteSeller = async () => {
    dispatch(deleteUserStart());
    try {
      const res = await fetch(`/api/user/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(deleteUserFailure(data.message));
      } else {
        navigate("/sellercenter?tab=auth&role=seller");
        dispatch(deleteUserSuccess(data));
      }
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };
  return (
    <>
      <Sidebar
        aria-label="Sidebar with content separator example"
        className="w-full md:w-56"
      >
        <Sidebar.Items>
          <Sidebar.ItemGroup>
            <span className="text-lg font-semibold ">Your Account</span>
            <Link to={"?page=profile"}>
              <Sidebar.Item
                className="my-3"
                icon={HiUser}
                active={page === "profile"}
              >
                My Profile
              </Sidebar.Item>
            </Link>
            <Link to={"?page=order-request"}>
              <Sidebar.Item
                className="my-3"
                icon={HiOutlineBriefcase}
                active={page === "order-request"}
                label={`${count}`}
              >
                Order Requests
              </Sidebar.Item>
            </Link>
            <Link to={"?page=products"}>
              <Sidebar.Item
                className="my-3"
                icon={HiShoppingBag}
                active={page === "products"}
              >
                My Products
              </Sidebar.Item>
            </Link>
            <Link to={"?page=create-product"}>
              <Sidebar.Item
                className="my-3"
                icon={HiPlusCircle}
                active={page === "create-product"}
              >
                Add Products
              </Sidebar.Item>
            </Link>
            <Link to={"?page=addProperties"}>
              <Sidebar.Item
                className="my-3"
                icon={HiFolderAdd}
                active={page === "addProperties"}
              >
                Add Proporties
              </Sidebar.Item>
            </Link>
            <Link to={"?page=coupon"}>
              <Sidebar.Item
                className="my-3"
                icon={MdOutlineDiscount}
                active={page === "coupon"}
              >
                Coupon
              </Sidebar.Item>
            </Link>
          </Sidebar.ItemGroup>

          <Sidebar.ItemGroup>
            <Sidebar.Item
              className="my-3"
              icon={HiTrash}
              onClick={handleDeleteSeller}
            >
              Delete My account
            </Sidebar.Item>
          </Sidebar.ItemGroup>
        </Sidebar.Items>
      </Sidebar>
    </>
  );
}
