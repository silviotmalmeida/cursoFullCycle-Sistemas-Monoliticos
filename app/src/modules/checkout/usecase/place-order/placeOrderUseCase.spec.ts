// dependências
import { FindClientFacadeOutputDto } from "../../../client-adm/facade/clientAdmFacadeInterface";
import { CheckStockFacadeOutputDto } from "../../../product-adm/facade/productAdmFacadeInterface";
import { FindStoreCatalogFacadeOutputDto } from "../../../store-catalog/facade/storeCatalogFacadeInterface";
import { PlaceOrderInputDto } from "./placeOrderDto";
import PlaceOrderUseCase from "./placeOrderUseCase";

// suíde de testes de unidade do caso de uso
describe("Place Order Usecase unit test", () => {
  // forçando a criação do caso de uso ignorando regras do construtor
  // @ts-expect-error - no params in constructor
  const usecase = new PlaceOrderUseCase();

  // teste relacionados ao método validateProducts
  describe("validateProducts method", () => {
    // se os produtos não forem selecionados, deve-se lançar um erro
    it("should throw an error when no products are selected", async () => {
      // definindo o input do caso de uso
      const input: PlaceOrderInputDto = {
        clientId: "0",
        products: [],
      };

      // verificando a execução
      // executando o método privado validateProducts diretamente
      await expect(usecase["validateProducts"](input)).rejects.toThrow(
        new Error("No products selected")
      );
    });

    // se os produtos não possuírem estoque, deve-se lançar um erro
    it("should throw an error when product is out of stock", async () => {
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

      // configurando o mock da ProductFacade
      const MockProductFacade = {
        checkStock: jest.fn(productOutput), // o método checkStock retorna conforme definido na função
      };

      // forçando injeção da clientFacade
      // @ts-expect-error - force set clientFacade
      usecase["_productFacade"] = MockProductFacade;

      // definindo o input do caso de uso
      let input: PlaceOrderInputDto = {
        clientId: "1",
        products: [{ productId: "1" }],
      };

      // verificando a execução
      // executando o método privado validateProducts diretamente
      await expect(usecase["validateProducts"](input)).rejects.toThrow(
        new Error("Product 1 is not available in stock")
      );

      // alterando o input do caso de uso
      input = {
        clientId: "1",
        products: [{ productId: "0" }, { productId: "1" }],
      };

      // verificando a execução
      // executando o método privado validateProducts diretamente
      await expect(usecase["validateProducts"](input)).rejects.toThrow(
        new Error("Product 1 is not available in stock")
      );
      expect(MockProductFacade.checkStock).toHaveBeenCalledTimes(3);

      // alterando o input do caso de uso
      input = {
        clientId: "1",
        products: [{ productId: "0" }, { productId: "1" }, { productId: "2" }],
      };

      // verificando a execução
      // executando o método privado validateProducts diretamente
      await expect(usecase["validateProducts"](input)).rejects.toThrow(
        new Error("Product 1 is not available in stock")
      );
      expect(MockProductFacade.checkStock).toHaveBeenCalledTimes(5);
    });
  });

  // teste relacionados ao método getProducts
  describe("getProducts method", () => {
    // criando a data mocada
    const mockDate = new Date(2000, 1, 1);

    // método a ser executado antes dos testes
    beforeAll(() => {
      jest.useFakeTimers("modern");
      jest.setSystemTime(mockDate);
    });

    // método a ser executado após os testes
    afterAll(() => {
      jest.useRealTimers();
    });

    // se os produtos não forem encontrados, deve-se lançar um erro
    it("should throw an error when product not found", async () => {
      // configurando o mock da CatalogFacade
      const MockCatalogFacade = {
        find: jest.fn().mockResolvedValue(null), // o método find retorna null
      };

      // forçando injeção da catalogFacade
      // @ts-expect-error - force set clientFacade
      usecase["_catalogFacade"] = MockCatalogFacade;

      // definindo o input do caso de uso
      const input: PlaceOrderInputDto = {
        clientId: "1",
        products: [{ productId: "0" }, { productId: "2" }, { productId: "3" }],
      };

      // verificando a execução
      // executando o método privado getProduct diretamente
      await expect(usecase["getProduct"]("0")).rejects.toThrow(
        new Error("Product 0 not found")
      );
    });
  });

  // testes relacionados ao método execute
  describe("execute method", () => {
    // se o cliente não existir, deve-se lançar um erro
    it("should throw an error when client not found", async () => {
      // configurando o mock da ClientFacade
      const MockClientFacade = {
        find: jest.fn().mockResolvedValue(null), // o método find retorna null
      };

      // forçando a criação do caso de uso ignorando regras do construtor
      // @ts-expect-error - no params in constructor
      const usecase = new PlaceOrderUseCase();

      // forçando injeção da clientFacade
      // @ts-expect-error - force set clientFacade
      usecase["_clientFacade"] = MockClientFacade;

      // definindo o input do caso de uso
      const input: PlaceOrderInputDto = {
        clientId: "0",
        products: [],
      };

      // verificando a execução
      await expect(usecase.execute(input)).rejects.toThrow(
        new Error("Client not found")
      );
    });

    // se os produtos não forem válidos, deve-se lançar um erro
    it("should throw an error when products are not valid", async () => {
      // configurando o mock da ClientFacade
      const MockClientFacade = {
        find: jest.fn().mockResolvedValue(true), // o método find retorna null
      };

      // forçando a criação do caso de uso ignorando regras do construtor
      // @ts-expect-error - no params in constructor
      const usecase = new PlaceOrderUseCase();

      // forçando injeção da clientFacade
      // @ts-expect-error - force set clientFacade
      usecase["_clientFacade"] = MockClientFacade;

      // espionando a execução do método privado interno do usecase
      const mockValidateProducts = jest
        // @ts-expect-error - spy on private method
        .spyOn(usecase, "validateProducts")
        // @ts-expect-error - not return never
        .mockRejectedValue(new Error("No products selected"));

      // definindo o input do caso de uso
      const input: PlaceOrderInputDto = {
        clientId: "1",
        products: [],
      };

      // verificando a execução
      await expect(usecase.execute(input)).rejects.toThrow(
        new Error("No products selected")
      );
      expect(mockValidateProducts).toHaveBeenCalledTimes(1);
    });
  });

  // suíde de testes de unidade customizados por mim
  describe("Customized tests", () => {
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

    // configurando o mock da PaymentFacade
    const MockPaymentFacade = {
      process: jest.fn().mockResolvedValue(null), // o método process retorna null
    };

    // configurando o mock da InvoiceFacade
    const MockInvoiceFacade = {
      generate: jest.fn().mockResolvedValue(null), // o método generate retorna null
      find: jest.fn().mockResolvedValue(null), // o método find retorna null
    };

    // configurando o mock do CheckoutGateway
    const MockCheckoutGateway = {
      addOrder: jest.fn().mockResolvedValue(null), // o método addOrder retorna null
      findOrder: jest.fn().mockResolvedValue(null), // o método findOrder retorna null
    };

    // criando a data mocada
    const mockDate = new Date(2000, 1, 1);

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
          MockCatalogFacade,
          MockInvoiceFacade,
          MockPaymentFacade,
          MockCheckoutGateway
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
          MockCatalogFacade,
          MockInvoiceFacade,
          MockPaymentFacade,
          MockCheckoutGateway
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
          MockCatalogFacade,
          MockInvoiceFacade,
          MockPaymentFacade,
          MockCheckoutGateway
        );

        // definindo o input do caso de uso
        const input: PlaceOrderInputDto = {
          clientId: "1",
          products: [
            { productId: "0" },
            { productId: "1" },
            { productId: "2" },
          ],
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
          MockCatalogFacade,
          MockInvoiceFacade,
          MockPaymentFacade,
          MockCheckoutGateway
        );

        // definindo o input do caso de uso
        const input: PlaceOrderInputDto = {
          clientId: "1",
          products: [
            { productId: "0" },
            { productId: "2" },
            { productId: "3" },
          ],
        };

        // verificando a execução
        await expect(usecase.execute(input)).rejects.toThrow(
          new Error("Product 0 not found")
        );
        expect(MockClientFacade.find).toHaveBeenCalledTimes(1);
        expect(MockProductFacade.checkStock).toHaveBeenCalledTimes(3);
        expect(MockCatalogFacade.find).toHaveBeenCalledTimes(3);
      });

      // deve-se retornar produtos
      it("should return a product", async () => {
        // criando o mock retorno do método find da clientFacade
        const client: FindClientFacadeOutputDto = {
          id: "1c",
          name: "Client 0",
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

        // criando o mock retorno do método find da catalogFacade
        const catalog: FindStoreCatalogFacadeOutputDto = {
          id: "0",
          name: "Product 0",
          description: "Product 0 description",
          salesPrice: 0,
        };

        // ajustando o mock da ClientFacade
        MockClientFacade.find = jest
          .fn()
          .mockResolvedValue(Promise.resolve(client)); // o método find retorna o client criado

        // ajustando o mock da ProductFacade
        MockProductFacade.checkStock = jest.fn(productOutput); // o método checkStock retorna conforme definido na função

        // ajustando o mock da CatalogFacade
        MockCatalogFacade.find = jest
          .fn()
          .mockResolvedValue(Promise.resolve(catalog)); // o método find retorna o catalog criado

        // criando o caso de uso
        const usecase = new PlaceOrderUseCase(
          MockClientFacade,
          MockProductFacade,
          MockCatalogFacade,
          MockInvoiceFacade,
          MockPaymentFacade,
          MockCheckoutGateway
        );

        // definindo o input do caso de uso
        const input: PlaceOrderInputDto = {
          clientId: "1",
          products: [{ productId: "0" }],
        };

        // verificando a execução
        await usecase.execute(input);
        expect(MockClientFacade.find).toHaveBeenCalledTimes(1);
        expect(MockProductFacade.checkStock).toHaveBeenCalledTimes(1);
        expect(MockCatalogFacade.find).toHaveBeenCalledTimes(1);
      });
    });
  });
});
