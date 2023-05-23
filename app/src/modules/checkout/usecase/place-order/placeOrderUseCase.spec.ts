// dependências
import Id from "../../../@shared/domain/value-object/id";
import { FindClientFacadeOutputDto } from "../../../client-adm/facade/clientAdmFacadeInterface";
import { CheckStockFacadeOutputDto } from "../../../product-adm/facade/productAdmFacadeInterface";
import { FindStoreCatalogFacadeOutputDto } from "../../../store-catalog/facade/storeCatalogFacadeInterface";
import Product from "../../domain/product";
import { PlaceOrderInputDto, PlaceOrderOutputDto } from "./placeOrderDto";
import PlaceOrderUseCase from "./placeOrderUseCase";

// suíde de testes de unidade do caso de uso
describe("Place Order Usecase unit test", () => {
  // forçando a criação do caso de uso ignorando regras do construtor
  // @ts-expect-error - no params in constructor
  const usecase = new PlaceOrderUseCase();

  // testes relacionados ao método validateProducts
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

  // testes relacionados ao método getProducts
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

    // deve-se retornar produtos
    it("should return a product", async () => {
      // criando o mock retorno do método find da catalogFacade
      const catalog: FindStoreCatalogFacadeOutputDto = {
        id: "0",
        name: "Product 0",
        description: "Product 0 description",
        salesPrice: 0,
      };

      // configurando o mock da CatalogFacade
      const MockCatalogFacade = {
        find: jest.fn().mockResolvedValue(catalog), // o método find retorna o produto criado
      };

      // padrão do objeto Product a ser retornado pelo getProduct
      const outputProduct = new Product({
        Id: new Id("0"),
        name: "Product 0",
        description: "Product 0 description",
        salesPrice: 0,
      });

      // forçando injeção da catalogFacade
      // @ts-expect-error - force set clientFacade
      usecase["_catalogFacade"] = MockCatalogFacade;

      // verificando a execução
      // executando o método privado getProduct diretamente
      await expect(usecase["getProduct"]("0")).resolves.toEqual(outputProduct);
      expect(MockCatalogFacade.find).toHaveBeenCalledTimes(1);
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

      // mocando a execução do método privado interno do usecase
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

  describe("place order", () => {
    // criando o mock retorno do método find da clientFacade
    const client: FindClientFacadeOutputDto = {
      id: "1c",
      name: "Client 0",
      document: "00000",
      email: "client@user.com",
      street: "some address",
      number: "1",
      complement: "",
      city: "some city",
      state: "some state",
      zipCode: "000",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // configurando o mock da ClientFacade
    const MockClientFacade = {
      add: jest.fn().mockResolvedValue(null), // o método add retorna null
      find: jest.fn().mockResolvedValue(client), // o método find retorna o cliente mocado
    };

    // configurando o mock da PaymentFacade
    const MockPaymentFacade = {
      process: jest.fn(), // o método process não faz nada
    };

    // configurando o mock do CheckoutGateway
    const MockCheckoutGateway = {
      addOrder: jest.fn(), // o método addOrder não faz nada
      findOrder: jest.fn().mockResolvedValue(null), // o método findOrder retorna null
    };

    // configurando o mock da InvoiceFacade
    const MockInvoiceFacade = {
      generate: jest.fn().mockResolvedValue({ id: "1i" }), // o método generate retorna um objeto com id
      find: jest.fn().mockResolvedValue(null), // o método find retorna null
    };

    // criando o caso de uso
    const usecase = new PlaceOrderUseCase(
      MockClientFacade,
      null,
      null,
      MockInvoiceFacade,
      MockPaymentFacade,
      MockCheckoutGateway
    );

    const products = {
      "1": new Product({
        Id: new Id("1"),
        name: "Product 1",
        description: "some description",
        salesPrice: 40,
      }),
      "2": new Product({
        Id: new Id("2"),
        name: "Product 2",
        description: "some description",
        salesPrice: 30,
      }),
    };

    // mocando a execução do método privado interno do usecase
    const mockValidateProducts = jest
      // @ts-expect-error - spy on private method
      .spyOn(usecase, "validateProducts")
      // @ts-expect-error - not return never
      // o validate vai retornar null
      .mockResolvedValue(null);

    // mocando a execução do método privado interno do usecase
    const mockGetProduct = jest
      // @ts-expect-error - spy on private method
      .spyOn(usecase, "getProduct")
      // @ts-expect-error - not return never
      // o get vai retornar um array com os id dos produtos
      .mockImplementation((productId: keyof typeof products) => {
        return products[productId];
      });

    // caso não seja aprovada
    it("should not be approved", async () => {
      // alterando o comportamento da MockPaymentFacade
      MockPaymentFacade.process = MockPaymentFacade.process.mockReturnValue({
        transactionId: "1t",
        orderId: "1o",
        amount: 100,
        status: "error",
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // definindo o input do caso de uso
      const input: PlaceOrderInputDto = {
        clientId: "1c",
        products: [{ productId: "1" }, { productId: "2" }],
      };

      // executando o caso de uso
      let output: PlaceOrderOutputDto = await usecase.execute(input);

      // verificando a execução
      expect(output.invoiceId).toBeNull();
      expect(output.total).toBe(70);
      expect(output.products).toStrictEqual([
        { productId: "1" },
        { productId: "2" },
      ]);
      expect(MockClientFacade.find).toHaveBeenCalledTimes(1);
      expect(MockClientFacade.find).toHaveBeenCalledWith({ id: "1c" });
      expect(mockValidateProducts).toHaveBeenCalledTimes(1);
      expect(mockValidateProducts).toHaveBeenCalledWith(input);
      expect(mockGetProduct).toHaveBeenCalledTimes(2);
      expect(MockCheckoutGateway.addOrder).toHaveBeenCalledTimes(1);
      expect(MockPaymentFacade.process).toHaveBeenCalledTimes(1);
      expect(MockPaymentFacade.process).toHaveBeenCalledWith({
        orderId: output.id,
        amount: output.total,
      });
      expect(MockInvoiceFacade.generate).toHaveBeenCalledTimes(0);
    });

    // caso seja aprovada
    it("should be approved", async () => {
      // alterando o comportamento da MockPaymentFacade
      MockPaymentFacade.process = MockPaymentFacade.process.mockReturnValue({
        transactionId: "1t",
        orderId: "1o",
        amount: 100,
        status: "approved",
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // definindo o input do caso de uso
      const input: PlaceOrderInputDto = {
        clientId: "1c",
        products: [{ productId: "1" }, { productId: "2" }],
      };

      // executando o caso de uso
      let output: PlaceOrderOutputDto = await usecase.execute(input);

      // verificando a execução
      expect(output.invoiceId).toBe("1i");
      expect(output.total).toBe(70);
      expect(output.products).toStrictEqual([
        { productId: "1" },
        { productId: "2" },
      ]);
      expect(MockClientFacade.find).toHaveBeenCalledTimes(1);
      expect(MockClientFacade.find).toHaveBeenCalledWith({ id: "1c" });
      expect(mockValidateProducts).toHaveBeenCalledTimes(1);
      expect(mockGetProduct).toHaveBeenCalledTimes(2);
      expect(MockCheckoutGateway.addOrder).toHaveBeenCalledTimes(1);
      expect(MockPaymentFacade.process).toHaveBeenCalledTimes(1);
      expect(MockPaymentFacade.process).toHaveBeenCalledWith({
        orderId: output.id,
        amount: output.total,
      });
      expect(MockInvoiceFacade.generate).toHaveBeenCalledTimes(1);
      expect(MockInvoiceFacade.generate).toHaveBeenCalledWith({
        name: client.name,
        document: client.document,
        street: client.street,
        number: client.number,
        complement: client.complement,
        city: client.city,
        state: client.state,
        zipCode: client.zipCode,
        items: [
          {
            id: products["1"].Id.id,
            name: products["1"].name,
            price: products["1"].salesPrice,
          },
          {
            id: products["2"].Id.id,
            name: products["2"].name,
            price: products["2"].salesPrice,
          },
        ],
      });
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
          document: "00000",
          email: "x@x.com",
          street: "some address",
          number: "1",
          complement: "",
          city: "some city",
          state: "some state",
          zipCode: "000",
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
          document: "00000",
          email: "x@x.com",
          street: "some address",
          number: "1",
          complement: "",
          city: "some city",
          state: "some state",
          zipCode: "000",
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
          document: "00000",
          email: "x@x.com",
          street: "some address",
          number: "1",
          complement: "",
          city: "some city",
          state: "some state",
          zipCode: "000",
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
          document: "00000",
          email: "x@x.com",
          street: "some address",
          number: "1",
          complement: "",
          city: "some city",
          state: "some state",
          zipCode: "000",
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

        // ajustando o mock da PaymentFacade
        MockPaymentFacade.process = MockPaymentFacade.process.mockReturnValue({
          transactionId: "1t",
          orderId: "1o",
          amount: 100,
          status: "error",
          createdAt: new Date(),
          updatedAt: new Date(),
        });

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
        expect(MockPaymentFacade.process).toHaveBeenCalledTimes(1);
      });
    });
  });
});
