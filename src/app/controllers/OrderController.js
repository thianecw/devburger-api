import * as Yup from "yup";
import Order from "../schemas/Order";
import Product from "../models/Product";
import Category from "../models/Category";
import mongoose from "mongoose";
import User from "../models/User";

class OrderController {
  async store(request, response) {
    const schema = Yup.object({
      products: Yup.array()
        .required()
        .of(
          Yup.object({
            id: Yup.number().required(),
            quantity: Yup.number().required(),
          })
        ),
    });

    try {
      schema.validateSync(request.body, {
        abortEarly: false,
      });
    } catch (err) {
      return response.status(400).json({
        error: err.errors,
      });
    }

    const { products } = request.body;

    // filtra os ids dos produtos
    const productIds = products.map((product) => product.id);

    // busca os produtos pelo id dos produtos, assim garantimos a segurança
    const findProducts = await Product.findAll({
      where: {
        id: productIds,
      },
      include: [
        {
          model: Category,
          as: "category",
          attributes: ["name"],
        },
      ],
    });

    const formattedProducts = findProducts.map((product) => {
      // busca o id do produto que vem da request e compara com o id do produto que vem do banco para buscar a quantidade correta do produto
      const productsIndex = products.findIndex(
        (item) => item.id === product.id
      );

      const newProducts = {
        id: product.id,
        name: product.name,
        price: product.price,
        category: product.category.name,
        url: product.url,
        quantity: products[productsIndex].quantity,
      };

      return newProducts;
    });

    const order = {
      user: {
        id: request.userId,
        name: request.userName,
      },
      products: formattedProducts,
      status: "Pedido realizado",
    };

    const createdOrder = await Order.create(order);

    return response.status(201).json(createdOrder);
  }

  // List all orders
  async index(request, response) {
    const orders = await Order.find();

    return response.json(orders);
  }

  // Update orders
  async update(request, response) {
    const schema = Yup.object({
      status: Yup.string().required(),
    });

    try {
      schema.validateSync(request.body, { abortEarly: false });
    } catch (err) {
      return response.status(400).json({ error: err.errors });
    }

    const { admin: isAdmin } = await User.findByPk(request.userId);

    if (!isAdmin) {
      return response.status(401).json();
    }

    const { id } = request.params;
    const { status } = request.body;

    try {
      await Order.updateOne({ _id: id }, { status });
    } catch (err) {
      return response.status(400).json({ error: "Id not found" });
    }

    return response.json({ message: "Status updated successfully" });
  }

  // Delete order
  async deleteOrder(request, response) {
    const { id } = request.params;

    // Verifica se o ID é válido
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return response.status(400).json({ error: "Invalid Order ID" });
    }

    try {
      const order = await Order.findByIdAndDelete(id);

      if (!order) {
        return response.status(404).json({ error: "Order not found" });
      }

      return response.json({ message: "Order deleted successfully" });
    } catch (err) {
      return response.status(500).json({ error: "Internal server error" });
    }
  }
}

export default new OrderController();
