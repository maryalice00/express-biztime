const express = require("express");
const router = express.Router();
const pool = require("../db");

// GET /invoices
router.get("/", async (req, res, next) => {
  try {
    const result = await pool.query('SELECT * FROM invoices');
    return res.json({ invoices: result.rows });
  } catch (error) {
    return next(error);
  }
});

// GET /invoices/:id
router.get("/:id", async (req, res, next) => {
  const { id } = req.params;

  try {
    const result = await pool.query('SELECT * FROM invoices WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    const invoice = result.rows[0];
    const companyResult = await pool.query('SELECT * FROM companies WHERE code = $1', [invoice.comp_code]);
    const company = companyResult.rows[0];

    return res.json({
      invoice: {
        id: invoice.id,
        comp_code: invoice.comp_code,
        amt: invoice.amt,
        paid: invoice.paid,
        add_date: invoice.add_date,
        paid_date: invoice.paid_date,
        company: {
          code: company.code,
          name: company.name,
          description: company.description,
        },
      },
    });
  } catch (error) {
    return next(error);
  }
});

// POST /invoices
router.post("/", async (req, res, next) => {
  const { comp_code, amt } = req.body;

  try {
    const result = await pool.query('INSERT INTO invoices (comp_code, amt) VALUES ($1, $2) RETURNING *', [comp_code, amt]);
    return res.status(201).json({ invoice: result.rows[0] });
  } catch (error) {
    return next(error);
  }
});

// PUT /invoices/:id
router.put("/:id", async (req, res, next) => {
  const { id } = req.params;
  const { amt, paid } = req.body;

  try {
    const result = await pool.query('UPDATE invoices SET amt = $1, paid = $2, paid_date = CASE WHEN $2 AND NOT paid THEN CURRENT_DATE ELSE null END WHERE id = $3 RETURNING *', [amt, paid, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    return res.json({ invoice: result.rows[0] });
  } catch (error) {
    return next(error);
  }
});

// DELETE /invoices/:id
router.delete("/:id", async (req, res, next) => {
  const { id } = req.params;

  try {
    const result = await pool.query('DELETE FROM invoices WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    return res.json({ status: 'deleted' });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;

