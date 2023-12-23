import axios from "axios";

const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

export async function getOrdersList() {
  const response = await fetch(`${API_URL}/orders/`, {
    method: "GET",
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch orders. Status: ${response.status}`);
  }

  const data = await response.json();

  return data;
}

export async function getOrderItem(id) {
  const response = await fetch(`${API_URL}/orders/${id}`, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch order with ID ${id}. Status: ${response.status}`,
    );
  }

  const data = await response.json();
  return data;
}

// totalIncomingQty, incomingDates,
export async function createOrderItem(order) {
  const response = await fetch(`${API_URL}/orders/`, {
    method: "POST",
    body: JSON.stringify({
      sku: order.sku,
      orderQty: order.orderQty,
      // status has default of "active" in model
      totalCost: order.totalCost,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.json();
}

export async function updateOrderItem(id, updates) {
  const { schedArrivalDate, orderStatus } = updates;
  const response = await fetch(`${API_URL}/orders/${id}`, {
    method: "PATCH",
    body: JSON.stringify({
      schedArrivalDate,
      orderStatus,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.json();
}

export async function deleteOrderItem(id) {
  const response = await fetch(`${API_URL}/orders/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.json();
}

export const clearAllOrderHistory = async () => {
  try {
    const response = await axios.delete(`${API_URL}/orders/clearhistory`, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error clearing order history:", error);
    throw error;
  }
};
