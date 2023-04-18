// dependências
import { Sequelize } from "sequelize-typescript";
import ProductAdmFacadeFactory from "../factory/productAdmfacadeFactory";
import { ProductModel } from "../repository/productModel";

// criando a suíte de testes de unidade
describe("ProductAdmFacade test", () => {
  // inicializando a variável do orm
  let sequelize: Sequelize;

  // ações que ocorrem antes de cada teste
  beforeEach(async () => {
    // configurando o orm
    sequelize = new Sequelize({
      dialect: "sqlite", // definindo o db
      storage: ":memory:", // definindo que irá gravar em memória
      logging: false, // sem login
      sync: { force: true }, // criar as tabelas ao inicializar o db
    });

    // adicionando as models a serem consideradas na criação das tabelas
    await sequelize.addModels([ProductModel]);
    // criando o db
    await sequelize.sync();
  });

  // ações que ocorrem após de cada teste
  afterEach(async () => {
    // encerrando o db
    await sequelize.close();
  });

  // se um registro for armazenado no db, seus atributos devem ser iguais aos do objeto de origem
  it("should create a product", async () => {
    // criando a facade utilizando a factory
    const productFacade = ProductAdmFacadeFactory.create();

    // definindo os dados do input
    const input = {
      id: "1",
      name: "Product 1",
      description: "Product 1 description",
      purchasePrice: 10,
      stock: 10,
    };

    // criando o product utilizando os métodos da facade
    await productFacade.addProduct(input);

    // consultando no db utilizando os métodos do orm
    const product = await ProductModel.findOne({ where: { id: "1" } });

    // comparando-se os dados
    expect(product).toBeDefined();
    expect(product.id).toBe(input.id);
    expect(product.name).toBe(input.name);
    expect(product.description).toBe(input.description);
    expect(product.purchasePrice).toBe(input.purchasePrice);
    expect(product.stock).toBe(input.stock);
  });

  // quando buscar o estoque de um product, os dados devem estar coerentes com o BD
  it("should check product stock", async () => {
    // salvando o product no db utilizando os métodos do orm
    ProductModel.create({
      id: "1",
      name: "Product 1",
      description: "Product 1 description",
      purchasePrice: 10,
      stock: 10,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // criando a facade utilizando a factory
    const productFacade = ProductAdmFacadeFactory.create();

    // buscando o estoque utilizando os métodos da facade
    const result = await productFacade.checkStock({ productId: "1" });

    // comparando-se os dados
    expect(result.productId).toEqual("1");
    expect(result.stock).toEqual(10);
  });
});
