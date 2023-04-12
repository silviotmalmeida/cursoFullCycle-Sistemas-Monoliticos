// dependências
import Id from "../../../@shared/domain/value-object/id";
import Product from "../../domain/product";
import CheckStockUseCase from "./checkStockUseCase";

// criando o product
const product = new Product({
  Id: new Id("1"),
  name: "Product",
  description: "Product description",
  purchasePrice: 100,
  stock: 10,
});

// configurando o mock do repository
const MockRepository = () => {
  return {
    add: jest.fn(), // o método add não retorna nada
    find: jest.fn().mockReturnValue(Promise.resolve(product)), // o método find retorna o product criado
  };
};

// suíde de testes de unidade do caso de uso
describe("CheckStock usecase unit test", () => {
  // quando buscar o estoque de um product, os dados devem estar coerentes com o BD
  it("should get stock of a product", async () => {
    // criando o mock do repository
    const ProductRepository = MockRepository();
    // criando o caso de uso
    const checkStockUseCase = new CheckStockUseCase(ProductRepository);

    // definindo o input do caso de uso
    const input = {
      productId: "1",
    };

    // executando o caso de uso e recebendo o output
    const output = await checkStockUseCase.execute(input);

    // verificando os dados
    expect(ProductRepository.find).toHaveBeenCalled();
    expect(output.productId).toBe("1");
    expect(output.stock).toBe(10);
  });
});
