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
import { PlaceOrderInputDto, PlaceOrderOutputDto } from "./placeOrderDto";

// classe que define o caso de uso
export default class PlaceOrderUseCase implements UseCaseInterface {
  // injetando as facades
  private _clientFacade: ClientAdmFacadeInterface;
  private _productFacade: ProductAdmFacadeInterface;
  private _catalogFacade: StoreCatalogFacadeInterface;
  private _invoiceFacade: InvoiceFacadeInterface;
  private _paymentFacade: PaymentFacadeInterface;

  // construtor
  constructor(
    clientFacade: ClientAdmFacadeInterface,
    productFacade: ProductAdmFacadeInterface,
    catalogFacade: StoreCatalogFacadeInterface,
    invoiceFacade: InvoiceFacadeInterface,
    paymentFacade: PaymentFacadeInterface
  ) {
    this._clientFacade = clientFacade;
    this._productFacade = productFacade;
    this._catalogFacade = catalogFacade;
    this._invoiceFacade = invoiceFacade;
    this._paymentFacade = paymentFacade;
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
      address: client.address,
    });

    // criando a order
    const order = new Order({ Client: myClient, Products: products });

    // // criando o address a partir do input
    // const address = new Address(
    //   input.street,
    //   input.number,
    //   input.complement,
    //   input.city,
    //   input.state,
    //   input.zipCode
    // );

    // // criando os products a partir do input
    // const items = input.items.map((item) => {
    //   return new Product({
    //     Id: new Id(item.id) || new Id(),
    //     name: item.name,
    //     price: item.price,
    //   });
    // });

    // // obtendo as propriedades para criação do invoice a partir do input
    // const props = {
    //   Id: new Id(input.id),
    //   name: input.name,
    //   document: input.document,
    //   Address: address,
    //   items: items,
    // };

    // // criando o invoice
    // const invoice = new Invoice(props);

    // // adicionando no BD utilizando o repository
    // await this._invoiceRepository.generate(invoice);

    // retornando o output conforme padrão do dto
    return {
      id: "",
      invoiceId: "",
      status: "",
      total: 0.0,
      products: [
        {
          productId: "",
        },
      ],
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
