// padrão de propriedades a serem passadas como input no caso de uso
export interface FindClientInputDto {
  id: string;
}

// padrão de propriedades a serem recebidas como output no caso de uso
export interface FindClientOutputDto {
  id: string;
  name: string;
  email: string;
  address: string;
  createdAt: Date;
  updatedAt: Date;
}