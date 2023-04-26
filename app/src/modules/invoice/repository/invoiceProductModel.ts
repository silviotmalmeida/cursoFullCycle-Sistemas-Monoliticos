// dependências
import {
  Table,
  Model,
  PrimaryKey,
  Column,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import InvoiceModel from "./invoiceModel";

// definindo as características da tabela no db
@Table({
  tableName: "invoice_products",
  timestamps: false,
})

// classe de modelo do orm sequelize
export default class InvoiceProductModel extends Model {
  // definindo as colunas e restrições da tabela
  @PrimaryKey
  @Column
  declare id: string;

  // relacionamento com invoice
  @ForeignKey(() => InvoiceModel)
  @Column({ allowNull: false })
  declare invoice_id: string;

  @BelongsTo(() => InvoiceModel)
  declare invoice: InvoiceModel;

  @Column({ allowNull: false })
  declare name: string;

  @Column({ allowNull: false })
  declare price: number;
}
