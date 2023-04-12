// dependências
import UseCaseInterface from "../../../@shared/usecase/useCaseInterface";
import ProductGateway from "../../gateway/productGateway";
import { CheckStockInputDto, CheckStockOutputDto } from "./checkStockDto";

// classe que define o caso de uso
export default class CheckStockUseCase implements UseCaseInterface {
  // injetando o repository
  private _productRepository: ProductGateway;

  // construtor
  constructor(productRepository: ProductGateway) {
    this._productRepository = productRepository;
  }

  // método de execução
  async execute(input: CheckStockInputDto): Promise<CheckStockOutputDto> {
    // buscando no BD utilizando o repository a partir do input
    const product = await this._productRepository.find(input.productId);

    // retornando o output conforme padrão do dto
    return {
      productId: product.Id.id,
      stock: product.stock,
    };
  }
}
