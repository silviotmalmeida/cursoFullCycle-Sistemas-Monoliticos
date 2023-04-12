// dependÊncias
import ProductAdmFacade from "../facade/productAdmFacade";
import ProductRepository from "../repository/productRepository";
import AddProductUseCase from "../usecase/add-product/addProductUseCase";
import CheckStockUseCase from "../usecase/check-stock/checkStockUseCase";

// classe de fábrica da facade
// como trata-se de um objeto complexo, além de não ser interessante expor para o mundo externo a forma de criação da facade,
// foi criada a factory
export default class ProductAdmFacadeFactory {
  static create() {
    const productRepository = new ProductRepository();
    const addProductUseCase = new AddProductUseCase(productRepository);
    const checkStockUseCase = new CheckStockUseCase(productRepository);
    const productFacade = new ProductAdmFacade({
      addUseCase: addProductUseCase,
      stockUseCase: checkStockUseCase,
    });

    return productFacade;
  }
}
