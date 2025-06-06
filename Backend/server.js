const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Models
const MenuItem = require('./models/MenuItem');
const TempOrder = require('./models/TempOrder');
const DailyReport = require('./models/DailyReport');
const Staff = require('./models/Staff');
const Expense = require('./models/Expense');
const Stock = require('./models/Stock'); // Add this line if you have Stock model
const jwt = require("jsonwebtoken");
const InventoryAdmin = require("./models/InventoryAdmin");
const SECRET = process.env.JWT_SECRET || "inventory_secret_key";// Use a secure one in production

// ============== NEW MODELS FOR ACCOUNTANT ==============
// Add Payment model schema if not exists
const paymentSchema = new mongoose.Schema({
    user_id: { type: String, required: true },
    amount: { type: Number, required: true },
    method: {
        type: String,
        enum: ['cash', 'card', 'upi', 'online'],
        default: 'cash'
    },
    orderId: { type: String }, // Reference to order if applicable
    description: { type: String },
    createdAt: { type: Date, default: Date.now }
});
const Payment = mongoose.model('Payment', paymentSchema);

// Route imports - All files should exist now
const stockRoutes = require('./Routes/stockRoutes');
const adminAuthRoutes = require('./Routes/adminAuthRoutes');
const adminRoutes = require('./Routes/adminRoutes');
// const authRoutes = require('./Routes/authRoutes');
const dashboardRoutes = require('./Routes/dashboardRoutes');
const notificationRoutes = require('./Routes/notificationsRoutes');
const orderRoutes = require('./Routes/orders');
const reportRoutes = require('./Routes/reportRoutes');
const settingRoutes = require('./Routes/settingRoutes');
const stockUsageRoutes = require('./Routes/stockUsageRoutes');
const userRoutes = require('./Routes/userRoutes');

// Set up Express app
const app = express();

// Create HTTP server for Socket.io
const server = http.createServer(app);

// Socket.io setup
const io = new Server(server, {
    cors: {
        origin: "*", // Configure this for production
        methods: ["GET", "POST"]
    }
});

// Make io accessible to routes
app.set("io", io);

// Socket.io connection handling
io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });

    // Handle custom events if needed
    socket.on("joinRoom", (room) => {
        socket.join(room);
        console.log(`User ${socket.id} joined room: ${room}`);
    });
});

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads', 'menu-images');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadsDir);
    },
    filename: function (req, file, cb) {
        // Generate unique filename
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'menu-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: function (req, file, cb) {
        // Check file type
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'), false);
        }
    }
});

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Serve static images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB URI
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/restaurant_management';

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.log("MongoDB connection error:", err));

// RestaurantOwner schema and model
const restaurantOwnerSchema = new mongoose.Schema({
    name: String,
    mobile_number: String,
    email: String,
    restaurant_name: String,
    location: String,
    user_id: { type: String, unique: true },
    password: String,
    paymentStatus: { type: String, default: "not paid" },
    paymentDate: Date,
    qrCode: String,
    num_tables: Number
});
const RestaurantOwner = mongoose.model('RestaurantOwner', restaurantOwnerSchema);

// YOUR NEW INVENTORY ROUTES (all routes now active)
app.use('/api/inventory-stock', stockRoutes);
app.use('/api/admin-auth', adminAuthRoutes);
app.use('/api/admin', adminRoutes);
// app.use('/api/auth-inventory', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/inventory-orders', orderRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/settings', settingRoutes);
app.use('/api/stock-usage', stockUsageRoutes);
app.use('/api/users', userRoutes);

// EXISTING ROUTES (Restaurant Management System)

// Signup
app.post('/api/signup', async (req, res) => {
    try {
        const newOwner = new RestaurantOwner(req.body);
        const owner = await newOwner.save();
        res.status(200).json({ message: "Signup successful", data: owner });
    } catch (err) {
        res.status(500).json({ message: "Error saving data", error: err });
    }
});

