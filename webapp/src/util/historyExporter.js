import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { formatShortDate } from "./dateFormatter";
import { toast } from "react-toastify";

const loadImage = (src) => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => resolve(img);
        img.onerror = (err) => reject(err);
        img.src = src;
    });
};

/**
 * Exports service history to a PDF file.
 * @param {Array} historyData - The history logs to export.
 * @param {Object} vehicle - (Optional) Current vehicle details if exporting for a specific one.
 * @param {Object} filters - (Optional) Current filters applied.
 */
export const exportHistoryToPDF = async (historyData, vehicle = null, filters = null) => {
    try {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();

        // 1. HEADER
        let startY = 42;
        let textX = 14;

        try {
            // Load and render Shine Depot logo from public directory
            const logoImg = await loadImage("/logo.jpeg");
            const logoWidth = 22; // mm width
            const logoHeight = (logoImg.naturalHeight / logoImg.naturalWidth) * logoWidth;
            doc.addImage(logoImg, "JPEG", 14, 10, logoWidth, logoHeight);
            textX = 14 + logoWidth + 5; // shift details 5mm to the right of logo
        } catch (error) {
            console.error("Failed to load logo image:", error);
            textX = 14;
        }

        // Draw Company details
        doc.setFont("helvetica", "bold");
        doc.setFontSize(16);
        doc.setTextColor(26, 29, 35);
        doc.text("SHINE DEPOT", textX, 17);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(100, 110, 120);
        doc.text("108 Old Kottawa Rd, Nugegoda", textX, 23);
        doc.text("Hotline: +94 76 315 3797 | Email: shinedepotlk@gmail.com", textX, 28);

        // Draw Document Title on the right side
        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        doc.setTextColor(142, 219, 0); // Primary green color
        doc.text("SERVICE HISTORY LOG", pageWidth - 14, 17, { align: "right" });

        // Draw generated date and time on the right side
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(100, 110, 120);
        const now = new Date();
        doc.text(`Date: ${now.toLocaleDateString()}`, pageWidth - 14, 23, { align: "right" });
        doc.text(`Time: ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`, pageWidth - 14, 28, { align: "right" });

        // Draw header horizontal line separator
        doc.setDrawColor(142, 219, 0); // Primary green
        doc.setLineWidth(0.8);
        doc.line(14, 33, pageWidth - 14, 33);

        // 2. VEHICLE INFO (If specific vehicle)
        if (vehicle) {
            doc.setFont("helvetica", "bold");
            doc.setFontSize(11);
            doc.setTextColor(30, 30, 30);
            doc.text(`Vehicle Details:`, 14, startY);

            doc.setFont("helvetica", "normal");
            doc.setFontSize(9);
            doc.setTextColor(80, 80, 80);
            doc.text(`Make & Model: ${vehicle.make} ${vehicle.model}`, 14, startY + 6);
            doc.text(`License Plate: ${vehicle.licensePlate}`, 14, startY + 12);
            doc.text(`Vehicle Type: ${vehicle.type}`, 14, startY + 18);
            doc.text(`Manufacture Year: ${vehicle.year || 'N/A'}`, 14, startY + 24);
            startY += 32;
        }

        // 2.2 FILTERS INFO
        if (filters && (filters.status !== 'all' || filters.duration !== 'all' || filters.search)) {
            doc.setFont("helvetica", "bold");
            doc.setFontSize(11);
            doc.setTextColor(30, 30, 30);
            doc.text(`Filters Applied:`, 14, startY);

            doc.setFont("helvetica", "normal");
            doc.setFontSize(9);
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
                doc.text(line, 14, startY + 6 + (index * 6));
            });
            startY += 12 + (filterLines.length * 6);
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
