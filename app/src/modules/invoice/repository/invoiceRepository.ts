// dependências
import Address from "../../@shared/domain/value-object/address";
import Id from "../../@shared/domain/value-object/id";
import Invoice from "../domain/invoice";
import Product from "../domain/product";
import InvoiceGateway from "../gateway/invoiceGateway";
import InvoiceModel from "./invoiceModel";
import ProductModel from "./invoiceProductModel";

// classe de repositório do orm, implementando a interface de gateway
export default class InvoiceRepository implements InvoiceGateway {
  async generate(invoice: Invoice): Promise<void> {
    // utiliza o método default do orm
    await InvoiceModel.create(
      {
        id: invoice.Id.id,
        name: invoice.name,
        document: invoice.document,
        street: invoice.Address.street,
        number: invoice.Address.number,
        complement: invoice.Address.complement,
        city: invoice.Address.city,
        state: invoice.Address.state,
        zipCode: invoice.Address.zipCode,
        items: invoice.items.map((item) => ({
          id: item.Id.id,
          name: item.name,
          price: item.price,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
        })),
        total: invoice.total(),
        createdAt: invoice.createdAt,
        updatedAt: invoice.updatedAt,
      },
      {
        // include do relacionamento HasMany, reponsável para criar os registros na tabela relacionada
        include: [{ model: ProductModel }],
      }
    );
  }

  // método de busca por id
  async find(id: string): Promise<Invoice> {
    // obtendo os dados do bd
    let invoiceModel;
    // tratamento de exceções
    try {
      // utiliza o método default do orm
      invoiceModel = await InvoiceModel.findOne({
        where: { id: id },
        include: ["items"],
        rejectOnEmpty: true,
      });

      // recriando as entidades do agregado, a partir dos dados do bd

      //// recriando os invoiceProduct do relacionamento
      const items = invoiceModel.items.map(
        // recriando as entidades do agregado, a partir dos dados do bd
        (item) => {
          const product = new Product({
            Id: new Id(item.id),
            name: item.name,
            price: item.price,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
          });
          return product;
        }
      );

      //// recriando o invoice
      const invoice = new Invoice({
        Id: new Id(invoiceModel.id),
        name: invoiceModel.name,
        document: invoiceModel.document,
        Address: new Address(
          invoiceModel.street,
          invoiceModel.number,
          invoiceModel.complement,
          invoiceModel.city,
          invoiceModel.state,
          invoiceModel.zipCode
        ),
        items: items,
        createdAt: invoiceModel.createdAt,
        updatedAt: invoiceModel.updatedAt,
      });

      return invoice;
    } catch (error) {
      // em caso de inexistência, lança uma exceção
      throw new Error("Invoice not found");
    }
  }
}
