// dependências
import Id from "../../../@shared/domain/value-object/id";
import Product from "../../domain/product";
import FindAllProductsUsecase from "./findAllProductsUseCase";

// criando o product 1
const product = new Product({
  Id: new Id("1"),
  name: "Product 1",
  description: "Description 1",
  salesPrice: 100,
});

// criando o product 2
const product2 = new Product({
  Id: new Id("2"),
  name: "Product 2",
  description: "Description 2",
  salesPrice: 200,
});

// configurando o mock do repository
const MockRepository = () => {
  return {
    find: jest.fn(), // o método find não retorna nada
    findAll: jest.fn().mockReturnValue(Promise.resolve([product, product2])), // o método findAll retorna a lista com os products criados
  };
};

// suíde de testes de unidade do caso de uso
describe("find all products usecase unit test", () => {
  // quando buscar a lista de products, os dados devem estar coerentes com o BD
  it("should find all products", async () => {
    // criando o mock do repository
    const productRepository = MockRepository();
    // criando o caso de uso
    const findAllProductsUseCase = new FindAllProductsUsecase(
      productRepository
    );

    // executando o caso de uso e recebendo o output
    const output = await findAllProductsUseCase.execute();

    // verificando os dados
    expect(productRepository.findAll).toHaveBeenCalled();
    expect(output.products.length).toBe(2);
    expect(output.products[0].id).toBe("1");
    expect(output.products[0].name).toBe("Product 1");
    expect(output.products[0].description).toBe("Description 1");
    expect(output.products[0].salesPrice).toBe(100);
    expect(output.products[1].id).toBe("2");
    expect(output.products[1].name).toBe("Product 2");
    expect(output.products[1].description).toBe("Description 2");
    expect(output.products[1].salesPrice).toBe(200);
  });
});
