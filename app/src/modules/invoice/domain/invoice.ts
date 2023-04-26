// dependências
import AggregateRoot from "../../@shared/domain/entity/aggregateRootInterface";
import BaseEntity from "../../@shared/domain/entity/baseEntity";
import Address from "../../@shared/domain/value-object/address";
import Id from "../../@shared/domain/value-object/id";
import Product from "./product";

// padrão de propriedades a serem recebidas para criação de um objeto
type InvoiceProps = {
  Id?: Id;
  name: string;
  document: string;
  Address: Address;
  items: Product[];
  createdAt?: Date;
  updatedAt?: Date;
};

// classe invoice, estende BaseEntity e implementa AggregateRoot
export default class Invoice extends BaseEntity implements AggregateRoot {
  // atributos
  private _name: string;
  private _document: string;
  private _Address: Address;
  private _items: Product[];

  // construtor
  constructor(props: InvoiceProps) {
    super(props.Id, props.createdAt, props.updatedAt);
    this._name = props.name;
    this._document = props.document;
    this._Address = props.Address;
    this._items = props.items;
  }

  // método para cálculo do preço total do invoice
  total(): number {
    return this._items.reduce((acc, item) => acc + item.price, 0);
  }

  // getters e setters necessários
  get name(): string {
    return this._name;
  }

  get document(): string {
    return this._document;
  }

  get Address(): Address {
    return this._Address;
  }

  get items(): Product[] {
    return this._items;
  }
}
