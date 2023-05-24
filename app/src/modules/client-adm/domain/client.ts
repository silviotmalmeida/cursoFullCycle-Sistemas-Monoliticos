// dependências
import AggregateRoot from "../../@shared/domain/entity/aggregateRootInterface";
import BaseEntity from "../../@shared/domain/entity/baseEntity";
import Id from "../../@shared/domain/value-object/id";

// padrão de propriedades a serem recebidas para criação de um objeto
type ClientProps = {
  Id?: Id;
  name: string;
  document: string;
  email: string;
  street: string;
  number: string;
  complement: string;
  city: string;
  state: string;
  zipCode: string;
  createdAt?: Date;
  updatedAt?: Date;
};

// classe client, estende BaseEntity e implementa AggregateRoot
export default class Client extends BaseEntity implements AggregateRoot {
  // atributos
  private _name: string;
  private _document: string;
  private _email: string;
  private _street: string;
  private _number: string;
  private _complement: string;
  private _city: string;
  private _state: string;
  private _zipCode: string;

  // construtor
  constructor(props: ClientProps) {
    super(props.Id, props.createdAt, props.updatedAt);
    this._name = props.name;
    this._document = props.document;
    this._email = props.email;
    this._street = props.street;
    this._number = props.number;
    this._complement = props.complement;
    this._city = props.city;
    this._state = props.state;
    this._zipCode = props.zipCode;

    // autovalidação de consistência
    this.validate();
  }

  // getters e setters necessários
  get name(): string {
    return this._name;
  }

  get document(): string {
    return this._document;
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

  // método de autovalidação de consistência
  validate(): boolean {
    if (this._name.length === 0) {
      throw new Error("Name is required");
    }
    if (this._document.length === 0) {
      throw new Error("Document is required");
    }
    if (this._email.length === 0) {
      throw new Error("Email is required");
    }
    if (this._street.length === 0) {
      throw new Error("Street is required");
    }
    if (this._number.length === 0) {
      throw new Error("Number is required");
    }
    if (this._city.length === 0) {
      throw new Error("City is required");
    }
    if (this._state.length === 0) {
      throw new Error("State is required");
    }
    if (this._zipCode.length === 0) {
      throw new Error("ZipCode is required");
    }

    return true;
  }
}
