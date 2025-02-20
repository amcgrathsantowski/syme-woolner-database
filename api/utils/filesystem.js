import { existsSync } from 'fs';
import { mkdir, readdir, stat, unlink } from 'fs/promises';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { Logger } from './logger.js';

const __dirname = dirname(fileURLToPath(`${import.meta.url}/../..`));

async function createDirectoryIfNotExists(directoryPath) {
  try {
    if (!existsSync(directoryPath)) {
      await mkdir(directoryPath, { recursive: true });
      Logger.info(`Directory created: ${directoryPath}`);
    } else Logger.info(`Directory already exists: ${directoryPath}`);
  } catch (err) {
    Logger.error(`Failed to create directory: ${directoryPath}`);
  }
}

async function fileLimit(directory, size) {
  try {
    // Read all file names in the directory
    const filenames = await readdir(directory);

    if (size && size > 0 && filenames.length >= size) {
      // Sort the file names based on modification time (oldest first)
      filenames.sort(async (a, b) => {
        const stat_a = await stat(`${directory}/${a}`);
        const stat_b = await stat(`${directory}/${b}`);
        return stat_a.mtime.getTime() - stat_b.mtime.getTime();
      });

      // Delete the oldest files
      const files_to_remove = filenames.splice(0, filenames.length - size + 1);
      files_to_remove.forEach((file) => {
        unlink(`${directory}/${file}`);
        Logger.warn(`Database Management - Deleted file: <${file}>`);
      });

      Logger.warn(
        `Database Management - Deleted files: <${files_to_remove.length}>`
      );
    } else {
      Logger.info(
        `Database Management - File limit not reached: ${filenames.length}/${size}`
      );
    }
  } catch (error) {
    Logger.error(
      `Database Management - Failed to delete file: ${error.message}`
    );
  }
}

export { __dirname, createDirectoryIfNotExists, fileLimit };
