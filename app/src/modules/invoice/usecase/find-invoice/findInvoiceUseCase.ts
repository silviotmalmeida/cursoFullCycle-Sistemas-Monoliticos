// dependências
import UseCaseInterface from "../../../@shared/usecase/useCaseInterface";
import InvoiceGateway from "../../gateway/invoiceGateway";
import { FindInvoiceInputDTO, FindInvoiceOutputDTO } from "./findInvoiceDto";

// classe que define o caso de uso
export default class FindInvoiceUseCase implements UseCaseInterface {
  // injetando o repository
  private _invoiceRepository: InvoiceGateway;

  // construtor
  constructor(invoiceRepository: InvoiceGateway) {
    this._invoiceRepository = invoiceRepository;
  }

  // método de execução
  async execute(input: FindInvoiceInputDTO): Promise<FindInvoiceOutputDTO> {
    // buscando no BD utilizando o repository a partir do input
    const invoice = await this._invoiceRepository.find(input.id);

    // retornando o output conforme padrão do dto
    return {
      id: invoice.Id.id,
      name: invoice.name,
      document: invoice.document,
      address: invoice.Address,
      items: invoice.items.map((product) => ({
        id: product.Id.id,
        name: product.name,
        price: product.price,
      })),
      total: invoice.total(),
      createdAt: invoice.createdAt,
    };
  }
}
