const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const cors = require("cors");

// const authRoutes = require("./routes/auth.js")
const listingRoutes = require("./routes/ListingRouter.js")
const bookingRoutes = require("./routes/BookingRouter.js")
const userRoutes = require("./routes/user.js")
const roleRoutes = require("./routes/RoleRouter.js")
const requestRoutes = require("./routes/requestRouter.js")


app.use(cors({ origin: "http://localhost:5173" })); 
app.use(express.json());
app.use(express.static("public"));

const UserRoutes = require("./routes/UserRouter.js")
app.use("/User",UserRoutes)
/* ROUTES */
// app.use("/auth", authRoutes)
app.use("/properties", listingRoutes)
app.use("/bookings", bookingRoutes)
app.use("/users", userRoutes)
app.use("/roles",roleRoutes)
app.use("/requests", requestRoutes)


/* MONGOOSE SETUP */
mongoose.connect(process.env.MONGO_URL, {
    dbName: "chillSpace",
}).then(() => {
    console.log("database connected...")
})
.catch((err) => console.log(`${err} did not connect`));

const PORT = 3001;
app.listen(PORT, () => console.log(`Server Port: ${PORT}`));