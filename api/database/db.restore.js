import { config } from 'dotenv';
import { rename, createReadStream } from 'fs';
import { createInterface } from 'readline';
import { join } from 'path';
import database from './db.config.js';
import {
  Logger,
  QueryLogger,
  createDirectoryIfNotExists,
  fileLimit
} from '../utils/index.js';

function readSQLFile(filename) {
  return new Promise((resolve, reject) => {
    const file_stream = createReadStream(filename, { encoding: 'utf8' });
    const read_line = createInterface({
      input: file_stream,
      crlfDelay: Infinity
    });
    let successful = 0;
    let failed = 0;

    let response_timeout = null;
    let is_complete = false;

    let statement = '';
    const promises = [];

    read_line.on('line', (line) => {
      // Skip commented lines
      line = line.trim();
      if (
        line.startsWith('--') ||
        line.startsWith('#') ||
        line.startsWith('//') ||
        (line.startsWith('/*') && !line.startsWith('/*!'))
      ) {
        return;
      }

      statement += ` ${line}`;
      statement = statement.trim();
      const end_semicolon = statement.endsWith(';');
      if (!end_semicolon) {
        return;
      }

      // Process the SQL statement
      if (statement.length > 0 && end_semicolon) {
        const query = database
          .query(statement)
          .then(() => {
            // Handle successful queries
            if (response_timeout) {
              clearTimeout(response_timeout);
            }

            successful += 1;
            QueryLogger.info(
              `Query Success: Successful: <${successful}> Failed: <${failed}>`
            );

            // Allow 500ms for each query to complete, if an individual query runs for more than 500ms then return the current status
            response_timeout = setTimeout(() => {
              if (is_complete) {
                return;
              }

              resolve({
                successful,
                failed,
                total: promises.length,
                not_ran: promises.length - (successful + failed)
              });
              is_complete = true;
            }, 500);
          })
          .catch((error) => {
            // Handle failed queries
            failed += 1;
            QueryLogger.error(
              `Query Failed: Successful: <${successful}> Failed: <${failed}> Error: ${error.message}`
            );
          });

        promises.push(query);
      }
      statement = '';
    });

    read_line.on('error', (error) => {
      reject(error);
    });
  });
}

async function restoreDatabase(file) {
  config();
  const { path, destination } = file;
  const total_queries = await readSQLFile(path);
  const date = new Date().toISOString();

  const restore_path = destination.replace('upload', 'data/restore');
  await createDirectoryIfNotExists(restore_path);
  fileLimit(restore_path, process.env.DB_RESTORE_LIMIT || 5);

  rename(
    path,
    join(
      restore_path,
      `db.restore-${
        process.platform === 'win32' ? date.replace(/:/g, ';') : date
      }.sql`
    ),
    (err) => {
      if (err) {
        Logger.error('Database Management - Failed to store database file');
        throw err;
      }
    }
  );

  return total_queries;
}

export default restoreDatabase;
