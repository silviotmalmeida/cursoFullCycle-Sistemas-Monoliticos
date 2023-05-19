// dependências
import { Sequelize } from "sequelize-typescript";
import ClientAdmFacadeFactory from "../factory/clientAdmFacadeFactory";
import { ClientModel } from "../repository/clientModel";

// criando a suíte de testes de unidade
describe("ClientAdmFacade test", () => {
  // inicializando a variável do orm
  let sequelize: Sequelize;

  // ações que ocorrem antes de cada teste
  beforeEach(async () => {
    // configurando o orm
    sequelize = new Sequelize({
      dialect: "sqlite", // definindo o db
      storage: ":memory:", // definindo que irá gravar em memória
      logging: false, // sem login
      sync: { force: true }, // criar as tabelas ao inicializar o db
    });

    // adicionando as models a serem consideradas na criação das tabelas
    await sequelize.addModels([ClientModel]);
    // criando o db
    await sequelize.sync();
  });

  // ações que ocorrem após de cada teste
  afterEach(async () => {
    // encerrando o db
    await sequelize.close();
  });

  // se um registro for armazenado no db, seus atributos devem ser iguais aos do objeto de origem
  it("should create a client", async () => {
    // definindo os dados do input
    const input = {
      id: "1",
      name: "Client 1",
      email: "x@x.com",
      street: "some address",
      number: "1",
      complement: "",
      city: "some city",
      state: "some state",
      zipCode: "000",
    };

    // criando a facade utilizando a factory
    const clientFacade = ClientAdmFacadeFactory.create();

    // criando o product utilizando os métodos da facade
    const output = await clientFacade.add(input);

    // consultando no db utilizando os métodos do orm
    const client = await ClientModel.findOne({ where: { id: "1" } });

    // comparando-se os dados
    expect(client).toBeDefined();
    expect(client.id).toBe(input.id);
    expect(client.name).toBe(input.name);
    expect(client.email).toBe(input.email);
    expect(client.street).toBe(input.street);
    expect(client.number).toBe(input.number);
    expect(client.complement).toBe(input.complement);
    expect(client.city).toBe(input.city);
    expect(client.state).toBe(input.state);
    expect(client.zipCode).toBe(input.zipCode);
  });

  // se for realizada uma busca por id, seus atributos devem ser iguais aos do objeto de origem
  it("should find a client", async () => {
    // criando o client utilizando o método do orm
    await ClientModel.create({
      id: "1",
      name: "Client 1",
      email: "x@x.com",
      street: "some address",
      number: "1",
      complement: "",
      city: "some city",
      state: "some state",
      zipCode: "000",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // criando a facade utilizando a factory
    const clientFacade = ClientAdmFacadeFactory.create();

    // buscando o client utilizando os métodos da facade
    const client = await clientFacade.find({ id: "1" });

    // comparando-se os dados
    expect(client.id).toBe("1");
    expect(client.name).toBe("Client 1");
    expect(client.email).toBe("x@x.com");
    expect(client.street).toBe("some address");
    expect(client.number).toBe("1");
    expect(client.complement).toBe("");
    expect(client.city).toBe("some city");
    expect(client.state).toBe("some state");
    expect(client.zipCode).toBe("000");
  });
});
