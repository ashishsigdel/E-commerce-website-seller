import { Link, Navigate, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Spinner } from "flowbite-react";
import SignIn from "./SignIn";

export default function Auth() {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formReset, setFormReset] = useState("");
  const [role, setRole] = useState("");
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      setLoading(true);
      setFormReset("");
      if (formData.password === formData.repassword) {
        const res = await fetch("/api/user/register-admin", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (res.ok) {
          setLoading(false);
          setFormReset("Sign up success, Proceed to Login.");
        } else {
          setLoading(false);
          setFormReset("");
          setError(data.message);
          return;
        }
      } else {
        setLoading(false);
        setFormReset("");
        setError("Password does not match.");
      }
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  };

  return (
    <div className="bg-orange-500 sm:max-h-screen ">
      <SignIn />
      <div className="flex sm:flex-row flex-col gap-2 sm:mx-auto max-w-7xl pb-3 pt-3 sm:pt-0 mx-2 sm:px-2">
        <div className="flex-1 py-5 mt-10 px-10">
          <h1 className="sm:text-7xl text-5xl font-bold text-white">
            Sell on Nepal's #1 <br /> Marketplace
          </h1>
          <p className="mt-5 text-white font-semibold">
            Create a PrimeBazaar seller account in 5 minutes and reach millions{" "}
            <br /> of customers today!
          </p>
          <img
            src="https://i.postimg.cc/jS7W10QH/banner.png"
            alt=""
            className="h-[400px] hidden sm:inline"
          />
        </div>
        <div className="flex-1 my-3">
          <h1 className="text-white text-center">
            Want to sell from overseas to Nepal?
          </h1>
          <div className="bg-white rounded-lg p-3 m-3 flex gap-3 flex-col items-center">
            <h1 className="text-3xl font-semibold">Create an Account</h1>
            <p>
              Welcome! Millions of Daraz users are waiting to buy your product.
            </p>
            <form
              className="flex flex-col sm:flex-row sm:gap-5 gap-0"
              onSubmit={handleSubmit}
            >
              <div className="flex-1">
                <div className="flex flex-col my-6">
                  <span className="text-xs">FirstName*</span>
                  <input
                    type="text"
                    id="firstName"
                    required
                    placeholder="Please enter your firstname"
                    onChange={handleChange}
                  />
                </div>
                <div className="flex flex-col my-6">
                  <span className="text-xs">LastName*</span>
                  <input
                    type="text"
                    id="lastName"
                    required
                    placeholder="Please enter your lastname"
                    onChange={handleChange}
                  />
                </div>
                <div className="flex flex-col my-6">
                  <span className="text-xs">Email*</span>
                  <input
                    type="email"
                    id="email"
                    required
                    placeholder="Please enter your email"
                    onChange={handleChange}
                  />
                </div>
                <div className="flex flex-col mt-6 sm:mb-5">
                  <span className="text-xs">Mobile*</span>
                  <input
                    type="text"
                    id="mobile"
                    required
                    placeholder="Please enter your phone number"
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="flex-1">
                <div className="flex flex-col my-6">
                  <span className="text-xs">Password*</span>
                  <input
                    type="password"
                    id="password"
                    required
                    placeholder="Please create your password"
                    onChange={handleChange}
                  />
                </div>
                <div className="flex flex-col my-6">
                  <span className="text-xs">Verify password*</span>
                  <input
                    type="password"
                    id="repassword"
                    required
                    placeholder="Please re-enter your password"
                    onChange={handleChange}
                  />
                </div>
                {error && <p className="my-2 text-sm text-red-500">{error}</p>}
                {formReset && (
                  <p className="my-2 text-sm text-green-500">{formReset}</p>
                )}

                <button color="" type="submit" className="w-full button">
                  {loading ? <Spinner /> : "Sign up"}
                </button>
                <p className="text-xs mt-3">
                  By clicking &#34;SIGN UP&#34;, I agree to PrimeBazaar&#39;s{" "}
                  <Link className="text-blue-500">Terms of Use</Link> and{" "}
                  <Link className="text-blue-500">Privacy Policy</Link>.
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
