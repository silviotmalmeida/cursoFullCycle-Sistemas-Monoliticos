// dependências
import Address from "../../../@shared/domain/value-object/address";
import Id from "../../../@shared/domain/value-object/id";
import Invoice from "../../domain/invoice";
import Product from "../../domain/product";
import FindInvoiceUseCase from "./findInvoiceUseCase";

// criando o address
const address = new Address(
  "Street 1",
  "123",
  "Complement 1",
  "City 1",
  "State 1",
  "Zip123"
);

// criando os products
const product1 = new Product({
  Id: new Id("p1"),
  name: "Product 1",
  price: 10.0,
});
const product2 = new Product({
  Id: new Id("p2"),
  name: "Product 2",
  price: 15.0,
});

// obtendo as propriedades para criação do invoice
const props = {
  Id: new Id("1"),
  name: "Client 1",
  document: "123456",
  Address: address,
  items: [product1, product2],
};
// criando o invoice
const invoice = new Invoice(props);

// configurando o mock do repository
const MockRepository = () => {
  return {
    generate: jest.fn(), // o método add não retorna nada
    find: jest.fn().mockReturnValue(Promise.resolve(invoice)), // o método find retorna o invoice criado
  };
};

// suíde de testes de unidade do caso de uso
describe("Find Invoice Usecase unit test", () => {
  // quando buscar um invoice, os dados devem estar coerentes com o BD
  it("should find a invoice", async () => {
    // criando o mock do repository
    const repository = MockRepository();
    // criando o caso de uso
    const usecase = new FindInvoiceUseCase(repository);

    // definindo o input do caso de uso
    const input = {
      id: "1",
    };

    // executando o caso de uso e recebendo o output
    const result = await usecase.execute(input);

    // verificando os dados
    expect(repository.find).toHaveBeenCalled();
    expect(result.id).toEqual(input.id);
    expect(result.name).toEqual(invoice.name);
    expect(result.document).toEqual(invoice.document);
    expect(result.address).toEqual(invoice.Address);
    expect(result.items[0].id).toEqual(invoice.items[0].Id.id);
    expect(result.items[0].name).toEqual(invoice.items[0].name);
    expect(result.items[0].price).toEqual(invoice.items[0].price);
    expect(result.items[1].id).toEqual(invoice.items[1].Id.id);
    expect(result.items[1].name).toEqual(invoice.items[1].name);
    expect(result.items[1].price).toEqual(invoice.items[1].price);
    expect(result.total).toEqual(invoice.total());
    expect(result.createdAt).toEqual(invoice.createdAt);
  });
});
