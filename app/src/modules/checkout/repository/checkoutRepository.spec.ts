// dependências
import { Sequelize } from "sequelize-typescript";
import Id from "../../@shared/domain/value-object/id";
import OrderModel from "./orderModel";
import CheckoutProductModel from "./checkoutProductModel";
import CheckoutClientModel from "./checkoutClientModel";
import Client from "../domain/client";
import Product from "../domain/product";
import Order from "../domain/order";
import CheckoutRepository from "./checkoutRepository";

// criando a suíte de testes unitários
describe("Checkout repository test", () => {
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
    await sequelize.addModels([
      OrderModel,
      CheckoutClientModel,
      CheckoutProductModel,
    ]);
    // criando o db
    await sequelize.sync();
  });

  // ações que ocorrem após de cada teste
  afterEach(async () => {
    // encerrando o db
    await sequelize.close();
  });

  // se um registro for armazenado no db, seus atributos devem ser iguais aos do objeto de origem
  it("should generate a new order", async () => {
    // criando o client
    const client = new Client({
      Id: new Id("1c"),
      name: "Client 0",
      email: "client@user.com",
      street: "some address",
      number: "1",
      complement: "",
      city: "some city",
      state: "some state",
      zipCode: "000",
    });

    // criando os products
    const products = [
      new Product({
        Id: new Id("1"),
        name: "Product 1",
        description: "some description",
        salesPrice: 40,
      }),
      new Product({
        Id: new Id("2"),
        name: "Product 2",
        description: "some description",
        salesPrice: 30,
      }),
    ];

    // obtendo as propriedades para criação do invoice
    const props = {
      Id: new Id("1o"),
      Client: client,
      Products: products,
      status: "pending",
    };
    // criando a order
    const order = new Order(props);

    // salvando no db utilizando os métodos do repository
    const repository = new CheckoutRepository();
    await repository.addOrder(order);

    // consultando no db utilizando os métodos do orm
    const orderDb = await OrderModel.findOne({
      where: { id: "1o" },
      include: ["client", "products"],
    });

    // comparando-se os dados
    expect(orderDb.toJSON()).toStrictEqual({
      id: order.Id.id,
      client: {
        id: client.Id.id,
        order_id: order.Id.id,
        name: client.name,
        email: client.email,
        street: client.street,
        number: client.number,
        complement: client.complement,
        city: client.city,
        state: client.state,
        zipCode: client.zipCode,
      },
      products: [
        {
          id: products[0].Id.id,
          order_id: order.Id.id,
          name: products[0].name,
          description: products[0].description,
          salesPrice: products[0].salesPrice,
        },
        {
          id: products[1].Id.id,
          order_id: order.Id.id,
          name: products[1].name,
          description: products[1].description,
          salesPrice: products[1].salesPrice,
        },
      ],
      status: order.status,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    });
  });
});