// Login
app.post('/api/login', async (req, res) => {
    const { user_id, password } = req.body;
    try {
        const owner = await RestaurantOwner.findOne({ user_id, password });
        if (!owner) return res.status(401).json({ message: "Invalid credentials" });
        res.status(200).json({ message: "Login successful", user_id: owner.user_id, paymentStatus: owner.paymentStatus });
    } catch (err) {
        res.status(500).json({ message: "Internal Server Error", error: err });
    }
});

// Payment
app.post('/api/payment', async (req, res) => {
    const { user_id, password } = req.body;
    try {
        const owner = await RestaurantOwner.findOne({ user_id, password });
        if (!owner) return res.status(401).json({ message: "Invalid user_id or password" });
        owner.paymentStatus = "paid";
        owner.paymentDate = new Date();
        await owner.save();
        res.status(200).json({ message: "Payment successful. Status updated to 'paid'." });
    } catch (err) {
        res.status(500).json({ message: "Internal Server Error", error: err });
    }
});

// Payment status
app.post('/api/getPaymentStatus', async (req, res) => {
    const { user_id } = req.body;
    try {
        const owner = await RestaurantOwner.findOne({ user_id });
        if (!owner) return res.status(404).json({ message: "User not found" });

        let daysLeft = 0;
        if (owner.paymentStatus === "paid" && owner.paymentDate) {
            const expiry = new Date(owner.paymentDate);
            expiry.setDate(expiry.getDate() + 30);
            daysLeft = Math.max(0, Math.ceil((expiry - new Date()) / (1000 * 60 * 60 * 24)));
        }

        res.status(200).json({ status: owner.paymentStatus, daysLeft });
    } catch (err) {
        res.status(500).json({ message: "Internal Server Error", error: err });
    }
});

// QR Code endpoints
app.post('/api/generateQR', async (req, res) => {
    const { user_id } = req.body;
    try {
        const owner = await RestaurantOwner.findOne({ user_id });
        if (!owner) return res.status(404).json({ error: "User not found" });
        if (owner.qrCode) return res.status(200).json({ qrValue: owner.qrCode });

        const qrURL = `http://localhost:5173/customer-entry/${user_id}`;
        owner.qrCode = qrURL;
        await owner.save();
        res.status(200).json({ qrValue: qrURL });
    } catch (err) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.post('/api/viewQR', async (req, res) => {
    const { user_id } = req.body;
    try {
        const owner = await RestaurantOwner.findOne({ user_id });
        if (!owner || !owner.qrCode) return res.status(404).json({ error: "QR not found" });
        res.status(200).json({ qrValue: owner.qrCode });
    } catch (err) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Set number of tables
app.post('/api/setTables', async (req, res) => {
    const { user_id, num_tables } = req.body;
    try {
        const owner = await RestaurantOwner.findOneAndUpdate({ user_id }, { num_tables }, { new: true });
        res.status(200).json({ message: "Tables updated", owner });
    } catch (err) {
        res.status(500).json({ message: "Error updating tables", error: err });
    }
});

app.post('/api/getTableCount', async (req, res) => {
    const { user_id } = req.body;
    try {
        const owner = await RestaurantOwner.findOne({ user_id });
        if (!owner) return res.status(404).json({ message: "User not found" });
        res.status(200).json({ num_tables: owner.num_tables || 0 });
    } catch (err) {
        res.status(500).json({ message: "Internal Server Error", error: err });
    }
});

// IMAGE UPLOAD ENDPOINT
app.post('/api/menu/uploadImage', upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No image file provided' });
        }

        // Return the relative URL path
        const imageUrl = `/uploads/menu-images/${req.file.filename}`;
        res.status(200).json({ imageUrl });
    } catch (error) {
        console.error('Image upload error:', error);
        res.status(500).json({ error: 'Failed to upload image' });
    }
});

// MENU ROUTES (Updated with image support)
app.post('/api/menu/getMenuItems', async (req, res) => {
    const { user_id } = req.body;
    try {
        const items = await MenuItem.find({ user_id });
        res.status(200).json({ items });
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch menu", details: err });
    }
});

app.post('/api/menu/addMenuItem', async (req, res) => {
    const { user_id, name, price, category, image_url } = req.body;
    try {
        const newItem = new MenuItem({
            user_id,
            name,
            price,
            category,
            image_url: image_url || null
        });
        await newItem.save();
        res.status(201).json({ item: newItem });
    } catch (err) {
        res.status(500).json({ error: "Failed to add item", details: err });
    }
});

app.put('/api/menu/updateMenuItem/:id', async (req, res) => {
    const { name, price, category, image_url } = req.body;
    try {
        const updateData = { name, price, category };

        // Only update image_url if it's provided
        if (image_url !== undefined) {
            updateData.image_url = image_url;
        }

        const updated = await MenuItem.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({ error: "Menu item not found" });
        }

        res.status(200).json({ item: updated });
    } catch (err) {
        res.status(500).json({ error: "Update failed", details: err });
    }
});

