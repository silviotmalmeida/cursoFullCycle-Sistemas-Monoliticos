// arquivo de configuração da api
// dependências
import express, { Express } from "express";
import { Sequelize } from "sequelize-typescript";
import { productsRoute } from "./routes/productsRoute";
import { ProductModel } from "../product-adm/repository/productModel";
import { clientsRoute } from "./routes/clientsRoute";
import { ClientModel } from "../client-adm/repository/clientModel";

// configurando o express da api, bem como suas rotas
export const app: Express = express();
app.use(express.json());
app.use("/products", productsRoute);
app.use("/clients", clientsRoute);

// configurando o DB a ser utilizado pela api
export let sequelize: Sequelize;
async function setupDb() {
  sequelize = new Sequelize({
    dialect: "sqlite",
    storage: ":memory:",
    logging: false,
  });
  await sequelize.addModels([ProductModel, ClientModel]);
  await sequelize.sync();
}
setupDb();
