// dependências
import { Sequelize } from "sequelize-typescript";
import Id from "../../@shared/domain/value-object/id";
import Transaction from "../domain/transaction";
import TransactionModel from "./transactionModel";
import TransactionRepostiory from "./transactionRepository";

// criando a suíte de testes de unidade
describe("TransactionRepository test", () => {
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
  it("should save a transaction", async () => {
    // criando a transaction
    const transaction = new Transaction({
      Id: new Id("1"),
      amount: 100,
      orderId: "1",
    });
    // aprovando a transaction
    transaction.approve();

    // salvando no db utilizando os métodos do repository
    const repository = new TransactionRepostiory();
    const result = await repository.save(transaction);

    // comparando-se os dados
    expect(result.Id.id).toBe(transaction.Id.id);
    expect(result.status).toBe("approved");
    expect(result.amount).toBe(transaction.amount);
    expect(result.orderId).toBe(transaction.orderId);
  });
});
