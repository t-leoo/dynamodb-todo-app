const DynamoDBTodoModel = require('./DynamoDBTodoModel');
const MySQLTodoModel = require('./MySQLTodoModel');

class DatabaseFactory {
  static create(databaseType = 'dynamodb') {
    const dbType = databaseType.toLowerCase();
    
    switch (dbType) {
      case 'dynamodb':
        console.log('Using DynamoDB as database');
        return new DynamoDBTodoModel();
        
      case 'mysql':
      case 'rds':
        console.log('Using MySQL/RDS as database');
        return new MySQLTodoModel();
        
      default:
        throw new Error(`Unsupported database type: ${databaseType}. Supported types: dynamodb, mysql, rds`);
    }
  }

  static getSupportedDatabases() {
    return ['dynamodb', 'mysql', 'rds'];
  }

  static validateDatabaseType(databaseType) {
    const supportedTypes = this.getSupportedDatabases();
    return supportedTypes.includes(databaseType.toLowerCase());
  }
}

module.exports = DatabaseFactory;
