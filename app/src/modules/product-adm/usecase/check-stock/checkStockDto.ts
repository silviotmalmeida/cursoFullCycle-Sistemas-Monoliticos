// padrão de propriedades a serem passadas como input no caso de uso
export interface CheckStockInputDto {
  productId: string;
}

// padrão de propriedades a serem recebidas como output no caso de uso
export interface CheckStockOutputDto {
  productId: string;
  stock: number;
}
