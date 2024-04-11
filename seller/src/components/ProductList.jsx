import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Table } from "flowbite-react";
import { Link } from "react-router-dom";

export default function ProductList() {
  const { currentUser } = useSelector((state) => state.user);
  const [sellerProducts, setSellerProducts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(
          `/api/product/getproduct?userRef=${currentUser._id}`
        );
        const data = await res.json();
        if (res.ok) {
          setSellerProducts(data.products);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    if (currentUser.role === "admin") {
      fetchPosts();
    }
  }, [currentUser._id]);

  const haneleDelete = async (id) => {
    try {
      const res = await fetch(`/api/product/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        const fetchPosts = async () => {
          try {
            const res = await fetch(
              `/api/product/getproduct?userRef=${currentUser._id}`
            );
            const data = await res.json();
            if (res.ok) {
              setSellerProducts(data.products);
            }
          } catch (error) {
            console.log(error.message);
          }
        };
        if (currentUser.role === "admin") {
          fetchPosts();
        }
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <div>
      {currentUser.role === "admin" && sellerProducts.length > 0 ? (
        <div className="m-6 p-3 w-full">
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Product image</Table.HeadCell>
              <Table.HeadCell>Product name</Table.HeadCell>
              <Table.HeadCell>Category</Table.HeadCell>
              <Table.HeadCell>Price</Table.HeadCell>
              <Table.HeadCell>Color</Table.HeadCell>
              <Table.HeadCell>Quantity</Table.HeadCell>
              <Table.HeadCell>
                <span className="sr-only">Edit</span>
              </Table.HeadCell>
            </Table.Head>
            {sellerProducts.map((product) => (
              <Table.Body>
                <Table.Row>
                  <Table.Cell>
                    <Link>
                      <img
                        src={product.images}
                        alt="Product"
                        className="h-16"
                      />
                    </Link>
                  </Table.Cell>
                  <Table.Cell>
                    <Link to={`/products/${product.slug}`}>
                      <p className="line-clamp-3 w-36">{product.title}</p>
                    </Link>
                  </Table.Cell>
                  <Table.Cell>
                    <p>{product.category}</p>
                  </Table.Cell>
                  <Table.Cell>
                    <p>{product.price}</p>
                  </Table.Cell>
                  <Table.Cell>
                    <p>{product.color}</p>
                  </Table.Cell>
                  <Table.Cell>
                    <p>{product.quantity}</p>
                  </Table.Cell>
                  <Table.Cell>
                    <div
                      onClick={() => haneleDelete(product._id)}
                      className="font-medium text-red-600 hover:underline cursor-pointer"
                    >
                      Delete
                    </div>
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            ))}
          </Table>
        </div>
      ) : (
        <div className="m-6 flex flex-col gap-3">
          <p className="text-red-500 text-xl">
            You have no listed product yet.
          </p>
          <Link to="/dashboard?page=create-product">
            <button type="button" className="button">
              Click Here to Add Product
            </button>
          </Link>
        </div>
      )}
    </div>
  );
}
