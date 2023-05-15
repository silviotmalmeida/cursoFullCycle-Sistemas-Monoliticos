// dependências
import UseCaseInterface from "../../@shared/usecase/useCaseInterface";
import PaymentFacadeInterface, {
  PaymentFacadeInputDto,
  PaymentFacadeOutputDto,
} from "./paymentFacadeInterface";

// agrupando os casos de uso para ser utilizado no construtor
export interface UseCaseProps {
  processUsecase: UseCaseInterface;
}

// implementação concreta da facade
export default class PaymentFacade implements PaymentFacadeInterface {
  // casos de uso que serão utilizados na implementação
  private _processUsecase: UseCaseInterface;

  // construtor
  constructor(usecaseProps: UseCaseProps) {
    this._processUsecase = usecaseProps.processUsecase;
  }

  // método de processamento
  process(input: PaymentFacadeInputDto): Promise<PaymentFacadeOutputDto> {
    return this._processUsecase.execute(input);
  }
}
