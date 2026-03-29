import { Image } from 'react-native';
import colors from '../constants/colors';

export const getInvoiceHtmlContent = () => {
    const logoSource = Image.resolveAssetSource(require('../assets/logo.png'));
    const logoUri = logoSource ? logoSource.uri : '';

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
      .wip-tag { color: #F59E0B; font-size: 12px; font-weight: bold; letter-spacing: 1px; margin-bottom: 10px; }
      .vehicle-title { font-size: 20px; font-weight: bold; color: ${colors.DARK}; margin-bottom: 4px; }
      .vehicle-subtitle { font-size: 14px; color: ${colors.SECONDARY}; }
      .section-title { font-size: 14px; font-weight: 800; color: ${colors.SECONDARY}; letter-spacing: 1px; margin-bottom: 15px; text-transform: uppercase; }
      table { width: 100%; border-collapse: collapse; background-color: ${colors.LIGHT}; border: 1px solid ${colors.BORDER_COLOR}; border-radius: 12px; overflow: hidden; margin-bottom: 20px; }
      th, td { padding: 15px; text-align: left; }
      th { background-color: ${colors.BACKGROUND_COLOR}; color: ${colors.SECONDARY}; font-size: 12px; text-transform: uppercase; border-bottom: 1px solid ${colors.BORDER_COLOR}; }
      td { border-bottom: 1px solid ${colors.BORDER_COLOR}; }
      .item-title { font-size: 16px; font-weight: bold; color: ${colors.DARK}; }
      .item-subtitle { font-size: 12px; color: ${colors.SECONDARY}; }
      .item-price { font-size: 16px; font-weight: bold; color: ${colors.DARK}; text-align: right; }
      .total-card { background-color: #111827; border-radius: 16px; padding: 24px; color: ${colors.LIGHT}; display: flex; justify-content: space-between; align-items: center; }
      .total-label { color: #9CA3AF; font-size: 12px; font-weight: bold; letter-spacing: 1px; margin-bottom: 8px; }
      .total-value { font-size: 32px; font-weight: 900; color: ${colors.LIGHT}; }
      .footer { margin-top: 50px; text-align: center; color: ${colors.SECONDARY}; font-size: 12px; }
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
      <div class="wip-tag">• WORK IN PROGRESS</div>
      <div class="vehicle-title">Vehicle: ABC-1234</div>
      <div class="vehicle-subtitle">2022 Tesla Model 3 • Silver</div>
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
        <tr>
          <td>
            <div class="item-title">Full Synthetic Oil Change</div>
            <div class="item-subtitle">Labor & Materials</div>
          </td>
          <td class="item-price">$85.00</td>
        </tr>
        <tr>
          <td>
            <div class="item-title">Premium Oil Filter</div>
            <div class="item-subtitle">Part #OF-992-B</div>
          </td>
          <td class="item-price">$22.50</td>
        </tr>
        <tr>
          <td>
            <div class="item-title">Brake Pad Set (Front)</div>
            <div class="item-subtitle">Ceramic Performance</div>
          </td>
          <td class="item-price">$145.00</td>
        </tr>
      </tbody>
    </table>

    <div class="total-card">
      <div>
        <div class="total-label">RUNNING TOTAL AMOUNT</div>
        <div class="total-value">LKR 22,520.50</div>
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
