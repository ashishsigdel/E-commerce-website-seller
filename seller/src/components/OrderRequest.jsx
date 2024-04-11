import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ProductCard from "./ProductCard";

export default function OrderRequest() {
  const { currentUser } = useSelector((state) => state.user);
  const [orders, setOrders] = useState([]);

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
  return (
    <div className="m-5">
      <h1 className="text-3xl font-semi-bold">Orders: </h1>
      <div className="flex gap-3 flex-wrap w-full m-5 mx-auto">
        {orders.map((order) => (
          <div key={order._id}>
            {order.orderStatus !== "Delivered" &&
              order.orderStatus !== "Cancelled" && (
                <ProductCard product={order} />
              )}
          </div>
        ))}
      </div>
    </div>
  );
}
