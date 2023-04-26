// padrão de propriedades a serem passadas como input no caso de uso
export interface FindInvoiceInputDTO {
  id: string;
}

// padrão de propriedades a serem recebidas como output no caso de uso
export interface FindInvoiceOutputDTO {
  id: string;
  name: string;
  document: string;
  address: {
    street: string;
    number: string;
    complement: string;
    city: string;
    state: string;
    zipCode: string;
  };
  items: {
    id: string;
    name: string;
    price: number;
  }[];
  total: number;
  createdAt: Date;
}