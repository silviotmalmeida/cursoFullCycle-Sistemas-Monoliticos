// dependências
import {
  Table,
  Model,
  PrimaryKey,
  Column,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import OrderModel from "./orderModel";

// definindo as características da tabela no db
@Table({
  tableName: "checkoutProducts",
  timestamps: false,
})

// classe de modelo do orm sequelize
export default class CheckoutProductModel extends Model {
  // definindo as colunas e restrições da tabela
  @PrimaryKey
  @Column
  declare id: string;

  // relacionamento com order
  @ForeignKey(() => OrderModel)
  @Column({ allowNull: false })
  declare order_id: string;

  @BelongsTo(() => OrderModel)
  declare order: OrderModel;

  @Column({ allowNull: false })
  declare name: string;

  @Column({ allowNull: false })
  declare description: string;

  @Column({ allowNull: false })
  declare salesPrice: number;
}
