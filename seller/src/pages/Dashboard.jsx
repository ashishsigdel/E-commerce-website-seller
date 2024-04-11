import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import SideBar from "../components/SideBar";
import Header from "./Header";
import DashProfile from "../components/DashProfile";
import CreateProduct from "../components/CreateProduct";
import ProductList from "../components/ProductList";
import AddProperties from "../components/AddProperties";
import Coupons from "../components/Coupons";
import ManageCoupons from "../components/ManageCoupons";
import OrderRequest from "../components/OrderRequest";

export default function Dashboard() {
  const location = useLocation();
  const [page, setPage] = useState("");
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const pageFromUrl = urlParams.get("page");
    if (pageFromUrl) {
      setPage(pageFromUrl);
    }
  }, [location.search]);
  return (
    <>
      <Header />
      <div className="min-h-screen flex flex-col md:flex-row">
        <div className="md:w-56">
          <SideBar />
        </div>
        {page === "profile" && <DashProfile />}
        {page === "create-product" && <CreateProduct />}
        {page === "products" && <ProductList />}
        {page === "addProperties" && <AddProperties />}
        {page === "coupon" && <Coupons />}
        {page === "couponmanage" && <ManageCoupons />}
        {page === "order-request" && <OrderRequest />}
      </div>
    </>
  );
}
