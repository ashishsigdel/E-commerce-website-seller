import { useEffect, useState } from "react";
import { Button, Carousel, Modal } from "flowbite-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { IoIosStar, IoIosStarOutline } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import {
  IoBusOutline,
  IoHeartOutline,
  IoLocation,
  IoServerOutline,
  IoShareSocialOutline,
} from "react-icons/io5";
import { GiMoneyStack, GiShieldDisabled } from "react-icons/gi";
import {
  HiOutlineBadgeCheck,
  HiOutlineExclamationCircle,
} from "react-icons/hi";
import Header from "./Header";
import ReviewRating from "../components/ReviewRating";

export default function Product() {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { productSlug } = useParams();
  const [product, setProduct] = useState({
    images: [],
    ratings: [],
    totalrating: 0,
  });
  const [role, setRole] = useState("");
  const [productCount, setProductCount] = useState(1);
  console.log(productCount);
  const [openModal, setOpenModal] = useState(false);
  const [openModalAddtoCart, setOpenModalAddtoCart] = useState(false);
  const solidStar = product.totalrating;
  const hollowStar = 5 - solidStar;

  useEffect(() => {
    const fetchProduct = async () => {
      setRole("");
      try {
        const res = await fetch(`/api/product/getproduct?slug=${productSlug}`);
        const data = await res.json();
        if (res.ok) {
          setProduct(data.products[0]);
        }
      } catch (error) {
        console.error("Error fetching product:", error.message);
      }
    };

    fetchProduct();
  }, [productSlug]);

  function onCloseModal() {
    setOpenModal(false);
    setOpenModalAddtoCart(false);
  }

  return (
    <>
      <Header />
      <div className="max-w-6xl bg-white w-full flex flex-col mx-auto my-5 p-2">
        <div className="flex sm:flex-row flex-col">
          <div className="flex-1 flex items-center justify-center">
            <div className="w-full h-full">
              <div className="grid h-96 gap-4 xl:h-80 2xl:h-96">
                <Carousel className="">
                  {product.images.map((image, index) => (
                    <div key={index} className="w-full h-full">
                      <img
                        src={image}
                        alt={`Product ${index + 1}`}
                        className="aspect-square object-contain"
                      />
                    </div>
                  ))}
                </Carousel>
              </div>
            </div>
          </div>

          <div className="w-rull sm:w-2/5 py-4 px-3 ">
            <div className="text-2xl">
              <h1 className="font-semibold">{product.title}</h1>
            </div>
            <div className="flex gap-1 my-2 items-center">
              <h1 className="text-blue-400 text-sm">Ratings : </h1>
              <div className="flex">
                {Array.from({ length: solidStar }, (_, index) => (
                  <IoIosStar key={index} className="text-yellow-500" />
                ))}
                {Array.from({ length: hollowStar }, (_, index) => (
                  <IoIosStarOutline key={index} className="text-yellow-500" />
                ))}
              </div>
            </div>
            <div className="flex justify-between gap-5 mb-3">
              <div className="flex gap-1">
                <span className="span2 text-sm">Brand: </span>
                <h1 className="text-blue-400 text-sm">{product.brand}</h1>
              </div>
              <div className="flex gap-1">
                <span className="span2 text-sm">Avaiable: </span>
                <h1 className="text-blue-400 text-sm">{product.quantity}</h1>
              </div>
              <div className="flex gap-4 items-center">
                <IoShareSocialOutline size={20} />
                <IoHeartOutline size={25} />
              </div>
            </div>
            <hr />
            <div className="flex gap-1 mt-3">
              <h1 className="text-2xl font-semibold text-red-500">
                Price: Rs.
              </h1>
              <h1 className="text-2xl font-semibold text-red-500">
                {product.price}
              </h1>
            </div>
            <form>
              <div className="flex gap-3 my-4 items-center">
                <p className="">Quantity: </p>
                <input
                  type="number"
                  min={1}
                  defaultValue={1}
                  max={product.quantity}
                  onChange={(e) => setProductCount(e.target.value)}
                />
              </div>

              <div className="flex gap-3 my-10">
                <button
                  disabled
                  type="button"
                  className="button2 w-full flex-1"
                >
                  Buy Now
                </button>
                <button disabled type="submit" className="button w-full flex-1">
                  Add to Cart
                </button>
              </div>
            </form>
          </div>
          <div className="flex-1 p-3 bg-slate-100">
            <div className="my-3">
              <span className="span">Delivery: </span>
              {currentUser ? (
                <div>
                  {currentUser.address === undefined ? (
                    <div className="flex gap-2 flex-wrap ">
                      <p>Please provide your address to deliver.</p>
                      <div>
                        <p className="text-blue-500 underline">Add</p>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center gap-2 ">
                        <IoLocation size={20} />
                        <p className="line-clamp-2">{currentUser.address} </p>
                        <div className="ml-3">
                          <p className="text-blue-500 underline">Change</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex gap-3 ">
                  <p>Login to purchase.</p>
                  <Link to={"/sign-in"}>
                    <p className="text-blue-500 underline">login</p>
                  </Link>
                </div>
              )}
            </div>
            <div className="my-3 flex flex-col gap-2  ">
              <hr />
              <div className="flex gap-2 items-center">
                <IoBusOutline size={20} />
                <span className="text-black">Delivery Charge:</span>
              </div>
              <p className="p-2 bg-white rounded-lg">
                Enjoy free shipping with minimum spend of Rs. 699.
              </p>
              <div className="flex gap-2 items-center">
                <GiMoneyStack size={20} />
                <span className="text-black">Cash On delivery avaiable.</span>
              </div>
            </div>
            <div className="my-3 flex flex-col gap-2  ">
              <hr />
              <div className="flex gap-2 items-center">
                <IoServerOutline size={20} />
                <span className="text-black">Services:</span>
              </div>
              <div className="p-2 bg-white rounded-lg">
                <p className="">14 days free & easy return.</p>
                <span className="span text-xs">
                  Change of mind is not applicable
                </span>
              </div>
              <div className="flex gap-2 items-center">
                <GiShieldDisabled size={20} />
                <span className="text-black">Warranty not available!</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-6xl bg-white w-full flex flex-col mx-auto my-5">
        <div className=" bg-slate-100 p-3 border border-b-1">
          <h3 className="font-semibold text-xl">{`Product details of ${product.title}`}</h3>
        </div>
        <div
          className="p-3 max-w-5xl mx-auto w-full product-content"
          dangerouslySetInnerHTML={{ __html: product && product.description }}
        ></div>
      </div>
      <ReviewRating product={product} />

      <Modal
        show={openModal}
        size="md"
        onClose={() => setOpenModal(false)}
        popup
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              You have to signin first to add wishlist.
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="gray" onClick={() => setOpenModal(false)}>
                No, cancel
              </Button>
              <Link to={"/sign-in"}>
                <Button color="green" onClick={() => setOpenModal(false)}>
                  {"Yes, Login"}
                </Button>
              </Link>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      <Modal
        show={openModalAddtoCart}
        onClose={() => setOpenModalAddtoCart(false)}
        popup
        size="md"
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineBadgeCheck className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              Successfully added to cart
            </h3>
            <Link to={"/cart"}>
              <button className="button">Go to cart</button>
            </Link>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
