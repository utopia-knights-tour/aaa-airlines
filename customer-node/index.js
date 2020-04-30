const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

require('dotenv').config();

const routes = require('./routes');

const PORT = process.env.PORT || '3000';


const app = express();

app.use(cors());
app.options('*', cors());

app.use(express.json());
app.use(
  morgan(process.env.NODE_ENV === 'production' ? 'common' : 'dev', {
    skip: () => process.env.NODE_ENV === 'test',
  }),
);
app.use('/customer', routes);

app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});


app.use((err, req, res, next) => {

  if (res.headersSent) {
    return next(err);
  }
  if (err.status) {
    const errBody = { ...err, message: err.message };
    return res.status(err.status).json(errBody);
  }
  console.log(err);
  if (err.message.includes('ECONNREFUSED')) {
    return res.status(503).json({ message: 'Service Unavailable' });
  }
  return res.status(500).json({ message: 'Internal Server Error' });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`server running on ${PORT}`);
  });
}

module.exports = { app };
