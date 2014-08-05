var express = require('express'),
	bodyParser = require('body-parser'),
	forge = require('node-forge'),
	db = require('./model.js');

function error(status, msg) {
  var err = new Error(msg);
  err.status = status;
  return err;
}

function sha(msg){
	var md = forge.md.sha1.create();
	md.update(msg);
	return md.digest().toHex();
}

var port = Number(process.env.PORT || 5000);

var app = express();
	app.use(bodyParser());
	app.set('views', __dirname + '/views');
	app.use(express.static(__dirname, '/public'));
	app.engine('.html', require('ejs').__express);
	app.listen(port);

app.use('/api', function(req, res, next){

  // Set cross-origin access
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");

  var apiKeys = ["1189","etkey"],
      key = req.query['auth'];

  if (!key) return next(error(400, 'api key required'));
  if (!~apiKeys.indexOf(key)) return next(error(401, 'invalid api key'));

  req.key = key;
  next();
});

app.get('/', function(req, res){
	res.render('index.html');
});

//################
//# TRANSACTIONS #
//################

app.post('/api/transactions', function(req, res){

	var transaction = req.body;

	var id = sha(transaction.order_id+new Date());

		transaction.transaction_id = id;

	var newTransaction = new db.Transactions(transaction);

	return newTransaction.save(function(err){
		if(err){
			return res.send(err);
		} else {
			return res.send(id);
		}
	});

});

app.delete('/api/transactions/:id', function(req, res){

	var id = req.params.id;

	return db.Transactions.findOne({ "transaction_id": id }, function (err, transaction) {
    	return transaction.remove(function (err) {
      		if (!err) {
        		console.log("removed");
        		return res.send('TRANSACTION DELETED: '+id);
      		} else {
        		return res.send(err);
      		}
    	});

	});
});

app.get('/api/transactions/:id', function(req, res){

	var id = req.params.id;

	return db.Transactions.findOne({ "transaction_id": id }, function(err, doc){
		if(doc){
			return res.send(doc);
		} else {
			return res.send('No transaction found with that id');
		}
	});

});

//##########
//# ORDERS #
//##########

app.post('/api/orders', function(req, res){

	var order = req.body;

	var id = sha(order+new Date());

		order.order_id = id;

    console.log(order);

	var newOrder = new db.Orders(order);

	return newOrder.save(function(err){
		if(err){
			return res.send(err);
		} else {
			return res.send(id);
		}
	});

});

app.delete('/api/orders/:id', function(req, res){

	var id = req.params.id;

	return db.Orders.findOne({ "order_id": id }, function (err, order) {
    	return order.remove(function (err) {
      		if (!err) {
        		console.log("removed");
        		return res.send('ORDER DELETED: '+id);
      		} else {
        		return res.send(err);
      		}
    	});

	});
});

app.get('/api/orders/:id', function(req, res){

	var id = req.params.id;

	return db.Orders.findOne({ "order_id": id }, function(err, doc){
		if(doc){
			return res.send(doc);
		} else {
			return res.send('No order found with that id');
		}
	});

});

// Update Order (Products Object)
app.post('/api/orders/:id', function(req, res){

	var id = req.params.id;

	var products = req.body.products; // { "prod23490": 0, "prod5": 2 }

    console.log(products);

	return db.Orders.findOne({ "order_id": id }, function(err, doc){
		if(doc){
			return db.Orders.findOneAndUpdate({ "order_id": id }, { "products": products }, function(err, doc){
				return res.send(doc);
			});
		} else {
			return res.send('No order found with that id.');
		}
	});

});

//############
//# PRODUCTS #
//############

app.post('/api/products', function(req, res){

	var product = req.body;

	var id = sha(product.title);

		product.product_id = id;

	var newProduct = new db.Products(product);

	return newProduct.save(function(err){
		if(err){
			return res.send(err);
		} else {
			return res.send(id);
		}
	});

});

app.delete('/api/products/:id', function(req, res){

	var id = req.params.id;

	return db.Products.findOne({ "product_id": id }, function (err, product) {
    	return product.remove(function (err) {
      		if (!err) {
        		console.log("removed");
        		return res.send('PRODUCT DELETED: '+id);
      		} else {
        		return res.send(err);
      		}
    	});

	});
});

