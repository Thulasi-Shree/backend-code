
const products = require('../data/menus.json');
const Product = require('../model/menuItem');
const users = require('../data/users.json');
const User = require('../model/user');
const orders = require('../data/orders.json');
const Order = require('../model/order');
const restaurant = require('../data/restaurants.json');
const Restaurant = require('../model/restaurant');
const timeSlot = require('../data/timeslots.json');
const TimeSlot = require('../model/timeSlot');
const dotenv = require('dotenv');
const connectDatabase = require('../config/database')

dotenv.config({path:'../config/config.env'});
connectDatabase();

const seedProducts = async ()=>{
    try{
        await Product.deleteMany();
        await Order.deleteMany();
        await Product.deleteMany();
        await TimeSlot.deleteMany();
        await Restaurant.deleteMany();
        await User.deleteMany();
        console.log('Data deleted!')
        await Product.insertMany(products);
        await Order.insertMany(orders);
        await TimeSlot.insertMany(timeSlot);
        await Restaurant.insertMany(restaurant);
        await User.insertMany(users);
        console.log('Data added!');
    }catch(error){
        console.log(error.message);
    }
    process.exit();
}

seedProducts();