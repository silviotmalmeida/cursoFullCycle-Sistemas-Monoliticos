// criação
//// definindo o formato do input dto
export interface AddProductFacadeInputDto {
  id?: string;
  name: string;
  description: string;
  purchasePrice: number;
  stock: number;
}
//// definindo o formato do output dto
export interface AddProductFacadeOutputDto {
  id: string;
  name: string;
  description: string;
  purchasePrice: number;
  stock: number;
  createdAt: Date;
  updatedAt: Date;
}
////////////////////////////////////////////

// busca de estoque
//// definindo o formato do input dto
export interface CheckStockFacadeInputDto {
  productId: string;
}
//// definindo o formato do output dto
export interface CheckStockFacadeOutputDto {
  productId: string;
  stock: number;
}
////////////////////////////////////////////

// definindo a interface da facade a ser divulgada ao mundo externo
export default interface ProductAdmFacadeInterface {
  addProduct(
    input: AddProductFacadeInputDto
  ): Promise<AddProductFacadeOutputDto>;
  checkStock(
    input: CheckStockFacadeInputDto
  ): Promise<CheckStockFacadeOutputDto>;
}
