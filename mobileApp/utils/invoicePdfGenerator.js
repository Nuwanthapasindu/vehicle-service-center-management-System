import { Image } from 'react-native';
import colors from '../constants/colors';

export const getInvoiceHtmlContent = (invoiceData = {}) => {
    // Setting defaults so the UI prints correctly if no data is passed
    const {
        invoiceDate = new Date().toLocaleDateString(),
        vehicleMakeModel = "Tesla Model 3",
        vehicleYear = "2022",
        vehicleNumber = "ABC-1234",
        currentMileage = "15,204 km",
        status = "WORK IN PROGRESS",
        billedItems = [
            { id: 1, title: "Full Synthetic Oil Change", subtitle: "Labor & Materials", amount: "LKR 85.00" },
            { id: 2, title: "Premium Oil Filter", subtitle: "Part #OF-992-B", amount: "LKR 22.50" },
            { id: 3, title: "Brake Pad Set (Front)", subtitle: "Ceramic Performance", amount: "LKR 145.00" }
        ],
        totalAmount = "LKR 22,520.50"
    } = invoiceData;

    const logoSource = Image.resolveAssetSource(require('../assets/logo.png'));
    const logoUri = logoSource ? logoSource.uri : '';

    const itemsHtml = billedItems.map(item => `
        <tr>
          <td>
            <div class="item-title">${item.title}</div>
            <div class="item-subtitle">${item.subtitle}</div>
          </td>
          <td class="item-price">${item.amount}</td>
        </tr>
    `).join('');

    return `
<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
    <style>
      body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: ${colors.DARK}; padding: 20px; background-color: ${colors.BACKGROUND_COLOR}; }
      .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid ${colors.BORDER_COLOR}; padding-bottom: 20px; margin-bottom: 20px; }
      .brand-container { display: flex; align-items: center; }
      .logo { height: 48px; margin-right: 12px; }
      .title { font-size: 24px; font-weight: 900; color: ${colors.DARK}; }
      .brand { font-size: 28px; font-weight: 900; color: ${colors.PRIMARY}; }
      
      .card { background-color: ${colors.LIGHT}; border: 1px solid ${colors.BORDER_COLOR}; border-radius: 12px; padding: 20px; margin-bottom: 20px; }
      .wip-tag { color: #F59E0B; font-size: 12px; font-weight: bold; letter-spacing: 1px; margin-bottom: 20px; text-transform: uppercase; }
      
      .info-grid { display: flex; flex-wrap: wrap; margin-bottom: -15px; }
      .info-item { width: 50%; margin-bottom: 15px; }
      .info-label { font-size: 11px; color: ${colors.SECONDARY}; text-transform: uppercase; font-weight: bold; margin-bottom: 4px; letter-spacing: 0.5px; }
      .info-value { font-size: 15px; color: ${colors.DARK}; font-weight: bold; }
      
      .section-title { font-size: 14px; font-weight: 800; color: ${colors.SECONDARY}; letter-spacing: 1px; margin-bottom: 15px; text-transform: uppercase; }
      table { width: 100%; border-collapse: collapse; background-color: ${colors.LIGHT}; border: 1px solid ${colors.BORDER_COLOR}; border-radius: 12px; overflow: hidden; margin-bottom: 20px; }
      th, td { padding: 15px; text-align: left; }
      th { background-color: ${colors.BACKGROUND_COLOR}; color: ${colors.SECONDARY}; font-size: 12px; text-transform: uppercase; border-bottom: 1px solid ${colors.BORDER_COLOR}; }
      td { border-bottom: 1px solid ${colors.BORDER_COLOR}; }
      .item-title { font-size: 16px; font-weight: bold; color: ${colors.DARK}; }
      .item-subtitle { font-size: 12px; color: ${colors.SECONDARY}; margin-top: 4px; }
      .item-price { font-size: 16px; font-weight: bold; color: ${colors.DARK}; text-align: right; }
      
      .total-card { background-color: #111827; border-radius: 16px; padding: 24px; color: ${colors.LIGHT}; display: flex; justify-content: space-between; align-items: center; }
      .total-label { color: #9CA3AF; font-size: 12px; font-weight: bold; letter-spacing: 1px; margin-bottom: 8px; }
      .total-value { font-size: 32px; font-weight: 900; color: ${colors.LIGHT}; }
      .footer { margin-top: 50px; text-align: center; color: ${colors.SECONDARY}; font-size: 12px; line-height: 1.6; }
    </style>
  </head>
  <body>
    <div class="header">
      <div class="brand-container">
        <img src="${logoUri}" class="logo" alt="Logo" />
        <div class="brand">AutoMate</div>
      </div>
      <div class="title">Invoice & Billing</div>
    </div>
    
    <div class="card">
      <div class="wip-tag">• ${status}</div>
      <div class="info-grid">
        <div class="info-item">
          <div class="info-label">Invoice Date</div>
          <div class="info-value">${invoiceDate}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Vehicle Number</div>
          <div class="info-value">${vehicleNumber}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Make & Model</div>
          <div class="info-value">${vehicleMakeModel}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Vehicle Year</div>
          <div class="info-value">${vehicleYear}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Current Mileage</div>
          <div class="info-value">${currentMileage}</div>
        </div>
      </div>
    </div>

    <div class="section-title">Billed Items</div>
    <table>
      <thead>
        <tr>
          <th>Description</th>
          <th style="text-align: right;">Amount</th>
        </tr>
      </thead>
      <tbody>
        ${itemsHtml}
      </tbody>
    </table>

    <div class="total-card">
      <div>
        <div class="total-label">RUNNING TOTAL AMOUNT</div>
        <div class="total-value">${totalAmount}</div>
      </div>
    </div>
    
    <div class="footer">
      Thank you for choosing AutoMate!<br>
      For any inquiries, contact support at 1-800-AUTOMATE
    </div>
  </body>
</html>
    `;
};