app.delete('/api/menu/deleteMenuItem/:id', async (req, res) => {
    try {
        const item = await MenuItem.findById(req.params.id);

        if (!item) {
            return res.status(404).json({ error: "Menu item not found" });
        }

        // Delete associated image file if it exists
        if (item.image_url) {
            const imagePath = path.join(__dirname, item.image_url);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        await MenuItem.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Menu item and associated image deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: "Delete failed", details: err });
    }
});

// Orders
app.post('/api/order/place', async (req, res) => {
    const { user_id, table_number, items, totalAmount } = req.body;
    try {
        const order = new TempOrder({ user_id, table_number, items, totalAmount, paymentStatus: "not paid" });
        await order.save();
        res.status(200).json({ order });
    } catch (err) {
        res.status(500).json({ message: "Failed to place order", error: err });
    }
});

app.post('/api/orders/getKitchenOrders', async (req, res) => {
    const { user_id } = req.body;
    try {
        const orders = await TempOrder.find({
            user_id,
            paymentStatus: { $in: ["not paid", "paid"] }  // ✅ this is critical
        });
        res.status(200).json({ orders });
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch kitchen orders", error: err });
    }
});

app.post('/api/reception/orders', async (req, res) => {
    const { user_id } = req.body;
    try {
        const orders = await TempOrder.find({ user_id, paymentStatus: "not paid" });
        res.status(200).json({ orders });
    } catch (err) {
        res.status(500).json({ message: "Error fetching reception orders", error: err });
    }
});

app.delete('/api/reception/deleteOrder/:orderId', async (req, res) => {
    try {
        await TempOrder.findByIdAndDelete(req.params.orderId);
        res.status(200).json({ message: "Deleted" });
    } catch (err) {
        res.status(500).json({ error: "Delete failed", details: err });
    }
});

// ============== UPDATED ORDER SERVING WITH PAYMENT TRACKING ==============
app.post('/api/orders/served', async (req, res) => {
    const { orderId, items, total, user_id, paymentMethod } = req.body;

    try {
        // 1. Delete from TempOrder
        await TempOrder.findByIdAndDelete(orderId);

        // 2. Find or create today's report
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let report = await DailyReport.findOne({ user_id, date: today });

        if (!report) {
            report = new DailyReport({
                user_id,
                date: today,
                totalRevenue: 0,
                itemSales: {}
            });
        }

        // 3. Update totalRevenue and itemSales
        report.totalRevenue += total;

        items.forEach(item => {
            const currentCount = report.itemSales.get(item.name) || 0;
            report.itemSales.set(item.name, currentCount + item.quantity);
        });

        await report.save();

        // 4. Record payment if provided
        if (paymentMethod && total > 0) {
            const payment = new Payment({
                user_id,
                amount: total,
                method: paymentMethod,
                orderId,
                description: 'Order payment - Table order'
            });
            await payment.save();
        }

        res.status(200).json({ message: "Order served and report updated." });
    } catch (error) {
        console.error("Error serving order:", error);
        res.status(500).json({ error: "Server error" });
    }
});

