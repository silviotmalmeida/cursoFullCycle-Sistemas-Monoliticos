// padrão de propriedades a serem passadas como input no caso de uso
export interface PlaceOrderInputDto {
  id?: string;
  clientId: string;
  products: {
    productId: string;
  }[];
}

// padrão de propriedades a serem recebidas como output no caso de uso
export interface PlaceOrderOutputDto {
  id: string;
  invoiceId: string;
  status: string;
  total: number;
  products: {
    productId: string;
  }[];
}
