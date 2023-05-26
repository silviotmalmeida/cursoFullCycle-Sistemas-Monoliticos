// dependências
import { Table, Model, PrimaryKey, Column, ForeignKey, BelongsTo } from "sequelize-typescript";
import OrderModel from "./orderModel";

// definindo as características da tabela no db
@Table({
  tableName: "checkoutClients",
  timestamps: false,
})

// classe de modelo do orm sequelize
export default class CheckoutClientModel extends Model {
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
  declare email: string;

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
}
