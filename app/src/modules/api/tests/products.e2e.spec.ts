// dependências
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
  it("should create a product", async () => {
    // realizando a requisição de criação
    const response = await request(app).post("/products").send({
      name: "Product 1",
      description: "Product 1 description",
      purchasePrice: 25.0,
      stock: 8,
    });

    // comparando-se os dados
    expect(response.status).toBe(200);
    expect(response.body.id).toBeDefined();
    expect(response.body.name).toBe("Product 1");
    expect(response.body.description).toBe("Product 1 description");
    expect(response.body.purchasePrice).toBe(25.0);
    expect(response.body.stock).toBe(8);
    expect(response.body.createdAt).toBeDefined();
    expect(response.body.updatedAt).toBeDefined();
  });

  // se um product é criado de forma incompleta, retorna erro 500
  it("should not create a product", async () => {
    // realizando a requisição de criação incompleta
    const response = await request(app).post("/products").send({
      name: "Product 1",
    });
    // conferindo o retorno
    expect(response.status).toBe(500);
  });
});
