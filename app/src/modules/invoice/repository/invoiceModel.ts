// dependências
import {
  Table,
  Model,
  PrimaryKey,
  Column,
  HasMany,
} from "sequelize-typescript";
import InvoiceProductModel from "./invoiceProductModel";

// definindo as características da tabela no db
@Table({
  tableName: "invoices",
  timestamps: false,
})

// classe de modelo do orm sequelize
export default class InvoiceModel extends Model {
  // definindo as colunas e restrições da tabela
  @PrimaryKey
  @Column
  declare id: string;

  @Column({ allowNull: false })
  declare name: string;

  @Column({ allowNull: false })
  declare document: string;

  @Column({ allowNull: false })
  declare street: string;

  @Column({ allowNull: false })
  declare number: string;

  @Column({ allowNull: false })
  declare complement: string;

  @Column({ allowNull: false })
  declare city: string;

  @Column({ allowNull: false })
  declare state: string;

  @Column({ allowNull: false })
  declare zipCode: string;

  // relacionamento com invoiceItem, tem que ser realizado o include deste model no repository
  @HasMany(() => InvoiceProductModel, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
    hooks: true,
  })
  declare items: InvoiceProductModel[];

  @Column({ allowNull: false })
  declare total: number;

  @Column({ allowNull: false })
  createdAt: Date;

  @Column({ allowNull: false })
  updatedAt: Date;
}
