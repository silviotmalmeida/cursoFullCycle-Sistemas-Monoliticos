// dependências
import BaseEntity from "../../@shared/domain/entity/baseEntity";
import Id from "../../@shared/domain/value-object/id";

// padrão de propriedades a serem recebidas para criação de um objeto
type ProductProps = {
  Id?: Id;
  name: string;
  price: number;
  createdAt?: Date;
  updatedAt?: Date;
};

// classe product, estende BaseEntity
export default class Product extends BaseEntity {
  // atributos
  private _name: string;
  private _price: number;

  // construtor
  constructor(props: ProductProps) {
    super(props.Id, props.createdAt, props.updatedAt);
    this._name = props.name;
    this._price = props.price;
  }

  // getters e setters necessários
  get name(): string {
    return this._name;
  }

  get price(): number {
    return this._price;
  }
}
