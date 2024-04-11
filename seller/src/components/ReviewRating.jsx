import { Rating, Spinner } from "flowbite-react";
import { useState } from "react";
import { IoIosStar, IoIosStarOutline } from "react-icons/io";
import { useSelector } from "react-redux";
import { TextInput } from "flowbite-react";
import { Link } from "react-router-dom";

export default function ReviewRating({ product }) {
  const { currentUser } = useSelector((state) => state.user);
  const solidStar = product.totalrating;
  const hollowStar = 5 - solidStar;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const handleRatingChange = (newRating) => {
    setRating(newRating);
  };

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const getRatingMessage = () => {
    if (product.totalrating >= 4) {
      return "Very Good";
    } else if (product.totalrating >= 3) {
      return "Average";
    } else if (product.totalrating >= 2) {
      return "Fair";
    } else {
      return "Poor";
    }
  };

  const calculatePercentage = (star) => {
    const totalRatings = product.ratings.length;
    const starRatings = product.ratings.filter(
      (rating) => rating.star === star
    ).length;
    const percentage =
      totalRatings === 0 ? 0 : (starRatings / totalRatings) * 100;
    return percentage.toFixed(0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (rating === 0) {
      setError("Please give rate out of 5.");
      setLoading(false);
      return;
    }
    try {
      const res = await fetch("/api/product/rating", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          star: rating,
          comment: comment,
          prodId: product._id,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setComment("");
        setRating(0);
        setLoading(false);
        setSuccess("Thank you for your valuable feedback!");
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.log(error.message);
      setLoading(false);
    }
  };

  return (
    <>
      <div className="max-w-6xl bg-white w-full flex flex-col mx-auto my-5">
        <div className="bg-slate-100 p-3 border border-b-1">
          <h3 className="font-semibold text-xl">Reviews and Ratings</h3>
        </div>
        <div className="flex flex-col sm:flex-row mx-3 p-2">
          <div className="px-6 py-4 flex w-full sm:w-2/5 sm:border-r my-3 flex-col gap-3">
            <div className=" gap-2 flex items-center">
              <p className="text-3xl text-black">{`${product.totalrating}`}</p>
              <div className="bg-yellow-400 px-3 rounded-md flex gap-1 items-center">
                <IoIosStar className="text-white" />
                <p className="text-xl italic text-white">{`${getRatingMessage()}`}</p>
              </div>
            </div>
            <div className="flex">
              {Array.from({ length: solidStar }, (_, index) => (
                <IoIosStar size={25} key={index} className="text-yellow-400" />
              ))}
              {Array.from({ length: hollowStar }, (_, index) => (
                <IoIosStarOutline
                  size={25}
                  key={index}
                  className="text-yellow-400"
                />
              ))}
            </div>
            {product.ratings.length !== 0 ? (
              <div className="flex gap-1">
                <p>{product.ratings.length}</p>
                <p>{product.ratings.length === 1 ? "Rating" : "Ratings"}</p>
              </div>
            ) : (
              <p>No Rated Yet!</p>
            )}
          </div>
          <div className="flex-1 my-4 mx-3">
            <Rating.Advanced
              percentFilled={calculatePercentage(5)}
              className="mb-2"
            >
              <div className="flex gap-1 text-yellow-400">
                <IoIosStar />
                <IoIosStar />
                <IoIosStar />
                <IoIosStar />
                <IoIosStar />
              </div>
            </Rating.Advanced>
            <Rating.Advanced
              percentFilled={calculatePercentage(4)}
              className="mb-2"
            >
              <div className="flex gap-1 text-yellow-400">
                <IoIosStar />
                <IoIosStar />
                <IoIosStar />
                <IoIosStar />
                <IoIosStarOutline />
              </div>
            </Rating.Advanced>
            <Rating.Advanced
              percentFilled={calculatePercentage(3)}
              className="mb-2"
            >
              <div className="flex gap-1 text-yellow-400">
                <IoIosStar />
                <IoIosStar />
                <IoIosStar />
                <IoIosStarOutline />
                <IoIosStarOutline />
              </div>
            </Rating.Advanced>
            <Rating.Advanced
              percentFilled={calculatePercentage(2)}
              className="mb-2"
            >
              <div className="flex gap-1 text-yellow-400">
                <IoIosStar />
                <IoIosStar />
                <IoIosStarOutline />
                <IoIosStarOutline />
                <IoIosStarOutline />
              </div>
            </Rating.Advanced>
            <Rating.Advanced percentFilled={calculatePercentage(1)}>
              <div className="flex gap-1 text-yellow-400">
                <IoIosStar />
                <IoIosStarOutline />
                <IoIosStarOutline />
                <IoIosStarOutline />
                <IoIosStarOutline />
              </div>
            </Rating.Advanced>
          </div>
        </div>
        <div className="px-6 mx-3">
          {product.ratings.map((rating, index) => (
            <div key={rating._id} className="border-t py-3">
              <div className="flex gap-2">
                <div className="flex">
                  {Array.from({ length: rating.star }, (_, index) => (
                    <IoIosStar
                      size={20}
                      key={index}
                      className="text-yellow-400"
                    />
                  ))}
                  {Array.from({ length: 5 - rating.star }, (_, index) => (
                    <IoIosStarOutline
                      size={20}
                      key={index}
                      className="text-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-sm text-gray-500">*******</p>
              </div>
              <p className="">{rating.comment}</p>
            </div>
          ))}
        </div>
        {currentUser ? (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col items-center justify-center border-t py-5"
          >
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((index) => (
                <label key={index} className="cursor-pointer">
                  <input
                    type="radio"
                    name="rating"
                    value={index}
                    className="hidden"
                    onChange={() => handleRatingChange(index)}
                  />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill={index <= rating ? "orange" : "none"}
                    viewBox="0 0 24 24"
                    stroke="orange"
                    className="w-8 h-8"
                    onClick={() => handleRatingChange(index)}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 2l2.516 6.27h6.734l-5.5 4.5 2.517 6.23-6.75-5.25-6.75 5.25 2.516-6.23-5.5-4.5h6.734z"
                    />
                  </svg>
                </label>
              ))}
            </div>

            <TextInput
              placeholder="Enter your comment..."
              value={comment}
              onChange={handleCommentChange}
              className="p-2"
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            {success && <p className="text-green-500 text-sm">{success}</p>}
            <button type="submit" className="button mt-4 min-w-32">
              {loading ? <Spinner /> : "Submit Rating"}
            </button>
          </form>
        ) : (
          <div className="flex flex-col items-center justify-center border-t py-5">
            <div className="flex space-x-2">
              <p>
                You have to{" "}
                <Link to={"/sign-in"} className="text-blue-500 hover:underline">
                  sign-in
                </Link>{" "}
                to review.
              </p>{" "}
            </div>{" "}
          </div>
        )}
      </div>
    </>
  );
}
