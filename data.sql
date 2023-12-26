-- DROP TABLES IF EXISTS
DROP TABLE IF EXISTS company_industries;
DROP TABLE IF EXISTS industries;
DROP TABLE IF EXISTS invoices;
DROP TABLE IF EXISTS companies;

-- CREATE COMPANIES TABLE
CREATE TABLE companies (
    code text PRIMARY KEY,
    name text NOT NULL UNIQUE,
    description text
);

-- CREATE INDUSTRIES TABLE
CREATE TABLE industries (
    code text PRIMARY KEY,
    industry text NOT NULL
);

-- CREATE COMPANY_INDUSTRIES TABLE (JOIN TABLE FOR MANY-TO-MANY RELATIONSHIP)
CREATE TABLE company_industries (
    comp_code text REFERENCES companies ON DELETE CASCADE,
    ind_code text REFERENCES industries ON DELETE CASCADE,
    PRIMARY KEY (comp_code, ind_code)
);

-- CREATE INVOICES TABLE
CREATE TABLE invoices (
    id serial PRIMARY KEY,
    comp_code text NOT NULL REFERENCES companies ON DELETE CASCADE,
    amt float NOT NULL,
    paid boolean DEFAULT false NOT NULL,
    add_date date DEFAULT CURRENT_DATE NOT NULL,
    paid_date date,
    CONSTRAINT invoices_amt_check CHECK ((amt > (0)::double precision))
);

-- INSERT SAMPLE DATA INTO COMPANIES TABLE
INSERT INTO companies
  VALUES ('apple', 'Apple Computer', 'Maker of OSX.'),
         ('ibm', 'IBM', 'Big blue.');

-- INSERT SAMPLE DATA INTO INDUSTRIES TABLE
INSERT INTO industries
  VALUES ('tech', 'Technology'),
         ('finance', 'Finance');

-- INSERT SAMPLE DATA INTO COMPANY_INDUSTRIES TABLE
INSERT INTO company_industries
  VALUES ('apple', 'tech'),
         ('ibm', 'tech'),
         ('ibm', 'finance');

-- INSERT SAMPLE DATA INTO INVOICES TABLE
INSERT INTO invoices (comp_Code, amt, paid, paid_date)
  VALUES ('apple', 100, false, null),
         ('apple', 200, false, null),
         ('apple', 300, true, '2018-01-01'),
         ('ibm', 400, false, null);
