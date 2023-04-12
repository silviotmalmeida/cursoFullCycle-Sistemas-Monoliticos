// dependências
import Id from "../value-object/id";

// superclasse de todas as entidades, com atributos e métodos gerais
export default class BaseEntity {
  // atributos
  private _Id: Id;
  private _createdAt: Date;
  private _updatedAt: Date;

  // construtor
  constructor(id?: Id, createdAt?: Date, updatedAt?: Date) {
    this._Id = id || new Id();
    this._createdAt = createdAt || new Date();
    this._updatedAt = updatedAt || new Date();
  }

  // getters e setters necessários
  get Id(): Id {
    return this._Id;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  set updatedAt(updatedAt: Date) {
    this._updatedAt = updatedAt;
  }
}
