import Layout from "@/components/Layout";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import axios from 'axios';
const DeleteProductPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [prodcutInfo, setProductInfo] = useState(null);

  useEffect(() => {
    if (!id) return;

    axios.get(`/api/products?id=${id}`).then((response) => setProductInfo(response.data));
  }, [id]);

  function goBack() {
    router.push("/Products");
  }

  async function goDelete() {
    await axios.delete(`/api/products/?id=${id}`)
    goBack();
  }

  return (
    <Layout>
      <div className="flex flex-col items-center">
        <h1>Do you really want to delete the product "{prodcutInfo?.title}"?</h1>
        <div>
          <button
            onClick={goDelete}
            className="bg-red-400 px-2 py-1 rounded-md  m-2"
          >
            Yes
          </button>
          <button
            onClick={goBack}
            className="bg-green-300 px-2 py-1 rounded-md  m-2"
          >
            No
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default DeleteProductPage;
