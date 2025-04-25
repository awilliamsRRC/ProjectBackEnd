import request from "supertest";
import app from "../src/app";
import { getAllPromotions, getPromotionById, createPromotion, updatePromotion, deletePromotion } from "../src/api/v1/controllers/promotionController";
import { Request, Response, NextFunction } from "express";

// Mock the promotionController functions
jest.mock("../src/api/v1/controllers/promotionController", () => ({
    getAllPromotions: jest.fn((req, res) => res.status(200).send({ message: "Promotions Retrieved", data: [] })),
    getPromotionById: jest.fn((req, res) => res.status(200).send({ message: "Promotion with id '1' retrieved successfully", data: {} })),
    createPromotion: jest.fn((req, res) => res.status(201).send({ message: "Promotion Created", data: {} })),
    updatePromotion: jest.fn((req, res) => res.status(200).send({ message: "Promotion Updated", data: {} })),
    deletePromotion: jest.fn((req, res) => res.status(200).send({ message: "Promotion Deleted" })),
}));

jest.mock("../src/api/v1/middleware/authenticate", () => {
    return jest.fn((req: Request, res: Response, next: NextFunction) => next());
});

jest.mock("../src/api/v1/middleware/authorize", () => {
    return jest.fn(
        (options) => (req: Request, res: Response, next: NextFunction) => next()
    );
});

describe("Promotion Routes", () => {
    afterEach(() => {
        jest.clearAllMocks(); 
    });

    // Test GET /api/v1/promotions
    describe("GET /api/v1/promotions", () => {
        it("should call getAllPromotions controller", async () => {
            await request(app).get("/api/v1/promotions");
            expect(getAllPromotions).toHaveBeenCalled();
        });

        it("should return a 200 status with the correct message", async () => {
            const response = await request(app).get("/api/v1/promotions");
            expect(response.status).toBe(200);
            expect(response.body.message).toBe("Promotions Retrieved");
        });
    });

    // Test POST /api/v1/promotions
    describe("POST /api/v1/promotions", () => {
        it("should call createPromotion controller", async () => {
            const mockPromotion = {
                title: "New Year Sale",
                description: "50% off on all items",
                discount: "50%",
                startDate: "2025-01-01",
                endDate: "2025-01-31"
            };

            await request(app).post("/api/v1/promotions").send(mockPromotion);
            expect(createPromotion).toHaveBeenCalled();
        });

        it("should return a 201 status with a success message", async () => {
            const mockPromotion = {
                title: "New Year Sale",
                description: "50% off on all items",
                discount: "50%",
                startDate: "2025-01-01",
                endDate: "2025-01-31"
            };

            const response = await request(app).post("/api/v1/promotions").send(mockPromotion);
            expect(response.status).toBe(201);
            expect(response.body.message).toBe("Promotion Created");
        });
    });

    // Test PUT /api/v1/promotions/:id
    describe("PUT /api/v1/promotions/:id", () => {
        it("should call updatePromotion controller", async () => {
            const mockPromotion = {
                title: "Updated Sale",
                description: "60% off on all items",
                discount: "60%",
                startDate: "2025-02-01",
                endDate: "2025-02-28"
            };

            const mockId = "1"; 

            await request(app).put(`/api/v1/promotions/${mockId}`).send(mockPromotion);
            expect(updatePromotion).toHaveBeenCalled();
        });
    });

    // Test DELETE /api/v1/promotions/:id
    describe("DELETE /api/v1/promotions/:id", () => {
        it("should call deletePromotion controller", async () => {
            const mockId = "1"; 
            await request(app).delete(`/api/v1/promotions/${mockId}`);
            expect(deletePromotion).toHaveBeenCalled();
        });

        it("should return a 200 status with a success message", async () => {
            const mockId = "1"; 
            const response = await request(app).delete(`/api/v1/promotions/${mockId}`);
            expect(response.status).toBe(200);
            expect(response.body.message).toBe("Promotion Deleted");
        });
    });
});
