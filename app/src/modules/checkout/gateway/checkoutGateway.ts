// dependências
import Order from "../domain/order";

// gateway que define os métodos disponíveis para comunicação com o mundo externo
// os repository deverão implementar o gateway
export default interface CheckoutGateway {
  addOrder(order: Order): Promise<void>;
  findOrder(id: string): Promise<Order | null>;
}
