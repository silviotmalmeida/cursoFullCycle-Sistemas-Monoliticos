// dependÊncias
import ProductAdmFacade from "../facade/productAdmFacade";
import ProductRepository from "../repository/productRepository";
import AddProductUseCase from "../usecase/add-product/addProductUseCase";
import CheckStockUseCase from "../usecase/check-stock/checkStockUseCase";

// classe de fábrica da facade
// como é um objeto complexo, a factory auxilia na criação
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
