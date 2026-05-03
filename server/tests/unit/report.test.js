const { getIncomeReport } = require("../../controller/report.controller");
const Invoice = require("../../model/Invoice");
const { LOG_PERIODS: REPORT_RANGES } = require("../../util/constants");
const AppError = require("../../error/AppError");

jest.mock("../../model/Invoice");

describe("Report Controller Unit Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getIncomeReport", () => {
    it("should calculate total income successfully", async () => {
      const mockData = [
        { _id: "2023-10-01", income: 100, count: 1 },
        { _id: "2023-10-02", income: 200, count: 2 },
      ];
      Invoice.aggregate.mockResolvedValue(mockData);

      const result = await getIncomeReport(REPORT_RANGES.TODAY);

      expect(Invoice.aggregate).toHaveBeenCalled();
      expect(result.totalIncome).toBe(300);
      expect(result.data).toEqual(mockData);
    });

    it("should handle custom range correctly", async () => {
      Invoice.aggregate.mockResolvedValue([]);

      const result = await getIncomeReport(
        REPORT_RANGES.CUSTOM,
        "2023-01-01",
        "2023-12-31",
      );

      expect(Invoice.aggregate).toHaveBeenCalled();
      expect(result.totalIncome).toBe(0);
    });

    it("should throw AppError if custom range lacks start/end dates", async () => {
      await expect(
        getIncomeReport(REPORT_RANGES.CUSTOM, null, null),
      ).rejects.toThrow("startDate and endDate are required");
    });
  });
});
