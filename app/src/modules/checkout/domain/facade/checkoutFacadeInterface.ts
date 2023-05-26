// criação
//// definindo o formato do input dto
export interface PlaceOrderInputDto {
  id?: string;
  clientId: string;
  products: {
    productId: string;
  }[];
}

//// definindo o formato do output dto
export interface PlaceOrderOutputDto {
  id: string;
  invoiceId: string;
  status: string;
  total: number;
  products: {
    productId: string;
  }[];
}

// definindo a interface da facade a ser divulgada ao mundo externo
export default interface CheckoutFacadeInterface {
  placeOrder(input: PlaceOrderInputDto): Promise<PlaceOrderOutputDto>;
}