app.get('/api/products/:id', function(req, res){

	var id = req.params.id;

	return db.Products.findOne({ "product_id": id }, function(err, doc){
		if(doc){
			return res.send(doc);
		} else {
			return res.send('No product found with that id.');
		}
	});

});

// Update Product
app.post('/api/products/:id', function(req, res){

	var id = req.params.id;

	var products = req.body;

	return db.Products.findOneAndUpdate({ "product_id": id }, { "products": products }, function(err, doc){
		if(err){
			return res.send(err);
		} else {
			return res.send(doc);
		}

	});

});


//#############
//# CUSTOMERS #
//#############

app.post('/api/customer', function(req, res){

	var customer = req.body;

	var id = sha(customer);

		customer.customer_id = id;

	var newCustomer = new db.Customers(customer);

	return newCustomer.save(function(err){
		if(err){
			return res.send(err);
		} else {
			return res.send(id);
		}
	});

});

app.delete('/api/customers/:id', function(req, res){

	var id = req.params.id;

	return db.Customers.findOne({ "customer_id": id }, function (err, customer) {
    	return customer.remove(function (err) {
      		if (!err) {
        		console.log("removed");
        		return res.send('CUSTOMER DELETED: '+id);
      		} else {
        		return res.send(err);
      		}
    	});

	});
});

app.get('/api/customers/:id', function(req, res){

	var id = req.params.id;

	return db.Customers.findOne({ "customer_id": id }, function(err, doc){
		if(doc){
			return res.send(doc);
		} else {
			return res.send('No customer found with that id.');
		}
	});

});

// Update Customer
app.post('/api/customers/:id', function(req, res){

	var id = req.params.id;

	var customer = req.body;

	return db.Customers.findOneAndUpdate({ "customer_id": id }, customer, function(err, doc){
		if(err){
			return res.send(err);
		} else {
			return res.send(doc);
		}

	});

});

//#################
//# MANUFACTURERS #
//#################

app.post('/api/manufacturers', function(req, res){

	var manufacturer = req.body;

	var id = sha(manufacturer);

		manufacturer.manufacturer_id = id;

	var newManufacturer = new db.Manufacturers(manufacturer);

	return newManufacturer.save(function(err){
		if(err){
			return res.send(err);
		} else {
			return res.send(id);
		}
	});

});

app.delete('/api/manufacturers/:id', function(req, res){

	var id = req.params.id;

	return db.Manufacturers.findOne({ "manufacturer_id": id }, function (err, manufacturer) {
    	return manufacturer.remove(function (err) {
      		if (!err) {
        		return res.send('MANUFACTURER DELETED: '+id);
      		} else {
        		return res.send(err);
      		}
    	});

	});
});

app.get('/api/manufacturers/:id', function(req, res){

	var id = req.params.id;

	return db.Manufacturers.findOne({ "manufacturer_id": id }, function(err, doc){
		if(doc){
			return res.send(doc);
		} else {
			return res.send('No manufacturer found with that id.');
		}
	});

});

// Update Manufacturer
app.post('/api/manufacturers/:id', function(req, res){

	var id = req.params.id;

	var manufacturer = req.body;

	return db.Manufacturers.findOneAndUpdate({ "manufacturer_id": id }, manufacturer, function(err, doc){
		if(err){
			return res.send(err);
		} else {
			return res.send(doc);
		}

	});

});

//############
//# LIST ALL #
//############

app.get('/api/products', function(req, res){

		return db.Products.find({}, function(err, docs){
			if(doc){
				return res.send(docs);
			} else {
				return res.send('No products found.');
			}
		});

});

app.get('/api/orders', function(req, res){

		return db.Orders.find({}, function(err, docs){
			if(docs){
				return res.send(docs);
			} else {
				return res.send('No orders found.');
			}
		});

});

app.get('/api/transactions', function(req, res){

		return db.Transactions.find({}, function(err, docs){
			if(docs){
				return res.send(docs);
			} else {
				return res.send('No transactions found.');
			}
		});
});

app.get('/api/customers', function(req, res){

		return db.Customers.find({}, function(err, docs){
			if(docs){
				return res.send(docs);
			} else {
				return res.send('No customers found.');
			}
		});
});

app.get('/api/manufacturers', function(req, res){

		return db.Manufacturers.find({}, function(err, docs){
			if(docs){
				return res.send(docs);
			} else {
				return res.send('No manufacturers found.');
			}
		});
});



