// dependências
import AggregateRoot from "../../@shared/domain/entity/aggregateRootInterface";
import BaseEntity from "../../@shared/domain/entity/baseEntity";
import Id from "../../@shared/domain/value-object/id";

// padrão de propriedades a serem recebidas para criação de um objeto
type ClientProps = {
  Id?: Id;
  name: string;
  email: string;
  street: string;
  number: string;
  complement: string;
  city: string;
  state: string;
  zipCode: string;
};

// classe client, estende BaseEntity e implementa AggregateRoot
export default class Client extends BaseEntity implements AggregateRoot {
  // atributos
  private _name: string;
  private _email: string;
  private _street: string;
  private _number: string;
  private _complement: string;
  private _city: string;
  private _state: string;
  private _zipCode: string;

  // construtor
  constructor(props: ClientProps) {
    super(props.Id);
    this._name = props.name;
    this._email = props.email;
    this._street = props.street;
    this._number = props.number;
    this._complement = props.complement;
    this._city = props.city;
    this._state = props.state;
    this._zipCode = props.zipCode;
  }

  // getters e setters necessários
  get name(): string {
    return this._name;
  }

  get email(): string {
    return this._email;
  }

  get street(): string {
    return this._street;
  }

  get number(): string {
    return this._number;
  }

  get complement(): string {
    return this._complement;
  }

  get city(): string {
    return this._city;
  }

  get state(): string {
    return this._state;
  }

  get zipCode(): string {
    return this._zipCode;
  }
}
