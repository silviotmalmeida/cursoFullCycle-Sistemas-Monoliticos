// dependências
import express, { Request, Response } from "express";
import CheckoutFacadeFactory from "../../checkout/factory/checkoutFacadeFactory";

// inicializando o gerenciador de rotas
export const checkoutRoute = express.Router();

// configurando a rota / do post, para criação
checkoutRoute.post("/", async (req: Request, res: Response) => {
  // criando a facade utilizando a factory
  const checkoutFacade = CheckoutFacadeFactory.create();

  // tratamento de exceções
  try {
    // definindo os dados do input
    const input = {
      id: req.body.id,
      clientId: req.body.clientId,
      products: req.body.products,
    };

    // criando o product utilizando os métodos da facade
    const output = await checkoutFacade.placeOrder(input);

    // enviando os dados de retorno como response
    res.send(output);
  } catch (err) {
    // em caso de erro, retorna código 500
    res.status(500).send(err);
  }
});
