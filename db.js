// db.js
import { Sequelize } from 'sequelize';

const db = new Sequelize({
  dialect: 'mysql',
  host: 'localhost',
  username: 'root',
  password: '',
  database: 'tokosagu',
  define: {
    timestamps: false, // Set timestamps to false if you don't want Sequelize to handle createdAt and updatedAt
  },
  dialectOptions: {
    // Additional options here
    dateStrings: true, // Force sequelize to output dates as strings
    typeCast: true, // Enable type casting for data values
  },
  timezone: '+07:00', // Adjust timezone according to your location
});

export default db;
