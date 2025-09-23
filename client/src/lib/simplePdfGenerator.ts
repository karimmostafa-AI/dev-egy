import { jsPDF } from 'jspdf';

interface OrderDetail {
  id: string;
  orderStatus: string;
  paymentStatus: string;
  paymentMethod: string;
  orderDate: string;
  deliveryDate: string | null;
  items: any[];
  customer: {
    name: string;
    phone: string;
  };
  shipping: {
    name: string;
    phone: string;
    addressType: string;
    area: string;
    roadNo: string;
    flatNo: string;
    houseNo: string;
    postCode: string;
    addressLine: string;
    addressLine2: string;
  };
  subTotal: number;
  couponDiscount: number;
  deliveryCharge: number;
  vatTax: number;
  grandTotal: number;
}

export const generatePDFInvoice = (orderData: OrderDetail) => {
  // Try to use autotable if available, otherwise use simple version
  try {
    return generateAdvancedPDFInvoice(orderData);
  } catch (error) {
    console.warn('Advanced PDF generation failed, using simple version:', error);
    return generateSimplePDFInvoice(orderData);
  }
};

const generateAdvancedPDFInvoice = (orderData: OrderDetail) => {
  const { jsPDF } = require('jspdf');
  require('jspdf-autotable');
  
  const doc = new jsPDF();
  
  // Header
  doc.setFont("helvetica");
  doc.setFontSize(24);
  doc.setTextColor(220, 38, 127);
  doc.text('DEV Egypt', 20, 30);
  
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text('INVOICE', 150, 30);
  
  // Order Info
  doc.setFontSize(12);
  doc.text(`Invoice #: ${orderData.id}`, 150, 45);
  doc.text(`Date: ${orderData.orderDate}`, 150, 55);
  doc.text(`Status: ${orderData.orderStatus}`, 150, 65);
  
  // Customer Info
  doc.setFontSize(14);
  doc.text('Bill To:', 20, 80);
  doc.setFontSize(12);
  doc.text(`${orderData.customer.name}`, 20, 95);
  doc.text(`Phone: ${orderData.customer.phone}`, 20, 105);
  
  // Products Table with autotable
  const tableData = orderData.items.map((item, index) => [
    index + 1,
    item.productName.substring(0, 40),
    item.shop,
    item.quantity,
    item.size,
    item.color,
    `$${item.price}`,
    `$${item.total}`
  ]);
  
  doc.autoTable({
    startY: 120,
    head: [['#', 'Product', 'Shop', 'Qty', 'Size', 'Color', 'Price', 'Total']],
    body: tableData,
    theme: 'grid',
    headStyles: { 
      fillColor: [220, 38, 127],
      textColor: [255, 255, 255],
      fontSize: 10
    },
    bodyStyles: { 
      fontSize: 9
    }
  });
  
  // Get position after table
  const finalY = doc.lastAutoTable?.finalY || 200;
  
  // Summary
  const summaryY = finalY + 20;
  doc.text(`Sub Total: $${orderData.subTotal}`, 120, summaryY);
  doc.text(`Delivery: $${orderData.deliveryCharge}`, 120, summaryY + 10);
  doc.text(`VAT & Tax: $${orderData.vatTax}`, 120, summaryY + 20);
  doc.text(`Total: $${orderData.grandTotal}`, 120, summaryY + 35);
  
  doc.save(`Invoice-${orderData.id}.pdf`);
};

export const generateSimplePDFInvoice = (orderData: OrderDetail) => {
  const doc = new jsPDF();
  
  // Set font
  doc.setFont("helvetica");
  
  // Header
  doc.setFontSize(24);
  doc.setTextColor(220, 38, 127); // Pink color
  doc.text('DEV Egypt', 20, 30);
  
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text('INVOICE', 150, 30);
  
  // Order Info
  doc.setFontSize(12);
  doc.text(`Invoice #: ${orderData.id}`, 150, 45);
  doc.text(`Date: ${orderData.orderDate}`, 150, 55);
  doc.text(`Status: ${orderData.orderStatus}`, 150, 65);
  
  // Customer Info
  doc.setFontSize(14);
  doc.text('Bill To:', 20, 80);
  doc.setFontSize(12);
  doc.text(`${orderData.customer.name}`, 20, 95);
  doc.text(`Phone: ${orderData.customer.phone}`, 20, 105);
  
  // Shipping Address
  doc.setFontSize(14);
  doc.text('Ship To:', 20, 125);
  doc.setFontSize(10);
  doc.text(`${orderData.shipping.name}`, 20, 138);
  doc.text(`Phone: ${orderData.shipping.phone}`, 20, 148);
  doc.text(`${orderData.shipping.addressLine}`, 20, 158);
  doc.text(`${orderData.shipping.addressLine2}`, 20, 168);
  doc.text(`${orderData.shipping.addressType}, Area: ${orderData.shipping.area}`, 20, 178);
  doc.text(`Post Code: ${orderData.shipping.postCode}`, 20, 188);
  
  // Order Summary (Simple text-based)
  doc.setFontSize(14);
  doc.text('Order Summary:', 20, 210);
  doc.setFontSize(12);
  
  let yPos = 225;
  orderData.items.forEach((item, index) => {
    doc.text(`${index + 1}. ${item.productName.substring(0, 50)}`, 20, yPos);
    doc.text(`   Shop: ${item.shop} | Qty: ${item.quantity} | Price: $${item.price}`, 25, yPos + 10);
    yPos += 25;
  });
  
  // Totals
  yPos += 10;
  doc.text(`Sub Total: $${orderData.subTotal}`, 120, yPos);
  doc.text(`Delivery Charge: $${orderData.deliveryCharge}`, 120, yPos + 10);
  doc.text(`VAT & Tax: $${orderData.vatTax}`, 120, yPos + 20);
  doc.text(`Coupon Discount: $${orderData.couponDiscount}`, 120, yPos + 30);
  
  // Grand Total
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text(`Grand Total: $${orderData.grandTotal}`, 120, yPos + 50);
  
  // Footer
  const pageHeight = doc.internal.pageSize.height;
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(128, 128, 128);
  doc.text('© 2025 All right reserved by RazinSoft', 20, pageHeight - 20);
  doc.text('📞 01963953968', 80, pageHeight - 20);
  doc.text('✉ example@gmail.com', 120, pageHeight - 20);
  
  // Save the PDF
  doc.save(`Invoice-${orderData.id}.pdf`);
};