import { Card } from "flowbite-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  updateOrderStart,
  updateOrderSuccess,
  updateOrderFailure,
} from "../redux/product/productSlice";
import { useSelector } from "react-redux";

export default function ProductCard({ product }) {
  const { currentProduct } = useSelector((state) => state.product);
  console.log(currentProduct);
  const [message, setMessage] = useState(null);
  const handleVerifyOrder = async () => {
    updateOrderStart();
    try {
      const res = await fetch(`/api/user/order/update-order/${product._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "Processing",
        }),
      });
      const data = await res.json();
      if (res.ok) {
        updateOrderSuccess(data.message);
        window.location.reload();
        setMessage("Product has been verified");
      } else {
        updateOrderFailure(data.message);
        setMessage("An error occured!");
      }
    } catch (err) {
      console.error(err);
      updateOrderFailure(err.message);
    }
  };

  return (
    <>
      <Card
        className="max-w-sm"
        imgAlt={product.products[0].product.title}
        imgSrc={product.products[0].product.images[0]}
      >
        <h5 className="text-2xl font-bold tracking-tight text-gray-900 line-clamp-1">
          {product.products[0].product.title}
        </h5>
        <div>
          <p className="">{`Status: ${product.paymentIntent.status}`}</p>
          <p>Order by: {product.orderBy}</p>
        </div>
        <div className="flex gap-3">
          <button onClick={handleVerifyOrder} className="button2 text-center">
            {product && product.paymentIntent.status === "Cash on Delivery"
              ? "Verify Order"
              : "Verified"}
          </button>
          <Link
            to={`/orderstatus/${product.paymentIntent.id}`}
            className="button text-center"
          >
            Delivered Progress
          </Link>
        </div>
      </Card>
    </>
  );
}
