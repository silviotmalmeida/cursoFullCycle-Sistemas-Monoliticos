// criação
//// definindo o formato do input dto
export interface AddClientFacadeInputDto {
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
////////////////////////////////////////////

// busca por id
//// definindo o formato do input dto
export interface FindClientFacadeInputDto {
  id: string;
}

//// definindo o formato do output dto
export interface FindClientFacadeOutputDto {
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
////////////////////////////////////////////

// definindo a interface da facade a ser divulgada ao mundo externo
export default interface ClientAdmFacadeInterface {
  add(input: AddClientFacadeInputDto): Promise<void>;
  find(input: FindClientFacadeInputDto): Promise<FindClientFacadeOutputDto>;
}
