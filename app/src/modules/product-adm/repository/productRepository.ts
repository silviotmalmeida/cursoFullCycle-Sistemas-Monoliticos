// dependências
import Id from "../../@shared/domain/value-object/id";
import Product from "../domain/product";
import ProductGateway from "../gateway/productGateway";
import { ProductModel } from "./productModel";

// classe de repositório do orm, implementando a interface de gateway
export default class ProductRepository implements ProductGateway {
  // método de criação
  async add(product: Product): Promise<void> {
    // utiliza o método default do orm
    await ProductModel.create({
      id: product.Id.id,
      name: product.name,
      description: product.description,
      purchasePrice: product.purchasePrice,
      stock: product.stock,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
  // método de busca por id
  async find(id: string): Promise<Product> {
    // obtendo os dados do bd
    const product = await ProductModel.findOne({
      where: { id },
    });

    // em caso de inexistência, lança uma exceção
    if (!product) {
      throw new Error(`Product with id ${id} not found`);
    }

    // recriando o product
    return new Product({
      Id: new Id(product.id),
      name: product.name,
      description: product.description,
      purchasePrice: product.purchasePrice,
      stock: product.stock,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    });
  }
}
