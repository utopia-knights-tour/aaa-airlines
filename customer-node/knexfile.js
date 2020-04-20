module.exports = {
  development: {
    client: 'mysql2',
    connection: process.env.DATABASE_URL || {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
    },
    debug: true,
  },
  production: {
    client: 'mysql2',
    connection: process.env.DATABASE_URL || {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
    },
  },
  test: {
    client: 'mysql2',
    connection: process.env.TEST_DATABASE_URL || {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: 'airline_test',
    },
  },
};
