const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
require("dotenv").config({ path: ".env" })


const app = express()

app.use(express.json())
app.use(cors({
    origin: true,
    credentials: true // thats use for store cookie
}
))

app.use("/api/admin", require("./routes/admin.routes"))
app.use("/api/auth", require("./routes/auth.route"))
app.use("/api/public", require("./routes/public.route"))
app.use("/api/user", require("./routes/user.route"))

app.use("*", (req, res) => {
    res.status(404).json({ message: "Resource Not Found" })
})
app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).json({ message: "Something Went Wrong", error: err.message })
})

mongoose.connect(process.env.MONGO_URL)

mongoose.connection.once("open", () => {
    console.log("MONGO CONNECTED");
    app.listen(process.env.PORT, console.log("SERVER CONNECTED"))
})