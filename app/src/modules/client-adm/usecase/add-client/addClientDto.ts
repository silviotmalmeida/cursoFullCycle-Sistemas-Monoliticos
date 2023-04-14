// padrão de propriedades a serem passadas como input no caso de uso
export interface AddClientInputDto {
  id?: string;
  name: string;
  email: string;
  address: string;
}

// padrão de propriedades a serem recebidas como output no caso de uso
export interface AddClientOutputDto {
  id: string;
  name: string;
  email: string;
  address: string;
  createdAt: Date;
  updatedAt: Date;
}
