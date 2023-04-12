// dependências
import Id from "../../../@shared/domain/value-object/id";
import Product from "../../domain/product";
import FindProductUseCase from "./findProductUseCase";

// criando o product
const product = new Product({
  Id: new Id("1"),
  name: "Product 1",
  description: "Description 1",
  salesPrice: 100,
});

// configurando o mock do repository
const MockRepository = () => {
  return {
    findAll: jest.fn(), // o método findAll não retorna nada
    find: jest.fn().mockReturnValue(Promise.resolve(product)), // o método find retorna o product criado
  };
};

// suíde de testes de unidade do caso de uso
describe("find a product usecase unit test", () => {
  // quando buscar um product, os dados devem estar coerentes com o BD
  it("should find a product", async () => {
    // criando o mock do repository
    const productRepository = MockRepository();
    // criando o caso de uso
    const findProductUseCase = new FindProductUseCase(productRepository);

    // definindo o input do caso de uso
    const input = {
      id: "1",
    };

    // executando o caso de uso e recebendo o output
    const output = await findProductUseCase.execute(input);

    // verificando os dados
    expect(productRepository.find).toHaveBeenCalled();
    expect(output.id).toBe("1");
    expect(output.name).toBe("Product 1");
    expect(output.description).toBe("Description 1");
    expect(output.salesPrice).toBe(100);
  });
});
