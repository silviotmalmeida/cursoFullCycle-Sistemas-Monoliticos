// dependências
import AggregateRoot from "../../@shared/domain/entity/aggregateRootInterface";
import BaseEntity from "../../@shared/domain/entity/baseEntity";
import Id from "../../@shared/domain/value-object/id";

// padrão de propriedades a serem recebidas para criação de um objeto
type TransactionProps = {
  Id?: Id;
  amount: number;
  orderId: string;
  status?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

// classe transaction, estende BaseEntity e implementa AggregateRoot
export default class Transaction extends BaseEntity implements AggregateRoot {
  // atributos
  private _amount: number;
  private _orderId: string;
  private _status: string;

  // construtor
  constructor(props: TransactionProps) {
    super(props.Id, props.createdAt, props.updatedAt);
    this._amount = props.amount;
    this._orderId = props.orderId;
    this._status = props.status || "pending";

    // autovalidação
    this.validate();
  }

  // método de autovalidação
  validate(): void {
    if (this._amount <= 0) {
      throw new Error("Amount must be greater than 0");
    }
  }

  // método de aprovação
  approve(): void {
    this._status = "approved";
  }

  // método de reprovação
  decline(): void {
    this._status = "declined";
  }

  // método de processamento
  process(): void {
    if (this._amount >= 100) {
      this.approve();
    } else {
      this.decline();
    }
  }

  // getters e setters necessários
  get amount(): number {
    return this._amount;
  }

  get orderId(): string {
    return this._orderId;
  }

  get status(): string {
    return this._status;
  }
}
