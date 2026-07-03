// scripts/migrate.js
// Executa o schema SQL no banco Neon
const { neon } = require('@neondatabase/serverless');
const fs = require('fs');
const path = require('path');

async function migrate() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL não definida. Configure o arquivo .env');
  }

  const sql = neon(process.env.DATABASE_URL);
  const schema = fs.readFileSync(path.join(__dirname, '../database/schema.sql'), 'utf8');
  
  console.log('🔄 Executando migração...');
  
  // Executa statement por statement
  const statements = schema
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0);
  
  for (const statement of statements) {
    try {
      await sql.query(statement);
    } catch (err) {
      // Ignora erros de "já existe" em desenvolvimento
      if (!err.message.includes('already exists')) {
        console.error('Erro no statement:', statement.substring(0, 80));
        throw err;
      }
    }
  }
  
  console.log('✅ Migração concluída!');
}

migrate().catch(console.error);
