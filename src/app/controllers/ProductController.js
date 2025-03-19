import * as Yup from "yup";
import Product from "../models/Product";
import Category from "../models/Category";
import User from "../models/User";

class ProductController {
	// Função para criar um novo produto
	async store(request, response) {
		console.log("Request body:", request.body);
		console.log("Request file:", request.file);

		if (!request.file) {
			return response.status(400).json({ error: "File not uploaded" });
		}

		const schema = Yup.object({
			name: Yup.string().required(),
			price: Yup.number().required(),
			category_id: Yup.number().required(),
			sale: Yup.boolean(),
		});

		try {
			schema.validateSync(request.body, { abortEarly: false });
		} catch (err) {
			return response.status(400).json({ error: err.errors });
		}

		const { admin: isAdmin } = await User.findByPk(request.userId);

		if (!isAdmin) {
			return response.status(401).json({ error: "Unauthorized" });
		}

		const { filename: path } = request.file;
		const { name, price, category_id, sale } = request.body;

		const product = await Product.create({
			name,
			price,
			category_id,
			path,
			sale,
		});

		return response.status(201).json(product);
	}

	// Função para atualizar um produto
	async update(request, response) {
		const schema = Yup.object({
			name: Yup.string(),
			price: Yup.number(),
			category_id: Yup.number(),
			sale: Yup.boolean(),
		});

		try {
			schema.validateSync(request.body, { abortEarly: false });
		} catch (err) {
			return response.status(400).json({ error: err.errors });
		}

		const { admin: isAdmin } = await User.findByPk(request.userId);

		if (!isAdmin) {
			return response.status(401).json({ error: "Unauthorized" });
		}

		const { id } = request.params;
		const findProduct = await Product.findByPk(id);
		if (!findProduct) {
			return response
				.status(400)
				.json({ error: "Make sure your product id is correct" });
		}

		let path;
		if (request.file) {
			path = request.file.filename;
		}

		const { name, price, category_id, sale } = request.body;

		await Product.update(
			{
				name,
				price,
				category_id,
				path,
				sale,
			},
			{
				where: {
					id,
				},
			},
		);

		return response
			.status(200)
			.json({ message: "Produto atualizado com sucesso 🎉" });
	}

	// Função para listar todos os produtos
	async index(request, response) {
		const products = await Product.findAll({
			include: {
				model: Category,
				as: "category",
				attributes: ["id", "name"],
			},
		});

		return response.json(products);
	}

	// Função para excluir um produto
	async delete(request, response) {
		try {
			const { id } = request.params;
			const product = await Product.findByPk(id);

			if (!product) {
				return response.status(404).json({ error: "Produto não encontrado ⚠️" });
			}

			await product.destroy();

			return response
				.status(200)
				.json({ message: "Produto excluído com sucesso 🗑️" });
		} catch (error) {
			console.error(error);
			return response
				.status(500)
				.json({ error: "Erro ao excluir o produto ❌" });
		}
	}
}

export default new ProductController();
