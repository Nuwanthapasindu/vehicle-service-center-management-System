const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

// Clear existing models to prevent OverwriteModelError
Object.keys(mongoose.models).forEach((key) => {
  delete mongoose.models[key];
});

const User = require("../../model/User");
const SmsCampaign = require("../../model/SmsCampaign");
const { createSmsCampaign, getSmsCampaigns } = require("../../controller/smsNotification.controller");
const { sendBulkSms } = require("../../util/smsSender");
const { USER_ROLES, MESSAGE_TYPES } = require("../../util/constants");

// Mock the SMS utility functions
jest.mock("../../util/smsSender", () => ({
  sendBulkSms: jest.fn().mockResolvedValue({ status: "success", request_id: "req_campaign_123" }),
  getAccountStatus: jest.fn().mockResolvedValue({ success: true }),
}));

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await User.deleteMany({});
  await SmsCampaign.deleteMany({});
  jest.clearAllMocks();
});

describe("SMS Campaign Controller Tests", () => {
  let mockAdmin, mockCustomer1, mockCustomer2;

  beforeEach(async () => {
    mockAdmin = await new User({
      name: "Admin User",
      mobile: "0771111111",
      address: "Admin Office",
      role: USER_ROLES.ADMIN,
      isActive: true,
    }).save();

    mockCustomer1 = await new User({
      name: "Customer One",
      mobile: "0772222222",
      address: "Address 1",
      role: USER_ROLES.CUSTOMER,
      isActive: true,
    }).save();

    mockCustomer2 = await new User({
      name: "Customer Two",
      mobile: "0773333333",
      address: "Address 2",
      role: USER_ROLES.CUSTOMER,
      isActive: true,
    }).save();
  });

  describe("createSmsCampaign", () => {
    test("should successfully send bulk SMS and save campaign document", async () => {
      const payload = {
        title: "Holiday Promotion",
        message: "Enjoy 20% off all detailing packages this weekend!",
        campaignType: MESSAGE_TYPES.PROMOTIONAL,
      };

      const result = await createSmsCampaign(payload, mockAdmin.mobile);

      expect(result).toBeDefined();
      expect(result.title).toBe(payload.title);
      expect(result.message).toBe(payload.message);
      expect(result.campaignType).toBe(payload.campaignType);
      expect(result.recipientsCount).toBe(2);
      expect(result.sentBy.toString()).toBe(mockAdmin._id.toString());
      expect(result.gatewayResponse).toEqual({ status: "success", request_id: "req_campaign_123" });

      // Verify Mongoose document actually saved in DB
      const dbCampaign = await SmsCampaign.findOne({ _id: result._id });
      expect(dbCampaign).not.toBeNull();
      expect(dbCampaign.title).toBe(payload.title);

      // Verify sendBulkSms mock was called with correct numbers
      expect(sendBulkSms).toHaveBeenCalledWith(
        expect.arrayContaining(["0772222222", "0773333333"]),
        payload.message,
        payload.campaignType
      );
    });

    test("should fail if title is missing", async () => {
      const payload = {
        message: "Missing title text",
      };

      await expect(createSmsCampaign(payload, mockAdmin.mobile)).rejects.toThrow("Campaign title is required");
    });

    test("should fail if message is missing", async () => {
      const payload = {
        title: "Missing message",
      };

      await expect(createSmsCampaign(payload, mockAdmin.mobile)).rejects.toThrow("SMS message content is required");
    });

    test("should fail if no active customer users exist", async () => {
      await User.deleteMany({ role: USER_ROLES.CUSTOMER });

      const payload = {
        title: "Test",
        message: "Test message",
      };

      await expect(createSmsCampaign(payload, mockAdmin.mobile)).rejects.toThrow("No active customers found with valid mobile numbers");
    });
  });

  describe("getSmsCampaigns", () => {
    test("should return all campaigns sorted by date descending", async () => {
      // Create two campaigns
      const c1 = new SmsCampaign({
        title: "Promo 1",
        message: "Msg 1",
        campaignType: MESSAGE_TYPES.PROMOTIONAL,
        recipientsCount: 2,
        sentBy: mockAdmin._id,
      });
      const c2 = new SmsCampaign({
        title: "Alert 2",
        message: "Msg 2",
        campaignType: MESSAGE_TYPES.TRANSACTIONAL,
        recipientsCount: 2,
        sentBy: mockAdmin._id,
      });

      await c1.save();
      // Ensure c2 is newer
      await new Promise((resolve) => setTimeout(resolve, 100));
      await c2.save();

      const res = await getSmsCampaigns();
      const campaigns = res.campaigns;
      expect(campaigns.length).toBe(2);
      expect(campaigns[0].title).toBe("Alert 2"); // newer first
      expect(campaigns[0].sentBy.name).toBe("Admin User"); // populated
      expect(campaigns[1].title).toBe("Promo 1");
      expect(res.metadata.totalCount).toBe(2);
    });

    test("should return paginated campaigns", async () => {
      // Create 15 campaigns
      for (let i = 1; i <= 15; i++) {
        await new SmsCampaign({
          title: `Promo ${i}`,
          message: `Msg ${i}`,
          campaignType: MESSAGE_TYPES.PROMOTIONAL,
          recipientsCount: 2,
          sentBy: mockAdmin._id,
        }).save();
        // Pause slightly to ensure creation times are sequential
        await new Promise((resolve) => setTimeout(resolve, 5));
      }

      // Fetch page 1 with limit 10
      const res1 = await getSmsCampaigns(1, 10);
      const page1 = res1.campaigns;
      expect(page1.length).toBe(10);
      expect(page1[0].title).toBe("Promo 15"); // newest first
      expect(res1.metadata.totalPages).toBe(2);

      // Fetch page 2 with limit 10
      const res2 = await getSmsCampaigns(2, 10);
      const page2 = res2.campaigns;
      expect(page2.length).toBe(5);
      expect(page2[0].title).toBe("Promo 5");
    });
  });
});
