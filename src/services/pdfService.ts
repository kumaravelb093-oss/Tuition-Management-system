import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Payment } from "./feeService";

export const pdfService = {
    generateReceipt: (payment: Payment) => {
        const doc = new jsPDF();

        // 1. Header
        doc.setFontSize(22);
        doc.setFont("helvetica", "bold");
        doc.text("ACADEMIA TUITION CENTER", 105, 20, { align: "center" });

        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text("123, Excellence Street, Knowledge City, Chennai - 600001", 105, 28, { align: "center" });
        doc.text("Phone: +91 98765 43210 | Email: admin@academia.com", 105, 33, { align: "center" });

        doc.setLineWidth(0.5);
        doc.line(20, 38, 190, 38);

        // 2. Receipt Info
        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        doc.text("FEE RECEIPT", 105, 50, { align: "center" });

        doc.setFontSize(11);
        doc.setFont("helvetica", "normal");

        const leftX = 20;
        const rightX = 140;
        const startY = 65;
        const gap = 8;

        doc.text(`Receipt No: ${payment.receiptNumber || "N/A"}`, leftX, startY);
        doc.text(`Date: ${payment.paymentDate}`, rightX, startY);

        doc.text(`Student Name: ${payment.studentName}`, leftX, startY + gap);
        doc.text(`Class/Grade: ${payment.grade}`, rightX, startY + gap);

        // 3. Table
        const tableStartY = startY + (gap * 3);

        autoTable(doc, {
            startY: tableStartY,
            head: [['Description', 'Month/Year', 'Amount (INR)']],
            body: [
                ['Tuition Fee', `${payment.feeMonth} ${payment.feeYear}`, `Rs. ${payment.amount.toLocaleString()}`],
            ],
            foot: [['Total Paid', '', `Rs. ${payment.amount.toLocaleString()}`]],
            theme: 'grid',
            headStyles: { fillColor: [15, 23, 42], textColor: 255, fontStyle: 'bold' }, // Slate-900
            footStyles: { fillColor: [241, 245, 249], textColor: [15, 23, 42], fontStyle: 'bold' },
        });

        // 4. Footer / Signature
        // @ts-ignore
        const finalY = doc.lastAutoTable.finalY + 40;

        doc.setFontSize(10);
        doc.text("Authorized Signature", 150, finalY, { align: "center" });
        doc.line(130, finalY - 5, 170, finalY - 5);

        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text("This is a computer generated receipt.", 105, 280, { align: "center" });

        // Save
        doc.save(`Receipt_${payment.receiptNumber}.pdf`);
    }
};
