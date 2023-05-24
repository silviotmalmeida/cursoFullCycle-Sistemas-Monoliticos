// dependências
import { app, sequelize } from "../express";
import request from "supertest";

// criando a suíte de testes end-to-end
describe("E2E test for clients", () => {
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
  it("should create a client", async () => {
    // realizando a requisição de criação
    const response = await request(app).post("/clients").send({
      name: "Client 0",
      document: "00000",
      email: "client@user.com",
      street: "some address",
      number: "1",
      complement: "",
      city: "some city",
      state: "some state",
      zipCode: "000",
    });

    // comparando-se os dados
    expect(response.status).toBe(200);
    expect(response.body.id).toBeDefined();
    expect(response.body.name).toBe("Client 0");
    expect(response.body.document).toBe("00000");
    expect(response.body.email).toBe("client@user.com");
    expect(response.body.street).toBe("some address");
    expect(response.body.number).toBe("1");
    expect(response.body.complement).toBe("");
    expect(response.body.city).toBe("some city");
    expect(response.body.state).toBe("some state");
    expect(response.body.zipCode).toBe("000");
    expect(response.body.createdAt).toBeDefined();
    expect(response.body.updatedAt).toBeDefined();
  });

  // se um client é criado de forma incompleta, retorna erro 500
  it("should not create a client", async () => {
    // realizando a requisição de criação incompleta
    const response = await request(app).post("/clients").send({
      name: "Client 0",
    });
    // conferindo o retorno
    expect(response.status).toBe(500);
  });
});
