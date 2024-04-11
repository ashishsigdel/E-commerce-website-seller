import { Select, TextInput } from "flowbite-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  createProductStart,
  createProductSuccess,
  createProductFailure,
} from "../redux/product/productSlice";
import { useDispatch, useSelector } from "react-redux";
import UploadImage from "./UploadImage";

export default function CreateProduct() {
  const [formData, setFormData] = useState({
    category: "uncategorized",
    brand: "No Brand",
    color: "unselected",
  });
  const [nextStep, setNextStep] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const [colors, setColors] = useState([]);
  const [brands, setBrands] = useState([]);
  const [catagorys, setCategorys] = useState([]);

  useEffect(() => {
    const fetchColor = async () => {
      try {
        const res = await fetch("/api/color/all-color");
        const data = await res.json();
        if (res.ok) {
          setColors(data);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    if (currentUser.role === "admin") {
      fetchColor();
    }
  }, [currentUser._id]);

  useEffect(() => {
    const fetchBrand = async () => {
      try {
        const res = await fetch("/api/brand/all-brand");
        const data = await res.json();
        if (res.ok) {
          setBrands(data);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    if (currentUser.role === "admin") {
      fetchBrand();
    }
  }, [currentUser._id]);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await fetch("/api/pcategory/all-category");
        const data = await res.json();
        if (res.ok) {
          setCategorys(data);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    if (currentUser.role === "admin") {
      fetchCategory();
    }
  }, [currentUser._id]);

  const handleSubmit = async (e) => {
    setNextStep(false);
    e.preventDefault();
    dispatch(createProductStart());
    try {
      const res = await fetch("/api/product/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        dispatch(createProductSuccess(data));
        setNextStep(true);
      } else {
        dispatch(createProductFailure(data.message));
        setNextStep(false);
      }
    } catch (error) {
      dispatch(createProductFailure(error.message));
      setNextStep(false);
    }
  };
  return (
    <div className="w-full my-5">
      <h1 className="text-4xl font-bold p-4">Create a product</h1>
      <form
        className="py-3 sm:px-10 px-4 flex flex-col gap-5 w-full"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col w-full">
          <span className="text-xs">Product Name*</span>
          <TextInput
            type="text"
            id="title"
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            placeholder="Title of Product"
            required
          />
        </div>
        <div className="flex flex-col w-full">
          <span className="text-xs">Description*</span>
          <ReactQuill
            theme="snow"
            placeholder="Describe your product detail here..."
            className="h-72 mb-12"
            required
            onChange={(value) => {
              setFormData({ ...formData, description: value });
            }}
          />
        </div>
        <div className="flex justify-between gap-2 w-full">
          <div className="flex flex-col flex-1">
            <span className="text-xs">Price*</span>
            <TextInput
              type="number"
              id="price"
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
              placeholder="Price of Product"
              className="sm:w-full w-44"
              required
            />
          </div>
          <div className="flex flex-col flex-1 w-full">
            <span className="text-xs">Quantity*</span>
            <TextInput
              type="number"
              id="quantity"
              onChange={(e) =>
                setFormData({ ...formData, quantity: e.target.value })
              }
              placeholder="Quantity of Product"
              className="sm:w-full w-44"
              required
            />
          </div>
        </div>
        <div className="flex justify-between gap-2 w-full">
          <div className="flex flex-col flex-1">
            <span className="text-xs">Category*</span>
            <div>
              <Select
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
              >
                <option value="uncategorized">Select a category</option>
                {catagorys &&
                  catagorys.map((catagory) => (
                    <option key={catagory._id} value={`${catagory.title}`}>
                      {catagory.title}
                    </option>
                  ))}
              </Select>
            </div>
          </div>
          <div className="flex flex-col flex-1">
            <span className="text-xs">Brand*</span>
            <div>
              <Select
                onChange={(e) =>
                  setFormData({ ...formData, brand: e.target.value })
                }
              >
                <option value="No Brand">No Brand</option>
                {brands &&
                  brands.map((brand) => (
                    <option key={brand._id} value={`${brand.title}`}>
                      {brand.title}
                    </option>
                  ))}
              </Select>
            </div>
          </div>
          <div className="flex flex-col flex-1">
            <span className="text-xs">Colour*</span>
            <div>
              <Select
                onChange={(e) =>
                  setFormData({ ...formData, color: e.target.value })
                }
              >
                <option value="unselected">Not selected</option>
                {colors &&
                  colors.map((color) => (
                    <option key={color._id} value={`${color.title}`}>
                      {color.title}
                    </option>
                  ))}
              </Select>
            </div>
          </div>
        </div>
        <div className="flex gap-2 mx-auto w-full">
          <button className="button" type="reset">
            Cancel
          </button>
          <button disabled={nextStep} type="submit" className="button">
            {nextStep ? "Upload images below" : "Publish"}
          </button>
        </div>
      </form>
      {nextStep && <UploadImage />}
    </div>
  );
}
