/**
 * Purchase Order PDF Template
 * @param {Object} order - The purchase order data object
 * @returns {string} - HTML string for PDF generation
 */
export const purchaseOrderTemplate = (order) => {
  const items = order?.items || [];
  const supplierName = order?.supplier?.companyName || "Unknown Supplier";
  const orderId = order?._id || "N/A";
  const date = new Date().toLocaleDateString();
  const status = order?.status || "Unknown";
  const totalCost = items.reduce(
    (sum, item) => sum + (item.cost || 0) * (item.qty || 1),
    0,
  );

  return `
    <html>
      <head>
        <style>
          body { font-family: 'Helvetica', sans-serif; padding: 20px; color: #333; }
          .header { text-align: center; margin-bottom: 30px; }
          .header h1 { margin: 0; color: #1F2937; }
          .details { margin-bottom: 20px; }
          .details p { margin: 5px 0; }
          table { width: 100%; border-collapse: collapse; margin-top: 15px; }
          th, td { padding: 10px; text-align: left; border-bottom: 1px solid #E5E7EB; }
          th { background-color: #F9FAFB; color: #374151; }
          .total { margin-top: 20px; text-align: right; font-size: 16px; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>PURCHASE ORDER</h1>
        </div>
        <div class="details">
          <p><strong>Order ID:</strong> ${orderId}</p>
          <p><strong>Supplier:</strong> ${supplierName}</p>
          <p><strong>Status:</strong> ${status}</p>
          <p><strong>Date:</strong> ${date}</p>
        </div>
        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>QTY</th>
              <th>Unit Price</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            ${items
              .map(
                (item) => `
              <tr>
                <td>${item.itemId?.name || item.name || "Unknown Item"}</td>
                <td>${item.qty} ${item.unitType || "Nos"}</td>
                <td>Rs. ${item.cost || 0}</td>
                <td>Rs. ${(item.cost || 0) * (item.qty || 0)}</td>
              </tr>
            `,
              )
              .join("")}
          </tbody>
        </table>
        <div class="total">
          <p>Total Cost: Rs. ${totalCost}</p>
        </div>
      </body>
    </html>
  `;
};
