// dependências
import { Column, Model, PrimaryKey, Table } from "sequelize-typescript";

// definindo as características da tabela no db
@Table({
  tableName: "products",
  timestamps: false,
})

// classe de modelo do orm sequelize
export default class ProductModel extends Model {
  // definindo as colunas e restrições da tabela
  @PrimaryKey
  @Column({ allowNull: false })
  id: string;

  @Column({ allowNull: false })
  name: string;

  @Column({ allowNull: false })
  description: string;

  @Column({ allowNull: false })
  salesPrice: number;
}
