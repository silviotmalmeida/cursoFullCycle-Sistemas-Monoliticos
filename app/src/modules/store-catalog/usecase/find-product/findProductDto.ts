// padrão de propriedades a serem passadas como input no caso de uso
export interface FindProductInputDto {
  id: string;
}

// padrão de propriedades a serem recebidas como output no caso de uso
export interface FindProductOutputDto {
  id: string;
  name: string;
  description: string;
  salesPrice: number;
}
