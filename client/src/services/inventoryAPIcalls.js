import getRandomShipper from "../utils/getRandomShipper";
import axios from "axios";
import { toast } from "react-hot-toast";

const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

export const sendCSVfile = async (csvFile) => {
  try {
    const formData = new FormData();
    formData.append("csvFile", csvFile);

    const response = await axios.post(`${API_URL}/inventory/upload`, formData);
    const { data } = response;

    const processedData = data.map((item) => ({
      ...item,
      shipper: getRandomShipper(),
    }));

    const csvFileResult = await createManyInventoryItems(processedData);
    return csvFileResult;
  } catch (error) {
    console.error(error);
  }
};

export async function getInventoryList() {
  const response = await fetch(`${API_URL}/inventory`, {
    method: "GET",
    credentials: "include",
  });
  return response.json();
}

export async function getInventoryItem(id) {
  const response = await fetch(`${API_URL}/inventory/${id}`, {
    method: "GET",
    credentials: "include",
  });
  return response.json();
}

export async function createInventoryItem(product) {
  const fieldsToValidate = ["inStock", "reorderAt", "orderQty", "unitPrice"];

  for (let field of fieldsToValidate) {
    if (typeof product[field] !== "number" && isNaN(Number(product[field]))) {
      throw new Error(`The field ${field} must be a number.`);
    }
  }

  try {
    const response = await fetch(`${API_URL}/inventory/`, {
      method: "POST",
      body: JSON.stringify({
        sku: product.sku,
        brand: product.brand,
        productName: product.productName,
        description: product.description,
        shipper: getRandomShipper(),
        inStock: Number(product.inStock),
        reorderAt: Number(product.reorderAt),
        orderQty: Number(product.orderQty),
        unitPrice: Number(product.unitPrice),
      }),
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "An unexpected error occurred.");
    }

    return response.json();
  } catch (error) {
    console.error("Error creating inventory item:", error);

    return error.message;
  }
}

export async function createManyInventoryItems(products) {
  let message;

  await products.map((product) => {
    for (let prop in product) {
      if (product.hasOwnProperty(prop)) {
        if (
          prop === "inStock" ||
          prop === "reorderAt" ||
          prop === "orderQty" ||
          prop === "unitPrice"
        ) {
          product[prop] = parseInt(product[prop]);
        }
      }
    }
  });
  console.log(products);

  const response = await fetch(`${API_URL}/inventory/bulk`, {
    method: "POST",
    body: JSON.stringify({ products }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  message = await response.json();

  if (response.status === 400) {
    toast.error(`${message.error}`);
  } else {
    toast.success(`${message} products have been added to inventory`, {});

    setTimeout(() => {
      location.reload();
    }, 4000);
  }
}

export const updateInventoryItem = async (id, updates) => {
  const { reorderAt, orderQty } = updates;

  let cleanUpdates = {};

  if (reorderAt !== undefined && reorderAt !== null) {
    cleanUpdates.reorderAt = parseInt(reorderAt, 10);
  }

  if (orderQty !== undefined && orderQty !== null) {
    cleanUpdates.orderQty = parseInt(orderQty, 10);
  }

  if (Object.keys(cleanUpdates).length === 0) {
    console.error("No valid fields to update");
    return;
  }

  try {
    const response = await axios.patch(
      `${API_URL}/inventory/${id}`,
      cleanUpdates,
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      },
    );
    return response.data;
  } catch (error) {
    console.error(
      "An error occurred while updating the inventory item:",
      error,
    );
    throw error;
  }
};

export const deleteInventoryItems = async (ids) => {
  try {
    const response = await axios.delete(`${API_URL}/inventory/bulk`, {
      data: { ids },
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    console.error("Error deleting inventory items:", error);
    throw error;
  }
};
