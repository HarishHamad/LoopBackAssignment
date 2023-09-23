import { inject } from '@loopback/context';
import { get, post, requestBody, response,Response, RestBindings } from '@loopback/rest';
import { Product } from '../models';
import { ProductRepository } from '../repositories';

export class ProductController {
  constructor(
    @inject('repositories.ProductRepository') private productRepository: ProductRepository,
    @inject(RestBindings.Http.RESPONSE) private response: Response,
  ) {}

  @get('/downloadProductsCSV')
  async downloadProductsCSV(): Promise<void> {
    const products: Product[] = await this.productRepository.find();

    // Convert products to CSV format
    const csvData: string = this.convertToCSV(products);

    // Set response headers for downloading the CSV file
    this.response.setHeader('Content-Disposition', 'attachment; filename=products.csv');
    this.response.setHeader('Content-Type', 'text/csv');

    // Send the CSV data as the response
    this.response.send(csvData);
  }

  @get('/downloadProductsJSON')
  async downloadProductsJSON(): Promise<void> {
    const products: Product[] = await this.productRepository.find();

    // Convert products to JSON format
    const jsonData: string = JSON.stringify(products, null, 2);

    // Set response headers for downloading the JSON file
    this.response.setHeader('Content-Disposition', 'attachment; filename=products.json');
    this.response.setHeader('Content-Type', 'application/json');

    // Send the JSON data as the response
    this.response.send(jsonData);
  }

  // Helper function to convert Product records to CSV format
  private convertToCSV(products: Product[]): string {
    const createCsvWriter = require('csv-writer').createObjectCsvStringifier;
    const csvWriter = createCsvWriter({
      header: [
        { id: 'id', title: 'ID' },
        { id: 'name', title: 'Name' },
        { id: 'price', title: 'Price' },
        { id: 'quantity', title: 'Quantity' },
      ],
    });

    return csvWriter.stringifyRecords(products);
  }
  @post('/updatePrices')
  @response(200, {
    description: 'Number of products whose prices were successfully updated.',
  })
  async updatePrices(
    @requestBody() priceUpdates: PriceUpdate[],
  ): Promise<{ updatedCount: number }> {
    let updatedCount = 0;

    for (const update of priceUpdates) {
      const product = await this.productRepository.findById(update.id);

      if (product) {
        product.price = update.newPrice;
        await this.productRepository.update(product);
        updatedCount++;
      }
    }

    return { updatedCount };
  }
}

interface PriceUpdate {
  id: number;
  newPrice: number;
}
