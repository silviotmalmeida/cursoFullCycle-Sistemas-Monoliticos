// dependências
import Product from "../domain/product";

// gateway que define os métodos disponíveis para comunicação com o mundo externo
// os repository deverão implementar o gateway
export default interface ProductGateway {
  findAll(): Promise<Product[]>;
  find(id: string): Promise<Product>;
}
