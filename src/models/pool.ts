import { Pool } from "pg";
import { config } from "dotenv";

const pool = new Pool({
    user: 'postgres',
    password: 'fighting',
    host: 'localhost',
    database: 'performanceWattWise',
    port: 5432
})

const createUserTableQuery = `
    CREATE TABLE users (
        user_id SERIAL PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        zipcode INTEGER NOT NULL
  );
`;

const createCountersTableQuery = `
    CREATE TABLE counters (
        counter_id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(user_id),
        counter_type VARCHAR(255) NOT NULL,
        count INTEGER NOT NULL,
        timestamp TIMESTAMP NOT NULL,
        zipcode INTEGER NOT NULL
  );
`;

const createDailyConsumptionTableQuery = `
    CREATE TABLE daily_consumption (
        consumption_id SERIAL PRIMARY KEY,
        counter_id INTEGER NOT NULL REFERENCES counters(counter_id),
        consumption_date DATE NOT NULL,
        consumption_counts INTEGER[] NOT NULL
  );
`

const createWeeklyConsumptionTableQuery = `
    CREATE TABLE weekly_consumption (
        consumption_id SERIAL PRIMARY KEY,
        counter_id INTEGER NOT NULL REFERENCES counters(counter_id),
        consumption_week_start DATE NOT NULL,
        consumption_week_counts INTEGER[] NOT NULL
    );
`

const createMonthlyConsumptionTableQuery = `
    CREATE TABLE monthly_consumption (
        consumption_id SERIAL PRIMARY KEY,
        counter_id INTEGER NOT NULL REFERENCES counters(counter_id),
        consumption_month DATE NOT NULL,
        consumption_month_counts INTEGER[] NOT NULL
    );
`

const createYearlyConsumptionTableQuery = `
    CREATE TABLE yearly_consumption (
        consumption_id SERIAL PRIMARY KEY,
        counter_id INTEGER NOT NULL REFERENCES counters(counter_id),
        consumption_year INTEGER NOT NULL,
        consumption_year_counts INTEGER[] NOT NULL
    );
`


pool.query(createUserTableQuery)
        .then(() => {
            console.log('User table created');
        })
        .catch((err) => {
            console.log('Error creating users table', err);
        })


pool.query(createCountersTableQuery)
    .then(() => {
        console.log('Counters table created successfully');
    })
    .catch(err => {
        console.error('Error creating counters table:', err);
    });


pool.query(createDailyConsumptionTableQuery)
    .then(() => {
        console.log('Daily consumption table created');
    })
    .catch((err) => {
        console.log('Error creating daily table', err);
    })


pool.query(createWeeklyConsumptionTableQuery)
    .then(() => {
        console.log('Weekly table created');
    })
    .catch((err) => {
        console.log('weekly table error', err);        
    })


pool.query(createMonthlyConsumptionTableQuery)
    .then(() => {
        console.log('Monthly consumption table created');
    })
    .catch(err => {
        console.log('error creating monthly table', err);
    })


pool.query(createYearlyConsumptionTableQuery)
    .then(() => {
        console.log('yearly table created');
    })
    .catch(err => {
        console.log('error creating yearly table', err);
    })


