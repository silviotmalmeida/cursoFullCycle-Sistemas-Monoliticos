// dependências
import Address from "../../../@shared/domain/value-object/address";
import Id from "../../../@shared/domain/value-object/id";
import UseCaseInterface from "../../../@shared/usecase/useCaseInterface";
import Invoice from "../../domain/invoice";
import Product from "../../domain/product";
import InvoiceGateway from "../../gateway/invoiceGateway";
import {
  GenerateInvoiceInputDto,
  GenerateInvoiceOutputDto,
} from "./generateInvoiceDto";

// classe que define o caso de uso
export default class GenerateInvoiceUseCase implements UseCaseInterface {
  // injetando o repository
  private _invoiceRepository: InvoiceGateway;

  // construtor
  constructor(invoiceRepository: InvoiceGateway) {
    this._invoiceRepository = invoiceRepository;
  }

  // método de execução
  async execute(
    input: GenerateInvoiceInputDto
  ): Promise<GenerateInvoiceOutputDto> {
    // criando o address a partir do input
    const address = new Address(
      input.street,
      input.number,
      input.complement,
      input.city,
      input.state,
      input.zipCode
    );

    // criando os products a partir do input
    const items = input.items.map((item) => {
      return new Product({
        Id: new Id(item.id) || new Id(),
        name: item.name,
        price: item.price,
      });
    });

    // obtendo as propriedades para criação do invoice a partir do input
    const props = {
      Id: new Id(input.id),
      name: input.name,
      document: input.document,
      Address: address,
      items: items,
    };

    // criando o invoice
    const invoice = new Invoice(props);

    // adicionando no BD utilizando o repository
    await this._invoiceRepository.generate(invoice);

    // retornando o output conforme padrão do dto
    return {
      id: invoice.Id.id,
      name: invoice.name,
      document: invoice.document,
      street: invoice.Address.street,
      number: invoice.Address.number,
      complement: invoice.Address.complement,
      city: invoice.Address.city,
      state: invoice.Address.state,
      zipCode: invoice.Address.zipCode,
      items: invoice.items.map((product) => ({
        id: product.Id.id,
        name: product.name,
        price: product.price,
      })),
      total: invoice.total(),
    };
  }
}
