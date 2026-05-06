require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');
const connectDB = require('./config/database');

const products = [
  {
    name: 'Wireless Bluetooth Headphones',
    price: 79.99,
    category: 'Electronics',
    stock: 50,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
  },
  {
    name: 'Smart Watch Series 5',
    price: 299.99,
    category: 'Electronics',
    stock: 30,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
  },
  {
    name: 'Laptop Stand Aluminum',
    price: 49.99,
    category: 'Accessories',
    stock: 100,
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500',
  },
  {
    name: 'Mechanical Gaming Keyboard',
    price: 129.99,
    category: 'Electronics',
    stock: 45,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500',
  },
  {
    name: 'Ergonomic Office Chair',
    price: 249.99,
    category: 'Furniture',
    stock: 20,
    image: 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=500',
  },
  {
    name: 'USB-C Hub 7-in-1',
    price: 39.99,
    category: 'Accessories',
    stock: 75,
    image: 'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=500',
  },
  {
    name: 'Portable SSD 1TB',
    price: 149.99,
    category: 'Electronics',
    stock: 60,
    image: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=500',
  },
  {
    name: 'Wireless Mouse',
    price: 29.99,
    category: 'Accessories',
    stock: 120,
    image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=500',
  },
  {
    name: '4K Webcam',
    price: 89.99,
    category: 'Electronics',
    stock: 35,
    image: 'https://images.unsplash.com/photo-1589739900243-c0e5c8e11e3e?w=500',
  },
  {
    name: 'Desk Lamp LED',
    price: 34.99,
    category: 'Furniture',
    stock: 80,
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500',
  },
  {
    name: 'Phone Stand Adjustable',
    price: 19.99,
    category: 'Accessories',
    stock: 150,
    image: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=500',
  },
  {
    name: 'Noise Cancelling Earbuds',
    price: 159.99,
    category: 'Electronics',
    stock: 40,
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500',
  },
];

const seedDatabase = async () => {
  try {
    await connectDB();

    // Clear existing products
    await Product.deleteMany();
    console.log('✓ Existing products cleared');

    // Insert seed data
    const insertedProducts = await Product.insertMany(products);
    console.log(`✓ ${insertedProducts.length} products added successfully`);

    console.log('\n✅ Database seeded successfully!');
    
    // Close connection and exit
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    process.exit(1);
  }
};

seedDatabase();
