// dependências
import { Sequelize } from "sequelize-typescript";
import PaymentFacadeFactory from "../factory/paymentFacadeFactory";
import TransactionModel from "../repository/transactionModel";

// criando a suíte de testes de unidade
describe("PaymentFacade test", () => {
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
    await sequelize.addModels([TransactionModel]);
    // criando o db
    await sequelize.sync();
  });

  // ações que ocorrem após de cada teste
  afterEach(async () => {
    // encerrando o db
    await sequelize.close();
  });

  // se um registro for armazenado no db, seus atributos devem ser iguais aos do objeto de origem
  it("should create a transaction", async () => {
    // definindo os dados do input
    const input = {
      orderId: "order-1",
      amount: 100,
    };

    // criando a facade utilizando a factory
    const facade = PaymentFacadeFactory.create();

    // criando a transaction utilizando os métodos da facade
    const output = await facade.process(input);

    // comparando-se os dados
    expect(output.transactionId).toBeDefined();
    expect(output.orderId).toBe(input.orderId);
    expect(output.amount).toBe(input.amount);
    expect(output.status).toBe("approved");
  });
});
