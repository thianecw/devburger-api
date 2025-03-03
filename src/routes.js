import { Router } from "express";
import multer from "multer";
import multerConfig from "./config/multer";
import authMiddleware from "./app/middlewares/auth";

import UserController from "./app/controllers/UserController";
import SessionController from "./app/controllers/SessionController";
import ProductController from "./app/controllers/ProductController";
import CategoryController from "./app/controllers/CategoryController";
import OrderController from "./app/controllers/OrderController";
import CreatePaymentIntentController from "./app/controllers/stripe/CreatePaymentIntentController.js";

const routes = new Router();
const upload = multer(multerConfig);

//rotas públicas, não precisam de middleware pra verificação//
routes.post("/users", UserController.store);
routes.post("/session", SessionController.store);

routes.use(authMiddleware);

//rotas não publicas, precisam de middleware pra verificação//
routes.post("/products", upload.single("file"), ProductController.store);
routes.get("/products", ProductController.index);
routes.put("/products/:id", upload.single("file"), ProductController.update);

routes.post("/categories", upload.single("file"), CategoryController.store);
routes.get("/categories", CategoryController.index);
routes.put("/categories/:id", upload.single("file"), CategoryController.update);

routes.post("/orders", OrderController.store);
routes.get("/orders", OrderController.index);
routes.put("/orders/:id", OrderController.update);
routes.delete("/orders/:id", OrderController.deleteOrder);

routes.post("/create-payment-intent", CreatePaymentIntentController.store);

export default routes;
