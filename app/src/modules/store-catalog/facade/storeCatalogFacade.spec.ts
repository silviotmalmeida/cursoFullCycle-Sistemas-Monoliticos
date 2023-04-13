// dependências
import { Sequelize } from "sequelize-typescript";
import StoreCatalogFacadeFactory from "../factory/storeCatalogFacadeFactory";
import ProductModel from "../repository/productModel";

// criando a suíte de testes de unidade
describe("StoreCatalogFacade test", () => {
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

  // se for realizada uma busca por id, seus atributos devem ser iguais aos do objeto de origem
  it("should find a product", async () => {
    // criando o product utilizando o método do orm
    await ProductModel.create({
      id: "1",
      name: "Product 1",
      description: "Description 1",
      salesPrice: 100,
    });

    // criando a facade utilizando a factory
    const facade = StoreCatalogFacadeFactory.create();

    // buscando o product utilizando os métodos da facade
    const output = await facade.find({ id: "1" });

    // comparando-se os dados
    expect(output.id).toBe("1");
    expect(output.name).toBe("Product 1");
    expect(output.description).toBe("Description 1");
    expect(output.salesPrice).toBe(100);
  });

  // se for realizada uma busca, seus atributos devem ser iguais aos dos objetos de origem
  it("should find all products", async () => {
    // criando os products utilizando o método do orm
    await ProductModel.create({
      id: "1",
      name: "Product 1",
      description: "Description 1",
      salesPrice: 100,
    });
    await ProductModel.create({
      id: "2",
      name: "Product 2",
      description: "Description 2",
      salesPrice: 200,
    });

    // criando a facade utilizando a factory
    const facade = StoreCatalogFacadeFactory.create();

    // buscando a lista de products utilizando os métodos da facade
    const output = await facade.findAll();

    // comparando-se os dados
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