app.post('/api/order/markServed', async (req, res) => {
    const { orderId } = req.body;

    try {
        const order = await TempOrder.findById(orderId);
        if (!order) return res.status(404).json({ message: "Order not found" });

        const dateOnly = new Date(new Date().setHours(0, 0, 0, 0));
        let report = await DailyReport.findOne({ user_id: order.user_id, date: dateOnly });

        if (!report) {
            report = new DailyReport({
                user_id: order.user_id,
                date: dateOnly,
                totalRevenue: 0,
                itemSales: {}
            });
        }

        report.totalRevenue += order.totalAmount;
        for (const item of order.items) {
            const current = report.itemSales.get(item.name) || 0;
            report.itemSales.set(item.name, current + item.quantity);
        }

        await report.save();
        await TempOrder.findByIdAndDelete(orderId);

        res.status(200).json({ message: "Order marked as served and revenue updated" });
    } catch (err) {
        res.status(500).json({ message: "Failed to mark served", error: err });
    }
});

app.post('/api/order/pay', async (req, res) => {
    const { orderId } = req.body;
    try {
        const order = await TempOrder.findById(orderId);
        if (!order) return res.status(404).json({ message: "Order not found" });

        const dateOnly = new Date(new Date().setHours(0, 0, 0, 0));
        let report = await DailyReport.findOne({ user_id: order.user_id, date: dateOnly });

        if (!report) report = new DailyReport({ user_id: order.user_id, date: dateOnly, totalRevenue: 0, itemSales: {} });

        report.totalRevenue += order.totalAmount;
        for (const item of order.items) {
            const current = report.itemSales.get(item.name) || 0;
            report.itemSales.set(item.name, current + item.quantity);
        }

        await report.save();
        await TempOrder.findByIdAndDelete(orderId);
        res.status(200).json({ message: "Paid and updated" });
    } catch (err) {
        res.status(500).json({ message: "Payment error", error: err });
    }
});

// ============== ENHANCED ACCOUNTANT MODULE ==============

// Existing revenue endpoint
app.post('/api/accountant/revenue', async (req, res) => {
    const { user_id, date } = req.body;
    try {
        const queryDate = new Date(date);
        const start = new Date(queryDate.setHours(0, 0, 0, 0));
        const end = new Date(queryDate.setHours(23, 59, 59, 999));
        const report = await DailyReport.findOne({ user_id, date: { $gte: start, $lte: end } });

        res.status(200).json({
            totalRevenue: report?.totalRevenue || 0,
            itemSales: report ? Object.fromEntries(report.itemSales) : {}
        });
    } catch (err) {
        res.status(500).json({ message: "Accountant fetch failed", error: err });
    }
});

// NEW: Monthly report endpoint for graphical analysis
app.post('/api/accountant/monthly-report', async (req, res) => {
    try {
        const { user_id } = req.body;

        if (!user_id) {
            return res.status(400).json({ error: 'user_id is required' });
        }

        // Get revenue data grouped by month
        const revenueData = await DailyReport.aggregate([
            { $match: { user_id } },
            {
                $group: {
                    _id: {
                        year: { $year: "$date" },
                        month: { $month: "$date" }
                    },
                    revenue: { $sum: "$totalRevenue" }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } }
        ]);

        // Get expense data grouped by month
        const expenseData = await Expense.aggregate([
            { $match: { user_id } },
            {
                $group: {
                    _id: {
                        year: { $year: "$date" },
                        month: { $month: "$date" }
                    },
                    expense: { $sum: "$amount" }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } }
        ]);

        // Create expense lookup map
        const expenseMap = {};
        expenseData.forEach(exp => {
            const key = `${exp._id.year}-${exp._id.month}`;
            expenseMap[key] = exp.expense;
        });

        // Combine data and format for frontend
        const monthNames = [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ];

        const monthlyReport = revenueData.map(item => {
            const key = `${item._id.year}-${item._id.month}`;
            const monthName = monthNames[item._id.month - 1];
            const year = item._id.year;

            return {
                month: `${monthName} ${year}`,
                revenue: item.revenue || 0,
                expense: expenseMap[key] || 0
            };
        });

        // Add months that have only expenses
        expenseData.forEach(exp => {
            const key = `${exp._id.year}-${exp._id.month}`;
            const exists = monthlyReport.find(item => {
                const monthName = monthNames[exp._id.month - 1];
                return item.month === `${monthName} ${exp._id.year}`;
            });

            if (!exists) {
                const monthName = monthNames[exp._id.month - 1];
                monthlyReport.push({
                    month: `${monthName} ${exp._id.year}`,
                    revenue: 0,
                    expense: exp.expense
                });
            }
        });

        // Sort by date
        monthlyReport.sort((a, b) => {
            const dateA = new Date(a.month);
            const dateB = new Date(b.month);
            return dateA - dateB;
        });

        res.status(200).json({ monthlyReport });
    } catch (error) {
        console.error('Error fetching monthly report:', error);
        res.status(500).json({ error: 'Failed to fetch monthly report' });
    }
});

