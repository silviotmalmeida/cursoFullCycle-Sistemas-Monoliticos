// dependências
import Product from "../domain/product";

// gateway que define os métodos disponíveis para comunicação com o mundo externo
// os repository deverão implementar o gateway
export default interface ProductGateway {
  add(product: Product): Promise<void>;
  find(id: string): Promise<Product>;
}
