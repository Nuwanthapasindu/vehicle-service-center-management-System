import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { formatShortDate } from "./dateFormatter";
import { toast } from "react-toastify";

/**
 * Exports service history to a PDF file.
 * @param {Array} historyData - The history logs to export.
 * @param {Object} vehicle - (Optional) Current vehicle details if exporting for a specific one.
 */
export const exportHistoryToPDF = (historyData, vehicle = null) => {
    try {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();

    // 1. HEADER
    doc.setFontSize(22);
    doc.setTextColor(40, 44, 52); // Dark color
    doc.text("SERVICE HISTORY LOG", pageWidth / 2, 20, { align: "center" });

    doc.setFontSize(10);
    doc.setTextColor(110, 110, 110);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, pageWidth / 2, 28, { align: "center" });

    // 2. VEHICLE INFO (If specific vehicle)
    let startY = 40;
    if (vehicle) {
        doc.setFontSize(12);
        doc.setTextColor(30, 30, 30);
        doc.text(`Vehicle Details:`, 14, startY);
        
        doc.setFontSize(10);
        doc.setTextColor(80, 80, 80);
        doc.text(`Make & Model: ${vehicle.make} ${vehicle.model}`, 14, startY + 7);
        doc.text(`License Plate: ${vehicle.licensePlate}`, 14, startY + 14);
        doc.text(`Vehicle Type: ${vehicle.type}`, 14, startY + 21);
        startY += 35;
    }

    // 3. DATA TABLE
    const tableHeaders = [["DATE", "VEHICLE", "LICENSE PLATE", "SERVICE PACKAGE", "STATUS"]];
    const tableRows = historyData.map(item => [
        formatShortDate(item.date),
        item.vehicle || "N/A",
        item.licensePlate || "N/A",
        item.service || "Pending Selection",
        item.status || "COMPLETED"
    ]);

    autoTable(doc, {
        startY: startY,
        head: tableHeaders,
        body: tableRows,
        styles: { fontSize: 9, cellPadding: 4 },
        headStyles: { fillColor: [142, 219, 0], textColor: [255, 255, 255] },
        alternateRowStyles: { fillColor: [248, 250, 252] },
        columnStyles: {
            0: { cellWidth: 30 },
            2: { cellWidth: 35 },
            4: { cellWidth: 30, halign: 'center' }
        }
    });

    // 4. FOOTER
    const finalY = doc.lastAutoTable.finalY || 150;
    doc.setFontSize(9);
    doc.setTextColor(150, 150, 150);
    doc.text("Thank you for choosing our professional vehicle detailing services.", pageWidth / 2, finalY + 20, { align: "center" });
    doc.text(`${doc.internal.getNumberOfPages()} Page(s)`, pageWidth / 2, doc.internal.pageSize.getHeight() - 10, { align: "center" });

    // 5. SAVE
    const fileName = vehicle 
        ? `ServiceHistory_${vehicle.licensePlate}_${new Date().toISOString().split('T')[0]}.pdf`
        : `FullServiceHistory_${new Date().toISOString().split('T')[0]}.pdf`;
        
    doc.save(fileName);
    } catch (error) {
        console.error("PDF Export Error:", error);
        toast.error("Failed to generate PDF. Please try again.");
    }
};
