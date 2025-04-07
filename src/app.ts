import movieRoutes from "./api/v1/routes/movieRoutes";
// import the express application and type definition
import express, { Express } from "express";

// import setupSwagger endpoint
import setupSwagger from "../config/swagger";


// initialize the express application
const app: Express = express();
app.use(express.json());

// setup swagger for api documentation
setupSwagger(app);

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
// export app and server for testing
export default app;