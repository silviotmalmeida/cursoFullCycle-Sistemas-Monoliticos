// dependências
import Transaction from "../domain/transaction";

// gateway que define os métodos disponíveis para comunicação com o mundo externo
// os repository deverão implementar o gateway
export default interface PaymentGateway {
  save(input: Transaction): Promise<Transaction>;
}
