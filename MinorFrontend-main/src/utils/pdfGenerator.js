import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export const generatePDF = async (elementId, filename = "Report.pdf") => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with id ${elementId} not found.`);
    return;
  }

  try {
    // Add a temporary class to adjust styles for PDF rendering if needed
    element.classList.add("pdf-rendering");

    const canvas = await html2canvas(element, {
      scale: 2, // Higher scale for better resolution
      useCORS: true, // Allow cross-origin images
      logging: false,
    });

    element.classList.remove("pdf-rendering");

    const imgData = canvas.toDataURL("image/png");

    // A4 size: 210 x 297 mm
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    // Add image to PDF. If it's longer than one page, jsPDF handles it (though manual splitting is better for complex multipage, single page scaling is fine for a summary)
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    
    // Check if we need multiple pages
    let heightLeft = pdfHeight - pdf.internal.pageSize.getHeight();
    let position = -pdf.internal.pageSize.getHeight();
    
    while (heightLeft >= 0) {
      position = heightLeft - pdfHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
      heightLeft -= pdf.internal.pageSize.getHeight();
    }

    pdf.save(filename);
  } catch (error) {
    console.error("Error generating PDF:", error);
  }
};
