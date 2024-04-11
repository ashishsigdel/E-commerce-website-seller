import { useDispatch, useSelector } from "react-redux";
import { Spinner } from "flowbite-react";
import { useRef, useState } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase.js";
import { CircularProgressbar } from "react-circular-progressbar";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
} from "../redux/user/userSlice.js";
import "react-circular-progressbar/dist/styles.css";

export default function DashProfile() {
  const dispatch = useDispatch();
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [editMode, setEditMode] = useState(false);
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, profilePic: downloadURL })
        );
      }
    );
  };
  const handleChange = async (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        dispatch(updateUserSuccess(data));
      } else {
        dispatch(updateUserFailure(data.message));
      }
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };
  return (
    <>
      {editMode ? (
        <div className="w-full">
          <h1 className="text-2xl sm:text-3xl p-5 m-2">Edit your Profile</h1>
          <div className="bg-white w-[90%] px-5 py-10 mx-auto flex rounded-lg">
            <div className="flex flex-col gap-4 w-full">
              <form onSubmit={handleUpdate} className=" w-full">
                <div className="flex sm:flex-row flex-col gap-3">
                  <div className="flex flex-1 items-center justify-center">
                    <input
                      onChange={(e) => setFile(e.target.files[0])}
                      hidden
                      ref={fileRef}
                      type="file"
                      accept="image/*"
                    />
                    <div className="relative self-center cursor-pointer shadow-md overflow-hidden rounded-full">
                      {filePerc && (
                        <CircularProgressbar
                          value={filePerc || 0}
                          text={`${filePerc}%`}
                          strokeWidth={5}
                          styles={{
                            root: {
                              width: "100%",
                              height: "100%",
                              position: "absolute",
                              top: 0,
                              left: 0,
                            },
                            path: {
                              stroke: `rgba(62, 152, 199, ${filePerc / 100})`,
                            },
                          }}
                        />
                      )}
                      <img
                        src={
                          file
                            ? URL.createObjectURL(file)
                            : currentUser.profilePic
                        }
                        onClick={() => fileRef.current.click()}
                        alt="user"
                        className={`rounded-full w-32 h-32 sm:w-52 sm:h-52 object-cover border-8 border-[lightgray] ${
                          filePerc && filePerc < 100 && "opacity-60"
                        }`}
                      />
                    </div>
                  </div>

                  <div className="flex-1 gap-3 sm:gap-6 px-3">
                    <div className="flex flex-col w-full my-3">
                      <label htmlFor="firstName" className="span1 text-xs">
                        First Name
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        placeholder="Enter your first name"
                        onChange={handleChange}
                        defaultValue={currentUser.firstName}
                        className="input"
                      />
                    </div>
                    <div className="flex flex-col w-full my-3 ">
                      <label htmlFor="lastName" className="span1 text-xs">
                        Last Name
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        placeholder="Enter your last name"
                        onChange={handleChange}
                        defaultValue={currentUser.lastName}
                        className="input"
                      />
                    </div>
                    <div className="flex flex-col w-full my-3 ">
                      <label htmlFor="email" className="span1 text-xs">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        placeholder="Enter your email"
                        onChange={handleChange}
                        defaultValue={currentUser.email}
                        className="input"
                      />
                    </div>
                    <div className="flex flex-col w-full my-3 ">
                      <label htmlFor="mobile" className="span1 text-xs">
                        Mobile
                      </label>
                      <input
                        type="text"
                        id="mobile"
                        placeholder="Enter your mobile"
                        onChange={handleChange}
                        defaultValue={currentUser.mobile}
                        className="input"
                      />
                    </div>
                    <div className="flex flex-col w-full my-3 ">
                      <label htmlFor="address" className="span1 text-xs">
                        Address
                      </label>
                      <input
                        type="text"
                        id="address"
                        placeholder="Enter your address"
                        onChange={handleChange}
                        defaultValue={currentUser.address}
                        className="input"
                      />
                    </div>

                    <div className="flex flex-col w-full my-3 ">
                      <label htmlFor="password" className="span1 text-xs">
                        Password
                      </label>
                      <input
                        type="password"
                        id="password"
                        placeholder="Enter your new password"
                        onChange={handleChange}
                        defaultValue={"********"}
                        className="input"
                      />
                    </div>
                  </div>
                </div>
                {fileUploadError && (
                  <p className="text-sm text-red-600">Error occured!</p>
                )}
                <div className="flex gap-3 mt-3 justify-center">
                  <button
                    type="button"
                    onClick={() => setEditMode(false)}
                    className="button"
                  >
                    Go Back
                  </button>
                  <button
                    className="button"
                    onClick={() => handleFileUpload(file)}
                    disabled={!file}
                  >
                    Check Image
                  </button>
                  <button
                    type="submit"
                    className="button2"
                    onClick={() => handleUpdate()}
                  >
                    {loading ? <Spinner /> : "Update"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full">
          <h1 className="text-2xl sm:text-3xl p-5 m-2">
            Seller Account Profile
          </h1>
          <div className="bg-white w-[90%] p-3 sm:p-6 mx-auto flex rounded-lg">
            <div className="flex flex-col">
              <div className="mx-auto mt-4">
                <img
                  src={currentUser.profilePic}
                  className="h-28 w-28 sm:h-44 sm:w-44 object-cover rounded-full"
                  alt=""
                />
              </div>
              <div className="flex w-full">
                <div className="p-3 sm:p-5 mx-auto ">
                  <div className="flex flex-wrap gap-3 my-5">
                    <div className="w-52  p-2 rounded-lg hover:shadow-lg">
                      <h1 className="text-lg">Full Name</h1>
                      <span className="span2">{`${currentUser.firstName} ${currentUser.lastName}`}</span>
                    </div>
                    <div className="w-52  p-2 rounded-lg hover:shadow-lg">
                      <h1 className="text-lg">Email</h1>
                      <span className="span2">{`${currentUser.email}`}</span>
                    </div>
                    <div className="w-52  p-2 rounded-lg hover:shadow-lg ">
                      <h1 className="text-lg">Phone No.</h1>
                      <span className="span2">
                        {currentUser.mobile
                          ? currentUser.mobile
                          : "Please Provide first!"}
                      </span>
                    </div>
                    <div className="w-52  p-2 rounded-lg hover:shadow-lg ">
                      <h1 className="text-lg">Address</h1>
                      <span className="span2">
                        {currentUser.address
                          ? currentUser.address
                          : "Please Provide first!"}
                      </span>
                    </div>
                  </div>
                  <button onClick={() => setEditMode(true)} className="button">
                    Edit Profile
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
