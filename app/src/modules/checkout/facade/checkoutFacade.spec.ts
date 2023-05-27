// dependências
import { Sequelize } from "sequelize-typescript";
import { ClientModel } from "../../client-adm/repository/clientModel";
import { ProductModel } from "../../product-adm/repository/productModel";
import CatalogProductModel from "../../store-catalog/repository/catalogProductModel";
import TransactionModel from "../../payment/repository/transactionModel";
import InvoiceModel from "../../invoice/repository/invoiceModel";
import InvoiceProductModel from "../../invoice/repository/invoiceProductModel";
import CheckoutClientModel from "../repository/checkoutClientModel";
import CheckoutProductModel from "../repository/checkoutProductModel";
import OrderModel from "../repository/orderModel";
import CheckoutFacadeFactory from "../factory/checkoutFacadeFactory";


// criando a suíte de testes de unidade
describe("CheckoutFacade test", () => {
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
      ClientModel,
      ProductModel,
      CatalogProductModel,
      TransactionModel,
      InvoiceModel,
      InvoiceProductModel,
      CheckoutClientModel,
      CheckoutProductModel,
      OrderModel,
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
  it("should place a order", async () => {
    // criando o client utilizando o método do orm
    await ClientModel.create({
      id: "1c",
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

    // criando os products no db utilizando os métodos do orm
    await ProductModel.create({
      id: "1p",
      name: "Product 1",
      description: "Product 1 description",
      purchasePrice: 50,
      stock: 10,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    await ProductModel.create({
      id: "2p",
      name: "Product 2",
      description: "Product 2 description",
      purchasePrice: 100,
      stock: 20,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // criando os catalogProducts utilizando o método do orm
    await CatalogProductModel.create({
      id: "1p",
      name: "Product 1",
      description: "Product 1 description",
      salesPrice: 50,
    });
    await CatalogProductModel.create({
      id: "2p",
      name: "Product 2",
      description: "Product 2 description",
      salesPrice: 100,
    });

    // definindo os dados do input
    const input = {
      id: "1o",
      clientId: "1c",
      products: [{ productId: "1p" }, { productId: "2p" }],
    };

    // criando a facade utilizando a factory
    const checkoutFacade = CheckoutFacadeFactory.create();

    // criando a order utilizando os métodos da facade
    const output = await checkoutFacade.placeOrder(input);

    // consultando no db utilizando os métodos do orm
    const orderDb = await OrderModel.findOne({
      where: { id: "1o" },
      include: ["client", "products"],
    });

    // comparando-se os dados
    expect(output.id).toBe(input.id);
    expect(output.invoiceId).toBeDefined();
    expect(output.status).toBe("approved");
    expect(output.total).toBe(150);
    expect(output.products[0].productId).toBe(input.products[0].productId);
    expect(output.products[1].productId).toBe(input.products[1].productId);

    expect(orderDb.toJSON()).toStrictEqual({
      id: input.id,
      client: {
        id: "1c",
        order_id: input.id,
        name: "Client 1",
        email: "x@x.com",
        street: "some address",
        number: "1",
        complement: "",
        city: "some city",
        state: "some state",
        zipCode: "000",
      },
      products: [
        {
          id: "1p",
          order_id: input.id,
          name: "Product 1",
          description: "Product 1 description",
          salesPrice: 50,
        },
        {
          id: "2p",
          order_id: input.id,
          name: "Product 2",
          description: "Product 2 description",
          salesPrice: 100,
        },
      ],
      status: "approved",
      createdAt: orderDb.toJSON().createdAt,
      updatedAt: orderDb.toJSON().updatedAt,
    });
  });
});
