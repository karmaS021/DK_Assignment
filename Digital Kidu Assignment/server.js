const mongoose = require('mongoose')
require('dotenv').config();

const app = require('./app')


mongoose.connect(process.env.Database, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Successfully connected to mongo.");
  })
  .catch((err) => {
    console.log("Error connecting to mongo.", err);
  });

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`server running on ${process.env.NODE_ENV} mode on ${process.env.PORT}`)
})