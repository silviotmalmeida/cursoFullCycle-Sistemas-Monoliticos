// dependências
import Id from "../../@shared/domain/value-object/id";
import Transaction from "../domain/transaction";
import transaction from "../domain/transaction";
import PaymentGateway from "../gateway/paymentGateway";
import TransactionModel from "./transactionModel";

// classe de repositório do orm, implementando a interface de gateway
export default class TransactionRepostiory implements PaymentGateway {
  // método de criação
  async save(input: transaction): Promise<transaction> {
    // utiliza o método default do orm
    const transaction = await TransactionModel.create({
      id: input.Id.id,
      orderId: input.orderId,
      amount: input.amount,
      status: input.status,
      createdAt: input.createdAt,
      updatedAt: input.updatedAt,
    });

    // recriando a transaction
    return new Transaction({
      Id: new Id(transaction.id),
      orderId: transaction.orderId,
      amount: transaction.amount,
      status: transaction.status,
      createdAt: transaction.createdAt,
      updatedAt: transaction.updatedAt,
    });
  }
}
