// dependências
import {
  Table,
  Model,
  PrimaryKey,
  Column,
  HasMany,
  ForeignKey,
  BelongsTo,
  HasOne,
} from "sequelize-typescript";
import CheckoutClientModel from "./checkoutClientModel";
import CheckoutProductModel from "./checkoutProductModel";

// definindo as características da tabela no db
@Table({
  tableName: "order",
  timestamps: false,
})

// classe de modelo do orm sequelize
export default class OrderModel extends Model {
  // definindo as colunas e restrições da tabela
  @PrimaryKey
  @Column
  declare id: string;

  // relacionamento com product, tem que ser realizado o include deste model no repository
  @HasOne(() => CheckoutClientModel, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
    hooks: true,
  })
  declare client: CheckoutClientModel[];

  // relacionamento com product, tem que ser realizado o include deste model no repository
  @HasMany(() => CheckoutProductModel, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
    hooks: true,
  })
  declare products: CheckoutProductModel[];

  @Column({ allowNull: false })
  declare status: string;

  @Column({ allowNull: false })
  declare createdAt: Date;

  @Column({ allowNull: false })
  declare updatedAt: Date;
}
