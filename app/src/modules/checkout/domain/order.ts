// dependências
import AggregateRoot from "../../@shared/domain/entity/aggregateRootInterface";
import BaseEntity from "../../@shared/domain/entity/baseEntity";
import Id from "../../@shared/domain/value-object/id";
import Client from "./client";
import Product from "./product";

// padrão de propriedades a serem recebidas para criação de um objeto
type OrderProps = {
  Id?: Id;
  Client: Client;
  Products: Product[];
  status?: string;
};

// classe order, estende BaseEntity e implementa AggregateRoot
export default class Order extends BaseEntity implements AggregateRoot {
  // atributos
  private _Client: Client;
  private _Products: Product[];
  private _status: string;

  // construtor
  constructor(props: OrderProps) {
    super(props.Id);
    this._Client = props.Client;
    this._Products = props.Products;
    this._status = props.status || "pending";
  }

  // método para alteração do status para approved
  approved(): void {
    this._status = "approved";
  }

  // método para cálculo do preço total do order
  total(): number {
    return this._Products.reduce((acc, item) => acc + item.salesPrice, 0);
  }

  // getters e setters necessários
  get Client(): Client {
    return this._Client;
  }

  get Products(): Product[] {
    return this._Products;
  }

  get status(): string {
    return this._status;
  }
}
