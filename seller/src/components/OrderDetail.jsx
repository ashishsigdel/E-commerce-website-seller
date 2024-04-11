import { useEffect, useState } from "react";
import { CiCircleCheck } from "react-icons/ci";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import Stepper from "./Stepper";
import Header from "../pages/Header";

export default function OrderDetail() {
  const { currentUser } = useSelector((state) => state.user);
  const [myOrder, setMyOrder] = useState(null);
  const { orderId } = useParams();
  useEffect(() => {
    try {
      const fetchOrders = async () => {
        const res = await fetch("/api/user/order/get-orders");
        const data = await res.json();
        if (res.ok) {
          const orderWithId = data.find(
            (order) => order.paymentIntent.id === orderId
          );
          setMyOrder(orderWithId);
        } else {
          console.log(data.message);
        }
      };
      fetchOrders();
    } catch (error) {
      console.log(error.message);
    }
  }, [currentUser, orderId]);

  const formatReadableDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      timeZoneName: "short",
    };
    return new Date(dateString).toLocaleString(undefined, options);
  };

  return (
    <>
      <Header />
      <div className="max-w-6xl bg-white w-full flex flex-col mx-auto my-5 p-2">
        <div className="flex gap-2 my-5 text-green-500 items-center justify-center text-2xl sm:text-3xl">
          <p>Order Control Center</p>
        </div>
        {myOrder ? (
          <div className="">
            <div className="flex justify-between px-5 sm:flex-row flex-col mb-5 pb-5 border-b">
              <div>
                <p className="span">
                  Order id is:{" "}
                  <span className="text-black">
                    {" "}
                    {myOrder.paymentIntent.id}
                  </span>
                </p>
                <p className="span2">
                  Placed on {formatReadableDate(myOrder.createdAt)}
                </p>
              </div>
              <div className="flex gap-2 text-2xl text-orange-500">
                <p>Rs.</p>
                <p>{myOrder.paymentIntent.amount}</p>
              </div>
            </div>
          </div>
        ) : (
          <p>Loading...</p>
        )}
        {myOrder && <Stepper order={myOrder} />}
      </div>
    </>
  );
}
