// dependências
import StoreCatalogFacade from "../facade/storeCatalogFacade";
import ProductRepository from "../repository/productRepository";
import FindAllProductsUsecase from "../usecase/find-all-products/findAllProductsUseCase";
import FindProductUseCase from "../usecase/find-product/findProductUseCase";

// classe de fábrica da facade
// como trata-se de um objeto complexo, além de não ser interessante expor para o mundo externo a forma de criação da facade,
// foi criada a factory
export default class StoreCatalogFacadeFactory {
  static create(): StoreCatalogFacade {
    const productRepository = new ProductRepository();
    const findUseCase = new FindProductUseCase(productRepository);
    const findAllUseCase = new FindAllProductsUsecase(productRepository);

    const facade = new StoreCatalogFacade({
      findUseCase: findUseCase,
      findAllUseCase: findAllUseCase,
    });
    return facade;
  }
}
