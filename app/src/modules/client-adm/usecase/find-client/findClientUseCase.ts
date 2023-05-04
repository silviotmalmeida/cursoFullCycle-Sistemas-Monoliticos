// dependências
import UseCaseInterface from "../../../@shared/usecase/useCaseInterface";
import ClientGateway from "../../gateway/clientGateway";
import { FindClientInputDto, FindClientOutputDto } from "./findClientDto";

// classe que define o caso de uso
export default class FindClientUseCase implements UseCaseInterface {
  // injetando o repository
  private _clientRepository: ClientGateway;

  // construtor
  constructor(clientRepository: ClientGateway) {
    this._clientRepository = clientRepository;
  }

  // método de execução
  async execute(input: FindClientInputDto): Promise<FindClientOutputDto> {
    // buscando no BD utilizando o repository a partir do input
    const client = await this._clientRepository.find(input.id);

    // retornando o output conforme padrão do dto
    return {
      id: client.Id.id,
      name: client.name,
      email: client.email,
      address: client.address,
      createdAt: client.createdAt,
      updatedAt: client.updatedAt,
    };
  }
}
