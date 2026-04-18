import { Image } from 'react-native';
import colors from '../../constants/colors';
import enums from '../../constants/enums';
import formatPrice from '../../utils/formatPrice';

export const getInvoiceTemplate = (invoice = {}) => {
    if (!invoice || !invoice._id) return '<html><body><h3>No Invoice Data</h3></body></html>';

    const vehicle = invoice.jobCard?.booking?.vehicle || {};
    
    const invoiceDate = new Date(invoice.createdAt).toLocaleDateString();
    const vehicleMakeModel = `${vehicle.make || 'Unknown'} ${vehicle.model || ''}`.trim();
    const vehicleYear = vehicle.year || 'N/A';
    const vehicleNumber = vehicle.licensePlate || 'N/A';
    const currentMileage = invoice.jobCard?.milageCount ? `${invoice.jobCard.milageCount} km` : 'N/A';
    const status = invoice.isCompleted ? enums.INVOICE_STATUS.COMPLETED : enums.INVOICE_STATUS.WORK_IN_PROGRESS;
    const checkStatusColor = invoice.isCompleted ? '#22C55E' : '#F59E0B';
    const totalAmount = formatPrice(invoice.totalPrice);

    let billedItems = [];

    // Package parsing
    if (invoice.selectedPackage?.selectedPackageTier) {
        billedItems.push({
            title: invoice.selectedPackage.package?.name || 'Package',
            subtitle: invoice.selectedPackage.selectedPackageTier.name,
            amount: formatPrice(invoice.selectedPackage.selectedPackageTier.price)
        });
    }

    // Additional items parsing
    if (invoice.additionalItems && invoice.additionalItems.length > 0) {
        invoice.additionalItems.forEach(item => {
            billedItems.push({
                title: item.item?.itemName || item.item?.name || 'Item',
                subtitle: `Qty: ${item.qty} ${item.item?.unitType || ''}`,
                amount: formatPrice((item.sellingPrice || 0) * (item.qty || 1))
            });
        });
    }

    // Additional services parsing
    if (invoice.additionalServices && invoice.additionalServices.length > 0) {
        invoice.additionalServices.forEach(service => {
            billedItems.push({
                title: service.service?.serviceName || service.service?.name || 'Service',
                subtitle: 'Labor & Service',
                amount: formatPrice(service.charge)
            });
        });
    }

    const logoSource = Image.resolveAssetSource(require('../../assets/logo.png'));
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
      .wip-tag { color: ${checkStatusColor}; font-size: 12px; font-weight: bold; letter-spacing: 1px; margin-bottom: 20px; text-transform: uppercase; }
      
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
      <div class="title">Invoice #${invoice.invoiceId || invoice._id}</div>
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
      For any inquiries, contact support at +94 77 767 3368
    </div>
  </body>
</html>
    `;
};
