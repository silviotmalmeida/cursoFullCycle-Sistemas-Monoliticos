// dependências
import Id from "../../@shared/domain/value-object/id";
import Product from "../domain/product";
import ProductGateway from "../gateway/productGateway";
import ProductModel from "./catalogProductModel";

// classe de repositório do orm, implementando a interface de gateway
export default class ProductRepository implements ProductGateway {
  // método de busca
  async findAll(): Promise<Product[]> {
    // obtendo os dados do bd
    const products = await ProductModel.findAll();

    // recriando a lista de products
    return products.map(
      (product) =>
        new Product({
          Id: new Id(product.id),
          name: product.name,
          description: product.description,
          salesPrice: product.salesPrice,
        })
    );
  }

  // método de busca por id
  async find(id: string): Promise<Product> {
    // obtendo os dados do bd
    const product = await ProductModel.findOne({
      where: {
        id: id,
      },
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
      salesPrice: product.salesPrice,
    });
  }
}
