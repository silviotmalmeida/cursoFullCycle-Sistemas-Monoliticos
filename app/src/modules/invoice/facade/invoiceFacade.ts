// dependências
import UseCaseInterface from "../../@shared/usecase/useCaseInterface";
import InvoiceFacadeInterface, {
  GenerateInvoiceFacadeInputDto,
  FindInvoiceFacadeInputDto,
  FindInvoiceFacadeOutputDto,
} from "./invoiceFacadeInterface";

// agrupando os casos de uso para ser utilizado no construtor
export interface UseCaseProps {
  findUsecase: UseCaseInterface;
  generateUsecase: UseCaseInterface;
}

// implementação concreta da facade
export default class InvoiceFacade implements InvoiceFacadeInterface {
  // casos de uso que serão utilizados na implementação
  private _findUsecase: UseCaseInterface;
  private _generateUsecase: UseCaseInterface;

  // construtor
  constructor(usecaseProps: UseCaseProps) {
    this._findUsecase = usecaseProps.findUsecase;
    this._generateUsecase = usecaseProps.generateUsecase;
  }

  // método de criação
  async generate(input: GenerateInvoiceFacadeInputDto): Promise<void> {
    // utilizando o caso de uso
    await this._generateUsecase.execute(input);
  }

  // método de busca por id
  async find(
    input: FindInvoiceFacadeInputDto
  ): Promise<FindInvoiceFacadeOutputDto> {
    // utilizando o caso de uso
    return await this._findUsecase.execute(input);
  }
}
