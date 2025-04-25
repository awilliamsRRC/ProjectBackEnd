import request from "supertest";
import app from "../src/app";
import { getAllReviews, getReviewById, createReview, updateReview, deleteReview } from "../src/api/v1/controllers/reviewController";
import { Request, Response, NextFunction } from "express";

// Mock the reviewController functions
jest.mock("../src/api/v1/controllers/reviewController", () => ({
    getAllReviews: jest.fn((req, res) => res.status(200).send({ message: "Reviews Retrieved", data: [] })),
    getReviewById: jest.fn((req, res) => res.status(200).send({ message: "Review with id '1' retrieved successfully", data: {} })),
    createReview: jest.fn((req, res) => res.status(201).send({ message: "Review Created", data: {} })),
    updateReview: jest.fn((req, res) => res.status(200).send({ message: "Review Updated", data: {} })),
    deleteReview: jest.fn((req, res) => res.status(200).send({ message: "Review Deleted" })),
}));

jest.mock("../src/api/v1/middleware/authenticate", () => {
    return jest.fn((req: Request, res: Response, next: NextFunction) => next());
});

jest.mock("../src/api/v1/middleware/authorize", () => {
    return jest.fn(
        (options) => (req: Request, res: Response, next: NextFunction) => next()
    );
});

describe("Review Routes", () => {
    afterEach(() => {
        jest.clearAllMocks(); 
    });

    // Test GET /api/v1/reviews
    describe("GET /api/v1/reviews", () => {
        it("should call getAllReviews controller", async () => {
            await request(app).get("/api/v1/reviews");
            expect(getAllReviews).toHaveBeenCalled();
        });

        it("should return a 200 status with the correct message", async () => {
            const response = await request(app).get("/api/v1/reviews");
            expect(response.status).toBe(200);
            expect(response.body.message).toBe("Reviews Retrieved");
        });
    });

    // Test POST /api/v1/reviews
    describe("POST /api/v1/reviews", () => {
        it("should call createReview controller", async () => {
            const mockReview = {
                movieId: "1",
                reviewer: "John Doe",
                rating: 5,
                comment: "Excellent movie!"
            };

            await request(app).post("/api/v1/reviews").send(mockReview);
            expect(createReview).toHaveBeenCalled();
        });

        it("should return a 201 status with a success message", async () => {
            const mockReview = {
                movieId: "1",
                reviewer: "John Doe",
                rating: 5,
                comment: "Excellent movie!"
            };

            const response = await request(app).post("/api/v1/reviews").send(mockReview);
            expect(response.status).toBe(201);
            expect(response.body.message).toBe("Review Created");
        });
    });

    // Test PUT /api/v1/reviews/:id
    describe("PUT /api/v1/reviews/:id", () => {
        it("should call updateReview controller", async () => {
            const mockReview = {
                movieId: "1",
                reviewer: "Jane Doe",
                rating: 4,
                comment: "Good movie, but could be better"
            };

            const mockId = "1"; 

            await request(app).put(`/api/v1/reviews/${mockId}`).send(mockReview);
            expect(updateReview).toHaveBeenCalled();
        });
    });

    // Test DELETE /api/v1/reviews/:id
    describe("DELETE /api/v1/reviews/:id", () => {
        it("should call deleteReview controller", async () => {
            const mockId = "1"; 
            await request(app).delete(`/api/v1/reviews/${mockId}`);
            expect(deleteReview).toHaveBeenCalled();
        });

        it("should return a 200 status with a success message", async () => {
            const mockId = "1"; 
            const response = await request(app).delete(`/api/v1/reviews/${mockId}`);
            expect(response.status).toBe(200);
            expect(response.body.message).toBe("Review Deleted");
        });
    });
});
