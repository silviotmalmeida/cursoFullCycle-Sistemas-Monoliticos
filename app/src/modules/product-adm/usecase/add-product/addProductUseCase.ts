// dependências
import Id from "../../../@shared/domain/value-object/id";
import Product from "../../domain/product";
import ProductGateway from "../../gateway/productGateway";
import { AddProductInputDto, AddProductOutputDto } from "./addProductDto";

// classe que define o caso de uso
export default class AddProductUseCase {
  // injetando o repository
  private _productRepository: ProductGateway;

  // construtor
  constructor(_productRepository: ProductGateway) {
    this._productRepository = _productRepository;
  }

  // método de execução
  async execute(input: AddProductInputDto): Promise<AddProductOutputDto> {
    // obtendo as propriedades para criação do product a partir do input
    const props = {
      id: new Id(input.id),
      name: input.name,
      description: input.description,
      purchasePrice: input.purchasePrice,
      stock: input.stock,
    };

    // criando o product
    const product = new Product(props);

    // adicionando no BD utilizando o repository
    this._productRepository.add(product);

    // retornando o output conforme padrão do dto
    return {
      id: product.id.id,
      name: product.name,
      description: product.description,
      purchasePrice: product.purchasePrice,
      stock: product.stock,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
  }
}
