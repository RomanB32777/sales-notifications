create TABLE employees(
    id SERIAL PRIMARY KEY,
    employee_name VARCHAR(255) UNIQUE,
    employee_photo VARCHAR(255) DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT Now() 
);

create TABLE transactions(
    id SERIAL PRIMARY KEY,
    project_name VARCHAR DEFAULT '',
    transaction_value NUMERIC DEFAULT 0,
    currency VARCHAR(10) DEFAULT '',
    employee_id INTEGER,
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT Now() 
);

-- CREATE TABLE employees_transactions
-- (
--     id BIGSERIAL PRIMARY KEY,
--     employee_id INTEGER,
--     FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
--     transaction_id INTEGER,
--     FOREIGN KEY (transaction_id) REFERENCES transactions(id) ON DELETE CASCADE,
--     UNIQUE (employee_id, transaction_id)
-- );