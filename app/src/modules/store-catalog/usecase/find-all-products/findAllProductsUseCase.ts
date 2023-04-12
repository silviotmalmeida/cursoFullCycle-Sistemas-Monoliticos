// dependências
import UseCaseInterface from "../../../@shared/usecase/useCaseInterface";
import ProductGateway from "../../gateway/productGateway";

// classe que define o caso de uso
export default class FindAllProductsUsecase implements UseCaseInterface {
  // injetando o repository
  private _productRepository: ProductGateway;

  // construtor
  constructor(_productRepository: ProductGateway) {
    this._productRepository = _productRepository;
  }

  // método de execução
  async execute(): Promise<any> {
    // obtendo a lista de products utilizando o repository
    const products = await this._productRepository.findAll();

    // retornando o output conforme padrão do dto
    return {
      products: products.map((product) => ({
        id: product.Id.id,
        name: product.name,
        description: product.description,
        salesPrice: product.salesPrice,
      })),
    };
  }
}