// NEW: Complete reports endpoint - Fetch all reports with revenue and expense data
app.get('/api/reports', async (req, res) => {
    try {
        const user_id = req.query.user_id || req.body.user_id;

        if (!user_id) {
            return res.status(400).json({ error: 'user_id is required' });
        }

        // Get all daily reports
        const dailyReports = await DailyReport.find({ user_id }).sort({ date: 1 });

        // Get all expenses grouped by date
        const expenses = await Expense.aggregate([
            { $match: { user_id } },
            {
                $group: {
                    _id: {
                        $dateToString: { format: "%Y-%m-%d", date: "$date" }
                    },
                    totalExpense: { $sum: "$amount" }
                }
            }
        ]);

        // Create expense lookup map
        const expenseMap = {};
        expenses.forEach(exp => {
            expenseMap[exp._id] = exp.totalExpense;
        });

        // Combine revenue and expense data
        const reports = dailyReports.map(report => {
            const dateStr = report.date.toISOString().split('T')[0];
            return {
                id: report._id,
                date: report.date,
                revenue: report.totalRevenue || 0,
                expense: expenseMap[dateStr] || 0,
                itemSales: Object.fromEntries(report.itemSales || new Map())
            };
        });

        // Also include days with only expenses (no revenue)
        expenses.forEach(exp => {
            const existingReport = reports.find(r =>
                r.date.toISOString().split('T')[0] === exp._id
            );

            if (!existingReport) {
                reports.push({
                    id: `expense-${exp._id}`,
                    date: new Date(exp._id),
                    revenue: 0,
                    expense: exp.totalExpense,
                    itemSales: {}
                });
            }
        });

        // Sort by date
        reports.sort((a, b) => new Date(a.date) - new Date(b.date));

        res.status(200).json(reports);
    } catch (error) {
        console.error('Error fetching reports:', error);
        res.status(500).json({ error: 'Failed to fetch reports' });
    }
});

// ============== PAYMENT TRACKING ROUTES ==============

// GET /api/payments/get - Fetch all payments for a user
app.post('/api/payments/get', async (req, res) => {
    try {
        const { user_id } = req.body;

        if (!user_id) {
            return res.status(400).json({ error: 'user_id is required' });
        }

        const payments = await Payment.find({ user_id }).sort({ createdAt: -1 });

        res.status(200).json({ payments });
    } catch (error) {
        console.error('Error fetching payments:', error);
        res.status(500).json({ error: 'Failed to fetch payments' });
    }
});

