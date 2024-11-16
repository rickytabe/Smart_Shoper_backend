const Order = require("../models/Order");
const OrderItem = require("../models/OrderItem");
const Product = require("../models/Product");
const BoughtProduct = require('../models/BoughtProduct');
const sequelize = require('../config/db').sequelize; 

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
          include: [Product], 
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
    await sequelize.transaction(async (t) => { 
      const order = await Order.create({ userId: req.user.id, total: 0 }, { transaction: t });
      let total = 0;

      if (!Array.isArray(items)) {
        throw new Error("Invalid items format. Items must be an array.");
      }

      for (const item of items) {
        const product = await Product.findByPk(item.productId, { transaction: t });

        if (!product || product.stock < item.quantity) {
          throw new Error(`Not enough stock for product ${product.name}`);
        }

        const orderItem = await OrderItem.create({
          orderId: order.id,
          productId: item.productId,
          quantity: item.quantity,
          price: product.price, 
        }, { transaction: t });

        await BoughtProduct.create({
          userId: req.user.id,
          productId: item.productId,
          vendorId: product.vendorId 
        }, { transaction: t });

        total += orderItem.price * orderItem.quantity;

        await product.decrement('stock', { by: item.quantity }, { transaction: t }); 
      }

      order.total = total;
      await order.save({ transaction: t }); 

      res.status(201).json(order);
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Failed to create order", error: error.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  try {
    await sequelize.transaction(async (t) => { 
      const order = await Order.findByPk(orderId, {
        include: [OrderItem], 
        transaction: t,
      });

      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      if (status === 'canceled') {
        for (const item of order.OrderItems) {
          const product = await Product.findByPk(item.productId, { transaction: t });
          if (product) {
            await product.increment('stock', { by: item.quantity, transaction: t });
          }
        }
      }

      await order.update({ status }, { transaction: t });
      res.json(order);
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ message: "Failed to update order status", error: error.message });
  }
};

exports.deleteOrder = async (req, res) => {
  const { orderId } = req.params;

  try {
    await sequelize.transaction(async (t) => { 
      const order = await Order.findByPk(orderId, {
        include: [OrderItem], 
        transaction: t,
      });

      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      if (order.userId !== req.user.id) {
        return res.status(403).json({ message: "Unauthorized to delete this order" });
      }

      for (const item of order.OrderItems) {
        const product = await Product.findByPk(item.productId, { transaction: t });
        if (product) {
          await product.increment('stock', { by: item.quantity, transaction: t });
        }
      }

      await order.destroy({ transaction: t });
      res.status(204).end(); 
    });
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({ message: "Failed to delete order", error: error.message });
  }
};

exports.updateOrder = async (req, res) => {
  const { orderId } = req.params;
  const { items } = req.body; 

  try {
    await sequelize.transaction(async (t) => {
      const order = await Order.findByPk(orderId, {
        include: [OrderItem], 
        transaction: t,
      });

      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      if (order.userId !== req.user.id) {
        return res.status(403).json({ message: "Unauthorized to update this order" });
      }

      const originalQuantities = {};
      order.OrderItems.forEach(item => {
        originalQuantities[item.productId] = item.quantity;
      });

      for (const item of items) {
        const existingOrderItem = order.OrderItems.find(
          (orderItem) => orderItem.productId === item.productId
        );

        if (existingOrderItem) {
          const quantityChange = item.quantity - originalQuantities[item.productId];
          if (quantityChange !== 0) {
            const product = await Product.findByPk(item.productId, { transaction: t });
            if (product) {
              if (quantityChange > 0) {
                if (product.stock < quantityChange) {
                  throw new Error(`Not enough stock for product ${product.name}`);
                }
                await product.decrement('stock', { by: quantityChange, transaction: t });
              } else {
                await product.increment('stock', { by: -quantityChange, transaction: t }); 
              }
            }
          }
          await existingOrderItem.update({ quantity: item.quantity }, { transaction: t });
        } else {
          const product = await Product.findByPk(item.productId, { transaction: t });
          if (!product || product.stock < item.quantity) {
            throw new Error(`Not enough stock for product ${product.name}`);
          }
          await OrderItem.create({
            orderId: order.id,
            productId: item.productId,
            quantity: item.quantity,
            price: product.price, 
          }, { transaction: t });
          await product.decrement('stock', { by: item.quantity }, { transaction: t });
        }
      }

      for (const originalItem of order.OrderItems) {
        const isItemRemoved = !items.some(item => item.productId === originalItem.productId);
        if (isItemRemoved) {
          const product = await Product.findByPk(originalItem.productId, { transaction: t });
          if (product) {
            await product.increment('stock', { by: originalItem.quantity, transaction: t });
          }
          await originalItem.destroy({ transaction: t }); 
        }
      }

      let total = 0;
      for (const orderItem of order.OrderItems) {
        total += orderItem.price * orderItem.quantity;
      }
      await order.update({ total }, { transaction: t });

      res.json(order);
    });
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({ message: "Failed to update order", error: error.message });
  }
};
