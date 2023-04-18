// dependências
import Id from "../../../@shared/domain/value-object/id";
import Client from "../../domain/client";
import ClientGateway from "../../gateway/clientGateway";
import { AddClientInputDto, AddClientOutputDto } from "./addClientDto";

// classe que define o caso de uso
export default class AddClientUseCase {
  // injetando o repository
  private _clientRepository: ClientGateway;

  // construtor
  constructor(clientRepository: ClientGateway) {
    this._clientRepository = clientRepository;
  }

  // método de execução
  async execute(input: AddClientInputDto): Promise<AddClientOutputDto> {
    // obtendo as propriedades para criação do client a partir do input
    const props = {
      Id: new Id(input.id) || new Id(),
      name: input.name,
      email: input.email,
      address: input.address,
    };

    // criando o client
    const client = new Client(props);

    // adicionando no BD utilizando o repository
    this._clientRepository.add(client);

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
