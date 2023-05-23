// dependências
import Id from "../../../@shared/domain/value-object/id";
import UseCaseInterface from "../../../@shared/usecase/useCaseInterface";
import Client from "../../domain/client";
import ClientGateway from "../../gateway/clientGateway";
import { AddClientInputDto, AddClientOutputDto } from "./addClientDto";

// classe que define o caso de uso
export default class AddClientUseCase implements UseCaseInterface {
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
      document: input.document,
      email: input.email,
      street: input.street,
      number: input.number,
      complement: input.complement,
      city: input.city,
      state: input.state,
      zipCode: input.zipCode,
    };

    // criando o client
    const client = new Client(props);

    // adicionando no BD utilizando o repository
    this._clientRepository.add(client);

    // retornando o output conforme padrão do dto
    return {
      id: client.Id.id,
      name: client.name,
      document: input.document,
      email: client.email,
      street: client.street,
      number: client.number,
      complement: client.complement,
      city: client.city,
      state: client.state,
      zipCode: client.zipCode,
      createdAt: client.createdAt,
      updatedAt: client.updatedAt,
    };
  }
}
