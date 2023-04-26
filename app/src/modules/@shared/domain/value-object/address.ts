import ValueObject from "./valueObjectInterface";

// classe que respresenta o objeto de valor address
export default class Address implements ValueObject {
  // definindo os atributos
  private _street: string;
  private _number: string;
  private _complement: string;
  private _city: string;
  private _state: string;
  private _zipCode: string;

  // definindo o construtor com os atributos mínimos necessários
  constructor(
    street: string,
    number: string,
    complement: string,
    city: string,
    state: string,
    zipCode: string
  ) {
    this._street = street;
    this._number = number;
    this._complement = complement;
    this._city = city;
    this._state = state;
    this._zipCode = zipCode;
  }

  // getters (somente necessários)
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

  // método para impressão da classe
  toString() {
    return `${this._street}, ${this._number}, ${this._complement}, ${this._city}, ${this._state}, ${this._zipCode}`;
  }
}
