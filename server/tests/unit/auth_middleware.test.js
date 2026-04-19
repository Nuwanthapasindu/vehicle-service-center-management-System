const { authTokenMiddleware } = require("../../middleware/auth");
const jwt = require("jsonwebtoken");
const User = require("../../model/User");
const Employee = require("../../model/Employee");
const AppError = require("../../error/AppError");

jest.mock("jsonwebtoken");
jest.mock("../../model/User");
jest.mock("../../model/Employee");

describe("Auth Middleware Security Tests", () => {
  let mockRequest;
  let mockResponse;
  let nextFunction;

  beforeEach(() => {
    mockRequest = {
      headers: {},
    };
    mockResponse = {};
    nextFunction = jest.fn();
    jest.clearAllMocks();
  });

  test("should fail if no authorization header is provided", async () => {
    await authTokenMiddleware(mockRequest, mockResponse, nextFunction);
    expect(nextFunction).toHaveBeenCalledWith(expect.any(Error));
    const error = nextFunction.mock.calls[0][0];
    expect(error.message).toBe("No token provided");
    expect(error.statusCode).toBe(401);
  });

  test("should fail if token does not start with Bearer", async () => {
    mockRequest.headers.authorization = "TOKEN_XYZ";
    await authTokenMiddleware(mockRequest, mockResponse, nextFunction);
    expect(nextFunction).toHaveBeenCalledWith(expect.any(Error));
    const error = nextFunction.mock.calls[0][0];
    expect(error.message).toBe("Invalid token");
  });

  test("should succeed with a valid admin token", async () => {
    const mockUser = {
      _id: "user_id_123",
      username: "admin",
      role: "ADMIN",
      isActive: true,
      isDeleted: false,
    };
    const mockEmployee = {
      name: "Admin User",
      employeeId: "EMP001",
    };

    mockRequest.headers.authorization = "Bearer VALID_TOKEN";
    jwt.verify.mockReturnValue({ id: "user_id_123" });
    User.findById.mockReturnValue({
      select: jest.fn().mockReturnThis(),
      lean: jest.fn().mockResolvedValue(mockUser),
    });
    Employee.findOne.mockReturnValue({
      select: jest.fn().mockReturnThis(),
      lean: jest.fn().mockResolvedValue(mockEmployee),
    });

    await authTokenMiddleware(mockRequest, mockResponse, nextFunction);
    expect(nextFunction).toHaveBeenCalled();
    expect(nextFunction).not.toHaveBeenCalledWith(expect.any(Error));
    expect(mockRequest.user.username).toBe("admin");
    expect(mockRequest.user.name).toBe("Admin User");
  });

  test("should fail if user is inactive", async () => {
    const mockUser = {
      id: "user_id_123",
      isActive: false,
    };

    mockRequest.headers.authorization = "Bearer VALID_TOKEN";
    jwt.verify.mockReturnValue({ id: "user_id_123" });
    User.findById.mockReturnValue({
      select: jest.fn().mockReturnThis(),
      lean: jest.fn().mockResolvedValue(mockUser),
    });

    await authTokenMiddleware(mockRequest, mockResponse, nextFunction);
    expect(nextFunction).toHaveBeenCalledWith(expect.any(Error));
    const error = nextFunction.mock.calls[0][0];
    expect(error.message).toBe("unauthorized");
  });

  test("should fail with invalid JWT", async () => {
    mockRequest.headers.authorization = "Bearer INVALID_TOKEN";
    jwt.verify.mockImplementation(() => {
      throw new Error("invalid signature");
    });

    await authTokenMiddleware(mockRequest, mockResponse, nextFunction);
    expect(nextFunction).toHaveBeenCalledWith(expect.any(Error));
    const error = nextFunction.mock.calls[0][0];
    expect(error.message).toBe("invalid signature");
  });
});
