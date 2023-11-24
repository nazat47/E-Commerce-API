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
const swaggerUI=require('swagger-ui-express')
const YAML=require('yamljs')
const swaggerDoc=YAML.load('./swagger.yaml')


app.use(cors());
app.use(express.json());
app.use('/public/uploads',express.static(__dirname+'/public/uploads'))
//app.use(authjwt());

app.get('/',(req,res)=>{
  res.send('<h1>E-Commerce API</h1><a href="/api-doc">Documentation</a>')
})
app.use('/api-doc',swaggerUI.serve,swaggerUI.setup(swaggerDoc))

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/products",authjwt(), productsRouter);
app.use("/api/v1/orders",authjwt(), orderRouter);
app.use("/api/v1/categories", authjwt(),categorieRouter);
app.use("/api/v1/users",authjwt(), userRouter);

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
