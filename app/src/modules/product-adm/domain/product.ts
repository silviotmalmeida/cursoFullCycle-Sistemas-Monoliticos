// dependências
import BaseEntity from "../../@shared/domain/entity/baseEntity";
import AggregateRoot from "../../@shared/domain/entity/aggregateRootInterface";
import Id from "../../@shared/domain/value-object/id";

// padrão de propriedades a serem recebidas para criação de um objeto
type ProductProps = {
  id?: Id;
  name: string;
  description: string;
  purchasePrice: number;
  stock: number;
  createdAt?: Date;
  updatedAt?: Date;
};

// classe product, estende BaseEntity e implementa AggregateRoot
export default class Product extends BaseEntity implements AggregateRoot {
  // atributos
  private _name: string;
  private _description: string;
  private _purchasePrice: number;
  private _stock: number;

  // construtor
  constructor(props: ProductProps) {
    super(props.id);
    this._name = props.name;
    this._description = props.description;
    this._purchasePrice = props.purchasePrice;
    this._stock = props.stock;
  }

  // getters e setters necessários
  get name(): string {
    return this._name;
  }

  get description(): string {
    return this._description;
  }

  get purchasePrice(): number {
    return this._purchasePrice;
  }

  get stock(): number {
    return this._stock;
  }

  set name(name: string) {
    this._name = name;
  }

  set stock(stock: number) {
    this._stock = stock;
  }

  set description(description: string) {
    this._description = description;
  }

  set purchasePrice(purchasePrice: number) {
    this._purchasePrice = purchasePrice;
  }
}
