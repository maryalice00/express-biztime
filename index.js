const express = require("express");
const router = express.Router();

const companiesRoutes = require("./companies");
const invoicesRoutes = require("./invoices");

// Mount the companies routes
router.use("/companies", companiesRoutes);

// Mount the invoices routes
router.use("/invoices", invoicesRoutes);

module.exports = router;
