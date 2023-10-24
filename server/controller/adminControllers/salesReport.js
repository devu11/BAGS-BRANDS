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
    const { fromDate, toDate } = req.query;
    if (!fromDate || !toDate) {
      return res.status(400).json({ error: 'Please select both Start and End Date' });
    }
  
    const orders = await Orders.find({
      date: {
        $gte: new Date(fromDate),
        $lte: new Date(toDate),
      },
    }).populate('userId');

    if (orders.length === 0) {
      return res.status(404).json({ error: 'No records found for the given date range' });
    }

    const doc = new pdfDocument({ size: 'A4' });

    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=sales_report.pdf');

    // Create a write stream to save the PDF
    const pdfPath = 'sales_report.pdf';
    const writeStream = fs.createWriteStream(pdfPath);
    doc.pipe(writeStream);

    // Initialize the PDF document
    doc.fontSize(12);

    // Add a header to the table
    doc.text('Sales Report', { align: 'center', size: 16 });
    doc.moveDown();

    // Create a table for the sales report
    const table = {
      headers: ['Order ID', 'Products', 'Quantity', 'Date', 'Amount'],
      rows: [],
    };

    // Populate the table data
    orders.forEach((order) => {
      const productNames = order.product.map((product) => product.name).join(', ');
      const quantities = order.product.map((product) => product.quantity).join(', ');
      const amount = `Rs.${order.amountAfterDiscount || order.total}`;
      table.rows.push([order.orderId, productNames, quantities, order.date, amount]);
    });

    // Set table column widths and column spacing
    const columnWidths = [60, 160, 60, 70, 70];
    const columnSpacing = 15;

    // Calculate the width of the entire table
    const tableWidth = columnWidths.reduce((sum, width) => sum + width, 0) + columnSpacing * (table.headers.length - 1);

    // Calculate the starting X position for the table to center it on the page
    const startX = (doc.page.width - tableWidth) / 2;

    // Draw the table headers
    doc.font('Helvetica-Bold');
    table.headers.forEach((header, index) => {
      doc.text(header, startX + index * (columnWidths[index] + columnSpacing), doc.y, { width: columnWidths[index], align: 'center' });
    });
    doc.moveDown();

    // Draw the table rows
    doc.font('Helvetica');
    table.rows.forEach((row) => {
      row.forEach((cell, index) => {
        doc.text(cell, startX + index * (columnWidths[index] + columnSpacing), doc.y, { width: columnWidths[index], align: 'left' });
      });
      doc.moveDown();
    });

    // Finalize the PDF document
    doc.end();

    // Send the generated PDF as a response
    res.download(pdfPath, 'sales_report.pdf', (err) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while generating the PDF' });
      }
    });

    // Clean up the generated PDF file
    fs.unlinkSync(pdfPath);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred while generating the PDF' });
  }
};


// exports.adminSalesReportpost = async (req, res) => {
//   try {
//     const { fromDate, toDate } = req.body;
//     if(!fromDate || !toDate){
//       return res.status(401).json({error: 'Please select the Start and End Date'});
//     }
//     const doc = new pdfDocument({
//       size: [700, 792],
//     });
//     const orders = await Orders.find({
//       date: {
//         $gte: new Date(fromDate),
//         $lte: new Date(toDate),
//       },
//     }).populate("userId");
//     if (orders.length == 0) {
//       return res.status(400).end();
//     }

//     res.setHeader("Content-Type", "application/pdf");
//     res.setHeader(
//       "Content-Disposition",
//       "attachment; filename=order_report.pdf"
//     );

//     doc.pipe(res);

//     doc.font(spartanMB).fontSize(20).text("Sales Report", { align: "center" });
//     doc.moveDown(0.5);

//     const productNames = orders.map((order) =>
//       order.product.map((product) => product.name).join(", ")
//     );
//     const quantity = orders.map((order) =>
//       order.product.map((quantity) => quantity.quantity).join(", ")
//     );

//     let orderTotal = 0;
//     orders.map((order) => {
//       if (order.amountAfterDiscount == undefined) {
//         orderTotal = order.total;
//       } else {
//         orderTotal = order.amountAfterDiscount;
//       }
//     });

//     const table = {
//       headers: [
//         "User Name",
//         "OrderId",
//         "Products",
//         "Quantity",
//         "Date",
//         "Amount",
//       ],
//       rows: orders.map((order, index) => [
//         order.userId.firstName,
//         order.orderId,
//         productNames[index],
//         quantity[index],
//         order.date,
//         `Rs:${orderTotal}`,
//       ]),
//     };

