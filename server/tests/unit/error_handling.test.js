const errorHandling = require("../../middleware/errorHandling");
const AppError = require("../../error/AppError");

describe("Error Handling Middleware Unit Tests", () => {
  let mockRequest;
  let mockResponse;
  let nextFunction;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    nextFunction = jest.fn();
  });

  test("should handle AppError with correct status and message", () => {
    const error = new AppError("Service not found", 404);
    errorHandling(error, mockRequest, mockResponse, nextFunction);

    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalled();
    const jsonResponse = mockResponse.json.mock.calls[0][0];
    expect(jsonResponse.payload.message).toBe("Service not found");
    expect(jsonResponse.payload.statusCode).toBe(404);
  });

  test("should default to 500 status code for generic errors", () => {
    const error = new Error("Something went wrong");
    errorHandling(error, mockRequest, mockResponse, nextFunction);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    const jsonResponse = mockResponse.json.mock.calls[0][0];
    expect(jsonResponse.payload.message).toBe("Something went wrong");
  });
});
