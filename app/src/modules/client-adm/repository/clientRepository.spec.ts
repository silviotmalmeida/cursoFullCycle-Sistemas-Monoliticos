// dependências
import { Sequelize } from "sequelize-typescript";
import Id from "../../@shared/domain/value-object/id";
import Client from "../domain/client";
import { ClientModel } from "./clientModel";
import ClientRepository from "./clientRepository";

// criando a suíte de testes de unidade
describe("ClientRepository test", () => {
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
    // propriedades do client
    const clientProps = {
      Id: new Id("1"),
      name: "Client 1",
      document: "00000",
      email: "x@x.com",
      street: "some address",
      number: "1",
      complement: "",
      city: "some city",
      state: "some state",
      zipCode: "000",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // criando o client
    const client = new Client(clientProps);
    // salvando no db utilizando os métodos do repository
    const repository = new ClientRepository();
    await repository.add(client);

    // consultando no db utilizando os métodos do orm
    const clientDb = await ClientModel.findOne({ where: { id: "1" } });

    // comparando-se os dados
    expect(clientDb).toBeDefined();
    expect(clientDb.id).toBe(client.Id.id);
    expect(clientDb.name).toBe(client.name);
    expect(clientDb.document).toBe(client.document);
    expect(clientDb.email).toBe(client.email);
    expect(clientDb.street).toEqual(client.street);
    expect(clientDb.number).toEqual(client.number);
    expect(clientDb.complement).toEqual(client.complement);
    expect(clientDb.city).toEqual(client.city);
    expect(clientDb.state).toEqual(client.state);
    expect(clientDb.zipCode).toEqual(client.zipCode);
    expect(clientDb.createdAt).toStrictEqual(client.createdAt);
    expect(clientDb.updatedAt).toStrictEqual(client.updatedAt);
  });

  // se for executada uma busca por id, os atributos devem ser iguais aos do objeto de origem
  it("should find a client", async () => {
    // salvando o product no db utilizando os métodos do orm
    const client = await ClientModel.create({
      id: "1",
      name: "Client 1",
      document: "00000",
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

    // consultando no db utilizando os métodos do repository
    const repository = new ClientRepository();
    const result = await repository.find(client.id);

    // comparando-se os dados
    expect(result.Id.id).toEqual(client.id);
    expect(result.name).toEqual(client.name);
    expect(result.document).toEqual(client.document);
    expect(result.email).toEqual(client.email);
    expect(result.street).toEqual(client.street);
    expect(result.number).toEqual(client.number);
    expect(result.complement).toEqual(client.complement);
    expect(result.city).toEqual(client.city);
    expect(result.state).toEqual(client.state);
    expect(result.zipCode).toEqual(client.zipCode);
    expect(result.createdAt).toStrictEqual(client.createdAt);
    expect(result.updatedAt).toStrictEqual(client.updatedAt);
  });
});
