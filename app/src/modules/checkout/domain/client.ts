// dependências
import AggregateRoot from "../../@shared/domain/entity/aggregateRootInterface";
import BaseEntity from "../../@shared/domain/entity/baseEntity";
import Id from "../../@shared/domain/value-object/id";

// padrão de propriedades a serem recebidas para criação de um objeto
type ClientProps = {
  Id?: Id;
  name: string;
  email: string;
  address: string;
};

// classe client, estende BaseEntity e implementa AggregateRoot
export default class Client extends BaseEntity implements AggregateRoot {
  // atributos
  private _name: string;
  private _email: string;
  private _address: string;

  // construtor
  constructor(props: ClientProps) {
    super(props.Id);
    this._name = props.name;
    this._email = props.email;
    this._address = props.address;
  }

  // getters e setters necessários
  get name(): string {
    return this._name;
  }

  get email(): string {
    return this._email;
  }

  get address(): string {
    return this._address;
  }
}
