// criação
//// definindo o formato do input dto
export interface PaymentFacadeInputDto {
  orderId: string;
  amount: number;
}

//// definindo o formato do output dto
export interface PaymentFacadeOutputDto {
  transactionId: string;
  orderId: string;
  amount: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}
////////////////////////////////////////////

// definindo a interface da facade a ser divulgada ao mundo externo
export default interface PaymentFacadeInterface {
  process(input: PaymentFacadeInputDto): Promise<PaymentFacadeOutputDto>;
}
