import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase.js";
import { useEffect, useRef, useState } from "react";
import { MdClose, MdOutlineAddPhotoAlternate } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import {
  uploadImageSuccess,
  uploadImageStart,
  uploadImageFailure,
} from "../redux/product/productSlice.js";

export default function UploadImage() {
  const location = useLocation();
  const { currentProduct, loading, error } = useSelector(
    (state) => state.product
  );
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const fileRef = useRef(null);
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [id, setId] = useState("");

  const handleImageSubmit = (e) => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true);
      setImageUploadError(false);
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setImageUploadError(false);
          setUploading(false);
        })
        .catch((err) => {
          setImageUploadError("Image upload failed (2 mb max per image)");
          setUploading(false);
        });
    } else {
      setImageUploadError("You can only upload 6 images per listing");
      setUploading(false);
    }
  };
  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };
  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(uploadImageStart());
    try {
      if (formData.imageUrls.length < 1)
        return setError("You must upload at least one image");
      const res = await fetch(`/api/product/upload/${currentProduct._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        dispatch(uploadImageSuccess());
        navigate("/dashboard?page=products");
      } else {
        dispatch(uploadImageFailure(data.message));
      }
    } catch (error) {
      dispatch(uploadImageFailure(error.message));
    }
  };
  return (
    <div className="w-full my-5">
      <h1 className="text-4xl font-bold p-4">Upload images to Product</h1>
      <form
        className="py-3 sm:px-10 px-4 flex flex-col gap-5 w-full"
        onSubmit={handleSubmit}
      >
        <div className="mx-auto">
          <input
            type="file"
            id="images"
            accept="image/*"
            multiple
            hidden
            ref={fileRef}
            onChange={(e) => setFiles(e.target.files)}
          />

          <p className="text-red-700 text-sm">
            {imageUploadError && imageUploadError}
          </p>
          <div className="flex flex-col items-center gap-10">
            <MdOutlineAddPhotoAlternate
              size={50}
              onClick={() => fileRef.current.click()}
              className="cursor-pointer"
            />
            <button
              type="button"
              disabled={uploading}
              onClick={handleImageSubmit}
              className="button"
            >
              {uploading ? "Creating..." : "Show Preview"}
            </button>

            <div className="flex gap-7 flex-wrap">
              {formData.imageUrls.length > 0 ? (
                <>
                  {formData.imageUrls.map((url, index) => (
                    <div
                      key={url}
                      className="relative h-60 w-60 bg-white rounded-lg p-2"
                    >
                      <img
                        src={url}
                        alt="listing image"
                        className="h-60 w-60 object-contain"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-2 right-2 text-red-500 cursor-pointer"
                      >
                        <MdClose size={20} />
                      </button>
                    </div>
                  ))}
                </>
              ) : (
                <p className="text-center">No photos selected.</p>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2 mx-auto">
          {error && <p className="text-red-700 text-sm">{error}</p>}
          <button
            disabled={loading || uploading || formData.imageUrls.length === 0}
            className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
          >
            {loading ? "Uploading..." : "Upload Photos"}
          </button>
        </div>
      </form>
    </div>
  );
}
