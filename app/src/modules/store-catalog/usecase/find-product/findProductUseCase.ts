// dependências
import UseCaseInterface from "../../../@shared/usecase/useCaseInterface";
import ProductGateway from "../../gateway/productGateway";
import { FindProductInputDto, FindProductOutputDto } from "./findProductDto";

// classe que define o caso de uso
export default class FindProductUseCase implements UseCaseInterface {
  // injetando o repository
  private _productRepository: ProductGateway;

  // construtor
  constructor(_productRepository: ProductGateway) {
    this._productRepository = _productRepository;
  }

  // método de execução
  async execute(input: FindProductInputDto): Promise<FindProductOutputDto> {
    // buscando no BD utilizando o repository a partir do input
    const product = await this._productRepository.find(input.id);

    // retornando o output conforme padrão do dto
    return {
      id: product.Id.id,
      name: product.name,
      description: product.description,
      salesPrice: product.salesPrice,
    };
  }
}
