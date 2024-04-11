import React, { useState } from "react";
import { Button, Checkbox, Label, Spinner, TextInput } from "flowbite-react";

export default function AddProperties() {
  const [loading, setLoading] = useState(false);
  const [brand, setBrand] = useState(null);
  const [color, setColor] = useState(null);
  const [category, setCategory] = useState(null);

  const handleSubmitBrand = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`/api/brand`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: brand,
        }),
      });
      if (res.ok) {
        setBrand(null);
        setLoading(false);
      } else {
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.log(error.message);
    }
  };

  const handleSubmitColor = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`/api/color`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: color,
        }),
      });
      if (res.ok) {
        setColor(null);
        setLoading(false);
      } else {
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.log(error.message);
    }
  };
  const handleSubmitCategory = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`/api/pcategory`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: category,
        }),
      });
      if (res.ok) {
        setCategory(null);
        setLoading(false);
      } else {
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.log(error.message);
    }
  };

  return (
    <div className="mx-auto">
      <h1 className="text-2xl sm:text-3xl p-5 m-2">Are you a first seller?</h1>
      <div className="bg-white p-3 sm:p-6 mx-auto flex-col gap-5 items-stretch sm:items-start flex-wrap sm:flex-nowrap rounded-md shadow-lg">
        {" "}
        <div className="w-full shadow-lg p-3">
          <h1 className="text-2xl">Add brand</h1>
          <form
            className="flex max-w-md flex-col gap-4 w-96"
            onSubmit={handleSubmitBrand}
          >
            <div>
              <TextInput
                id="brand"
                type="text"
                placeholder={`Enter brand`}
                required
                onChange={(e) => setBrand(e.target.value)}
              />
            </div>
            <Button type="submit">{loading ? <Spinner /> : "Add Brand"}</Button>
          </form>
        </div>
        <div className="w-full shadow-lg p-3">
          <h1 className="text-2xl">Add color</h1>
          <form
            className="flex max-w-md flex-col gap-4 w-96"
            onSubmit={handleSubmitColor}
          >
            <div>
              <TextInput
                id="color"
                type="text"
                placeholder={`Enter color`}
                required
                onChange={(e) => setColor(e.target.value)}
              />
            </div>
            <Button type="submit">{loading ? <Spinner /> : "Add Color"}</Button>
          </form>
        </div>
        <div className="w-full shadow-lg p-3">
          <h1 className="text-2xl">Add category</h1>
          <form
            className="flex max-w-md flex-col gap-4 w-96"
            onSubmit={handleSubmitCategory}
          >
            <div>
              <TextInput
                id="category"
                type="text"
                placeholder={`Enter category`}
                required
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>
            <Button type="submit">
              {loading ? <Spinner /> : "Add Category"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
