// dependências
import UseCaseInterface from "../../@shared/usecase/useCaseInterface";
import ClientAdmFacadeInterface, {
  AddClientFacadeInputDto,
  AddClientOutputDto,
  FindClientFacadeInputDto,
  FindClientFacadeOutputDto,
} from "./clientAdmFacadeInterface";

// agrupando os casos de uso para ser utilizado no construtor
export interface UseCaseProps {
  findUsecase: UseCaseInterface;
  addUsecase: UseCaseInterface;
}

// implementação concreta da facade
export default class ClientAdmFacade implements ClientAdmFacadeInterface {
  // casos de uso que serão utilizados na implementação
  private _findUsecase: UseCaseInterface;
  private _addUsecase: UseCaseInterface;

  // construtor
  constructor(usecaseProps: UseCaseProps) {
    this._findUsecase = usecaseProps.findUsecase;
    this._addUsecase = usecaseProps.addUsecase;
  }

  // método de criação
  async add(input: AddClientFacadeInputDto): Promise<AddClientOutputDto> {
    // utilizando o caso de uso
    return await this._addUsecase.execute(input);
  }

  // método de busca por id
  async find(
    input: FindClientFacadeInputDto
  ): Promise<FindClientFacadeOutputDto> {
    // utilizando o caso de uso
    return await this._findUsecase.execute(input);
  }
}
