// dependências
import { Column, Model, PrimaryKey, Table } from "sequelize-typescript";

// definindo as características da tabela no db
@Table({
  tableName: "transactions",
  timestamps: false,
})

// classe de modelo do orm sequelize
export default class TransactionModel extends Model {
  // definindo as colunas e restrições da tabela
  @PrimaryKey
  @Column({ allowNull: false })
  id: string;

  @Column({ allowNull: false, field: "order_id" })
  orderId: string;

  @Column({ allowNull: false })
  amount: number;

  @Column({ allowNull: false })
  status: string;

  @Column({ allowNull: false, field: "created_at" })
  createdAt: Date;

  @Column({ allowNull: false, field: "updated_at" })
  updatedAt: Date;
}
