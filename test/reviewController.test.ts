import { Request, Response, NextFunction } from "express";
import * as reviewController from "../src/api/v1/controllers/reviewController";
import * as reviewService from "../src/api/v1/services/reviewService";

// Mocking the reviewService methods with jest.mock
jest.mock("../src/api/v1/services/reviewService", () => ({
    getAllReviews: jest.fn(),
    getReviewById: jest.fn(),
    createReview: jest.fn(),
    updateReview: jest.fn(),
    deleteReview: jest.fn(),
}));

describe("Review Controller", () => {
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

    describe("getReviewById", () => {
        it("should return a review by ID", async () => {
            const mockReview = { id: "1", movieId: "101", reviewer: "John", rating: 5, comment: "Great movie!" };
            (reviewService.getReviewById as jest.Mock).mockResolvedValue([mockReview]);

            mockReq.params = { id: "1" };

            await reviewController.getReviewById(mockReq as Request, mockRes as Response, mockNext);

            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Review with id "1" retrieved successfully',
                data: mockReview,
                status: "success",
            });
        });

        it("should handle errors correctly", async () => {
            const mockError = new Error("Review not found");
            (reviewService.getReviewById as jest.Mock).mockRejectedValue(mockError);

            await reviewController.getReviewById(mockReq as Request, mockRes as Response, mockNext);

            expect(mockNext).toHaveBeenCalledWith(mockError);
        });
    });

    describe("createReview", () => {
        it("should create a new review", async () => {
            const newReview = { id: "1", movieId: "101", reviewer: "John", rating: 5, comment: "Amazing!" };
            (reviewService.createReview as jest.Mock).mockResolvedValue(newReview);

            mockReq.body = { movieId: "101", reviewer: "John", rating: 5, comment: "Amazing!" };

            await reviewController.createReview(mockReq as Request, mockRes as Response, mockNext);

            expect(mockRes.status).toHaveBeenCalledWith(201);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: "Review Created",
                data: newReview,
                status: "success",
            });
        });

        it("should handle errors correctly", async () => {
            const mockError = new Error("Failed to create review");
            (reviewService.createReview as jest.Mock).mockRejectedValue(mockError);

            await reviewController.createReview(mockReq as Request, mockRes as Response, mockNext);

            expect(mockNext).toHaveBeenCalledWith(mockError);
        });
    });

    describe("updateReview", () => {
        it("should update a review", async () => {
            const updatedReview = { id: "1", movieId: "101", reviewer: "John", rating: 4, comment: "Good movie!" };
            (reviewService.updateReview as jest.Mock).mockResolvedValue(updatedReview);

            mockReq.params = { id: "1" };
            mockReq.body = { movieId: "101", reviewer: "John", rating: 4, comment: "Good movie!" };

            await reviewController.updateReview(mockReq as Request, mockRes as Response, mockNext);

            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: "Review Updated",
                data: updatedReview,
                status: "success",
            });
        });

        it("should handle errors correctly", async () => {
            const mockError = new Error("Failed to update review");
            (reviewService.updateReview as jest.Mock).mockRejectedValue(mockError);

            await reviewController.updateReview(mockReq as Request, mockRes as Response, mockNext);

            expect(mockNext).toHaveBeenCalledWith(mockError);
        });
    });

    describe("deleteReview", () => {
        it("should delete a review", async () => {
            (reviewService.deleteReview as jest.Mock).mockResolvedValue(undefined);

            mockReq.params = { id: "1" };

            await reviewController.deleteReview(mockReq as Request, mockRes as Response, mockNext);

            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: "Review Deleted",
            });
        });

        it("should handle errors correctly", async () => {
            const mockError = new Error("Failed to delete review");
            (reviewService.deleteReview as jest.Mock).mockRejectedValue(mockError);

            await reviewController.deleteReview(mockReq as Request, mockRes as Response, mockNext);

            expect(mockNext).toHaveBeenCalledWith(mockError);
        });
    });
});
