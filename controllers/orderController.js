const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');

exports.getOrders = async (req, res) => {
  const orders = await Order.findAll({ where: { userId: req.userId }, include: [OrderItem] });
  res.json(orders);
};

exports.createOrder = async (req, res) => {
  const { items } = req.body;

  try {
    const order = await Order.create({ userId: req.userId, total: 0 });
    let total = 0;

    for (const item of items) {
      const orderItem = await OrderItem.create({ orderId: order.id, ...item });
      total += orderItem.price * orderItem.quantity;
    }

    order.total = total;
    await order.save();

    res.status(201).json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Failed to create order' });
  }
};