// POST /api/payments/add - Add a new payment record
app.post('/api/payments/add', async (req, res) => {
    try {
        const { user_id, amount, method, orderId, description } = req.body;

        if (!user_id || !amount) {
            return res.status(400).json({ error: 'user_id and amount are required' });
        }

        const payment = new Payment({
            user_id,
            amount,
            method: method || 'cash',
            orderId,
            description
        });

        await payment.save();

        res.status(201).json({
            message: 'Payment recorded successfully',
            payment
        });
    } catch (error) {
        console.error('Error adding payment:', error);
        res.status(500).json({ error: 'Failed to record payment' });
    }
});

// GET /api/payments/summary - Get payment method summary
app.post('/api/payments/summary', async (req, res) => {
    try {
        const { user_id, startDate, endDate } = req.body;

        if (!user_id) {
            return res.status(400).json({ error: 'user_id is required' });
        }

        const matchCondition = { user_id };

        if (startDate && endDate) {
            matchCondition.createdAt = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }

        const summary = await Payment.aggregate([
            { $match: matchCondition },
            {
                $group: {
                    _id: '$method',
                    totalAmount: { $sum: '$amount' },
                    count: { $sum: 1 }
                }
            }
        ]);

        res.status(200).json({ summary });
    } catch (error) {
        console.error('Error fetching payment summary:', error);
        res.status(500).json({ error: 'Failed to fetch payment summary' });
    }
});

// Staff management
app.post('/api/staff/add', async (req, res) => {
    try {
        const newStaff = new Staff(req.body);
        await newStaff.save();
        res.status(201).json({ message: "Staff added" });
    } catch (err) {
        res.status(500).json({ message: "Add staff failed", error: err });
    }
});

app.post('/api/staff/get', async (req, res) => {
    try {
        const staff = await Staff.find({ user_id: req.body.user_id });
        res.status(200).json({ staff });
    } catch (err) {
        res.status(500).json({ message: "Fetch staff failed", error: err });
    }
});

// Add Expense
app.post('/api/expenses/add', async (req, res) => {
    try {
        const { user_id, category, amount, note, date } = req.body;
        const expense = new Expense({ user_id, category, amount, note, date });
        await expense.save();
        res.status(201).json({ message: 'Expense added successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Failed to add expense', error: err });
    }
});

// Get Expenses
app.post('/api/expenses/get', async (req, res) => {
    try {
        const { user_id } = req.body;
        const expenses = await Expense.find({ user_id }).sort({ date: -1 });
        res.status(200).json({ expenses });
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch expenses', error: err });
    }
});

app.post("/api/auth/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await InventoryAdmin.findOne({ username });
        if (!user || user.password !== password) {
            return res.status(400).json({ message: "Invalid username or password" });
        }

        const token = jwt.sign({ id: user._id, username: user.username }, SECRET, {
            expiresIn: "1d",
        });

        res.status(200).json({ message: "Login successful", token });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err });
    }
});

app.post("/api/auth/forgot-password", async (req, res) => {
    const { username, newPassword } = req.body;

    try {
        const user = await InventoryAdmin.findOne({ username });
        if (!user) return res.status(404).json({ message: "User not found" });

        user.password = newPassword;
        await user.save();

        res.status(200).json({ message: "Password updated successfully" });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err });
    }
});

app.get("/api/create-admin", async (req, res) => {
    const exists = await InventoryAdmin.findOne({ username: "admin" });
    if (exists) return res.send("Admin already exists");

    const admin = new InventoryAdmin({ username: "admin", password: "admin123" });
    await admin.save();
    res.send("Admin created");
});

// Error handling middleware for multer
app.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ error: 'File too large. Maximum size is 5MB.' });
        }
    }

    if (error.message === 'Only image files are allowed!') {
        return res.status(400).json({ error: 'Only image files are allowed!' });
    }

    next(error);
});

// Start server with Socket.io
const port = 5000;
server.listen(port, () => {
    console.log(`Server running on port ${port}`);
    console.log(`Socket.io server ready`);
    console.log(`Image upload support enabled`);
    console.log(`Images will be served from: http://localhost:${port}/uploads/`);
    console.log(`✅ Accountant module with payment tracking enabled`);
    console.log(`✅ Enhanced reporting and analytics available`);
});