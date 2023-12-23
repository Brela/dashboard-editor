import express from 'express';
import * as ordersController from '../controllers/orders.js';

const router = express();

// for now, only working on active orders, and not order history
router.get("/", ordersController.getAllOrders);
// router.get('/:id', ordersController.getOrderItem);

router.post('/', ordersController.createOrder);

router.patch('/:id', ordersController.updateOrderItem);

router.delete('/clearactiveorders', ordersController.deleteAllActiveOrders);
router.delete('/clearhistory', ordersController.deleteAllOrderHistory);

router.delete('/:id', ordersController.deleteOrderItem);

export default router;

/* router.get("/", authenticate, ordersController.getAllOrders);
// router.get('/:id', ordersController.getOrderItem);

router.post("/", authenticate, ordersController.createOrder);

router.patch("/:id", authenticate, ordersController.updateOrderItem);

router.delete(
  "/clearactiveorders",
  authenticate,
  ordersController.deleteAllActiveOrders
);
router.delete(
  "/clearhistory",
  authenticate,
  ordersController.deleteAllOrderHistory
);

router.delete("/:id", authenticate, ordersController.deleteOrderItem);
 */
