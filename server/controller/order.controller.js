const Order = require('../model/order');
const { adjustStockHelper } = require('./inventory.controller'); 

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({ isDeleted: false })
      .populate('supplierId', 'companyName agentName companyMobile') 
      .sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) { 
    res.status(500).json({ error: error.message }); 
  }
};

exports.createOrder = async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (error) { 
    res.status(400).json({ error: error.message }); 
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    await Order.findByIdAndUpdate(req.params.id, { isDeleted: true, deletedAt: new Date() });
    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) { 
    res.status(500).json({ error: error.message }); 
  }
};

exports.receiveOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order || order.isDeleted) {
      return res.status(404).json({ message: "Order not found" });
    }
    if (order.status === 'Received') {
      return res.status(400).json({ message: "Order is already marked as received" });
    }

    for (let item of order.items) {
       await adjustStockHelper(item.inventoryId, item.qty, 'PO_RECEIVE'); 
    }

    order.status = 'Received';
    await order.save();
    
    res.status(200).json({ message: "Order received and inventory updated automatically!", order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};