// dependências
import AggregateRoot from "../../@shared/domain/entity/aggregateRootInterface";
import BaseEntity from "../../@shared/domain/entity/baseEntity";
import Id from "../../@shared/domain/value-object/id";

// padrão de propriedades a serem recebidas para criação de um objeto
type ProductProps = {
  Id: Id;
  name: string;
  description: string;
  salesPrice: number;
};

// classe product, estende BaseEntity e implementa AggregateRoot
export default class Product extends BaseEntity implements AggregateRoot {
  // atributos
  private _name: string;
  private _description: string;
  private _salesPrice: number;

  // construtor
  constructor(props: ProductProps) {
    super(props.Id);
    this._name = props.name;
    this._description = props.description;
    this._salesPrice = props.salesPrice;
  }

  // getters e setters necessários
  get name(): string {
    return this._name;
  }

  get description(): string {
    return this._description;
  }

  get salesPrice(): number {
    return this._salesPrice;
  }
}
