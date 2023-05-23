// padrão de propriedades a serem passadas como input no caso de uso
export interface AddClientInputDto {
  id?: string;
  name: string;
  document: string;
  email: string;
  street: string;
  number: string;
  complement: string;
  city: string;
  state: string;
  zipCode: string;
}

// padrão de propriedades a serem recebidas como output no caso de uso
export interface AddClientOutputDto {
  id: string;
  name: string;
  document: string;
  email: string;
  street: string;
  number: string;
  complement: string;
  city: string;
  state: string;
  zipCode: string;
  createdAt: Date;
  updatedAt: Date;
}
