import { injectable, /* inject, */ BindingScope } from '@loopback/core';
import { repository } from '@loopback/repository';
import { ProductRepository } from '../repositories';

@injectable({ scope: BindingScope.TRANSIENT })
export class SeedService {
  constructor(
    @repository(ProductRepository) private productRepo: ProductRepository,
  ) {}

  async seedDatabase(): Promise<void> {
    const sampleProducts = [
      { name: 'Product 1', price: 10, quantity: 100 },
      { name: 'Product 2', price: 15, quantity: 75 },
      { name: 'Product 3', price: 20, quantity: 50 },
      { name: 'Product 4', price: 25, quantity: 25 },
      { name: 'Product 5', price: 30, quantity: 10 },
    ];

    for (const productData of sampleProducts) {
      await this.productRepo.create(productData);
    }
  }
}
