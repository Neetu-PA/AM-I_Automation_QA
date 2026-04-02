import fs from "fs";
import { logger } from './helpers/logger'

export class FileHandler {
	deleteDirectory = async (directory: any) => {
		try {
			if (fs.existsSync(directory)) {
				// check if directory exists
				fs.rm(directory, { recursive: true }, (err: any) => {
					// delete directory recursively
					if (err) {
						logger.error(JSON.stringify(err))
						throw err;
					}
				});
			}
		} catch (err) {
		}
	};
	readFile = (filePath: any): Promise<string> => {
		return new Promise((resolve, reject) => {
			fs.readFile(filePath, 'utf8', (err, data) => {
				if (err) {
					logger.error(err)
					reject(err);
				} else {
					resolve(data);
				}
			});
		});
	};
	writeFile = (filePath: any, data: any) => {
		fs.writeFile(filePath, data, (err: any) => {
			if (err) {
				logger.error(JSON.stringify(err))
			}
		});
	};
	copyFile = async (srcFile: any, destFile: string) => {
		fs.copyFile(srcFile, destFile, (err: any) => {
			if (err) {
				logger.error(JSON.stringify(err))
			}
			logger.info("File was copied to : " + destFile)
		});
	};
	readDirectory = async (directory: any) => {
		fs.readdir(directory, (err, files: any[]) => {
			//handling error
			if (err) {
				logger.error(JSON.stringify(err))
			}
			//listing all files using forEach
			files.forEach((file: any) => {
				// Do whatever you want to do with the file
				logger.debug(file)
				console.debug(file);
			});
		});
	}
	deleteFile = async (filePath: string) => {
		fs.unlink(filePath, (err: any) => {
			if (err) logger.error(err);
			logger.debug(`File : ${filePath} deleted successfully`);
		});
	}
}

