import { useState, useRef } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5000/api/AdminProduct";

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
console.log("Backend URL:", VITE_BACKEND_URL); // just to confirm


const fetchProducts = async () => {
  const res = await fetch(`${VITE_BACKEND_URL}api/AdminProduct/AdminGetProduct`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
};

export default function AdminProduct() {
  const navigate = useNavigate();
  const handleAddToMen = () => navigate("/adminMenProduct");
  const handleAddToWomen = () => navigate("/adminWomenProduct");
  const handleAddToChild = () => navigate("/adminChildProduct");
  const AdminOrder = () => navigate("/adminOrderTracking");
    const AdminDashboard = () => navigate("/adminDashboard");


  const queryClient = useQueryClient();
  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  const [editingProduct, setEditingProduct] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileRef = useRef();

  const mutation = useMutation({
    mutationFn: async ({ formData, isEdit, id }) => {
      const url = isEdit
        ? `${VITE_BACKEND_URL}api/AdminProduct/AdminUpdateProduct/${id}`
        : `${VITE_BACKEND_URL}api/AdminProduct/AdminCreateProduct`;

      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        body: formData,
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Operation failed");
      return json;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["products"]);
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const res = await fetch(`${VITE_BACKEND_URL}api/AdminProduct/AdminDeleteProduct/${id}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Delete failed");
      return json;
    },
    onSuccess: () => queryClient.invalidateQueries(["products"]),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData();

    formData.append("name", form.name.value);
    formData.append("price", form.price.value);
    formData.append("description", form.description.value);
    formData.append("expectedDelivery", form.expectedDelivery.value); // ✅ new field
    if (fileRef.current?.files[0]) {
      formData.append("image", fileRef.current.files[0]);
    }

    mutation.mutate({
      formData,
      isEdit: Boolean(editingProduct),
      id: editingProduct?._id,
    });
  };

  const resetForm = () => {
    document.getElementById("product-form").reset();
    fileRef.current.value = "";
    setImagePreview(null);
    setEditingProduct(null);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setImagePreview(product.image);
  };

  const handleDelete = (id) => {
    if (confirm("Delete this product?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white shadow-xl rounded-lg">
   <div className="w-full bg-white shadow-sm border-b">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 py-3">
      {[
        { label: "Add Men Product", action: handleAddToMen },
        { label: "Add Women Product", action: handleAddToWomen },
        { label: "Add Child Product", action: handleAddToChild },
        { label: "Admin Dashboard", action: AdminDashboard },
        { label: "Admin Orders Update", action: AdminOrder },
      ].map((item, index) => (
        <button
          key={index}
          onClick={item.action}
          className="text-sm font-medium text-gray-700 hover:text-white hover:bg-blue-600 px-3 py-1.5 rounded-lg transition duration-200"
        >
          {item.label}
        </button>
      ))}
    </div>
  </div>
</div>

      <h1 className="text-2xl font-bold mb-4">
        {editingProduct ? "Edit Product" : "Add All New Product"}
      </h1>

      <form
        id="product-form"
        onSubmit={handleSubmit}
        className="space-y-4"
        encType="multipart/form-data"
      >
        <input
          name="name"
          defaultValue={editingProduct?.name}
          placeholder="Product Name"
          className="w-full border px-4 py-2 rounded"
          required
        />
        <input
          name="price"
          type="number"
          defaultValue={editingProduct?.price}
          placeholder="Price"
          className="w-full border px-4 py-2 rounded"
          required
        />
        <textarea
          name="description"
          defaultValue={editingProduct?.description}
          placeholder="Description"
          className="w-full border px-4 py-2 rounded"
        />
        <input
          type="date"
          name="expectedDelivery"
          defaultValue={
            editingProduct?.expectedDelivery
              ? new Date(editingProduct.expectedDelivery)
                  .toISOString()
                  .split("T")[0]
              : ""
          }
          className="w-full border px-4 py-2 rounded"
        />
        <input
          ref={fileRef}
          name="image"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="block w-full"
        />
        {imagePreview && (
          <img
            src={imagePreview}
            alt="Preview"
            className="w-32 h-32 object-cover border rounded-md mt-2"
          />
        )}

        <button
          type="submit"
          disabled={mutation.isPending}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {editingProduct ? "Update Product" : "Create Product"}
        </button>

        {mutation.isError && (
          <p className="text-red-600">❌ {mutation.error.message}</p>
        )}
        {mutation.isSuccess && (
          <p className="text-green-600">✅ Success!</p>
        )}
      </form>

      <h2 className="text-xl font-semibold mt-8 mb-4">All Products</h2>
      {isLoading ? (
        <p>Loading products...</p>
      ) : (
        <div className="grid gap-4">
          {products.map((product) => (
            <div
              key={product._id}
              className="p-4 border rounded-md shadow-sm flex gap-4"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-24 h-24 object-cover rounded"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{product.name}</h3>
                <p>₹{product.price}</p>
                <p className="text-sm text-gray-600">{product.description}</p>

                {/* ✅ Show Expected Delivery */}
                {product.expectedDelivery && (
                  <p className="text-sm text-green-600">
                    🚚 Expected Delivery:{" "}
                    {new Date(product.expectedDelivery).toLocaleDateString(
                      "en-IN",
                      {
                        weekday: "short",
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      }
                    )}
                  </p>
                )}

                <div className="mt-2 space-x-2">
                  <button
                    onClick={() => handleEdit(product)}
                    className="px-3 py-1 bg-yellow-400 rounded text-white"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="px-3 py-1 bg-red-500 rounded text-white"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
