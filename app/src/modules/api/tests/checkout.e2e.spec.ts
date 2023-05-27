// dependências
import { ClientModel } from "../../client-adm/repository/clientModel";
import { ProductModel } from "../../product-adm/repository/productModel";
import CatalogProductModel from "../../store-catalog/repository/catalogProductModel";
import { app, sequelize } from "../express";
import request from "supertest";

// criando a suíte de testes end-to-end
describe("E2E test for products", () => {
  // ações que ocorrem antes de cada teste
  beforeEach(async () => {
    // recriando o db
    await sequelize.sync({ force: true });
  });

  // ações que ocorrem após todos os testes
  afterAll(async () => {
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

    // realizando a requisição de criação
    const response = await request(app)
      .post("/checkout")
      .send({
        id: "1o",
        clientId: "1c",
        products: [{ productId: "1p" }, { productId: "2p" }],
      });

    // comparando-se os dados
    expect(response.status).toBe(200);
    expect(response.body.id).toBe("1o");
    expect(response.body.invoiceId).toBeDefined();
    expect(response.body.status).toBe("approved");
    expect(response.body.total).toBe(150);
    expect(response.body.products[0].productId).toBe("1p");
    expect(response.body.products[1].productId).toBe("2p");
  });

  // se o client não existir, retorna erro 500
  it("should not place a order if client not exists", async () => {
    // realizando a requisição de criação
    const response = await request(app)
      .post("/checkout")
      .send({
        id: "1o",
        clientId: "1a",
        products: [{ productId: "1p" }, { productId: "2p" }],
      });
    // conferindo o retorno
    expect(response.status).toBe(500);
  });

  // se o algum produto estiver sem estoque, retorna erro 500
  it("should not place a order if client not exists", async () => {
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
      stock: 0,
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

    // realizando a requisição de criação
    const response = await request(app)
      .post("/checkout")
      .send({
        id: "1o",
        clientId: "1c",
        products: [{ productId: "1p" }, { productId: "2p" }],
      });
    // conferindo o retorno
    expect(response.status).toBe(500);
  });
});
