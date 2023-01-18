//Dependencies
require("dotenv").config();
const { PORT = 3000, DATABASE_URL } = process.env;
const express = require("express");
const app = express();
const mongoose = require("mongoose")
const cors = require("cors")
const morgan = require("morgan")

//Database connection
mongoose.connect(DATABASE_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });

//Connection events
mongoose.connection
  .on("open", () => console.log("Your are connected to mongoose"))
  .on("close", () => console.log("Your are disconnected from mongoose"))
  .on("error", (error) => console.log(error));

//Models
const CheeseSchema = new mongoose.Schema({
    name: String,
    countryOfOrigin: String,
    image: String,
})

const Cheese = mongoose.model("Cheese", CheeseSchema);

//Middleware
app.use(cors()); // to prevent cors errors, open access to all origins
app.use(morgan("dev")); // logging
app.use(express.json()); // parse json bodies

//Routes
app.get("/", (req, res) => {
    res.send("Welcome to the home page!")
});

//Cheese index route
app.get("/cheese", async (req, res) => {
    try {
      // send all people
      res.json(await Cheese.find({}));
    } catch (error) {
      //send error
      res.status(400).json(error);
    }
  });

//Cheese create route
app.post("/cheese", async(req,res) => {
    try {
        res.json(await Cheese.create(req.body));
    } catch (error){
        res.status(400).json(error);
    }
})

//Cheese update route
app.put("/cheese/:id", async (req, res) => {
    try {
      // send all people
      res.json(
        await Cheese.findByIdAndUpdate(req.params.id, req.body, { new: true })
      );
    } catch (error) {
      //send error
      res.status(400).json(error);
    }
  });
  
//Cheese delete route
app.delete("/cheese/:id", async (req, res) => {
    try {
        res.json(
            await Cheese.findByIdAndDelete(req.params.id));
    } catch (error) {
        res.status(400).json(error);
    }
});

//Cheese show route
app.get("/cheese/:id", async(req,res) => {
    try{
        res.json(await Cheese.findById(req.params.id))
    } catch (error) {
        res.status(400).json(error);
    }
});

//Listener
app.listen(PORT, () => {
    console.log(`Port is dancing on ${PORT}`)
});
