import axios from "axios";

export const getCategories = () => axios.get("/categories");

export const createCategory = async (categoryName) => {
  return await axios.post("/categories", {
    name: categoryName.trim(),
  });
};

export const getCategoriesAndInventory = async () => {
  const [categoriesResponse, inventoryResponse] = await Promise.all([
    axios.get("/categories"),
    axios.get("/inventory")
  ]);

  return {
    categories: categoriesResponse?.data?.payload?.data || categoriesResponse?.data?.data || [],
    inventory: inventoryResponse?.data?.payload?.data || inventoryResponse?.data?.data || []
  };
};

export const updateCategory = async (id, name) => {
  return await axios.patch(`/categories/${id}`, { name: name.trim() });
};

export const deleteCategory = async (id) => {
  return await axios.delete(`/categories/${id}`);
};


