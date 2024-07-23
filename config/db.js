const { Sequelize } = require('sequelize');
const fs = require('fs');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

// Path to the certificate file, which will be set by Render
const certPath = process.env.CERT_PEM_PATH || path.join(__dirname, 'cert.pem');

// Read the certificate content
let certContent;
try {
  certContent = fs.readFileSync(certPath);
} catch (error) {
  console.error(`Error reading certificate from ${certPath}:`, error);
  process.exit(1);
}

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: 'mysql',
  dialectOptions: {
    ssl: {
      ca: certContent
    }
  }
});

module.exports = sequelize;
