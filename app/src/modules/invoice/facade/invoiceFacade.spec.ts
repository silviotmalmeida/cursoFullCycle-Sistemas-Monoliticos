// dependências
import { Sequelize } from "sequelize-typescript";
import InvoiceModel from "../repository/invoiceModel";
import ProductModel from "../repository/productModel";
import InvoiceFacadeFactory from "../factory/invoiceFacadeFactory";
import InvoiceRepository from "../repository/invoiceRepository";

// criando a suíte de testes de unidade
describe("InvoiceFacade test", () => {
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
    await sequelize.addModels([InvoiceModel, ProductModel]);
    // criando o db
    await sequelize.sync();
  });

  // ações que ocorrem após de cada teste
  afterEach(async () => {
    // encerrando o db
    await sequelize.close();
  });

  // se um registro for armazenado no db, seus atributos devem ser iguais aos do objeto de origem
  it("should generate a invoice", async () => {
    // definindo os dados do input
    const input = {
      id: "1",
      name: "Client 1",
      document: "123456",
      street: "Street 1",
      number: "123",
      complement: "Complement 1",
      city: "City 1",
      state: "State 1",
      zipCode: "Zip123",
      items: [
        {
          id: "p1",
          name: "Product 1",
          price: 10.0,
        },
        {
          id: "p2",
          name: "Product 2",
          price: 15.0,
        },
      ],
    };

    // criando a facade utilizando a factory
    const invoiceFacade = InvoiceFacadeFactory.create();

    // criando o invoice utilizando os métodos da facade
    await invoiceFacade.generate(input);

    // consultando no db utilizando os métodos do orm
    const invoice = await InvoiceModel.findOne({
      where: { id: input.id },
      include: ["items"],
    });

    // comparando-se os dados
    expect(invoice).toBeDefined();
    expect(invoice.id).toBe(input.id);
    expect(invoice.document).toBe(input.document);
    expect(invoice.street).toBe(input.street);
    expect(invoice.number).toBe(input.number);
    expect(invoice.complement).toBe(input.complement);
    expect(invoice.city).toBe(input.city);
    expect(invoice.state).toBe(input.state);
    expect(invoice.zipCode).toBe(input.zipCode);
    expect(invoice.items[0].id).toBe(input.items[0].id);
    expect(invoice.items[0].name).toBe(input.items[0].name);
    expect(invoice.items[0].price).toBe(input.items[0].price);
    expect(invoice.items[1].id).toBe(input.items[1].id);
    expect(invoice.items[1].name).toBe(input.items[1].name);
    expect(invoice.items[1].price).toBe(input.items[1].price);
    expect(invoice.total).toBe(input.items[0].price + input.items[1].price);
  });

  // se for realizada uma busca por id, seus atributos devem ser iguais aos do objeto de origem
  it("should find a invoice", async () => {
    // criando o client utilizando o método do orm
    await InvoiceModel.create(
      {
        id: "1",
        name: "Client 1",
        document: "123456",
        street: "Street 1",
        number: "123",
        complement: "Complement 1",
        city: "City 1",
        state: "State 1",
        zipCode: "Zip123",
        items: [
          {
            id: "p1",
            name: "Product 1",
            price: 10.0,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: "p2",
            name: "Product 2",
            price: 15.0,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        total: 25.0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        // include do relacionamento HasMany, reponsável para criar os registros na tabela relacionada
        include: [{ model: ProductModel }],
      }
    );

    // criando a facade utilizando a factory
    const invoiceFacade = InvoiceFacadeFactory.create();

    // buscando o client utilizando os métodos da facade
    const invoice = await invoiceFacade.find({ id: "1" });

    // comparando-se os dados
    expect(invoice.id).toBe("1");
    expect(invoice.name).toBe("Client 1");
    expect(invoice.document).toBe("123456");
    expect(invoice.address.street).toBe("Street 1");
    expect(invoice.address.number).toBe("123");
    expect(invoice.address.complement).toBe("Complement 1");
    expect(invoice.address.city).toBe("City 1");
    expect(invoice.address.state).toBe("State 1");
    expect(invoice.address.zipCode).toBe("Zip123");
    expect(invoice.items[0].id).toBe("p1");
    expect(invoice.items[0].name).toBe("Product 1");
    expect(invoice.items[0].price).toBe(10.0);
    expect(invoice.items[1].id).toBe("p2");
    expect(invoice.items[1].name).toBe("Product 2");
    expect(invoice.items[1].price).toBe(15.0);
    expect(invoice.total).toBe(25.0);
  });
});
