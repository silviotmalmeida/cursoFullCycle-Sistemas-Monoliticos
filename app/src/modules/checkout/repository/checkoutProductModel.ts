// dependências
import { Table, Model, PrimaryKey, Column } from "sequelize-typescript";

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

  @Column({ allowNull: false })
  declare name: string;

  @Column({ allowNull: false })
  declare description: string;

  @Column({ allowNull: false })
  declare salesPrice: number;

  @Column({ allowNull: false })
  declare createdAt: Date;

  @Column({ allowNull: false })
  declare updatedAt: Date;
}
