// dependências
import UseCaseInterface from "../../@shared/usecase/useCaseInterface";
import ProductAdmFacadeInterface, {
  AddProductFacadeInputDto,
  CheckStockFacadeInputDto,
  CheckStockFacadeOutputDto,
} from "./productAdmFacadeInterface";

// agrupando os casos de uso para ser utilizado no construtor
export interface UseCasesProps {
  addUseCase: UseCaseInterface;
  stockUseCase: UseCaseInterface;
}

// implementação concreta da facade
export default class ProductAdmFacade implements ProductAdmFacadeInterface {
  // casos de uso que serão utilizados na implementação
  private _addUsecase: UseCaseInterface;
  private _checkStockUsecase: UseCaseInterface;

  // construtor
  constructor(usecasesProps: UseCasesProps) {
    this._addUsecase = usecasesProps.addUseCase;
    this._checkStockUsecase = usecasesProps.stockUseCase;
  }

  // método de criação
  addProduct(input: AddProductFacadeInputDto): Promise<void> {
    // utilizando o caso de uso
    return this._addUsecase.execute(input);
  }

  // método de busca de estoque
  checkStock(
    input: CheckStockFacadeInputDto
  ): Promise<CheckStockFacadeOutputDto> {
    // utilizando o caso de uso
    return this._checkStockUsecase.execute(input);
  }
}
