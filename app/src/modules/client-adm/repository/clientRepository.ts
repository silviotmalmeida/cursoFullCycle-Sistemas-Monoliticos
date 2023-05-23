// dependências
import Id from "../../@shared/domain/value-object/id";
import Client from "../domain/client";
import ClientGateway from "../gateway/clientGateway";
import { ClientModel } from "./clientModel";

// classe de repositório do orm, implementando a interface de gateway
export default class ClientRepository implements ClientGateway {
  // método de criação
  async add(client: Client): Promise<void> {
    // utiliza o método default do orm
    await ClientModel.create({
      id: client.Id.id,
      name: client.name,
      document: client.document,
      email: client.email,
      street: client.street,
      number: client.number,
      complement: client.complement,
      city: client.city,
      state: client.state,
      zipCode: client.zipCode,
      createdAt: client.createdAt,
      updatedAt: client.updatedAt,
    });
  }
  // método de busca por id
  async find(id: string): Promise<Client> {
    // obtendo os dados do bd
    const client = await ClientModel.findOne({ where: { id } });

    // em caso de inexistência, lança uma exceção
    if (!client) {
      throw new Error("Client not found");
    }

    // recriando o client
    return new Client({
      Id: new Id(client.id),
      name: client.name,
      document: client.document,
      email: client.email,
      street: client.street,
      number: client.number,
      complement: client.complement,
      city: client.city,
      state: client.state,
      zipCode: client.zipCode,
      createdAt: client.createdAt,
      updatedAt: client.updatedAt,
    });
  }
}
