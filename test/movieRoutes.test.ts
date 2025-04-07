import request from "supertest";
import app from "../src/app";
import * as movieController from "../src/api/v1/controllers/movieController";

// Mock the movieController functions
jest.mock("../src/api/v1/controllers/movieController", () => ({
    getAllMovies: jest.fn((req, res) => res.status(200).send({ message: "Movies Retrieved", data: [] })),
    getMoviesId: jest.fn((req, res) => res.status(200).send({ message: "Movie with name '1' retrieved successfully", data: {} })),
    createMovie: jest.fn((req, res) => res.status(201).send({ message: "Movie Created", data: {} })),
    updateMovie: jest.fn((req, res) => res.status(200).send({ message: "Movie Updated", data: {} })),
    deleteMovie: jest.fn((req, res) => res.status(200).send({ message: "Movie Deleted" })),
}));

describe("Movie Routes", () => {
    afterEach(() => {
        jest.clearAllMocks(); 
    });

    // Test GET /api/v1/movies
    describe("GET /api/v1/movies", () => {
        it("should call getAllMovies controller", async () => {
            await request(app).get("/api/v1/movies");
            expect(movieController.getAllMovies).toHaveBeenCalled();
        });

        it("should return a 200 status with the correct message", async () => {
            const response = await request(app).get("/api/v1/movies");
            expect(response.status).toBe(200);
            expect(response.body.message).toBe("Movies Retrieved");
        });
    });

    // Test PUT /api/v1/movies/:id
    describe("PUT /api/v1/movies/:id", () => {
        it("should call updateMovie controller", async () => {
            const mockMovie = {
                name: "Updated Movie",
                description: "Updated Description",
                price: "25.00"
            };

            const mockId = "1"; 

            // Call the route
            await request(app).put(`/api/v1/movies/${mockId}`).send(mockMovie);

            // Check that the updateMovie controller is called
            expect(movieController.updateMovie).toHaveBeenCalled();
        });

        it("should return a 200 status with a success message", async () => {
            const mockMovie = {
                name: "Updated Movie",
                description: "Updated Description",
                price: "25.00"
            };

            const mockId = "1"; 
            const response = await request(app).put(`/api/v1/movies/${mockId}`).send(mockMovie);
            expect(response.status).toBe(200);
            expect(response.body.message).toBe("Movie Updated");
        });
    });

    // Test POST /api/v1/movies
    describe("POST /api/v1/movies", () => {
        it("should call createMovie controller", async () => {
            const mockMovie = {
                name: "Test Movie",
                description: "Test Description",
                price: "20.00"
            };

            await request(app).post("/api/v1/movies").send(mockMovie);
            expect(movieController.createMovie).toHaveBeenCalled();
        });

        it("should return a 201 status with a success message", async () => {
            const mockMovie = {
                name: "Test Movie",
                description: "Test Description",
                price: "20.00"
            };

            const response = await request(app).post("/api/v1/movies").send(mockMovie);
            expect(response.status).toBe(201);
            expect(response.body.message).toBe("Movie Created");
        });
    });

    // Test DELETE /api/v1/movies/:id
    describe("DELETE /api/v1/movies/:id", () => {
        it("should call deleteMovie controller", async () => {
            const mockId = "1"; 
            await request(app).delete(`/api/v1/movies/${mockId}`);
            expect(movieController.deleteMovie).toHaveBeenCalled();
        });

        it("should return a 200 status with a success message", async () => {
            const mockId = "1"; 
            const response = await request(app).delete(`/api/v1/movies/${mockId}`);
            expect(response.status).toBe(200);
            expect(response.body.message).toBe("Movie Deleted");
        });
    });
});
