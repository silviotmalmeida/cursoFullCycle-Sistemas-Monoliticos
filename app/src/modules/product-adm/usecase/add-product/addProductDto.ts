// padrão de propriedades a serem passadas como input no caso de uso
export interface AddProductInputDto {
  id?: string;
  name: string;
  description: string;
  purchasePrice: number;
  stock: number;
}

// padrão de propriedades a serem recebidas como output no caso de uso
export interface AddProductOutputDto {
  id: string;
  name: string;
  description: string;
  purchasePrice: number;
  stock: number;
  createdAt: Date;
  updatedAt: Date;
}
