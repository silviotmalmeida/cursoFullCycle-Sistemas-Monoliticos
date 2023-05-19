// dependências
import Id from "../../../@shared/domain/value-object/id";
import UseCaseInterface from "../../../@shared/usecase/useCaseInterface";
import ClientAdmFacadeInterface from "../../../client-adm/facade/clientAdmFacadeInterface";
import InvoiceFacadeInterface from "../../../invoice/facade/invoiceFacadeInterface";
import PaymentFacadeInterface from "../../../payment/facade/paymentFacadeInterface";
import ProductAdmFacadeInterface from "../../../product-adm/facade/productAdmFacadeInterface";
import StoreCatalogFacadeInterface from "../../../store-catalog/facade/storeCatalogFacadeInterface";
import Client from "../../domain/client";
import Order from "../../domain/order";
import Product from "../../domain/product";
import CheckoutGateway from "../../gateway/checkoutGateway";
import { PlaceOrderInputDto, PlaceOrderOutputDto } from "./placeOrderDto";

// classe que define o caso de uso
export default class PlaceOrderUseCase implements UseCaseInterface {
  // injetando as facades
  private _clientFacade: ClientAdmFacadeInterface;
  private _productFacade: ProductAdmFacadeInterface;
  private _catalogFacade: StoreCatalogFacadeInterface;
  private _invoiceFacade: InvoiceFacadeInterface;
  private _paymentFacade: PaymentFacadeInterface;
  private _checkoutGateway: CheckoutGateway;

  // construtor
  constructor(
    clientFacade: ClientAdmFacadeInterface,
    productFacade: ProductAdmFacadeInterface,
    catalogFacade: StoreCatalogFacadeInterface,
    invoiceFacade: InvoiceFacadeInterface,
    paymentFacade: PaymentFacadeInterface,
    checkoutGateway: CheckoutGateway
  ) {
    this._clientFacade = clientFacade;
    this._productFacade = productFacade;
    this._catalogFacade = catalogFacade;
    this._invoiceFacade = invoiceFacade;
    this._paymentFacade = paymentFacade;
    this._checkoutGateway = checkoutGateway;
  }

  // método de execução
  async execute(input: PlaceOrderInputDto): Promise<PlaceOrderOutputDto> {
    // verificando a existência do client
    const client = await this._clientFacade.find({ id: input.clientId });
    if (!client) throw new Error("Client not found");

    // verificando a existência de produtos
    await this.validateProducts(input);

    // criando os Products
    const products = await Promise.all(
      input.products.map((p) => this.getProduct(p.productId))
    );

    // criando o Client
    const myClient = new Client({
      Id: new Id(client.id),
      name: client.name,
      email: client.email,
      street: client.street,
      number: client.number,
      complement: client.complement,
      city: client.city,
      state: client.state,
      zipCode: client.zipCode,
    });

    // criando a order
    const order = new Order({ Client: myClient, Products: products });

    // processando o pagamento
    const payment = await this._paymentFacade.process({
      orderId: order.Id.id,
      amount: order.total(),
    });

    // criando o invoice
    const invoice =
      // somente se o status for approved
      payment.status === "approved"
        ? await this._invoiceFacade.generate({
            name: client.name,
            document: "documento",
            street: client.street,
            number: client.number,
            complement: client.complement,
            city: client.city,
            state: client.state,
            zipCode: client.zipCode,
            items: products.map((p) => {
              return {
                id: p.Id.id,
                name: p.name,
                price: p.salesPrice,
              };
            }),
          })
        : null;

    // aprovando a order
    payment.status === "approved" && order.approved();

    // persistindo a order
    this._checkoutGateway.addOrder(order);

    // retornando o output conforme padrão do dto
    return {
      id: order.Id.id,
      invoiceId: payment.status === "approved" ? invoice.id : null,
      status: order.status,
      total: order.total(),
      products: order.Products.map((p) => {
        return {
          productId: p.Id.id,
        };
      }),
    };
  }

  private async validateProducts(input: PlaceOrderInputDto): Promise<void> {
    if (input.products.length === 0) throw new Error("No products selected");

    for (const p of input.products) {
      const product = await this._productFacade.checkStock({
        productId: p.productId,
      });
      if (product.stock <= 0) {
        throw new Error(
          `Product ${product.productId} is not available in stock`
        );
      }
    }
  }

  private async getProduct(productId: string): Promise<Product> {
    const product = await this._catalogFacade.find({
      id: productId,
    });
    if (!product) {
      throw new Error(`Product ${productId} not found`);
    }
    const productProps = {
      Id: new Id(product.id),
      name: product.name,
      description: product.description,
      salesPrice: product.salesPrice,
    };

    return new Product(productProps);
  }
}
