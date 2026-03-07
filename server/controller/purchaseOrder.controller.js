const PurchaseOrder = require('../model/PurchaseOrder');
const Inventory = require('../model/Inventory');

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await PurchaseOrder.find().populate('supplier', 'companyName agentName').sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) { res.status(500).json({ error: error.message }); }
};

exports.createOrder = async (req, res) => {
  try {
    const newOrder = new PurchaseOrder(req.body);
    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (error) { res.status(400).json({ error: error.message }); }
};

exports.markAsReceived = async (req, res) => {
  try {
    const order = await PurchaseOrder.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    if (order.status === 'Received') return res.status(400).json({ message: "Already received" });

    // 1. AUTO UPDATE INVENTORY
    for (let item of order.items) {
      if (item.itemId) {
        await Inventory.findByIdAndUpdate(item.itemId, { $inc: { qty: item.qty } });
      }
    }

    // 2. UPDATE ORDER STATUS
    order.status = 'Received';
    order.receivedDate = new Date();
    await order.save();

    res.status(200).json({ message: "Order received & inventory updated!", order });
  } catch (error) { res.status(500).json({ error: error.message }); }
};

exports.deleteOrder = async (req, res) => {
  try {
    await PurchaseOrder.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Order deleted" });
  } catch (error) { res.status(500).json({ error: error.message }); }
};