import React, { useEffect, useState } from "react";
import { Button, Label, Spinner, TextInput } from "flowbite-react";
import { useSelector } from "react-redux";

export default function CreateCoupon() {
  const currentUser = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    expiryDate: "",
    expiryTime: "",
    discount: "",
  });
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmitCoupon = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const formattedExpiry = new Date(
        `${formData.expiryDate} ${formData.expiryTime}`
      ).toGMTString();

      const finalFormData = {
        name: formData.name,
        expiry: formattedExpiry,
        discount: parseInt(formData.discount),
      };

      const res = await fetch(`/api/coupon`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(finalFormData),
      });
      const data = await res.json();
      if (res.ok) {
        setLoading(false);
        setFormData({});
        setMessage("Coupon Created Successfully.");
        setError(null);
      } else {
        setLoading(false);
        setError(data.message);
      }
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  };

  return (
    <div className=" mx-auto">
      <h1 className="text-2xl sm:text-3xl p-5 m-2">Create Coupon</h1>
      <div className="bg-white p-3 sm:p-6 mx-auto flex flex-col sm:flex-row gap-3 items-stretch sm:items-start flex-wrap sm:flex-nowrap rounded-md shadow-lg">
        <div className="w-full shadow-lg p-3">
          <form
            className="flex w-96 flex-col gap-4"
            onSubmit={handleSubmitCoupon}
          >
            <div>
              <TextInput
                id="name"
                type="text"
                placeholder={`Coupon Name`}
                required
                onChange={handleChange}
              />
            </div>
            <div>
              <Label>Expiry Date & Time</Label>
              <div className="flex justify-between">
                <TextInput
                  id="expiryDate"
                  type="date"
                  placeholder={`Select Date`}
                  required
                  onChange={handleChange}
                />
                <TextInput
                  id="expiryTime"
                  type="time"
                  placeholder={`Select Time`}
                  required
                  onChange={handleChange}
                />
              </div>
            </div>
            <div>
              <TextInput
                id="discount"
                type="number"
                placeholder={`Discount Percentage`}
                required
                onChange={handleChange}
              />
            </div>
            {message && <p className="text-sm text-green-500">{message}</p>}
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button type="submit">
              {loading ? <Spinner /> : "Create Coupon"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
