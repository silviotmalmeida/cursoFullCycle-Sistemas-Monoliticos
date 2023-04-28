// criação
//// definindo o formato do input dto
export interface GenerateInvoiceFacadeInputDto {
  id?: string;
  name: string;
  document: string;
  street: string;
  number: string;
  complement: string;
  city: string;
  state: string;
  zipCode: string;
  items: {
    id: string;
    name: string;
    price: number;
  }[];
}
////////////////////////////////////////////

// busca por id
//// definindo o formato do input dto
export interface FindInvoiceFacadeInputDto {
  id: string;
}

//// definindo o formato do output dto
export interface FindInvoiceFacadeOutputDto {
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
  updatedAt: Date;
}
////////////////////////////////////////////

// definindo a interface da facade a ser divulgada ao mundo externo
export default interface InvoiceFacadeInterface {
  generate(input: GenerateInvoiceFacadeInputDto): Promise<void>;
  find(input: FindInvoiceFacadeInputDto): Promise<FindInvoiceFacadeOutputDto>;
}
