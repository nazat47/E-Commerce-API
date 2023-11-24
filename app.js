require("dotenv").config();
require("express-async-errors");
const connectDB = require("./db/connect");
const express = require("express");
const app = express();
const { expressjwt: jwt } = require("express-jwt");
const cors = require("cors");
const errorHandler = require("./middlewares/error-handler");
const authentication = require("./middlewares/authentication");
const notFound = require("./middlewares/not-found");
const productsRouter = require("./routes/product-route");
const orderRouter = require("./routes/order-route");
const categorieRouter = require("./routes/categorie-route");
const userRouter = require("./routes/user-route");
const authRouter = require("./routes/auth-route");
const authjwt = require("./helpers/jwt-auth");

app.use(cors());
app.use(express.json());
app.use('/public/uploads',express.static(__dirname+'/public/uploads'))
app.use(authjwt());

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/products", productsRouter);
app.use("/api/v1/orders", orderRouter);
app.use("/api/v1/categories", categorieRouter);
app.use("/api/v1/users", userRouter);

app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 3000;
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () => console.log(`Server listening on port ${port}...`));
  } catch (error) {
    console.log(error);
  }
};
start();
