// dependências
import InvoiceFacade from "../facade/invoiceFacade";
import InvoiceRepository from "../repository/invoiceRepository";
import FindInvoiceUseCase from "../usecase/find-invoice/findInvoiceUseCase";
import GenerateInvoiceUseCase from "../usecase/generate-invoice/generateInvoiceUseCase";

// classe de fábrica da facade
// como trata-se de um objeto complexo, além de não ser interessante expor para o mundo externo a forma de criação da facade,
// foi criada a factory
export default class InvoiceFacadeFactory {
  static create() {
    const repository = new InvoiceRepository();
    const findUsecase = new FindInvoiceUseCase(repository);
    const generateUsecase = new GenerateInvoiceUseCase(repository);
    const facade = new InvoiceFacade({
      generateUsecase: generateUsecase,
      findUsecase: findUsecase,
    });

    return facade;
  }
}
