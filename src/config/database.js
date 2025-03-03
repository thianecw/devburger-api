require("dotenv").config(); // Carrega as variáveis do .env

module.exports = {
	dialect: process.env.DB_DIALECT || "postgres",
	host: process.env.DB_HOST || "localhost",
	port: process.env.DB_PORT || 5432,
	username: process.env.DB_USER || "postgres",
	password: process.env.DB_PASS || "postgres",
	database: process.env.DB_NAME || "devburger",
	define: {
		timestamps: true,
		underscored: true,
		underscoredAll: true,
	},
};
