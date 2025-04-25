import { Request, Response, NextFunction } from "express";
import * as movieController from "../src/api/v1/controllers/movieController";
import * as movieService from "../src/api/v1/services/movieService";

// Mocking the movieService methods with jest.mock.
jest.mock("../src/api/v1/services/movieService", () => ({
    getAllMovies: jest.fn(),
    getMoviesId: jest.fn(),
    createMovie: jest.fn(),
    updateMovie: jest.fn(),
    deleteMovie: jest.fn(),
}));

describe("Movie Controller", () => {
    let mockReq: Partial<Request>;
    let mockRes: Partial<Response>;
    let mockNext: NextFunction;

    // Setup mock request, response, and next function before each test
    beforeEach(() => {
        jest.clearAllMocks();
        mockReq = { params: {}, body: {} }; 
        mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() }; 
        mockNext = jest.fn(); 
    });

    describe("getAllMovies", () => {
        it("should return a list of movies", async () => {
            // Mocking the resolved value from the service to simulate the movieService behavior
            const mockMovies = [
                { id: "1", name: "Movie 1", description: "Test Description", price: "10.00" },
            ];
            (movieService.getAllMovies as jest.Mock).mockResolvedValue(mockMovies);

            // Calling the controller function
            await movieController.getAllMovies(mockReq as Request, mockRes as Response, mockNext);

            // Verifying that the response status and JSON output match the expected outcome
            expect(mockRes.status).toHaveBeenCalledWith(200); // HTTP Status 200
            expect(mockRes.json).toHaveBeenCalledWith({
                message: "Movies Retrieved", 
                data: mockMovies, 
                
            });
        });

        it("should handle errors correctly", async () => {
            // Simulating an error in the service
            const mockError = new Error("Failed to retrieve movies");
            (movieService.getAllMovies as jest.Mock).mockRejectedValue(mockError);

            // Calling the controller function, which should call next() with the error
            await movieController.getAllMovies(mockReq as Request, mockRes as Response, mockNext);

            // Verifying that the next function is called with the error
            expect(mockNext).toHaveBeenCalledWith(mockError);
        });
    });

    describe("getMoviesId", () => {
        it("should return a movie by ID", async () => {
            // Mocking the resolved value for a movie by ID
            const mockMovie = { id: "1", name: "Movie 1", description: "Test Description", price: "10.00" };
            (movieService.getMoviesId as jest.Mock).mockResolvedValue(mockMovie);

            // Setting the mock request params for the movie ID
            mockReq.params = { id: "1" };

            // Calling the controller function
            await movieController.getMoviesId(mockReq as Request, mockRes as Response, mockNext);

            // Verifying that the response status and JSON output match the expected outcome
            expect(mockRes.status).toHaveBeenCalledWith(200); 
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Movie with id "1" retrieved successfully', 
                data: mockMovie, 
                status: "success", 
            });
        });

        it("should handle errors correctly", async () => {
            // Simulating an error when the movie by ID is not found
            const mockError = new Error("Movie not found");
            (movieService.getMoviesId as jest.Mock).mockRejectedValue(mockError);

            // Calling the controller function, which should call next() with the error
            await movieController.getMoviesId(mockReq as Request, mockRes as Response, mockNext);

            // Verifying that the next function is called with the error
            expect(mockNext).toHaveBeenCalledWith(mockError);
        });
    });

    describe("createMovie", () => {
        it("should create a new movie", async () => {
            // Mocking the resolved value for a created movie
            const newMovie = { id: "1", name: "New Movie", description: "Description", price: "20.00" };
            (movieService.createMovie as jest.Mock).mockResolvedValue(newMovie);

            // Setting the mock request body
            mockReq.body = { name: "New Movie", description: "Description", price: "20.00" };

            // Calling the controller function
            await movieController.createMovie(mockReq as Request, mockRes as Response, mockNext);

            // Verifying that the response status and JSON output match the expected outcome
            expect(mockRes.status).toHaveBeenCalledWith(201); // HTTP Status 201
            expect(mockRes.json).toHaveBeenCalledWith({
                message: "Movie Created", 
                data: newMovie, 
                status: "success", 
            });
        });

        it("should handle errors correctly", async () => {
            // Simulating an error when creating a movie
            const mockError = new Error("Failed to create movie");
            (movieService.createMovie as jest.Mock).mockRejectedValue(mockError);

            // Calling the controller function, which should call next() with the error
            await movieController.createMovie(mockReq as Request, mockRes as Response, mockNext);

            // Verifying that the next function is called with the error
            expect(mockNext).toHaveBeenCalledWith(mockError);
        });
    });

    describe("updateMovie", () => {
        it("should update a movie", async () => {
            // Mocking the resolved value for an updated movie
            const updatedMovie = { id: "1", name: "Updated Movie", description: "Updated Description", price: "30.00" };
            (movieService.updateMovie as jest.Mock).mockResolvedValue(updatedMovie);

            // Setting the mock request params and body
            mockReq.params = { id: "1" };
            mockReq.body = { name: "Updated Movie", description: "Updated Description", price: "30.00" };

            // Calling the controller function
            await movieController.updateMovie(mockReq as Request, mockRes as Response, mockNext);

            // Verifying that the response status and JSON output match the expected outcome
            expect(mockRes.status).toHaveBeenCalledWith(200); 
            expect(mockRes.json).toHaveBeenCalledWith({
                message: "Movie Updated", 
                data: updatedMovie, 
                status: "success", 
            });
        });

        it("should handle errors correctly", async () => {
            // Simulating an error when updating a movie
            const mockError = new Error("Failed to update movie");
            (movieService.updateMovie as jest.Mock).mockRejectedValue(mockError);

            // Calling the controller function, which should call next() with the error
            await movieController.updateMovie(mockReq as Request, mockRes as Response, mockNext);

            // Verifying that the next function is called with the error
            expect(mockNext).toHaveBeenCalledWith(mockError);
        });
    });

    describe("deleteMovie", () => {
        it("should delete a movie", async () => {
            // Mocking the resolved value for deleting a movie
            (movieService.deleteMovie as jest.Mock).mockResolvedValue(undefined);

            // Setting the mock request params
            mockReq.params = { id: "1" };

            // Calling the controller function
            await movieController.deleteMovie(mockReq as Request, mockRes as Response, mockNext);

            // Verifying that the response status and JSON output match the expected outcome
            expect(mockRes.status).toHaveBeenCalledWith(200); 
            expect(mockRes.json).toHaveBeenCalledWith({
                message: "Movie Deleted", 
            });
        });

        it("should handle errors correctly", async () => {
            // Simulating an error when deleting a movie
            const mockError = new Error("Failed to delete movie");
            (movieService.deleteMovie as jest.Mock).mockRejectedValue(mockError);

            // Calling the controller function, which should call next() with the error
            await movieController.deleteMovie(mockReq as Request, mockRes as Response, mockNext);

            // Verifying that the next function is called with the error
            expect(mockNext).toHaveBeenCalledWith(mockError);
        });
    });
});
