// dependências
import UseCaseInterface from "../../../@shared/usecase/useCaseInterface";
import ClientAdmFacadeInterface from "../../../client-adm/facade/clientAdmFacadeInterface";
import ProductAdmFacadeInterface from "../../../product-adm/facade/productAdmFacadeInterface";
import { PlaceOrderInputDto, PlaceOrderOutputDto } from "./placeOrderDto";

// classe que define o caso de uso
export default class PlaceOrderUseCase implements UseCaseInterface {
  // injetando as facades
  private _clientFacade: ClientAdmFacadeInterface;
  private _productFacade: ProductAdmFacadeInterface;

  // construtor
  constructor(
    clientFacade: ClientAdmFacadeInterface,
    productFacade: ProductAdmFacadeInterface
  ) {
    this._clientFacade = clientFacade;
    this._productFacade = productFacade;
  }

  // método de execução
  async execute(input: PlaceOrderInputDto): Promise<PlaceOrderOutputDto> {
    // verificando a existência do client
    const client = await this._clientFacade.find({ id: input.clientId });
    if (!client) throw new Error("Client not found");

    // verificando a existência de produtos
    await this.validateProducts(input);

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

  async validateProducts(input: PlaceOrderInputDto): Promise<void> {
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
}
