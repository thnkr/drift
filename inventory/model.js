var key = require('./keys.js'),
	mongoose = require('mongoose');
	mongoose.connect(key.mongoAddress);

var transactions = mongoose.Schema({
  transaction_id: { type: String, unique: true, required: true },
  order_id: { type: String, required: true },
  customer_id: String,
  amount: { type: String, required: true }
});

var orders = mongoose.Schema({
  order_id: { type: String, unique: true, required: true },
  created: { type: String, default: Date.now },
  products: Array // { id: product_id, quantity: 1 }
});

var products = mongoose.Schema({
	product_id: { type: String, unique: true, required: true },
	title: { type: String, required: true },
	description: String,
	url: String,
	inventory: String
});

var customers = mongoose.Schema({
	customer_id: { type: String, unique: true, required: true},
	email: String,
	phone: String
});

var manufacturers = mongoose.Schema({
	manufacturer_id: { type: String, unique: true, required: true},
	email: String,
	phone: String
});

var Transactions = mongoose.model('transactions', transactions),
	Orders = mongoose.model('orders', orders),
	Products = mongoose.model('products', products),
	Manufacturers = mongoose.model('manufacturers', manufacturers),
	Customers = mongoose.model('customers', customers);

var Collection =  {
	Transactions: Transactions,
	Orders: Orders,
	Products: Products,
	Manufacturers: Manufacturers,
	Customers: Customers,
}

module.exports = Collection;