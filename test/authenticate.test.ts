jest.mock("../config/firebaseConfig", () => ({
    auth: {
      verifyIdToken: jest.fn(),  
    },
  }));
  
  import { Request, Response } from "express";
  import authenticate from "../src/api/v1/middleware/authenticate";
  import { auth } from "../config/firebaseConfig";
  import { AuthenticationError } from "../src/api/v1/errors/errors";
  
  describe("authenticate middleware", () => {
      let mockRequest: Partial<Request>;
      let mockResponse: Partial<Response>;
      let nextFunction: jest.Mock;
  
      beforeEach(() => {
          mockRequest = {
              headers: {},
          };
          mockResponse = {
              locals: {},
          };
          nextFunction = jest.fn();
      });
  
      it("should call next passing AuthenticationError when no token is provided", async () => {
          // Assemble
          const expectedError: AuthenticationError = new AuthenticationError(
              "Unauthorized: No token provided",
              "TOKEN_NOT_FOUND"
          );
  
          // Act
          await authenticate(mockRequest as Request, mockResponse as Response, nextFunction);
  
          // Assert
          expect(nextFunction).toHaveBeenCalledWith(expectedError);
      });
  
      it("should call next passing AuthenticationError when malformed token is provided", async () => {
          // Assemble
          mockRequest.headers = {
              authorization: "Bearer ", // Malformed token (empty bearer token)
          };
  
          const expectedError: AuthenticationError = new AuthenticationError(
              "Unauthorized: No token provided",
              "TOKEN_NOT_FOUND"
          );
  
          // Act
          await authenticate(mockRequest as Request, mockResponse as Response, nextFunction);
  
          // Assert
          expect(nextFunction).toHaveBeenCalledWith(expectedError);
      });
  
      it("should call next passing AuthenticationError when invalid token is provided", async () => {
          // Assemble
          mockRequest.headers = {
              authorization: "Bearer invalid-token", // Invalid token
          };
  
          const expectedError: AuthenticationError = new AuthenticationError(
              "Unauthorized: Invalid token",
              "INVALID_TOKEN"
          );
  
          // Mocking the `verifyIdToken` method to simulate an invalid token
          (auth.verifyIdToken as jest.Mock).mockRejectedValueOnce(new Error("Invalid token"));
  
          // Act
          await authenticate(mockRequest as Request, mockResponse as Response, nextFunction);
  
          // Assert
          expect(auth.verifyIdToken).toHaveBeenCalledWith("invalid-token");
          expect(nextFunction).toHaveBeenCalledWith(expectedError);
      });
  
      it("should call next() when token is valid", async () => {
          // Assemble
          mockRequest.headers = {
              authorization: "Bearer mock-token", // Valid token
          };
  
          // Mock the successful response from Firebase
          (auth.verifyIdToken as jest.Mock).mockResolvedValueOnce({
              uid: "mock-uid",
              role: "user", // User role data
          });
  
          // Act
          await authenticate(mockRequest as Request, mockResponse as Response, nextFunction);
  
          // Assert
          expect(auth.verifyIdToken).toHaveBeenCalledWith("mock-token");
          expect(mockResponse.locals).toEqual({
              uid: "mock-uid",
              role: "user",
          });
          expect(nextFunction).toHaveBeenCalled();
      });
  });
  