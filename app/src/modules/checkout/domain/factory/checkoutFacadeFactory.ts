// dependências
import ClientAdmFacadeFactory from "../../../client-adm/factory/clientAdmFacadeFactory";
import InvoiceFacadeFactory from "../../../invoice/factory/invoiceFacadeFactory";
import PaymentFacadeFactory from "../../../payment/factory/paymentFacadeFactory";
import ProductAdmFacadeFactory from "../../../product-adm/factory/productAdmfacadeFactory";
import StoreCatalogFacadeFactory from "../../../store-catalog/factory/storeCatalogFacadeFactory";
import CheckoutRepository from "../../repository/checkoutRepository";
import PlaceOrderUseCase from "../../usecase/place-order/placeOrderUseCase";
import CheckoutFacade from "../facade/checkoutFacade";

// classe de fábrica da facade
// como trata-se de um objeto complexo, além de não ser interessante expor para o mundo externo a forma de criação da facade,
// foi criada a factory
export default class CheckoutFacadeFactory {
  static create() {
    const clientFacade = ClientAdmFacadeFactory.create();
    const productFacade = ProductAdmFacadeFactory.create();
    const catalogFacade = StoreCatalogFacadeFactory.create();
    const invoiceFacade = InvoiceFacadeFactory.create();
    const paymentFacade = PaymentFacadeFactory.create();
    const checkoutRepository = new CheckoutRepository();
    const placeOrderUsecase = new PlaceOrderUseCase(
      clientFacade,
      productFacade,
      catalogFacade,
      invoiceFacade,
      paymentFacade,
      checkoutRepository
    );

    const facade = new CheckoutFacade({
      placeOrder: placeOrderUsecase,
    });

    return facade;
  }
}
