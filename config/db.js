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

// Initialize Sequelize
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

// Function to sync database schema
const syncDatabase = async () => {
  try {
    console.log('Synchronizing database schema...');

    // 1. Get all model names
    const modelNames = Object.keys(sequelize.models);

    // 2. Loop through each model and sync individually
    for (const modelName of modelNames) {
      console.log(`Syncing model: ${modelName}`);

      // 3. Check if the model has an 'email' attribute
      const modelAttributes = sequelize.models[modelName].getAttributes();
      const hasEmailAttribute = Object.keys(modelAttributes).includes('email');

      // 4. Sync with 'alter: true' ONLY if the model doesn't have an 'email' attribute
      if (!hasEmailAttribute) {
        await sequelize.models[modelName].sync({ alter: true });
      } else {
        // If the model has an 'email' attribute, sync without altering
        await sequelize.models[modelName].sync();
      }

      // 5. Add the foreign key constraint for Product AFTER syncing
      if (modelName === 'Product') {
        // Check if the foreign key already exists
        const [foreignKeyExists] = await sequelize.query(
          "SELECT 1 FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS WHERE CONSTRAINT_NAME = 'Products_categoryId_foreign_idx' AND TABLE_SCHEMA = DATABASE();",
          { type: Sequelize.QueryTypes.SELECT }
        );

        // Add the foreign key only if it doesn't exist
        if (!foreignKeyExists) {
          // 6. Add the column first (if it doesn't exist)
          await sequelize.query(
            'ALTER TABLE `Products` ADD COLUMN IF NOT EXISTS `categoryId` VARCHAR(255) NOT NULL;',
            { raw: true }
          );

          // 7. Then add the foreign key constraint
          await sequelize.query(
            'ALTER TABLE `Products` ADD CONSTRAINT `Products_categoryId_foreign_idx` FOREIGN KEY (`categoryId`) REFERENCES `Categories` (`id`);',
            { raw: true }
          );
        }
      }
    } // <-- Closing brace moved here

    console.log('Database schema synchronized successfully');
  } catch (error) {
    console.error('Error synchronizing database schema:', error);
    process.exit(1);
  }
};

// Export sequelize and syncDatabase
module.exports = {
  sequelize,
  syncDatabase
};