import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { formatShortDate } from "./dateFormatter";
import { toast } from "react-toastify";

/**
 * Exports service history to a PDF file.
 * @param {Array} historyData - The history logs to export.
 * @param {Object} vehicle - (Optional) Current vehicle details if exporting for a specific one.
 * @param {Object} filters - (Optional) Current filters applied.
 */
export const exportHistoryToPDF = (historyData, vehicle = null, filters = null) => {
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
            doc.text(`Manufacture Year: ${vehicle.year || 'N/A'}`, 14, startY + 28);
            startY += 42;
        }

        // 2.2 FILTERS INFO
        if (filters && (filters.status !== 'all' || filters.duration !== 'all' || filters.search)) {
            doc.setFontSize(12);
            doc.setTextColor(30, 30, 30);
            doc.text(`Filters Applied:`, 14, startY);

            doc.setFontSize(10);
            doc.setTextColor(80, 80, 80);
            let filterLines = [];
            if (filters.search) filterLines.push(`Search: "${filters.search}"`);
            if (filters.status && filters.status !== 'all') filterLines.push(`Status: ${filters.status.toUpperCase()}`);
            if (filters.duration && filters.duration !== 'all') {
                const durationLabel = filters.duration === '6m' ? 'Last 6 Months' :
                    filters.duration === '1y' ? 'Last Year' :
                        filters.duration === '2y' ? 'Last 2 Years' :
                            filters.duration === '5y' ? 'Last 5 Years' : filters.duration;
                filterLines.push(`Duration: ${durationLabel}`);
            }

            filterLines.forEach((line, index) => {
                doc.text(line, 14, startY + 7 + (index * 7));
            });
            startY += 15 + (filterLines.length * 7);
        } else {
            startY += 5; // Extra space if no filters
        }

        // 3. DATA TABLE
        const tableHeaders = [["DATE", "VEHICLE", "LICENSE PLATE", "SERVICE PACKAGE", "MILEAGE", "STATUS"]];
        const tableRows = historyData.map(item => [
            formatShortDate(item.date),
            item.vehicle || "N/A",
            item.licensePlate || "N/A",
            item.service || "Pending Selection",
            item.milageCount ? `${item.milageCount.toLocaleString()} km` : "N/A",
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
                0: { cellWidth: 25 },
                2: { cellWidth: 30 },
                4: { cellWidth: 25, halign: 'center' },
                5: { cellWidth: 25, halign: 'center' }
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
