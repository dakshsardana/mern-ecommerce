"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { storage } from "../pages/api/Firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import Spinner from "./Spinner";
import { ReactSortable } from "react-sortablejs";

export default function ProductForm({
  _id,
  category: exCategory,
  title: exTitle,
  description: exDescription,
  price: exPrice,
  images: exImages,
  properties: exProperties,
}) {
  const [title, setTitle] = useState(exTitle || "");
  const [description, setDescription] = useState(exDescription || "");
  const [price, setPrice] = useState(exPrice || "");
  const [images, setImages] = useState([]);
  const [goToProducts, setGoToProducts] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [propertiesInfo, setPropertiesInfo] = useState(exProperties || {});
  const [selectedCategory, setSelectedCategory] = useState(exCategory || null);
  const router = useRouter();

  useEffect(() => {
    axios.get("/api/category").then((res) => {
      if (!res) {
        console.log("Error fetching categories");
      }
      setCategories(res.data);
    });
  }, []);

  useEffect(() => {
    if (exImages) {
      setImages(exImages);
    }
  }, []);

  async function saveProduct(ev) {
    ev.preventDefault();
    const data = {
      title,description,price,images,selectedCategory,properties: propertiesInfo,
    };
    if (_id) {
      //UPDATE
      await axios.put("/api/products/", { ...data, _id });
    } else {
      //CREATE
      await axios.post("/api/products", data);
    }
    setGoToProducts(true);
  }
  if (goToProducts) router.push("/Products");

  async function uploadFiles(ev) {
    setIsUploading(true);
    const links = [];
    const file = ev.target?.files[0];
    const fileName = Date.now() + "." + file?.name.split(".").pop();
    const imageRef = ref(storage, `images/${fileName}`);
    try {
      await uploadBytesResumable(imageRef, file);
      const url = await getDownloadURL(imageRef);
      links.push(url);
      setImages((prev) => [...prev, ...links]);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
    setIsUploading(false);
  }

  function updateImagesOrder(images) {
    setImages(images);
  }

  const properties = [];
  if (categories.length > 0 && selectedCategory) {
    let selCatInfo = categories.find(({ _id }) => _id === selectedCategory);
    if (selCatInfo) {
      properties.push(...selCatInfo.properties);
      while (selCatInfo?.parent?._id) {
        const parent = categories.find(
          ({ _id }) => _id === selCatInfo?.parent?._id
        );
        properties.push(...parent.properties);
        selCatInfo = parent;
      }
    }
  }

  function setProductProp(propName, value) {
    setPropertiesInfo((prev) => {
      const newProductInfo = { ...prev };
      newProductInfo[propName] = value;
      return newProductInfo;
    });
  }

  return (
    <form onSubmit={saveProduct}>
      <label>Product Name</label>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Product Name"
      />
      <label>Category</label>
      <select
        value={selectedCategory}
        onChange={(ev) => setSelectedCategory(ev.target.value)}
      >
        <option value="">Uncategorized</option>
        {categories.length > 0 &&
          categories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
      </select>
      <div className="flex gap-2">
        {properties.length > 0 &&
          properties.map((property) => (
            <div>
              <label>{property.name}</label>
              <select
                value={propertiesInfo[property.name] || property.values[0]}
                onChange={(ev) => {
                  setProductProp(property.name, ev.target.value);
                }}
              >
                {property.values.map((value) => (
                  <option>{value}</option>
                ))}
              </select>
            </div>
          ))}
      </div>
      <label>Photos</label>
      <div className="mb-2 flex items-center">
        <div className="flex">
          <ReactSortable
            list={images}
            className="flex flex-wrap gap-1"
            setList={updateImagesOrder}
          >
            {!!images?.length &&
              images.map((link) => {
                return (
                  <div key={link}>
                    <img src={link} className="uploadImage" alt={link} />
                  </div>
                );
              })}
          </ReactSortable>
          {isUploading && (
            <div className="h-23 w-24 flex items-center justify-center">
              <Spinner className="w-24 h-24" />
            </div>
          )}
        </div>
        <label className="flex cursor-pointer flex-col text-sm text-gray-500 items-center rounded-lg justify-center w-24 h-24 bg-gray-200 ml-2 hoverUpload">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 8.25H7.5a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25H15m0-3l-3-3m0 0l-3 3m3-3V15"
            />
          </svg>{" "}
          Upload
          <input type="file" onChange={uploadFiles} className="hidden" />
        </label>
      </div>
      <label>Description</label>
      <textarea
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Product Description"
      />
      <label>Price (₹)</label>
      <input
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        type="number"
        placeholder="Price"
      />
      <button type="submit" className="btn-primary">
        Save
      </button>
    </form>
  );
}
