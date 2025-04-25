import express, { Express } from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";
dotenv.config();
import movieRoutes from "./api/v1/routes/movieRoutes";
import promotionsRoutes from './api/v1/routes/promotionsRoutes';
import reviewsRoutes from './api/v1/routes/reviewsRoutes';
//import promotionsRoutes from "./api/v1/routes/promotionsRoutes";
import morgan from "morgan";
import setupSwagger from "../config/swagger";
import errorHandler from "./api/v1/middleware/errorHandler";
import { accessLogger } from "./api/v1/middleware/logger";



// initialize the express application
const app: Express = express();
// CORS configuration
app.use(cors({
    origin: ['https://console.firebase.google.com/project/branch-database-project3/overview', 'https://console.firebase.google.com/'], 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }));

app.use(helmet());
// Configure specific protections using Helmet

// Protect against Cross-Site Scripting (XSS) attacks
app.use(helmet.xssFilter()); 
// Prevent clickjacking by denying iframe embedding
app.use(helmet.frameguard({ action: 'deny' })); 


// setup swagger for api documentation.
setupSwagger(app);
app.use(accessLogger);
app.use(morgan("combined"));
app.use(express.json());

// respond to GET request at endpoint "/" with message
app.get("/", (req, res) => {
    res.send("Hello, world!");
});

// example "tasks" endpoint
/**
 * @openapi
 * /tasks:
 *  get:
 *   summary: Retrieve a list of tasks
 *   tags: [Tasks]
 *   responses:
 *    200:
 *     description: A list of tasks
 */
app.get("/tasks", (req, res) => {
    res.send("Retrieve tasks");
});

// define GET route for health check
/**
 * @openapi
 * /api/v1/health:
 *  get:
 *   summary: Get health status of the application
 *   tags: [Health]
 *   responses:
 *    200:
 *     description: The application's status, uptime, the current timestamp, and version
 */
app.get("/api/v1/health", (req, res) => {
    res.json({
        status: "OK",
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        version: "1.0.0"
    });
    // send JSON response with status, server uptime, current time, API version
});

app.use("/api/v1/movies", movieRoutes);
app.use("/api/v1/promotions", promotionsRoutes);
app.use("/api/v1/reviews", reviewsRoutes);

app.use(errorHandler);

// export app and server for testing
export default app;