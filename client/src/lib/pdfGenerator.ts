import { jsPDF } from 'jspdf';

// Import autotable plugin
require('jspdf-autotable');

// Extend jsPDF type to include autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

interface OrderItem {
  id: string;
  productName: string;
  shop: string;
  quantity: number;
  size: string;
  color: string;
  price: number;
  total: number;
}

interface CustomerInfo {
  name: string;
  phone: string;
}

interface ShippingAddress {
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
}

interface OrderDetail {
  id: string;
  orderStatus: string;
  paymentStatus: string;
  paymentMethod: string;
  orderDate: string;
  deliveryDate: string | null;
  items: OrderItem[];
  customer: CustomerInfo;
  shipping: ShippingAddress;
  subTotal: number;
  couponDiscount: number;
  deliveryCharge: number;
  vatTax: number;
  grandTotal: number;
}

export const generatePDFInvoice = (orderData: OrderDetail) => {
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
  doc.text('Bill To:', 20, 60);
  doc.setFontSize(12);
  doc.text(`${orderData.customer.name}`, 20, 75);
  doc.text(`Phone: ${orderData.customer.phone}`, 20, 85);
  
  // Shipping Address
  doc.setFontSize(14);
  doc.text('Ship To:', 20, 105);
  doc.setFontSize(10);
  doc.text(`${orderData.shipping.name}`, 20, 118);
  doc.text(`Phone: ${orderData.shipping.phone}`, 20, 128);
  doc.text(`${orderData.shipping.addressLine}`, 20, 138);
  doc.text(`${orderData.shipping.addressLine2}`, 20, 148);
  doc.text(`${orderData.shipping.addressType}, Area: ${orderData.shipping.area}`, 20, 158);
  doc.text(`Post Code: ${orderData.shipping.postCode}`, 20, 168);
  
  // Products Table
  const tableData = orderData.items.map((item, index) => [
    index + 1,
    item.productName.substring(0, 50) + (item.productName.length > 50 ? '...' : ''),
    item.shop,
    item.quantity,
    item.size,
    item.color,
    `$${item.price}`,
    `$${item.total}`
  ]);
  
  doc.autoTable({
    startY: 185,
    head: [['#', 'Product', 'Shop', 'Qty', 'Size', 'Color', 'Price', 'Total']],
    body: tableData,
    theme: 'grid',
    headStyles: { 
      fillColor: [220, 38, 127],
      textColor: [255, 255, 255],
      fontSize: 10
    },
    bodyStyles: { 
      fontSize: 9,
      textColor: [60, 60, 60]
    },
    columnStyles: {
      1: { cellWidth: 60 }, // Product name
      0: { cellWidth: 10 }, // Serial number
      2: { cellWidth: 25 }, // Shop
      3: { cellWidth: 15 }, // Quantity
      4: { cellWidth: 15 }, // Size
      5: { cellWidth: 20 }, // Color
      6: { cellWidth: 20 }, // Price
      7: { cellWidth: 20 }  // Total
    }
  });
  
  // Get the final Y position after the table
  const finalY = (doc as any).lastAutoTable?.finalY || 185;
  
  // Summary section
  const summaryY = finalY + 20;
  
  // Summary table
  const summaryData = [
    ['Sub Total', `$${orderData.subTotal}`],
    ['Coupon Discount', `$${orderData.couponDiscount}`],
    ['Delivery Charge', `$${orderData.deliveryCharge}`],
    ['VAT & Tax', `$${orderData.vatTax}`],
    ['Grand Total', `$${orderData.grandTotal}`]
  ];
  
  doc.autoTable({
    startY: summaryY,
    body: summaryData,
    theme: 'plain',
    styles: {
      fontSize: 11,
      cellPadding: 3
    },
    columnStyles: {
      0: { 
        halign: 'right',
        cellWidth: 140,
        fontStyle: 'bold'
      },
      1: { 
        halign: 'right',
        cellWidth: 40,
        fontStyle: 'bold'
      }
    },
    didParseCell: function (data) {
      // Style the grand total row differently
      if (data.row.index === summaryData.length - 1) {
        data.cell.styles.fillColor = [240, 240, 240];
        data.cell.styles.fontSize = 12;
        data.cell.styles.fontStyle = 'bold';
      }
    },
    margin: { left: 20 }
  });
  
  // Footer
  const pageHeight = doc.internal.pageSize.height;
  doc.setFontSize(8);
  doc.setTextColor(128, 128, 128);
  doc.text('© 2025 All right reserved by RazinSoft', 20, pageHeight - 20);
  doc.text('📞 01963953968', 80, pageHeight - 20);
  doc.text('✉ example@gmail.com', 120, pageHeight - 20);
  
  // Save the PDF
  doc.save(`Invoice-${orderData.id}.pdf`);
};