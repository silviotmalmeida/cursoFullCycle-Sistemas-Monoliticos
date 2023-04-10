// dependências
import AddProductUseCase from "./addProductUseCase";

// configurando o mock do repository
const MockRepository = () => {
  return {
    add: jest.fn(), // o método add não retorna nada
    find: jest.fn(), // o método find não retorna nada
  };
};

// suíde de testes de unidade do caso de uso
describe("Add Product usecase unit test", () => {
  // quando adicionar um product, os dados devem estar coerentes com o input informado
  it("should add a product", async () => {
    // criando o mock do repository
    const productRepository = MockRepository();
    // criando o caso de uso
    const usecase = new AddProductUseCase(productRepository);

    // definindo o input do caso de uso
    const input = {
      name: "Product 1",
      description: "Product 1 description",
      purchasePrice: 100,
      stock: 10,
    };

    // executando o caso de uso e recebendo o output
    const output = await usecase.execute(input);

    // verificando os dados
    expect(productRepository.add).toHaveBeenCalled();
    expect(output.id).toBeDefined();
    expect(output.name).toBe(input.name);
    expect(output.description).toBe(input.description);
    expect(output.purchasePrice).toBe(input.purchasePrice);
    expect(output.stock).toBe(input.stock);
  });
});
