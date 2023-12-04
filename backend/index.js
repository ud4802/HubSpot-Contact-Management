require("dotenv").config();
const express = require('express');
const app = express();
const port = 3050;
const mongoose = require('mongoose');
var bodyParser = require("body-parser");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");


// Connect to MongoDB using Mongoose
mongoose.connect(process.env.DBURI, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;

// Event listeners to track the connection status
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Event listener for when the application is terminated
process.on('SIGINT', () => {
  db.close(() => {
    console.log('Disconnected from MongoDB');
    process.exit(0);
  });
});

//middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())


//routes
app.use("/create", require("./routes/createContact"));
app.use("/getcontact",require("./routes/getContact"));
app.use("/update",require("./routes/updateContact"));
app.use("/delete",require("./routes/deleteContact"));

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});