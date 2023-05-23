// dependências
import { Column, Model, PrimaryKey, Table } from "sequelize-typescript";

// definindo as características da tabela no db
@Table({
  tableName: "clients",
  timestamps: false,
})

// classe de modelo do orm sequelize
export class ClientModel extends Model {
  // definindo as colunas e restrições da tabela
  @PrimaryKey
  @Column({ allowNull: false })
  id: string;

  @Column({ allowNull: false })
  name: string;

  @Column({ allowNull: false })
  document: string;

  @Column({ allowNull: false })
  email: string;

  @Column({ allowNull: false })
  street: string;

  @Column({ allowNull: false })
  number: string;

  @Column({ allowNull: false })
  complement: string;

  @Column({ allowNull: false })
  city: string;

  @Column({ allowNull: false })
  state: string;

  @Column({ allowNull: false })
  zipCode: string;

  @Column({ allowNull: false })
  createdAt: Date;

  @Column({ allowNull: false })
  updatedAt: Date;
}
