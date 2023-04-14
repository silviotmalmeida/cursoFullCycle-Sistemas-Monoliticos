// dependências
import AddClientUseCase from "./addClientUseCase";

// configurando o mock do repository
const MockRepository = () => {
  return {
    add: jest.fn(), // o método add não retorna nada
    find: jest.fn(), // o método find não retorna nada
  };
};

// suíde de testes de unidade do caso de uso
describe("Add Client Usecase unit test", () => {
  // quando adicionar um client, os dados devem estar coerentes com o input informado
  it("should add a client", async () => {
    // criando o mock do repository
    const repository = MockRepository();
    // criando o caso de uso
    const usecase = new AddClientUseCase(repository);

    // definindo o input do caso de uso
    const input = {
      name: "Client 1",
      email: "x@x.com",
      address: "Address 1",
    };

    // executando o caso de uso e recebendo o output
    const result = await usecase.execute(input);

    // verificando os dados
    expect(repository.add).toHaveBeenCalled();
    expect(result.id).toBeDefined();
    expect(result.name).toEqual(input.name);
    expect(result.email).toEqual(input.email);
    expect(result.address).toEqual(input.address);
  });
});
