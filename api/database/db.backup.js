import { config } from 'dotenv';
import mysqldump from 'mysqldump';
import { join } from 'path';
import {
  __dirname,
  createDirectoryIfNotExists,
  fileLimit
} from '../utils/index.js';

async function databaseBackup() {
  config();

  const backup_dir = join(__dirname, 'data', 'backup');
  const date = new Date().toISOString();
  const filename = `db.backup-${
    process.platform === 'win32' ? date.replace(/:/g, ';') : date
  }.sql`;
  const file_path = join(backup_dir, filename);
  await createDirectoryIfNotExists(backup_dir);
  fileLimit(backup_dir, parseInt(process.env.DB_BACKUP_LIMIT) || 5);

  const data = await mysqldump({
    connection: {
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    },
    dumpOptions: {
      tables: ['token'],
      excludeTables: true
    },
    dumpToFile: file_path
  });

  return { data, filePath: file_path };
}

export default databaseBackup;
