 // Import required modules
 const express = require('express');
 const bodyParser = require('body-parser');
 const { MongoClient, ObjectId } = require('mongodb');
 const cors = require('cors');
 
 // MongoDB connection URI
 const uri = "mongodb+srv://naomikmutuaya:root@cluster0.yfzuibo.mongodb.net/";
 const client = new MongoClient(uri);
 
 // Initialize Express app
 const app = express();
 const port = 5500;
 
 // Middleware to parse JSON bodies
 app.use(bodyParser.json());
 app.use(cors());
 
 // Connect to MongoDB and start the server
 async function startServer() {
     try {
         await client.connect();
         console.log("Connected to MongoDB Atlas");
 
         // Insert a default customer when the server starts
         const database = client.db('mobile_store'); // database name
         const customersCollection = database.collection('customers'); //collection name
         const defaultCustomer = {
             name: "Niyla Carter",
             email: "NiylaC@gmail.com",
             phone: "084 8474 848"
         };
         await customersCollection.insertOne(defaultCustomer);
         console.log("Default customer inserted");
 
         // Define route to handle POST requests to /api/customers
         app.post('/api/customers', async (req, res) => {
             const newCustomerData = req.body; // Get customer data from request body
             try {
                 // Insert new customer data into MongoDB
                 const result = await customersCollection.insertOne(newCustomerData);
                 res.status(201).json(result.ops[0]); // Send back the inserted customer data
             } catch (error) {
                 console.error("Error adding customer:", error.message);
                 res.status(500).json({ error: "Failed to add customer" });
             }
         });
 
         // Define route to handle POST requests to create another customer
         app.post('/api/create-customer', async (req, res) => {
             const newCustomerData = req.body; // Get customer data from request body
             try {
                 // Insert new customer data into MongoDB
                 const result = await customersCollection.insertOne(newCustomerData);
                 res.status(201).json(result.ops[0]); // Send back the inserted customer data
             } catch (error) {
                 console.error("Error adding customer:", error.message);
                 res.status(500).json({ error: "Failed to add customer" });
             }
         });
 
         app.listen(port, () => {
             console.log(`Server is running on http://localhost:${port}`);
         });
     } catch (error) {
         console.error("Error connecting to MongoDB:", error.message);
     }
 }
 
 // Start the Express server
 startServer();
 
 // API endpoint to retrieve all customers
 app.get('/api/customers', async (req, res) => {
     try {
         const customers = await client.db("mobile_store").collection("customers").find().toArray();
         res.json(customers);
     } catch (error) {
         console.error("Error retrieving customers:", error.message);
         res.status(500).json({ error: "Internal server error" });
     }
 });
 
 // API endpoint to retrieve a customer by ID
 app.get('/api/customers/:customerId', async (req, res) => {
     try {
         const customerId = req.params.customerId;
         const customer = await client.db("mobile_store").collection("customers").findOne({ _id: ObjectId(customerId) });
         if (customer) {
             res.json(customer);
         } else {
             res.status(404).json({ error: "Customer not found" });
         }
     } catch (error) {
         console.error("Error retrieving customer:", error.message);
         res.status(500).json({ error: "Internal server error" });
     }
 });
 
 // API endpoint to update a customer by ID
 app.put('/api/customers/:customerId', async (req, res) => {
     try {
         const customerId = req.params.customerId;
         const updatedCustomer = req.body;
         const result = await client.db("mobile_store").collection("customers").updateOne(
             { _id: ObjectId(customerId) },
             { $set: updatedCustomer }
         );
         if (result.modifiedCount === 1) {
             res.json({ message: "Customer updated successfully" });
         } else {
             res.status(404).json({ error: "Customer not found" });
         }
     } catch (error) {
         console.error("Error updating customer:", error.message);
         res.status(500).json({ error: "Internal server error" });
     }
 });
 
 // API endpoint to delete a customer by ID
 app.delete('/api/customers/:customerId', async (req, res) => {
     try {
         const customerId = req.params.customerId;
         const result = await client.db("mobile_store").collection("customers").deleteOne({ _id: ObjectId(customerId) });
         if (result.deletedCount === 1) {
             res.json({ message: "Customer deleted successfully" });
         } else {
             res.status(404).json({ error: "Customer not found" });
         }
     } catch (error) {
         console.error("Error deleting customer:", error.message);
         res.status(500).json({ error: "Internal server error" });
     }
 });
 
 // Function to delete one record for a customer matching the specified details
 async function deleteCustomer(details) {
     try {
         // Delete one record for a customer matching the specified details
         const result = await client.db("mobile_store").collection("customers").deleteOne(details);
         console.log(`${result.deletedCount} customer(s) deleted`);
     } catch (error) {
         console.error("Error deleting customer:", error.message);
     }
 }
 
 // Call deleteCustomer function to delete one customer
 deleteCustomer({ name: "Niyla Carter" });
 
 module.exports = {
     deleteCustomer
 };
 
 
 // API endpoint to create a new phone item
 app.post('/api/phone_items', async (req, res) => {
     try {
         const newPhoneItem = req.body;
         const result = await client.db("mobile_store").collection("phone_items").insertOne(newPhoneItem);
         res.json({ message: "Phone item created successfully", phoneItemId: result.insertedId });
     } catch (error) {
         console.error("Error creating phone item:", error.message);
         res.status(500).json({ error: "Internal server error" });
     }
 });
 
 // API endpoint to retrieve all phone items
 app.get('/api/phone_items', async (req, res) => {
     try {
         const phoneItems = await client.db("mobile_store").collection("phone_items").find().toArray();
         res.json(phoneItems);
     } catch (error) {
         console.error("Error retrieving phone items:", error.message);
         res.status(500).json({ error: "Internal server error" });
     }
 });
 
 // API endpoint to retrieve a phone item by ID
 app.get('/api/phone_items/:phoneItemId', async (req, res) => {
     try {
         const phoneItemId = req.params.phoneItemId;
         const phoneItem = await client.db("mobile_store").collection("phone_items").findOne({ _id: ObjectId(phoneItemId) });
         if (phoneItem) {
             res.json(phoneItem);
         } else {
             res.status(404).json({ error: "Phone item not found" });
         }
     } catch (error) {
         console.error("Error retrieving phone item:", error.message);
         res.status(500).json({ error: "Internal server error" });
     }
 });
 
 // API endpoint to update a phone item by ID
 app.put('/api/phone_items/:phoneItemId', async (req, res) => {
     try {
         const phoneItemId = req.params.phoneItemId;
         const updatedPhoneItem = req.body;
         const result = await client.db("mobile_store").collection("phone_items").updateOne(
             { _id: ObjectId(phoneItemId) },
             { $set: updatedPhoneItem }
         );
         if (result.modifiedCount === 1) {
             res.json({ message: "Phone item updated successfully" });
         } else {
             res.status(404).json({ error: "Phone item not found" });
         }
     } catch (error) {
         console.error("Error updating phone item:", error.message);
         res.status(500).json({ error: "Internal server error" });
     }
 });
 
 // API endpoint to delete a phone item by ID
 app.delete('/api/phone_items/:phoneItemId', async (req, res) => {
     try {
         const phoneItemId = req.params.phoneItemId;
         const result = await client.db("mobile_store").collection("phone_items").deleteOne({ _id: ObjectId(phoneItemId) });
         if (result.deletedCount === 1) {
             res.json({ message: "Phone item deleted successfully" });
         } else {
             res.status(404).json({ error: "Phone item not found" });
         }
     } catch (error) {
         console.error("Error deleting phone item:", error.message);
         res.status(500).json({ error: "Internal server error" });
     }
 });
 
 // API endpoint to create a new order
 app.post('/api/orders', async (req, res) => {
     try {
         const newOrder = req.body;
         const result = await client.db("mobile_store").collection("orders").insertOne(newOrder);
         res.json({ message: "Order created successfully", orderId: result.insertedId });
     } catch (error) {
         console.error("Error creating order:", error.message);
         res.status(500).json({ error: "Internal server error" });
     }
 });
 
 // API endpoint to retrieve all orders
 app.get('/api/orders', async (req, res) => {
     try {
         const orders = await client.db("mobile_store").collection("orders").find().toArray();
         res.json(orders);
     } catch (error) {
         console.error("Error retrieving orders:", error.message);
         res.status(500).json({ error: "Internal server error" });
     }
 });
 
 // API endpoint to retrieve an order by ID
 app.get('/api/orders/:orderId', async (req, res) => {
     try {
         const orderId = req.params.orderId;
         const order = await client.db("mobile_store").collection("orders").findOne({ _id: ObjectId(orderId) });
         if (order) {
             res.json(order);
         } else {
             res.status(404).json({ error: "Order not found" });
         }
     } catch (error) {
         console.error("Error retrieving order:", error.message);
         res.status(500).json({ error: "Internal server error" });
     }
 });
 
 // API endpoint to update an order by ID
 app.put('/api/orders/:orderId', async (req, res) => {
     try {
         const orderId = req.params.orderId;
         const updatedOrder = req.body;
         const result = await client.db("mobile_store").collection("orders").updateOne(
             { _id: ObjectId(orderId) },
             { $set: updatedOrder }
         );
         if (result.modifiedCount === 1) {
             res.json({ message: "Order updated successfully" });
         } else {
             res.status(404).json({ error: "Order not found" });
         }
     } catch (error) {
         console.error("Error updating order:", error.message);
         res.status(500).json({ error: "Internal server error" });
     }
 });
 
 // API endpoint to delete an order by ID
 app.delete('/api/orders/:orderId', async (req, res) => {
     try {
         const orderId = req.params.orderId;
         const result = await client.db("mobile_store").collection("orders").deleteOne({ _id: ObjectId(orderId) });
         if (result.deletedCount === 1) {
             res.json({ message: "Order deleted successfully" });
         } else {
             res.status(404).json({ error: "Order not found" });
         }
     } catch (error) {
         console.error("Error deleting order:", error.message);
         res.status(500).json({ error: "Internal server error" });
     }
 });
 // API endpoint to update a customer by ID
 app.put('/api/customers/:customerId', async (req, res) => {
     try {
         const customerId = req.params.customerId;
         const updatedCustomer = req.body;
         const result = await client.db("mobile_store").collection("customers").updateOne(
             { _id: ObjectId(customerId) },
             { $set: updatedCustomer }
         );
         if (result.modifiedCount === 1) {
             res.json({ message: "Customer updated successfully" });
         } else {
             res.status(404).json({ error: "Customer not found" });
         }
     } catch (error) {
         console.error("Error updating customer:", error.message);
         res.status(500).json({ error: "Internal server error" });
     }
 });
 
 // API endpoint to delete a customer by ID
 app.delete('/api/customers/:customerId', async (req, res) => {
     try {
         const customerId = req.params.customerId;
         const result = await client.db("mobile_store").collection("customers").deleteOne({ _id: ObjectId(customerId) });
         if (result.deletedCount === 1) {
             res.json({ message: "Customer deleted successfully" });
         } else {
             res.status(404).json({ error: "Customer not found" });
         }
     } catch (error) {
         console.error("Error deleting customer:", error.message);
         res.status(500).json({ error: "Internal server error" });
     }
 });
 
 // API endpoint to retrieve all customers
 app.get('/api/customers', async (req, res) => {
     try {
         const customers = await client.db("mobile_store").collection("customers").find().toArray();
         res.json(customers);
     } catch (error) {
         console.error("Error retrieving customers:", error.message);
         res.status(500).json({ error: "Internal server error" });
     }
 });
 
 // API endpoint to retrieve a customer by ID
 app.get('/api/customers/:customerId', async (req, res) => {
     try {
         const customerId = req.params.customerId;
         const customer = await client.db("mobile_store").collection("customers").findOne({ _id: ObjectId(customerId) });
         if (customer) {
             res.json(customer);
         } else {
             res.status(404).json({ error: "Customer not found" });
         }
     } catch (error) {
         console.error("Error retrieving customer:", error.message);
         res.status(500).json({ error: "Internal server error" });
     }
 });
 
 // API endpoint to create a new customer
 app.post('/api/customers', async (req, res) => {
     try {
         const newCustomer = req.body;
         const result = await client.db("mobile_store").collection("customers").insertOne(newCustomer);
         res.json({ message: "Customer created successfully", customerId: result.insertedId });
     } catch (error) {
         console.error("Error creating customer:", error.message);
         res.status(500).json({ error: "Internal server error" });
     }
 });
 
 
 
 // Track if the customers have been inserted before
 let customersInserted = false;
 
 // Function to connect to MongoDB and perform operations
 async function main() {
     try {
         // Connect to MongoDB
         await client.connect();
         console.log("Connected to MongoDB Atlas");
 
         // Call functions to perform operations
         await createCustomers(); // Create customers
         await createPhoneItems(); // Create phone items
         await createOrders(); // Create orders
 
         // CRUD operations for Customers
         await insertCustomer(); // Insert a new customer
         await findCustomer(); // Find a customer
         await updateCustomer(); // Update a customer
         await deleteCustomer(); // Delete a customer
 
         // CRUD operations for Phone Items
         await createPhoneItem(); // Create a new phone item
         await findPhoneItem(); // Find a phone item
         await updatePhoneItem(); // Update a phone item
         await deletePhoneItem(); // Delete a phone item
 
         // CRUD operations for Orders
         await createOrder(); // Create a new order
         await findOrder(); // Find an order
         await updateOrder(); // Update an order
         await deleteOrder(); // Delete an order
 
     } catch (error) {
         console.error("Error:", error.message);
     } finally {
         // Close the MongoDB connection
         await client.close();
     }
 }
 
 // Function to create customers in the database
 async function createCustomers() {
     try {
         // Sample customer data
         const customers = [
             {
                 title: "Ms",
                 firstName: "Naomi",
                 surname: "Kaz",
                 mobile: "1234567890",
                 email: "naomi.kaz@yahoo.com",
                 homeAddress: {
                     addressLine1: "57 BallyField Street",
                     addressLine2: "",
                     town: "Waterford",
                     county: "Ireland",
                     eircode: "X72 V2A4"
                 },
                 shippingAddress: {
                     addressLine1: "4985 Conolly Street",
                     addressLine2: " Beachwood ",
                     town: "Mullingar",
                     county: "Maynooth",
                     eircode: "X934 789"
                 }
             },
             {
                 title: "Mr",
                 firstName: "Abu Ahmed",
                 surname: "Walid",
                 mobile: "087 533 3848",
                 email: "ahmed.walid@gmail.com",
                 homeAddress: {
                     addressLine1: "84 Yemen Street",
                     addressLine2: "837 Iran Woods",
                     town: "Kinshasa",
                     county: "Congo",
                     eircode: "X862893"
                 },
                 shippingAddress: {
                     addressLine1: "7568 Elmi Town Street",
                     addressLine2: " 3837 KilHights Street",
                     town: "Lagos",
                     county: "Nigeria",
                     eircode: "XOZ7F89"
                 }
             }
         ];
 
         // Insert customers into the 'customers' collection if not already inserted
         if (!customersInserted) {
             for (const customer of customers) {
                 // Check if the customer already exists in the database
                 const existingCustomer = await client.db("mobile_store").collection("customers").findOne({
                     firstName: customer.firstName,
                     surname: customer.surname,
                     mobile: customer.mobile,
                     email: customer.email
                 });
 
                 // If the customer exists, set customersInserted to true and continue
                 if (existingCustomer) {
                     customersInserted = true;
                     console.log("Customer already exists in the database. Skipping insertion.");
                     continue;
                 }
 
                 // Insert the new customer document into the 'customers' collection
                 const result = await client.db("mobile_store").collection("customers").insertOne(customer);
                 console.log(`New customer created with the following id: ${result.insertedId}`);
                 customersInserted = true; // Set customersInserted to true
             }
         } else {
             console.log("Customers already exist in the database. Skipping insertion.");
         }
     } catch (error) {
         console.error("Error creating customers:", error.message);
     }
 }
 
 // Function to create item details for mobile phones sold by the online store
 async function createPhoneItems() {
     try {
         // dataset of phone items
         const allPhoneItems = [
             { manufacturer: "Apple", model: "iPhone 11", price: 999 },
             { manufacturer: "Samsung", model: "Galaxy A10", price: 799 },
             { manufacturer: "Google", model: "Pixel 6", price: 699 },
             { manufacturer: "Microsoft", model: "Microsoft 365", price: 999 },
             { manufacturer: "Nokia", model: "Nokia 7", price: 799 },
             { manufacturer: "Hauwei", model: "Hauwei 21", price: 699 },
             { manufacturer: "Redmi", model: "Redemi 1", price: 699 },
             { manufacturer: "Alcatel", model: "Alcatel 60", price: 799 },
             { manufacturer: "Lenovo", model: "Lenvo 7", price: 699 },
             { manufacturer: "Sony", model: "Sony 120", price: 699 }
         ];
 
         // Check if the phone items already exist in the database
         const existingPhoneItems = await client.db("mobile_store").collection("phone_items").find().toArray();
 
         if (existingPhoneItems.length === 0) {
             // Insert the phone items into the 'phone_items' collection
             const result = await client.db("mobile_store").collection("phone_items").insertMany(allPhoneItems);
             console.log(`Inserted ${result.insertedCount} phone items into the database`);
         } else {
             console.log("Phone items already exist in the database. Skipping insertion.");
         }
     } catch (error) {
         console.error("Error creating phone items:", error.message);
     }
 }
 
 // Function to create orders for customers
 async function createOrders() {
     try {
         // Sample order data
         const orders = [
             {
                 customerId: "60aadb94b2428a001c4284bd", // Replace with actual customer ID
                 items: [
                     { productId: "60aadb94b2428a001c4284bf", quantity: 2 }, // Replace with actual product ID and quantity
                     { productId: "60aadb94b2428a001c4284c0", quantity: 1 }
                 ],
                 orderDate: new Date()
             },
             {
                 customerId: "60aadb94b2428a001c4284be",
                 items: [
                     { productId: "60aadb94b2428a001c4284c1", quantity: 1 }
                 ],
                 orderDate: new Date()
             }
         ];
 
         // Insert orders into the 'orders' collection
         const result = await client.db("mobile_store").collection("orders").insertMany(orders);
         console.log(`Inserted ${result.insertedCount} orders into the database`);
     } catch (error) {
         console.error("Error creating orders:", error.message);
     }
 }
 
 // CRUD operations for Customers
 
 // Insert a new customer
 async function insertCustomer() {
     try {
         // Sample customer data
         const customer = {
             title: "Ms",
             firstName: "New",
             surname: "Customer",
             mobile: "1234567890",
             email: "new.customer@example.com",
             homeAddress: {
                 addressLine1: "123 New Street",
                 addressLine2: "",
                 town: "New Town",
                 county: "New County",
                 eircode: "X12 Y34"
             },
             shippingAddress: {
                 addressLine1: "456 Shipping Street",
                 addressLine2: "",
                 town: "Shipping Town",
                 county: "Shipping County",
                 eircode: "Y56 Z78"
             }
         };
 
         // Insert the new customer document into the 'customers' collection
         const result = await client.db("mobile_store").collection("customers").insertOne(customer);
         console.log(`New customer created with the following id: ${result.insertedId}`);
     } catch (error) {
         console.error("Error creating customer:", error.message);
     }
 }
 
 // Find a random customer
 async function findCustomer() {
     try {
         // Find a random customer from the collection
         const customer = await client.db("mobile_store").collection("customers").aggregate([{ $sample: { size: 1 } }]).toArray();
         console.log("Found customer:", customer[0]); // Output the first (and only) element of the array
     } catch (error) {
         console.error("Error finding customer:", error.message);
     }
 }
 
 // Update a random customer's personal information and address data
 async function updateCustomer() {
     try {
         // Find a random customer
         const randomCustomer = await client.db("mobile_store").collection("customers").aggregate([{ $sample: { size: 1 } }]).toArray();
 
         // Generate new values for phone, email, title, and address data
         const newMobile = generateRandomMobile();
         const newEmail = generateRandomEmail();
         const newTitle = generateRandomTitle();
         const newAddress = generateRandomAddress();
 
         // Update personal information and address data for the randomly selected customer
         const filter = { _id: randomCustomer[0]._id }; // Filter by customer ID
         const updateDoc = {
             $set: {
                 mobile: newMobile,
                 email: newEmail,
                 title: newTitle,
                 homeAddress: newAddress, // Assuming newAddress contains the updated address data
                 shippingAddress: newAddress // Assuming shipping address is also updated with the same data
             }
         };
 
         // Perform the update
         const result = await client.db("mobile_store").collection("customers").updateOne(filter, updateDoc);
 
         console.log(`${result.modifiedCount} customer(s) updated`);
     } catch (error) {
         console.error("Error updating customer:", error.message);
     }
 }
 
 // Function to generate a random mobile number
 function generateRandomMobile() {
     // Generate a random 10-digit mobile number
     const mobile = "0" + Math.floor(Math.random() * 10000000000);
     return mobile.substring(0, 4) + " " + mobile.substring(4, 7) + " " + mobile.substring(7);
 }
 
 // Function to generate a random email
 function generateRandomEmail() {
     // Generate a random email address
     const email = "user" + Math.floor(Math.random() * 10000) + "@example.com";
     return email;
 }
 
 // Function to generate a random title
 function generateRandomTitle() {
     // List of possible titles
     const titles = ["Mr", "Mrs", "Miss", "Ms", "Dr", "Prof"];
 
     // Randomly select a title from the list
     const randomIndex = Math.floor(Math.random() * titles.length);
     return titles[randomIndex];
 }
 
 // Function to generate a random address
 function generateRandomAddress() {
     // Generate a random address object with sample data
     const address = {
         addressLine1: "123 New Street",
         addressLine2: "",
         town: "New Town",
         county: "New County",
         eircode: "X12 Y34"
     };
     return address;
 }
 
 
 // Delete all records for a customer matching the specified details
 async function deleteCustomer(details) {
     try {
         // Delete all records for a customer matching the specified details
         const result = await client.db("mobile_store").collection("customers").deleteMany(details);
         console.log(`${result.deletedCount} customer(s) deleted`);
     } catch (error) {
         console.error("Error deleting customer:", error.message);
     }
 }
 
 
 // CRUD operations for Phone Items
 
 // Create a new phone item
 async function createPhoneItem() {
     try {
         // Sample phone item data
         const phoneItem = {
             manufacturer: "NewBrand",
             model: "NewModel",
             price: 999
         };
 
         // Insert the new phone item document into the 'phone_items' collection
         const result = await client.db("mobile_store").collection("phone_items").insertOne(phoneItem);
         console.log(`New phone item created with the following id: ${result.insertedId}`);
     } catch (error) {
         console.error("Error creating phone item:", error.message);
     }
 }
 
 // Find a phone item
 async function findPhoneItem() {
     try {
         // Find a phone item by its model
         const phoneItem = await client.db("mobile_store").collection("phone_items").findOne({ model: "iPhone 11" });
         console.log("Found phone item:", phoneItem);
     } catch (error) {
         console.error("Error finding phone item:", error.message);
     }
 }
 
 // Update a phone item
 async function updatePhoneItem() {
     try {
         // Update the price of a phone item
         const filter = { model: "NewModel" };
         const updateDoc = {
             $set: { price: 899 } // New price
         };
         const result = await client.db("mobile_store").collection("phone_items").updateOne(filter, updateDoc);
         console.log(`${result.modifiedCount} phone item(s) updated`);
     } catch (error) {
         console.error("Error updating phone item:", error.message);
     }
 }
 
 // Delete a phone item
 async function deletePhoneItem() {
     try {
         // Delete a phone item by its model
         const result = await client.db("mobile_store").collection("phone_items").deleteOne({ model: "NewModel" });
         console.log(`${result.deletedCount} phone item(s) deleted`);
     } catch (error) {
         console.error("Error deleting phone item:", error.message);
     }
 }
 
 // CRUD operations for Orders
 
 // Create a new order
 async function createOrder() {
     try {
         // Sample order data
         const order = {
             customerId: "60aadb94b2428a001c4284bd", // Replace with actual customer ID
             items: [
                 { productId: "60aadb94b2428a001c4284bf", quantity: 2 }, // Replace with actual product ID and quantity
                 { productId: "60aadb94b2428a001c4284c0", quantity: 1 }
             ],
             orderDate: new Date()
         };
 
         // Insert the new order document into the 'orders' collection
         const result = await client.db("mobile_store").collection("orders").insertOne(order);
         console.log(`New order created with the following id: ${result.insertedId}`);
     } catch (error) {
         console.error("Error creating order:", error.message);
     }
 }
 
 // Find an order
 async function findOrder() {
     try {
         // Find an order by its customer ID
         const order = await client.db("mobile_store").collection("orders").findOne({ customerId: "60aadb94b2428a001c4284bd" });
         console.log("Found order:", order);
     } catch (error) {
         console.error("Error finding order:", error.message);
     }
 }
 
 // Update an order
 async function updateOrder() {
     try {
         // Update the quantity of a product in an order
         const filter = { customerId: "60aadb94b2428a001c4284bd" };
         const updateDoc = {
             $set: { "items.$[elem].quantity": 3 }, // New quantity
         };
         const options = {
             arrayFilters: [{ "elem.productId": "60aadb94b2428a001c4284bf" }] // Filter by product ID
         };
         const result = await client.db("mobile_store").collection("orders").updateOne(filter, updateDoc, options);
         console.log(`${result.modifiedCount} order(s) updated`);
     } catch (error) {
         console.error("Error updating order:", error.message);
     }
 }
 
 // Delete an order
 async function deleteOrder() {
     try {
         // Delete an order by its customer ID
         const result = await client.db("mobile_store").collection("orders").deleteOne({ customerId: "60aadb94b2428a001c4284bd" });
         console.log(`${result.deletedCount} order(s) deleted`);
     } catch (error) {
         console.error("Error deleting order:", error.message);
     }
 }
 
 // Call the main function to start the application
 main().catch(console.error);
 