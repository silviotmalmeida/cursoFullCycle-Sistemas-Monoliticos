// dependências
import express, { Request, Response } from "express";
import ClientAdmFacadeFactory from "../../client-adm/factory/clientAdmFacadeFactory";

// inicializando o gerenciador de rotas
export const clientsRoute = express.Router();

// configurando a rota / do post, para criação
clientsRoute.post("/", async (req: Request, res: Response) => {
  // criando a facade utilizando a factory
  const clientFacade = ClientAdmFacadeFactory.create();

  // tratamento de exceções
  try {
    // definindo os dados do input
    const input = {
      name: req.body.name,
      document: req.body.document,
      email: req.body.email,
      street: req.body.street,
      number: req.body.number,
      complement: req.body.complement,
      city: req.body.city,
      state: req.body.state,
      zipCode: req.body.zipCode,
    };

    // criando o product utilizando os métodos da facade
    const output = await clientFacade.add(input);

    // enviando os dados de retorno como response
    res.send(output);
  } catch (err) {
    // em caso de erro, retorna código 500
    res.status(500).send(err);
  }
});
