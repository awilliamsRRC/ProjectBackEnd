import morgan, { StreamOptions } from "morgan";
import fs from "fs";
import path from "path";

// Create a write stream (in append mode) for access logs
const accessLogStream = fs.createWriteStream(
	path.join(__dirname, "../../../logs/access.log"),
	{ flags: "a" }
);

// Define custom stream options for error logging
const errorLogStream: StreamOptions = {
	write: (message) =>
		fs.appendFileSync(
			path.join(__dirname, "../../../logs/error.log"),
			message
		),
};

// Setup the logger for access logs
const accessLogger = morgan("combined", { stream: accessLogStream });

// Setup the logger for error logs
const errorLogger = morgan("combined", { stream: errorLogStream });

export { accessLogger, errorLogger };