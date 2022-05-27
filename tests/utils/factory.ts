import { faker } from '@faker-js/faker';
import factory from 'factory-girl';

factory.define(
  'Customer',
  {},
  {
    name: faker.name.findName,
    email: faker.internet.email,
  },
);

factory.define(
  'Product',
  {},
  {
    name: faker.commerce.productName,
    price: () => parseFloat(faker.commerce.price(1, 50)),
    quantity: () => faker.datatype.number({ min: 1, max: 100 }),
  },
);

export default factory;