//     const tableMargin = 50;
//     let startY = doc.y + 50;
//     const rowHeight = 30;
//     const colWidth = (doc.page.width - tableMargin * 2) / table.headers.length;
//     const totalWidth = colWidth * table.headers.length;
//     let rowsPerPage = 10;
//     let rowCount = 0;
//     let currentPage = 1;

//     const startNewPage = () => {
//       doc.addPage();
//       startY = 50; // Reset startY for the new page
//       rowCount = 0; // Reset rowCount for the new page
//       currentPage++;
//     };

//     doc
//       .fillColor("#F0F0F0")
//       .rect(tableMargin, startY, totalWidth, rowHeight)
//       .fill();
//     drawTableRow(
//       doc,
//       table.headers,
//       tableMargin,
//       startY,
//       colWidth,
//       rowHeight,
//       "center",
//       true
//     );

//     startY += rowHeight;

//     table.rows.forEach((row) => {
//       if (rowCount >= rowsPerPage) {
//         // Start a new page when the rowCount exceeds rowsPerPage
//         startNewPage();
//         doc
//           .fillColor("#F0F0F0")
//           .rect(tableMargin, startY, totalWidth, rowHeight)
//           .fill();
//         drawTableRow(
//           doc,
//           table.headers,
//           tableMargin,
//           startY,
//           colWidth,
//           rowHeight,
//           "center",
//           true
//         );
//         startY += rowHeight;
//       }
//       const products = row[2].split(", ");
//       const quantities = row[3].split(", ");

//       products.forEach((product, index) => {
//         const newRow = [...row]; // Create a new row with the same content
//         newRow[2] = product; // Set the product name in the new row
//         newRow[3] = quantities[index]; // Set the corresponding quantity in the new row

//         drawTableRow(
//           doc,
//           newRow,
//           tableMargin,
//           startY,
//           colWidth,
//           rowHeight,
//           index === 0 ? "left" : "center", // Left-align the first product, center-align the rest
//           false
//         );

//         startY += rowHeight;
//         rowCount++;
//       });
//     });

//     const totalOrderRevenue = orders.reduce(
//       (sum, order) => sum + order.total,
//       0
//     );

//     doc.moveDown(1).font(spartanMB).fontSize(12);

//     const totalRow = [
//       "Total Revenue:",
//       "",
//       "",
//       "",
//       "",
//       `Rs:${totalOrderRevenue}`,
//     ];
//     if (rowCount >= rowsPerPage) {
//       // Start a new page if necessary before drawing the totalRow
//       startNewPage();
//     }

//     drawTableRow(
//       doc,
//       totalRow,
//       tableMargin,
//       startY,
//       colWidth,
//       rowHeight,
//       "right",
//       true
//     );

//     const tableHeight = (rowCount + 1) * rowHeight; // +1 for the totalRow

//     // Draw 'from' and 'to' dates below the total row
//     const dateSectionX = tableMargin;
//     const dateSectionY = startY + tableHeight + 20; // Add some space (20 units) below the table
//     // const dateSectionWidth = colWidth * table.headers.length;

//     doc
//       .fontSize(12)
//       .fillColor("black")
//       .text(`From: ${fromDate}`, dateSectionX, dateSectionY);

//     doc
//       .fontSize(12)
//       .fillColor("black")
//       .text(`To: ${toDate}`, dateSectionX, dateSectionY + 20);

//     // End the PDF document
//     doc.end();
//     return res.status(200).end();
//   } catch (err) {
//     console.log(err);
//   }
// };

// function drawTableRow(doc, row, x, y, colWidth, rowHeight, align, isHeader) {
//   try {
//     let startX = x;

//     // Set font and font size based on whether it's a header or regular row
//     if (isHeader) {
//       doc.font(spartanMB).fontSize(12).fillColor("black");
//     } else {
//       doc.font(spartanMB).fontSize(10).fillColor("black");
//     }

//     // Draw each cell of the row with borders
//     row.forEach((cell, index) => {
//       doc.rect(startX, y, colWidth, rowHeight).stroke();

//       // Draw cell content with padding
//       doc.text(cell?.toString() || "", startX + 5, y + 5, {
//         width: colWidth - 10,
//         height: rowHeight - 10,
//         align,
//       });

//       startX += colWidth;
//     });

//     // Draw horizontal line for the row
//     doc
//       .moveTo(x, y + rowHeight)
//       .lineTo(startX, y + rowHeight)
//       .stroke();
//   } catch (error) {
//     console.log(error);
//   }
// }

