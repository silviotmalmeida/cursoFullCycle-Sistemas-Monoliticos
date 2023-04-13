// busca por id
//// definindo o formato do input dto
export interface FindStoreCatalogFacadeInputDto {
  id: string;
}

//// definindo o formato do output dto
export interface FindStoreCatalogFacadeOutputDto {
  id: string;
  name: string;
  description: string;
  salesPrice: number;
}
////////////////////////////////////////////

// busca de estoque
//// definindo o formato do output dto
export interface FindAllStoreCatalogFacadeOutputDto {
  products: {
    id: string;
    name: string;
    description: string;
    salesPrice: number;
  }[];
}
////////////////////////////////////////////

// definindo a interface da facade a ser divulgada ao mundo externo
export default interface StoreCatalogFacadeInterface {
  find(
    id: FindStoreCatalogFacadeInputDto
  ): Promise<FindStoreCatalogFacadeOutputDto>;
  findAll(): Promise<FindAllStoreCatalogFacadeOutputDto>;
}
