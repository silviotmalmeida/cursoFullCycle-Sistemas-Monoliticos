// dependências
import express, { Request, Response } from "express";
import ProductAdmFacadeFactory from "../../product-adm/factory/productAdmfacadeFactory";

// inicializando o gerenciador de rotas
export const productsRoute = express.Router();

// configurando a rota / do post, para criação
productsRoute.post("/", async (req: Request, res: Response) => {
  // criando a facade utilizando a factory
  const productFacade = ProductAdmFacadeFactory.create();

  // tratamento de exceções
  try {
    // definindo os dados do input
    const input = {
      name: req.body.name,
      description: req.body.description,
      purchasePrice: req.body.purchasePrice,
      stock: req.body.stock,
    };

    // criando o product utilizando os métodos da facade
    const output = await productFacade.addProduct(input);

    // enviando os dados de retorno como response
    res.send(output);
  } catch (err) {
    // em caso de erro, retorna código 500
    res.status(500).send(err);
  }
});
