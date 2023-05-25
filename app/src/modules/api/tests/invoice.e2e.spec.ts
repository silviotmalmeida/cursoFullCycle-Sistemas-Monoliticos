// dependências
import InvoiceFacadeFactory from "../../invoice/factory/invoiceFacadeFactory";
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

  // se for executada uma busca por id, os atributos devem ser iguais aos dos objetos de origem
  it("should find a invoice", async () => {
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

    // realizando a requisição de busca
    const response = await request(app).get("/invoice/1").send();

    // conferindo o retorno
    expect(response.status).toBe(200);
    expect(response.body.id).toBe(input.id);
    expect(response.body.name).toBe(input.name);
    expect(response.body.document).toBe(input.document);
    expect(response.body.address._street).toBe(input.street);
    expect(response.body.address._number).toBe(input.number);
    expect(response.body.address._complement).toBe(input.complement);
    expect(response.body.address._city).toBe(input.city);
    expect(response.body.address._state).toBe(input.state);
    expect(response.body.address._zipCode).toBe(input.zipCode);
    expect(response.body.items[0].id).toBe(input.items[0].id);
    expect(response.body.items[0].name).toBe(input.items[0].name);
    expect(response.body.items[0].price).toBe(input.items[0].price);
    expect(response.body.items[1].id).toBe(input.items[1].id);
    expect(response.body.items[1].name).toBe(input.items[1].name);
    expect(response.body.items[1].price).toBe(input.items[1].price);
    expect(response.body.total).toBe(25.0);
    expect(response.body.createdAt).toBeDefined();
  });
});
