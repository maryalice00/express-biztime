const express = require("express");
const router = express.Router();
const pool = require("../db");
const slugify = require("slugify");

// GET /companies
router.get("/", async (req, res, next) => {
  try {
    const result = await pool.query('SELECT code, name FROM companies');
    return res.json({ companies: result.rows });
  } catch (error) {
    return next(error);
  }
});

// GET /companies/:code
router.get("/:code", async (req, res, next) => {
  const { code } = req.params;

  try {
    const companyResult = await pool.query('SELECT * FROM companies WHERE code = $1', [code]);

    if (companyResult.rows.length === 0) {
      return res.status(404).json({ error: 'Company not found' });
    }

    const company = companyResult.rows[0];

    const industryResult = await pool.query('SELECT ind_code FROM company_industries WHERE comp_code = $1', [code]);
    const industries = industryResult.rows.map(row => row.ind_code);

    return res.json({
      company: {
        code: company.code,
        name: company.name,
        description: company.description,
        industries: industries,
      },
    });
  } catch (error) {
    return next(error);
  }
});

// POST /companies
router.post("/", async (req, res, next) => {
  const { name, description } = req.body;
  const code = slugify(name, { lower: true });

  try {
    const result = await pool.query('INSERT INTO companies (code, name, description) VALUES ($1, $2, $3) RETURNING *', [code, name, description]);
    return res.status(201).json({ company: result.rows[0] });
  } catch (error) {
    return next(error);
  }
});

// PUT /companies/:code
router.put("/:code", async (req, res, next) => {
  const { code } = req.params;
  const { name, description } = req.body;

  try {
    const result = await pool.query('UPDATE companies SET name = $1, description = $2 WHERE code = $3 RETURNING *', [name, description, code]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Company not found' });
    }

    return res.json({ company: result.rows[0] });
  } catch (error) {
    return next(error);
  }
});

// DELETE /companies/:code
router.delete("/:code", async (req, res, next) => {
  const { code } = req.params;

  try {
    const result = await pool.query('DELETE FROM companies WHERE code = $1 RETURNING *', [code]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Company not found' });
    }

    return res.json({ status: 'deleted' });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
