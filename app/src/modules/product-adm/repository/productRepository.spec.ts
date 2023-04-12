// dependências
import { Sequelize } from "sequelize-typescript";
import Id from "../../@shared/domain/value-object/id";
import Product from "../domain/product";
import { ProductModel } from "./productModel";
import ProductRepository from "./productRepository";

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

  // ações que ocorrem após de cada teste
  afterEach(async () => {
    // encerrando o db
    await sequelize.close();
  });

  // se um registro for armazenado no db, seus atributos devem ser iguais aos do objeto de origem
  it("should create a product", async () => {
    // propriedades do product
    const productProps = {
      Id: new Id("1"),
      name: "Product 1",
      description: "Product 1 description",
      purchasePrice: 100,
      stock: 10,
    };
    // criando o product
    const product = new Product(productProps);
    // salvando o product no db utilizando os métodos do repository
    const productRepository = new ProductRepository();
    await productRepository.add(product);

    // consultando no db utilizando os métodos do orm
    const productDb = await ProductModel.findOne({
      where: { id: productProps.Id.id },
    });

    // comparando-se os dados
    expect(productProps.Id.id).toEqual(productDb.id);
    expect(productProps.name).toEqual(productDb.name);
    expect(productProps.description).toEqual(productDb.description);
    expect(productProps.purchasePrice).toEqual(productDb.purchasePrice);
    expect(productProps.stock).toEqual(productDb.stock);
  });

  // se for executada uma busca por id, os atributos devem ser iguais aos do objeto de origem
  it("should find a product", async () => {
    // salvando o product no db utilizando os métodos do orm
    ProductModel.create({
      id: "1",
      name: "Product 1",
      description: "Product 1 description",
      purchasePrice: 100,
      stock: 10,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // consultando no db utilizando os métodos do repository
    const productRepository = new ProductRepository();
    const product = await productRepository.find("1");

    // comparando-se os dados
    expect(product.Id.id).toEqual("1");
    expect(product.name).toEqual("Product 1");
    expect(product.description).toEqual("Product 1 description");
    expect(product.purchasePrice).toEqual(100);
    expect(product.stock).toEqual(10);
  });
});
