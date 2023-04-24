// dependências
import UseCaseInterface from "../../../@shared/usecase/useCaseInterface";
import Transaction from "../../domain/transaction";
import PaymentGateway from "../../gateway/paymentGateway";
import {
  ProcessPaymentInputDto,
  ProcessPaymentOutputDto,
} from "./processPaymentDto";

// classe que define o caso de uso
export default class ProcessPaymentUseCase implements UseCaseInterface {
  // injetando o repository
  private _transactionRepository: PaymentGateway;

  // construtor
  constructor(transactionRepository: PaymentGateway) {
    this._transactionRepository = transactionRepository;
  }

  // método de execução
  async execute(
    input: ProcessPaymentInputDto
  ): Promise<ProcessPaymentOutputDto> {

    // criando a transaction a partir dos dados de input
    const transaction = new Transaction({
      amount: input.amount,
      orderId: input.orderId,
    });

    // processando a transaction
    transaction.process();

    // adicionando no BD utilizando o repository
    const persistTransaction = await this._transactionRepository.save(
      transaction
    );

    // retornando o output conforme padrão do dto
    return {
      transactionId: persistTransaction.Id.id,
      orderId: persistTransaction.orderId,
      amount: persistTransaction.amount,
      status: persistTransaction.status,
      createdAt: persistTransaction.createdAt,
      updatedAt: persistTransaction.updatedAt,
    };
  }
}
