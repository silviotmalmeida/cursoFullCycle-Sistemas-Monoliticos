// dependências
import PlaceOrderUseCase from "./placeOrderUseCase";

// configurando o mock do repository
const MockRepository = () => {
  return {
    addOrder: jest.fn(), // o método add não retorna nada
    findOrder: jest.fn(), // o método find não retorna nada
  };
};

// suíde de testes de unidade do caso de uso
describe("Place Order Usecase unit test", () => {
  describe("execute method", () => {
    // se o cliente não existir, deve-se lançar um erro
    it("should throw an error when client not found", async () => {
      // configurando o mock da facade
      const MockClientFacade = {
        find: jest.fn().mockResolvedValue(null), // o método find retorna null
      };

      // criando o caso de uso
      // @ts-expect-error - no params in constructor
      const usecase = new PlaceOrderUseCase();
      // @ts-expect-error - force set clientFacade
      usecase["_clientFacade"] = MockClientFacade;

      // definindo o input do caso de uso
      const input = {
        clientId: "0",
        products: [{ productId: "0" }],
      };

      await expect(usecase.execute(input)).rejects.toThrow(
        new Error("Client not found")
      );
    });

    // // quando gerar um invoice, os dados devem estar coerentes com o input informado
    // it("should generate a invoice", async () => {
    //   // criando o mock do repository
    //   const repository = MockRepository();
    //   // criando o caso de uso
    //   const usecase = new PlaceOrderUseCase(repository);

    //   // definindo o input do caso de uso
    //   const input = {
    //     name: "Client 1",
    //     document: "123456",
    //     street: "Street 1",
    //     number: "123",
    //     complement: "Complement 1",
    //     city: "City 1",
    //     state: "State 1",
    //     zipCode: "Zip123",
    //     items: [
    //       { id: "p1", name: "Product 1", price: 10.0 },
    //       { id: "p2", name: "Product 2", price: 15.0 },
    //     ],
    //   };

    //   // executando o caso de uso e recebendo o output
    //   const result = await usecase.execute(input);

    //   // verificando os dados
    //   expect(repository.generate).toHaveBeenCalled();
    //   expect(result.id).toBeDefined();
    //   expect(result.name).toEqual(input.name);
    //   expect(result.document).toEqual(input.document);
    //   expect(result.street).toEqual(input.street);
    //   expect(result.number).toEqual(input.number);
    //   expect(result.complement).toEqual(input.complement);
    //   expect(result.city).toEqual(input.city);
    //   expect(result.state).toEqual(input.state);
    //   expect(result.zipCode).toEqual(input.zipCode);
    //   expect(result.items[0].id).toEqual(input.items[0].id);
    //   expect(result.items[0].name).toEqual(input.items[0].name);
    //   expect(result.items[0].price).toEqual(input.items[0].price);
    //   expect(result.items[1].id).toEqual(input.items[1].id);
    //   expect(result.items[1].name).toEqual(input.items[1].name);
    //   expect(result.items[1].price).toEqual(input.items[1].price);
    // });
  });
});
