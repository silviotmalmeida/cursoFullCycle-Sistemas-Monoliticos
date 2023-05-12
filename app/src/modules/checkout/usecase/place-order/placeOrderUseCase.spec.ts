// dependências
import ClientAdmFacade from "../../../client-adm/facade/clientAdmFacade";
import { FindClientFacadeOutputDto } from "../../../client-adm/facade/clientAdmFacadeInterface";
import { CheckStockFacadeOutputDto } from "../../../product-adm/facade/productAdmFacadeInterface";
import { PlaceOrderInputDto } from "./placeOrderDto";
import PlaceOrderUseCase from "./placeOrderUseCase";

// configurando o mock da ClientFacade
const MockClientFacade = {
  add: jest.fn().mockResolvedValue(null), // o método add retorna null
  find: jest.fn().mockResolvedValue(null), // o método find retorna null
};

// configurando o mock da ProductFacade
const MockProductFacade = {
  addProduct: jest.fn().mockResolvedValue(null), // o método add retorna null
  checkStock: jest.fn().mockResolvedValue(null), // o método find retorna null
};

// configurando o mock da CatalogFacade
const MockCatalogFacade = {
  find: jest.fn().mockResolvedValue(null), // o método find retorna null
  findAll: jest.fn().mockResolvedValue(null), // o método findAll retorna null
};

// criando a data mocada
const mockDate = new Date(2000, 1, 1);
// suíde de testes de unidade do caso de uso
describe("Place Order Usecase unit test", () => {
  // método a ser executado antes dos testes
  beforeAll(() => {
    jest.useFakeTimers("modern");
    jest.setSystemTime(mockDate);
  });

  // método a ser executado após os testes
  afterAll(() => {
    jest.useRealTimers();
  });

  describe("execute method", () => {
    // se o cliente não existir, deve-se lançar um erro
    it("should throw an error when client not found", async () => {
      // criando o caso de uso
      const usecase = new PlaceOrderUseCase(
        MockClientFacade,
        MockProductFacade,
        MockCatalogFacade
      );

      // definindo o input do caso de uso
      const input: PlaceOrderInputDto = {
        clientId: "0",
        products: [{ productId: "0" }],
      };

      // verificando a execução
      await expect(usecase.execute(input)).rejects.toThrow(
        new Error("Client not found")
      );
      expect(MockClientFacade.find).toHaveBeenCalledTimes(1);
    });

    // se os produtos não forem válidos, deve-se lançar um erro
    it("should throw an error when products are not valid", async () => {
      // criando o mock retorno do método find da clientFacade
      const client: FindClientFacadeOutputDto = {
        id: "1",
        name: "Client 1",
        email: "x@x.com",
        address: "Address 1",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // ajustando o mock da ClientFacade
      MockClientFacade.find = jest
        .fn()
        .mockResolvedValue(Promise.resolve(client)); // o método find retorna o client criado

      // criando o caso de uso
      const usecase = new PlaceOrderUseCase(
        MockClientFacade,
        MockProductFacade,
        MockCatalogFacade
      );

      // definindo o input do caso de uso
      const input: PlaceOrderInputDto = {
        clientId: "1",
        products: [],
      };

      // verificando a execução
      await expect(usecase.execute(input)).rejects.toThrow(
        new Error("No products selected")
      );
      expect(MockClientFacade.find).toHaveBeenCalledTimes(1);
      expect(MockProductFacade.checkStock).toHaveBeenCalledTimes(0);
    });

    // se os produtos não possuírem estoque, deve-se lançar um erro
    it("should throw an error when product is out of stock", async () => {
      // criando o mock retorno do método find da clientFacade
      const client: FindClientFacadeOutputDto = {
        id: "1",
        name: "Client 1",
        email: "x@x.com",
        address: "Address 1",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // criando o mock retorno do método checkStock da productFacade
      // criando função para retornar stock zero para produtos com id 1
      const productOutput = ({
        productId,
      }: {
        productId: string;
      }): Promise<CheckStockFacadeOutputDto> =>
        Promise.resolve({
          productId,
          stock: productId === "1" ? 0 : 1,
        });

      // ajustando o mock da ClientFacade
      MockClientFacade.find = jest
        .fn()
        .mockResolvedValue(Promise.resolve(client)); // o método find retorna o client criado

      // ajustando o mock da ProductFacade
      MockProductFacade.checkStock = jest.fn(productOutput); // o método checkStock retorna conforme definido na função

      // criando o caso de uso
      const usecase = new PlaceOrderUseCase(
        MockClientFacade,
        MockProductFacade,
        MockCatalogFacade
      );

      // definindo o input do caso de uso
      const input: PlaceOrderInputDto = {
        clientId: "1",
        products: [{ productId: "0" }, { productId: "1" }, { productId: "2" }],
      };

      // verificando a execução
      await expect(usecase.execute(input)).rejects.toThrow(
        new Error("Product 1 is not available in stock")
      );
      expect(MockClientFacade.find).toHaveBeenCalledTimes(1);
      expect(MockProductFacade.checkStock).toHaveBeenCalledTimes(2);
    });

    // se os produtos não forem encontrados, deve-se lançar um erro
    it("should throw an error when product not found", async () => {
      // criando o mock retorno do método find da clientFacade
      const client: FindClientFacadeOutputDto = {
        id: "1",
        name: "Client 1",
        email: "x@x.com",
        address: "Address 1",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // criando o mock retorno do método checkStock da productFacade
      // criando função para retornar stock zero para produtos com id 1
      const productOutput = ({
        productId,
      }: {
        productId: string;
      }): Promise<CheckStockFacadeOutputDto> =>
        Promise.resolve({
          productId,
          stock: productId === "1" ? 0 : 1,
        });

      // ajustando o mock da ClientFacade
      MockClientFacade.find = jest
        .fn()
        .mockResolvedValue(Promise.resolve(client)); // o método find retorna o client criado

      // ajustando o mock da ProductFacade
      MockProductFacade.checkStock = jest.fn(productOutput); // o método checkStock retorna conforme definido na função

      // criando o caso de uso
      const usecase = new PlaceOrderUseCase(
        MockClientFacade,
        MockProductFacade,
        MockCatalogFacade
      );

      // definindo o input do caso de uso
      const input: PlaceOrderInputDto = {
        clientId: "1",
        products: [{ productId: "0" }, { productId: "2" }, { productId: "3" }],
      };

      // verificando a execução
      await expect(usecase.execute(input)).rejects.toThrow(
        new Error("Product 0 not found")
      );
      expect(MockClientFacade.find).toHaveBeenCalledTimes(1);
      expect(MockProductFacade.checkStock).toHaveBeenCalledTimes(3);
      expect(MockCatalogFacade.find).toHaveBeenCalledTimes(1);
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
