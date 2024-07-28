const { json } = require("body-parser");
const Order = require("../models/Order");
const OrderItem = require("../models/OrderItem");
const Product = require("../models/Product"); // Import Product model

exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { userId: req.user.id },
      include: [OrderItem],
    });
    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

exports.getOrder = async (req, res) => {
  const { orderId } = req.params;

  try {
    const order = await Order.findByPk(orderId, {
      include: [
        {
          model: OrderItem,
          include: [Product], // Include the associated Product for each OrderItem
        },
      ],
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ message: "Failed to fetch order" });
  }
};

exports.createOrder = async (req, res) => {
  const { items } = req.body;

  try {
    const order = await Order.create({ userId: req.user.id, total: 0 });
    let total = 0;
    // Check if items is an array
    if (!Array.isArray(items)) {
      return res
        .status(400)
        .json({ message: "Invalid items format. Items must be an array." });
    }

    for (const item of items) {
      // Fetch the product from the database
      const product = await Product.findByPk(item.productId);

      if (!product) {
        return res
          .status(404)
          .json({ message: `Product with ID ${item.productId} not found.` });
      }

      // Create the order item
      const orderItem = await OrderItem.create({
        orderId: order.id,
        productId: item.productId,
        quantity: item.quantity,
        price: product.price, // Use the price from the database
      });

      total += orderItem.price * orderItem.quantity;
    }

    order.total = total;
    await order.save();

    res.status(201).json(order);
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Failed to create order" });
  }
};

exports.updateOrderStatus = async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  try {
    const order = await Order.findByPk(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Validate status
    if (!["completed", "canceled"].includes(status)) {
      return res
        .status(400)
        .json({
          message: 'Invalid status. Must be "completed" or "canceled".',
        });
    }

    await order.update({ status });
    res.json(order);
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ message: "Failed to update order status" });
  }
};

exports.deleteOrder = async (req, res) => {
  const { orderId } = req.params;

  try {
    const order = await Order.findByPk(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Check if the order belongs to the current user
    if (order.userId !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Unauthorized to delete this order" });
    }

    await order.destroy();
    //return a json saying order deleted
    res.status(200).json({ message: 'Order deleted successfully'}); // 204 No Content - successful deletion with no content
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({ message: "Failed to delete order" });
  }
};

exports.updateOrder = async (req, res) => {
  const { orderId } = req.params;
  const { items } = req.body; // Only accepting items for update

  try {
    const order = await Order.findByPk(orderId, {
      include: [OrderItem], // Include OrderItems to update quantities
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Check if the order belongs to the current user
    if (order.userId !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Unauthorized to update this order" });
    }

    // Update items (if provided)
    if (items) {
      // Validate items format
      if (!Array.isArray(items)) {
        return res
          .status(400)
          .json({ message: "Invalid items format. Items must be an array." });
      }

      // Update existing OrderItems or create new ones
      for (const item of items) {
        const existingOrderItem = order.OrderItems.find(
          (orderItem) => orderItem.productId === item.productId
        );

        if (existingOrderItem) {
          // Update existing OrderItem
          await existingOrderItem.update({ quantity: item.quantity });
        } else {
            // Fetch the product from the database
          const product = await Product.findByPk(item.productId);

          if (!product) {
            return res.status(404).json({ message: `Product with ID ${item.productId} not found.` });
          }

          // Create new OrderItem
          await OrderItem.create({
            orderId: order.id,
            productId: item.productId,
            quantity: item.quantity,
            price: product.price, // Assuming price is provided in the request
          });
        }
      }

      // Recalculate total after updating items
      let total = 0;
      for (const orderItem of order.OrderItems) {
        total += orderItem.price * orderItem.quantity;
      }
      await order.update({ total });
    }

    res.json(order);
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({ message: "Failed to update order" });
  }
};
