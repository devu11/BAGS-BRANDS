const pdfDocument = require("pdfkit");
const Orders = require("../../model/orders");
const path = require("path");
const fs=require("fs");

const spartanMB = path.join(
  __dirname,
  "../../assets/fonts/Spartan MB SemiBold.ttf"
);

exports.adminSalesReports = async (req, res) => {
  try {
    const deliveredOrders = await Orders.find({ status: "Delivered" });
    res.render("admin_sales_report", { deliveredOrders });

  } catch (err) {
    console.log(err);
  }
};

exports.adminSalesReportPDF = async (req, res) => {

  try {
    const { fromDate, toDate } = req.query; // Assuming you'll pass these as query parameters
    console.log(fromDate, toDate);
    // Validate input here
    if (!fromDate || !toDate) {
      console.log("sales report error")
      return res.status(400).json({ error: "Please select both Start and End Date" });
    }

    // Generate the PDf
    const doc = new pdfDocument({
      size: "A4", // Standard A4 page size
    });

    const orders = await Orders.find({
      date: {

        $gte: new Date(fromDate),
        $lte: new Date(toDate),
      },

    }).populate("userId");
    console.log(orders)
    if (orders.length === 0) {
      return res.status(404).json({ error: "No records found for the given date range" });
    }

    // Set response headers
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=sales_report.pdf");

    // Pipe the PDF directly to the response stream
    doc.pipe(res);
    doc
  .fontSize(25).text('BAGS & BRANDS', { align: 'center' });
  doc
  .fontSize(12)

    // PDF content generation (similar to your previous code)
    orders.forEach((order) => {
      // Append order details to the PDF
      doc.text(`Order ID: ${order.orderId}`);
      doc.text(`Date: ${order.date}`);
      doc.text("Products:");
      order.product.forEach((product) => {
        doc.text(`   ${product.name}, Quantity: ${product.quantity}`);
      })
      doc.text(`   Amount: Rs.${order.amountAfterDiscount || order.total}`);
      doc.text('--------------------------------------------');
    });
    // End the PDF
    doc.end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred while generating the PDF" });
  }
};