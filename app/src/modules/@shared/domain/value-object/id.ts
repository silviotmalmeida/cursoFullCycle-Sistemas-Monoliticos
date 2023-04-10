// dependências
import ValueObject from "./valueObjectInterface";
import { v4 as uuidv4 } from "uuid";

// classe que representa o objeto de valor id
export default class Id implements ValueObject {
  // atibutos
  private _id: string;

  // construtor
  constructor(id?: string) {
    this._id = id || uuidv4();
  }

  // getters e setters necessários
  get id(): string {
    return this._id;
  }
}
