// dependências
import Id from "../../../@shared/domain/value-object/id";
import Client from "../../domain/client";
import FindClientUseCase from "./findClientUseCase";

// criando o client
const client = new Client({
  Id: new Id("1"),
  name: "Client 1",
  document: "00000",
  email: "x@x.com",
  street: "some address",
  number: "1",
  complement: "",
  city: "some city",
  state: "some state",
  zipCode: "000",
});

// configurando o mock do repository
const MockRepository = () => {
  return {
    add: jest.fn(), // o método add não retorna nada
    find: jest.fn().mockReturnValue(Promise.resolve(client)), // o método find retorna o client criado
  };
};

// suíde de testes de unidade do caso de uso
describe("Find Client Usecase unit test", () => {
  // quando buscar um client, os dados devem estar coerentes com o BD
  it("should find a client", async () => {
    // criando o mock do repository
    const repository = MockRepository();
    // criando o caso de uso
    const usecase = new FindClientUseCase(repository);

    // definindo o input do caso de uso
    const input = {
      id: "1",
    };

    // executando o caso de uso e recebendo o output
    const result = await usecase.execute(input);

    // verificando os dados
    expect(repository.find).toHaveBeenCalled();
    expect(result.id).toEqual(input.id);
    expect(result.name).toEqual(client.name);
    expect(result.document).toEqual(client.document);
    expect(result.email).toEqual(client.email);
    expect(result.street).toEqual(client.street);
    expect(result.number).toEqual(client.number);
    expect(result.complement).toEqual(client.complement);
    expect(result.city).toEqual(client.city);
    expect(result.state).toEqual(client.state);
    expect(result.zipCode).toEqual(client.zipCode);
    expect(result.createdAt).toEqual(client.createdAt);
    expect(result.updatedAt).toEqual(client.updatedAt);
  });
});
