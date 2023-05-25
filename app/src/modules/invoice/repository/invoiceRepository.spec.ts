// dependências
import { Sequelize } from "sequelize-typescript";
import InvoiceModel from "./invoiceModel";
import InvoiceProductModel from "./invoiceProductModel";
import Address from "../../@shared/domain/value-object/address";
import Product from "../domain/product";
import Id from "../../@shared/domain/value-object/id";
import Invoice from "../domain/invoice";
import InvoiceRepository from "./invoiceRepository";

// criando a suíte de testes unitários
describe("Invoice repository test", () => {
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
    await sequelize.addModels([InvoiceModel, InvoiceProductModel]);
    // criando o db
    await sequelize.sync();
  });

  // ações que ocorrem após de cada teste
  afterEach(async () => {
    // encerrando o db
    await sequelize.close();
  });

  // se um registro for armazenado no db, seus atributos devem ser iguais aos do objeto de origem
  it("should generate a new invoice", async () => {
    // criando o address
    const address = new Address(
      "Street 1",
      "123",
      "Complement 1",
      "City 1",
      "State 1",
      "Zip123"
    );

    // criando os products
    const product1 = new Product({
      Id: new Id("p1"),
      name: "Product 1",
      price: 10.0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    const product2 = new Product({
      Id: new Id("p2"),
      name: "Product 2",
      price: 15.0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // obtendo as propriedades para criação do invoice
    const props = {
      Id: new Id("1"),
      name: "Client 1",
      document: "123456",
      Address: address,
      items: [product1, product2],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    // criando o invoice
    const invoice = new Invoice(props);

    // salvando no db utilizando os métodos do repository
    const repository = new InvoiceRepository();
    await repository.generate(invoice);

    // consultando no db utilizando os métodos do orm
    const invoiceDb = await InvoiceModel.findOne({
      where: { id: "1" },
      include: ["items"],
    });

    // comparando-se os dados
    expect(invoiceDb.toJSON()).toStrictEqual({
      id: invoice.Id.id,
      name: invoice.name,
      document: invoice.document,
      street: invoice.Address.street,
      number: invoice.Address.number,
      complement: invoice.Address.complement,
      city: invoice.Address.city,
      state: invoice.Address.state,
      zipCode: invoice.Address.zipCode,
      items: [
        {
          id: product1.Id.id,
          invoice_id: invoice.Id.id,
          name: product1.name,
          price: product1.price,
          createdAt: product1.createdAt,
          updatedAt: product1.updatedAt,
        },
        {
          id: product2.Id.id,
          invoice_id: invoice.Id.id,
          name: product2.name,
          price: product2.price,
          createdAt: product2.createdAt,
          updatedAt: product2.updatedAt,
        },
      ],
      total: invoice.total(),
      createdAt: invoice.createdAt,
      updatedAt: invoice.updatedAt,
    });
  });

  // se for executada uma busca por id, os atributos devem ser iguais aos do objeto de origem
  it("should find a invoice", async () => {
    // criando o address
    const address = new Address(
      "Street 1",
      "123",
      "Complement 1",
      "City 1",
      "State 1",
      "Zip123"
    );

    // criando os products
    const product1 = new Product({
      Id: new Id("p1"),
      name: "Product 1",
      price: 10.0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    const product2 = new Product({
      Id: new Id("p2"),
      name: "Product 2",
      price: 15.0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // obtendo as propriedades para criação do invoice
    const props = {
      Id: new Id("1"),
      name: "Client 1",
      document: "123456",
      Address: address,
      items: [product1, product2],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    // criando o invoice
    const invoice = new Invoice(props);

    // salvando no db utilizando os métodos do repository
    const repository = new InvoiceRepository();
    await repository.generate(invoice);

    // consultando no db utilizando os métodos do repository
    const invoiceResult = await repository.find(invoice.Id.id);

    // comparando-se os dados
    expect(invoice).toStrictEqual(invoiceResult);
  });

  // se for executada uma busca por id e a mesma não retornar registros, deve-se lançar uma exceção
  it("should throw an error when invoice id is not found", async () => {
    // consultando no db utilizando os métodos do repository, por um registro inexistente
    const repository = new InvoiceRepository();

    expect(async () => {
      await repository.find("456ABC");
    }).rejects.toThrow("Invoice not found");
  });
});
