const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const cors = require("cors");

const authRoutes = require("./routes/auth.js")
const listingRoutes = require("./routes/listing.js")
const bookingRoutes = require("./routes/booking.js")
const userRoutes = require("./routes/user.js")
const roleRoutes = require("./routes/RoleRouter.js")

const UserRoutes = require("./routes/UserRouter.js")
app.use("/User",UserRoutes)

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

/* ROUTES */
app.use("/auth", authRoutes)
app.use("/properties", listingRoutes)
app.use("/bookings", bookingRoutes)
app.use("/users", userRoutes)
app.use("/roles",roleRoutes)


/* MONGOOSE SETUP */
mongoose.connect("mongodb://127.0.0.1:27017/chillSpace").then(() => {
    console.log("database connected...")
})
.catch((err) => console.log(`${err} did not connect`));

const PORT = 3001;
app.listen(PORT, () => console.log(`Server Port: ${PORT}`));