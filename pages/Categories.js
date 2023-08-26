import Layout from "@/components/Layout";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { withSwal } from "react-sweetalert2";

function Categories({ swal }) {
  const [editedCategory, setEditedCategory] = useState(null);
  const [name, setName] = useState("");
  const [categories, setCategories] = useState([]);
  const [parentCategory, setParentCategory] = useState(null);
  const [properties, setProperties] = useState([]);
  useEffect(() => {
    fetchCategory();
  }, []);

  function fetchCategory() {
    axios.get("/api/category").then((response) => {
      if (!response) console.log("There has been an error fetching the data!");
      setCategories(response.data);
    });
  }

  async function saveCategory(ev) {
    ev.preventDefault();
    const data = {
      name,
      parentCategory,
      properties: properties.map((p) => ({
        name: p.name,
        values: p.values.split(","),
      })),
    };
    if (editedCategory) {
      data._id = editedCategory._id;
      const res = await axios.put("/api/category", data);
      if (!res) {
        console.log("There has been an error!");
      }
      setEditedCategory(null);
    } else {
      const res = await axios.post("/api/category", data);
      if (!res) {
        console.log("There has been an error!");
      }
    }
    fetchCategory();
    setName("");
    setParentCategory(null);
    setProperties([])
  }

  function editCategory(category) {
    setEditedCategory(category);
    setName(category.name);
    setParentCategory(category.parent?._id);
    const propertiesRedefined = category.properties.map((p)=> {
      p.values = p.values.join()
      return {name: p.name, values: p.values}
    });
    setProperties(propertiesRedefined)
  }

  function deleteCategory(category) {
    swal
      .fire({
        title: "Warning",
        text: `Are you sure, you want to delete ${category.name} category`,
        showCancelButton: true,
        cancelButtonTitle: "Cancel",
        confirmButtonText: "Yes, Delete!",
        confirmButtonColor: "#c7140e",
        reverseButtons: true,
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          const res = await axios.delete(`/api/category/?_id=${category._id}`);
          if (!res) {
            console.log("There has been an error!");
          }
          fetchCategory();
        }
      });
  }

  function addProperty() {
    setProperties((prev) => [...prev, { name: "", values: "" }]);
  }

  function updatePropertyName(index, property, newName) {
    setProperties((prev) => {
      const properties = [...prev];
      properties[index].name = newName;
      return properties;
    });
  }

  function updatePropertyValue(index, property, newValues) {
    setProperties((prev) => {
      const properties = [...prev];
      properties[index].values = newValues;
      return properties;
    });
  }

  function removeProperty(index) {
    setProperties((prev) => {
      const properties = prev.filter((elem, idx) => idx != index);
      console.log(properties);
      return properties;
    });
  }

  return (
    <Layout>
      <h1>Categories</h1>
      <label>
        {editedCategory
          ? `Edit Category ${editedCategory.name}`
          : "New Category"}
      </label>
      <form onSubmit={saveCategory}>
        <div className="flex gap-1 mb-1">
          <input
            className="mb-0"
            type="text"
            placeholder={"category name"}
            value={name}
            onChange={(ev) => setName(ev.target.value)}
          ></input>
          <select
            className="mb-0"
            value={parentCategory}
            onChange={(ev) => setParentCategory(ev.target.value)}
          >
            <option value={null} onClick={(ev)=>setParentCategory}>No parent Category</option>
            {categories.length > 0 &&
              categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
          </select>
        </div>
        <div className="mb-1">
          <label className="block mb-1">Properties</label>
          <button type="button" onClick={addProperty} className="btn-normal">
            Add New Properties
          </button>
          {properties.length > 0 &&
            properties.map((property, index) => (
              <div key={index} className="flex gap-1 mt-1">
                <input
                  type="text"
                  className="mb-0"
                  value={property.name}
                  onChange={(ev) =>
                    updatePropertyName(index, property, ev.target.value)
                  }
                  placeholder="Property Name (example: color)"
                />
                <input
                  type="text"
                  value={property.values}
                  className="mb-0"
                  onChange={(ev) =>
                    updatePropertyValue(index, property, ev.target.value)
                  }
                  placeholder="Property Values (example: Black)"
                />
                <button
                  className="btn-warning"
                  onClick={() => removeProperty(index)}
                >
                  Remove
                </button>
              </div>
            ))}
        </div>
        <div className="flex gap-1">
          <button type="submit" className="btn-primary ">
            Save
          </button>
          {editedCategory && (
            <button
              type="button"
              onClick={() => {
                setEditedCategory(null);
                setName("");
                setParentCategory("");
                setProperties([])
              }}
              className="btn-normal"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
      {!editedCategory && (
        <table className="basic">
          <thead>
            <tr>
              <td>Categories</td>
              <td>Parent</td>
              <td></td>
            </tr>
          </thead>
          <tbody>
            {categories.length > 0 &&
              categories.map((category) => (
                <tr key={category._id}>
                  <td>{category.name}</td>
                  <td>{category.parent?.name}</td>
                  <td>
                    <div >
                      <button
                        onClick={() => editCategory(category)}
                        className="mr-1 btn-normal"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteCategory(category)}
                        className="mr-1 btn-warning"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      )}
    </Layout>
  );
}

export default withSwal(({ swal }, ref) => <Categories swal={swal} />);
