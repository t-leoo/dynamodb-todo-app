const AWS = require('aws-sdk');
require('dotenv').config();

// Configure AWS
AWS.config.update({
  region: process.env.AWS_REGION || 'us-east-1',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const dynamodb = new AWS.DynamoDB({ endpoint: process.env.AWS_DYNAMODB_ENDPOINT, region: process.env.AWS_REGION, port: 8000 });
const tableName = process.env.DYNAMODB_TABLE_NAME || 'todos';

async function createTable() {
  const params = {
    TableName: tableName,
    KeySchema: [
      {
        AttributeName: 'id',
        KeyType: 'HASH' // Partition key
      }
    ],
    AttributeDefinitions: [
      {
        AttributeName: 'id',
        AttributeType: 'S' // String
      }
    ],
    BillingMode: 'PAY_PER_REQUEST', // On-demand billing
    Tags: [
      {
        Key: 'Project',
        Value: 'TodoApp'
      }
    ]
  };

  try {
    console.log(`Creating DynamoDB table: ${tableName}`);

    // Check if table already exists
    try {
      await dynamodb.describeTable({ TableName: tableName }).promise();
      console.log(`Table ${tableName} already exists`);
      return;
    } catch (error) {
      if (error.code !== 'ResourceNotFoundException') {
        throw error;
      }
    }

    // Create the table
    const result = await dynamodb.createTable(params).promise();
    console.log(`Table ${tableName} created successfully`);
    console.log('Table ARN:', result.TableDescription.TableArn);

    // Wait for table to be active
    console.log('Waiting for table to be active...');
    await dynamodb.waitFor('tableExists', { TableName: tableName }).promise();
    console.log('Table is now active and ready to use');

  } catch (error) {
    console.error('Error creating table:', error);
    throw error;
  }
}

// Run the script
if (require.main === module) {
  createTable()
    .then(() => {
      console.log('Setup complete!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Setup failed:', error);
      process.exit(1);
    });
}

module.exports = { createTable };
