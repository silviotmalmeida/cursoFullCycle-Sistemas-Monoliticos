// padrão de propriedades a serem recebidas como output no caso de uso
export interface FindAllProductsOutputDto {
  products: {
    id: string;
    name: string;
    description: string;
    salesPrice: number;
  }[];
}
