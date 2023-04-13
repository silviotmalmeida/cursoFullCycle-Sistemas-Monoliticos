// dependências
import FindAllProductsUsecase from "../usecase/find-all-products/findAllProductsUseCase";
import FindProductUseCase from "../usecase/find-product/findProductUseCase";
import StoreCatalogFacadeInterface, {
  FindAllStoreCatalogFacadeOutputDto,
  FindStoreCatalogFacadeInputDto,
  FindStoreCatalogFacadeOutputDto,
} from "./storeCatalogFacadeInterface";

// agrupando os casos de uso para ser utilizado no construtor
export interface UseCaseProps {
  findUseCase: FindProductUseCase;
  findAllUseCase: FindAllProductsUsecase;
}

// implementação concreta da facade
export default class StoreCatalogFacade implements StoreCatalogFacadeInterface {
  // casos de uso que serão utilizados na implementação
  private _findUseCase: FindProductUseCase;
  private _findAllUseCase: FindAllProductsUsecase;

  // construtor
  constructor(props: UseCaseProps) {
    this._findUseCase = props.findUseCase;
    this._findAllUseCase = props.findAllUseCase;
  }

  // método de busca por id
  async find(
    id: FindStoreCatalogFacadeInputDto
  ): Promise<FindStoreCatalogFacadeOutputDto> {
    // utilizando o caso de uso
    return await this._findUseCase.execute(id);
  }

  // método de busca
  async findAll(): Promise<FindAllStoreCatalogFacadeOutputDto> {
    // utilizando o caso de uso
    return await this._findAllUseCase.execute();
  }
}
