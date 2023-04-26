// dependências
import Invoice from "../domain/invoice";

// gateway que define os métodos disponíveis para comunicação com o mundo externo
// os repository deverão implementar o gateway
export default interface InvoiceGateway {
  generate(invoice: Invoice): Promise<void>;
  find(id: string): Promise<Invoice>;
}
