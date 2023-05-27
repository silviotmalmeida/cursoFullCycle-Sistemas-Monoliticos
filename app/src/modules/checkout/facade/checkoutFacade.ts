// dependências

import UseCaseInterface from "../../@shared/usecase/useCaseInterface";
import { PlaceOrderOutputDto } from "../usecase/place-order/placeOrderDto";
import PlaceOrderUseCase from "../usecase/place-order/placeOrderUseCase";
import CheckoutFacadeInterface, {
  PlaceOrderInputDto,
} from "./checkoutFacadeInterface";

// agrupando os casos de uso para ser utilizado no construtor
export interface UseCaseProps {
  placeOrder: PlaceOrderUseCase;
}

// implementação concreta da facade
export default class CheckoutFacade implements CheckoutFacadeInterface {
  // casos de uso que serão utilizados na implementação
  private _placeOrder: UseCaseInterface;

  // construtor
  constructor(usecaseProps: UseCaseProps) {
    this._placeOrder = usecaseProps.placeOrder;
  }

  // método de criação
  async placeOrder(input: PlaceOrderInputDto): Promise<PlaceOrderOutputDto> {
    // utilizando o caso de uso
    return await this._placeOrder.execute(input);
  }
}
