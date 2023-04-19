// dependências
import PaymentFacadeInterface from "../facade/facadeInterface";
import PaymentFacade from "../facade/paymentFacade";
import TransactionRepostiory from "../repository/transactionRepository";
import ProcessPaymentUseCase from "../usecase/process-payment/processPaymentUseCase";

// classe de fábrica da facade
// como trata-se de um objeto complexo, além de não ser interessante expor para o mundo externo a forma de criação da facade,
// foi criada a factory
export default class PaymentFacadeFactory {
  static create(): PaymentFacadeInterface {
    const repository = new TransactionRepostiory();
    const processUsecase = new ProcessPaymentUseCase(repository);
    const facade = new PaymentFacade({
      processUsecase: processUsecase,
    });
    return facade;
  }
}
