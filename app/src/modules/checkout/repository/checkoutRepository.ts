// dependências

import Order from "../domain/order";
import CheckoutGateway from "../gateway/checkoutGateway";
import CheckoutClientModel from "./checkoutClientModel";
import CheckoutProductModel from "./checkoutProductModel";
import OrderModel from "./orderModel";

// classe de repositório do orm, implementando a interface de gateway
export default class CheckoutRepository implements CheckoutGateway {
  async addOrder(order: Order): Promise<void> {
    // utiliza o método default do orm
    await OrderModel.create(
      {
        id: order.Id.id,
        client: order.Client,
        products: order.Products.map((item) => ({
          id: item.Id.id,
          name: item.name,
          description: item.description,
          salesPrice: item.salesPrice,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
        })),
        status: order.status,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
      },
      {
        // include do relacionamento HasMany, reponsável para criar os registros na tabela relacionada
        include: [
          { model: CheckoutProductModel },
          { model: CheckoutClientModel },
        ],
      }
    );
  }

  // método de busca por id
  findOrder(id: string): Promise<Order | null> {
    return null;
  }
}
