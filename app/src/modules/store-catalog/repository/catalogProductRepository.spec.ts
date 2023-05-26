// dependências
import { Sequelize } from "sequelize-typescript";
import ProductModel from "./catalogProductModel";
import ProductRepository from "./catalogProductRepository";

// criando a suíte de testes de unidade
describe("ProductRepository test", () => {
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

  // se for executada uma busca, os atributos devem ser iguais aos dos objetos de origem
  it("should find all products", async () => {
    // salvando os products no db utilizando os métodos do orm
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

    // consultando no db utilizando os métodos do repository
    const productRepository = new ProductRepository();
    const products = await productRepository.findAll();

    // comparando-se os dados
    expect(products.length).toBe(2);
    expect(products[0].Id.id).toBe("1");
    expect(products[0].name).toBe("Product 1");
    expect(products[0].description).toBe("Description 1");
    expect(products[0].salesPrice).toBe(100);
    expect(products[1].Id.id).toBe("2");
    expect(products[1].name).toBe("Product 2");
    expect(products[1].description).toBe("Description 2");
    expect(products[1].salesPrice).toBe(200);
  });

  // se for executada uma busca por id, os atributos devem ser iguais aos do objeto de origem
  it("should find a product", async () => {
    // salvando o product no db utilizando os métodos do orm
    await ProductModel.create({
      id: "1",
      name: "Product 1",
      description: "Description 1",
      salesPrice: 100,
    });

    // consultando no db utilizando os métodos do repository
    const productRepository = new ProductRepository();
    const product = await productRepository.find("1");

    // comparando-se os dados
    expect(product.Id.id).toBe("1");
    expect(product.name).toBe("Product 1");
    expect(product.description).toBe("Description 1");
    expect(product.salesPrice).toBe(100);
  });
});
