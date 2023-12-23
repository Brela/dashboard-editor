import prisma from "../../config/prismaClient.js";
import { formatDate } from "../../utils/formatDate.js";
import { createRandomArrivalDate } from "../../utils/createRandomArrivalDate.js";

export const getAllOrders = async (req, res) => {
  let orderList;
  let formattedOrderList;
  try {
    orderList = await prisma.Order.findMany({
      include: {
        product: true,
      },
    });

    orderList.sort((a, b) => a.product.sku.localeCompare(b.product.sku));

    formattedOrderList = orderList.map((order) => {
      const fOrderedDate = formatDate(order.orderedDate);
      const fSchedArrivalDate = formatDate(order.schedArrivalDate);
      const fDelivered = formatDate(order.delivered);
      return {
        ...order,
        orderedDate: fOrderedDate,
        schedArrivalDate: fSchedArrivalDate,
        delivered: fDelivered,
      };
    });
  } catch (error) {
    console.log("Error Found: ", error);
    return res.json(error);
  }
  return res.json(formattedOrderList);
};

export const getOrderItem = async (req, res) => {
  const { id } = req.params;
  let orderItem;
  try {
    const getOrderItem = await prisma.Order.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        product: true,
      },
    });
    orderItem = getOrderItem;
  } catch (err) {
    console.log("Error Found: ", err);
    return res.json(err);
  }
  if (orderItem) {
    return res.json(orderItem);
  } else {
    return res.json({
      message: `No orders with the ID ${id}`,
    });
  }
};

export const createOrder = async (req, res) => {
  const { sku, orderQty, totalCost } = req.body;

  const product = await prisma.Product.findFirst({
    where: {
      sku: sku,
    },
  });

  if (!product) {
    console.log("Product not found");
    return res.status(404).json({ error: "Product not found" });
  }

  let orderItem;
  try {
    const randomArrivalDate = createRandomArrivalDate();
    const createOrderItem = await prisma.Order.create({
      data: {
        schedArrivalDate: randomArrivalDate,
        orderQty: orderQty,
        totalCost: totalCost,
        product: {
          connect: {
            id: product.id,
          },
        },
      },
    });
    orderItem = createOrderItem;
  } catch (err) {
    console.log("Error Found: ", err);
    return res.json(err);
  }
  return res.json(orderItem);
};

export const updateOrderItem = async (req, res) => {
  const { id } = req.params;
  const updatedOrderData = req.body;
  let order;
  let updatedOrder;
  try {
    if (updatedOrderData.orderStatus === "delivered") {
      updatedOrderData.delivered = new Date().toISOString();
    }
    updatedOrder = await prisma.Order.update({
      where: {
        id: Number(id),
      },
      data: {
        ...updatedOrderData,
      },
    });
    order = updatedOrder;
  } catch (err) {
    if (err.code === "P2025") {
      return res.json({ message: "Order not found" });
    } else {
      console.log("Error Found: ", err);
      return res.json(err);
    }
  }
  return res.json(order);
};

export const deleteOrderItem = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.Order.delete({
      where: {
        id: Number(id),
      },
    });
  } catch (err) {
    if (err.code === "P2025") {
      return res.json({ message: "Order not found" });
    } else {
      console.log("Error Found: ", err);
      return res.json(err);
    }
  }
  return res.json({ message: "Order deleted!" });
};

export const deleteAllOrderHistory = async (req, res) => {
  try {
    const deletedOrders = await prisma.Order.deleteMany({
      where: {
        orderStatus: "delivered",
      },
    });
    if (deletedOrders.count === 0) {
      return res.status(404).json({ message: "No orders to delete." });
    }
    return res.json({
      message: `Successfully deleted ${deletedOrders.count} orders.`,
    });
  } catch (err) {
    console.log("Error Found: ", err);
    return res
      .status(500)
      .json({
        message: "An error occurred while trying to delete orders.",
        error: err.message,
      });
  }
};

export const deleteAllActiveOrders = async (req, res) => {
  try {
    const deletedOrders = await prisma.Order.deleteMany({
      where: {
        orderStatus: "active",
      },
    });
    return res.json(deletedOrders);
  } catch (err) {
    console.log("Error Found: ", err);
    return res.json(err);
  }
};
