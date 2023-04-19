// padrão de propriedades a serem passadas como input no caso de uso
export interface ProcessPaymentInputDto {
  orderId: string;
  amount: number;
}

// padrão de propriedades a serem recebidas como output no caso de uso
export interface ProcessPaymentOutputDto {
  transactionId: string;
  orderId: string;
  amount: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}
