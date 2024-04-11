import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Table } from "flowbite-react";
import { Link } from "react-router-dom";

export default function ManageCoupons() {
  const { currentUser } = useSelector((state) => state.user);
  const [coupons, setCoupons] = useState([]);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`/api/coupon`);
        const data = await res.json();
        if (res.ok) {
          setCoupons(data);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    if (currentUser.role === "admin") {
      fetchPosts();
    }
  }, [currentUser._id]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const haneleDelete = async (id) => {
    try {
      const res = await fetch(`/api/coupon/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setMessage("Coupon delete Successfully.");
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <div className="mx-auto">
      <h1 className="text-2xl sm:text-3xl p-5 m-2">Available Coupons</h1>
      <div className="bg-white p-3 sm:p-6 mx-auto flex flex-col sm:flex-row gap-3 items-stretch sm:items-start flex-wrap sm:flex-nowrap rounded-md">
        <div className="w-full p-3">
          {coupons &&
            coupons.map((coupon) => (
              <div key={coupon.id}>
                <div className="gap-3 border-b my-2">
                  <p className="text-xl">Name: {coupon.name}</p>
                  <p>Expiry: {formatDate(coupon.expiry)}</p>
                  <p>Discount percentage: -{coupon.discount}%</p>
                  {message && <p className="text-sm">{message}</p>}
                  <button
                    onClick={() => haneleDelete(coupon._id)}
                    className="text-red-500"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
