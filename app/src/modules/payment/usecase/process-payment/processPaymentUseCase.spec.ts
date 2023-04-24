// dependências
import Id from "../../../@shared/domain/value-object/id";
import Transaction from "../../domain/transaction";
import ProcessPaymentUseCase from "./processPaymentUseCase";

// criando a transaction aprovada
const transaction = new Transaction({
  Id: new Id("1"),
  amount: 100,
  orderId: "1",
  status: "approved",
});

// configurando o mock do repository
const MockRepositoryApproved = () => {
  return {
    save: jest.fn().mockReturnValue(Promise.resolve(transaction)), // o método save retorna a transaction aprovada
  };
};

// criando a transaction reprovada
const transaction2 = new Transaction({
  Id: new Id("1"),
  amount: 50,
  orderId: "1",
  status: "declined",
});

// configurando o mock do repository
const MockRepositoryDeclined = () => {
  return {
    save: jest.fn().mockReturnValue(Promise.resolve(transaction2)), // o método save retorna a transaction reprovada
  };
};

// suíde de testes de unidade do caso de uso
describe("Process payment usecase unit test", () => {
  // se uma solicitação possuir amount >= 100, deve ser aprovada
  it("should approve a transaction", async () => {
    // criando o mock do repository
    const paymentRepository = MockRepositoryApproved();
    // criando o caso de uso
    const usecase = new ProcessPaymentUseCase(paymentRepository);

    // definindo o input do caso de uso
    const input = {
      orderId: "1",
      amount: 100,
    };

    // executando o caso de uso e recebendo o output
    const result = await usecase.execute(input);

    // verificando os dados
    expect(result.transactionId).toBe(transaction.Id.id);
    expect(paymentRepository.save).toHaveBeenCalled();
    expect(result.status).toBe("approved");
    expect(result.amount).toBe(100);
    expect(result.orderId).toBe("1");
    expect(result.createdAt).toBe(transaction.createdAt);
    expect(result.updatedAt).toBe(transaction.updatedAt);
  });

  // se uma solicitação possuir amount < 100, deve ser reprovada
  it("should decline a transaction", async () => {
    // criando o mock do repository
    const paymentRepository = MockRepositoryDeclined();
    // criando o caso de uso
    const usecase = new ProcessPaymentUseCase(paymentRepository);

    // definindo o input do caso de uso
    const input = {
      orderId: "1",
      amount: 50,
    };

    // executando o caso de uso e recebendo o output
    const result = await usecase.execute(input);

    // verificando os dados
    expect(result.transactionId).toBe(transaction2.Id.id);
    expect(paymentRepository.save).toHaveBeenCalled();
    expect(result.status).toBe("declined");
    expect(result.amount).toBe(50);
    expect(result.orderId).toBe("1");
    expect(result.createdAt).toBe(transaction2.createdAt);
    expect(result.updatedAt).toBe(transaction2.updatedAt);
  });
});
