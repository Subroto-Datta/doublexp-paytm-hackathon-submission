import html2canvas from "html2canvas";
import jsPDF from "jspdf";

/**
 * generatePDF(contractId: string)
 *
 * Generates a PDF from the hidden #zubaan-record-pdf element.
 * Uses html2canvas to capture the DOM element and jsPDF to create the PDF.
 * Saves the file and returns a blob URL for preview/download.
 */
export async function generatePDF(contractId: string): Promise<string> {
  try {
    // 1. Get element
    const element = document.getElementById("zubaan-record-pdf");
    if (!element) {
      throw new Error("PDF element not found");
    }

    // 2. Capture with html2canvas
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#FFFFFF",
    });

    // 3. Get canvas dimensions
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;

    // 4. Create jsPDF instance with custom format
    const pdf = new jsPDF({
      unit: "px",
      format: [imgWidth / 2, imgHeight / 2],
    });

    // 5. Add image to PDF
    const imgData = canvas.toDataURL("image/png");
    pdf.addImage(imgData, "PNG", 0, 0, imgWidth / 2, imgHeight / 2);

    // 6. Save file
    pdf.save(`Zubaan-Record-${contractId}.pdf`);

    // 7. Generate blob URL
    const blob = pdf.output("blob");
    const url = URL.createObjectURL(blob);

    console.log("[PDF Generated]", `Zubaan-Record-${contractId}.pdf`, url);

    return url;
  } catch (err) {
    console.error("[generatePDF Error]", err);
    throw err;
  }
}
