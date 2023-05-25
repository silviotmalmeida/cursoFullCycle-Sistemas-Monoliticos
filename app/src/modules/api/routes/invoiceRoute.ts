// dependências
import express, { Request, Response } from "express";
import InvoiceFacadeFactory from "../../invoice/factory/invoiceFacadeFactory";

// inicializando o gerenciador de rotas
export const invoiceRoute = express.Router();

// configurando a rota /:id do get, para busca por id
invoiceRoute.get("/:id", async (req: Request, res: Response) => {
  // criando a facade utilizando a factory
  const invoiceFacade = InvoiceFacadeFactory.create();

  // tratamento de exceções
  try {
    // definindo os dados do input
    const input = {
      id: req.params.id,
    };

    // consultando o invoice utilizando os métodos da facade
    const output = await invoiceFacade.find(input);

    // enviando os dados de retorno como response
    res.send(output);
  } catch (err) {
    // em caso de erro, retorna código 500
    res.status(500).send(err);
  }
});
