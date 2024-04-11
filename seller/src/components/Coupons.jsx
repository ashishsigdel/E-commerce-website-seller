import React from "react";
import CreateCoupon from "./CreateCoupon";
import ManageCoupons from "./ManageCoupons";

export default function Coupons() {
  return (
    <div className="flex flex-col sm:flex-row gap-5 mx-5">
      <CreateCoupon />
      <ManageCoupons />
    </div>
  );
}
