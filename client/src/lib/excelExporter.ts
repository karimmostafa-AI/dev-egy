import * as XLSX from 'xlsx';

interface Order {
  id: string;
  date: string;
  customer: string;
  shop: string;
  amount: string;
  status: string;
  paymentMethod: string;
}

export const exportOrdersToExcel = (orders: Order[], filename: string = 'orders.xlsx') => {
  // Prepare data for Excel
  const excelData = orders.map((order, index) => ({
    'SL': index + 1,
    'Order ID': order.id,
    'Order Date': order.date,
    'Customer': order.customer,
    'Shop': order.shop,
    'Total Amount': order.amount,
    'Payment Method': order.paymentMethod,
    'Status': order.status,
  }));

  // Create a new workbook
  const workbook = XLSX.utils.book_new();

  // Create worksheet from the data
  const worksheet = XLSX.utils.json_to_sheet(excelData);

  // Set column widths
  const columnWidths = [
    { wch: 5 },  // SL
    { wch: 15 }, // Order ID
    { wch: 20 }, // Order Date
    { wch: 20 }, // Customer
    { wch: 20 }, // Shop
    { wch: 15 }, // Total Amount
    { wch: 20 }, // Payment Method
    { wch: 15 }, // Status
  ];
  worksheet['!cols'] = columnWidths;

  // Style the header row
  const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');
  for (let C = range.s.c; C <= range.e.c; ++C) {
    const address = XLSX.utils.encode_cell({ r: 0, c: C });
    if (!worksheet[address]) continue;
    worksheet[address].s = {
      font: { bold: true },
      fill: { fgColor: { rgb: "DC267F" } }, // Pink color
      color: { rgb: "FFFFFF" }
    };
  }

  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Orders');

  // Add summary sheet
  const summaryData = [
    ['Summary Report', ''],
    ['Total Orders', orders.length],
    ['Export Date', new Date().toLocaleDateString()],
    ['Export Time', new Date().toLocaleTimeString()],
    ['', ''],
    ['Status Breakdown', ''],
    ...getStatusBreakdown(orders)
  ];

  const summaryWorksheet = XLSX.utils.aoa_to_sheet(summaryData);
  summaryWorksheet['!cols'] = [{ wch: 20 }, { wch: 15 }];
  XLSX.utils.book_append_sheet(workbook, summaryWorksheet, 'Summary');

  // Generate Excel file and download
  XLSX.writeFile(workbook, filename);
};

const getStatusBreakdown = (orders: Order[]): [string, number][] => {
  const statusCounts: Record<string, number> = {};
  
  orders.forEach(order => {
    statusCounts[order.status] = (statusCounts[order.status] || 0) + 1;
  });

  return Object.entries(statusCounts).map(([status, count]) => [status, count]);
};

// Export filtered orders
export const exportFilteredOrders = (
  allOrders: Order[], 
  searchTerm: string, 
  statusFilter: string,
  filename: string = 'filtered_orders.xlsx'
) => {
  const filteredOrders = allOrders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.shop.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  exportOrdersToExcel(filteredOrders, filename);
};

// Export orders by date range
export const exportOrdersByDateRange = (
  orders: Order[], 
  startDate: string, 
  endDate: string,
  filename: string = 'orders_by_date.xlsx'
) => {
  const filteredOrders = orders.filter(order => {
    const orderDate = new Date(order.date);
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    return orderDate >= start && orderDate <= end;
  });

  exportOrdersToExcel(filteredOrders, filename);
};