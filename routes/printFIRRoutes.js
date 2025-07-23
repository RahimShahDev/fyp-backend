const express = require('express');
const PDFDocument = require('pdfkit');
const QRCode = require('qrcode');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const SuspiciousReport = require('../models/SuspiciousReport');

const router = express.Router();

router.get('/print-fir/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const report = await SuspiciousReport.findById(id);
    if (!report || report.status !== 'Approved') {
      return res.status(404).json({ error: 'Approved report not found' });
    }

    const doc = new PDFDocument({ margin: 50 });
    const filePath = path.join(__dirname, `../public/fir_${id}.pdf`);
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    // 🖼 Logo
    const logoPath = path.join(__dirname, '../public/logo.png');
    if (fs.existsSync(logoPath)) {
      doc.image(logoPath, 50, 30, { width: 70 });
    }

    // 💧 Watermark
    doc.fontSize(60)
      .fillColor('gray')
      .opacity(0.08)
      .rotate(45, { origin: [300, 300] })
      .text('VEHICLE FIR SYSTEM', 100, 250, { align: 'center', width: 500 });
    doc.rotate(-45, { origin: [300, 300] });
    doc.opacity(1).fillColor('black');

    // 📄 Title
    doc.fontSize(24)
      .font('Helvetica-Bold')
      .text('Vehicle FIR Report', 0, 50, { align: 'center', underline: true })
      .moveDown(2);

    // 🗂 Structured Fields
    const startX = 50;
    const labelX = startX;
    const valueX = 200;
    let y = doc.y;

    const printField = (label, value) => {
      doc.font('Helvetica-Bold').fontSize(12).text(`${label}:`, labelX, y);
      doc.font('Helvetica').fontSize(12).text(value || 'N/A', valueX, y);
      y += 25;
    };

    printField('Full Name', report.fullName);
    printField('Email', report.email);
    printField('Vehicle Type', report.vehicleType);
    printField('Plate Number', report.plateNumber);
    printField('Location Seen', report.locationSeen);
    printField('Date/Time Seen', new Date(report.datetimeSeen).toLocaleString());
    printField('Description', report.description);
    printField('Status', report.status);

    // 📸 Add Image (converted if needed)
   // 📸 Add Vehicle Image (Evidence)
if (report.imageUrl) {
  const imgPath = path.join(__dirname, '../', report.imageUrl); // e.g., /uploads/reports/abc.jpg
  // const imgPath = path.join(__dirname, '../public', report.imageUrl); 

  const ext = path.extname(imgPath).toLowerCase();
  const tempJpgPath = path.join(__dirname, `../temp_${id}.jpg`);

  try {
    // Move Y down a bit before image section
    y += 30;
    doc.moveTo(startX, y).lineTo(550, y).strokeColor('#aaaaaa').stroke(); // horizontal line
    y += 15;

    doc.font('Helvetica-Bold').fontSize(14).text('Evidence Image:', labelX, y);
    y += 10;

    // Convert unsupported formats
    let finalImagePath = imgPath;
    if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png') {
      await sharp(imgPath).jpeg().toFile(tempJpgPath);
      finalImagePath = tempJpgPath;
    }
  //   if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png') {
  // await sharp(imgPath).jpeg().toFile(tempJpgPath);
  // finalImagePath = tempJpgPath;
// }


    // Insert image centered below the text
    doc.image(finalImagePath, {
      fit: [400, 250],
      align: 'center',
      valign: 'center'
    });

    if (fs.existsSync(tempJpgPath)) fs.unlinkSync(tempJpgPath); // cleanup
    y += 270;
  } catch (imageErr) {
    console.error('Image processing failed:', imageErr.message);
  }
}


    // 🔍 QR Code
    y += 10;
    doc.font('Helvetica-Bold').fontSize(12).text('Scan to Verify FIR', startX, y);
    const qrData = `https://firsystem.com/view/${report._id}`;
    const qrImage = await QRCode.toDataURL(qrData);
    const imgBuffer = Buffer.from(qrImage.split(',')[1], 'base64');
    doc.image(imgBuffer, startX, y + 15, { width: 100, height: 100 });

    // ✍️ Signature Placeholder
    doc.font('Helvetica-Bold').fontSize(12).text('Inspector Signature:', 380, 700);
    doc.text('_________________________', 380, 715);

    doc.end();

    stream.on('finish', () => {
      res.download(filePath, `FIR_Report_${report.plateNumber}.pdf`, () => {
        fs.unlinkSync(filePath);
      });
    });

  } catch (err) {
    console.error('PDF Error:', err.message);
    res.status(500).json({ error: 'Failed to generate FIR report PDF' });
  }
});

module.exports = router;
