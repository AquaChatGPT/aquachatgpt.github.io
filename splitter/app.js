const pdfUpload = document.getElementById("pdfUpload");
const processPdf = document.getElementById("processPdf");
const output = document.getElementById("output");
const tokens = document.getElementById("tokens");


var TOKEN_LIMIT = document.getElementById("split").value; // Max tokens per split
console.log("TOKEN LIMIT" + TOKEN_LIMIT);
var finaltokens = 0;
processPdf.addEventListener("click", async () => {
    
    if (!pdfUpload.files.length) {
        alert("Please upload a PDF file.");
        return;
    }
    TOKEN_LIMIT = document.getElementById("split").value;
    finaltokens = 0;
    console.log("updated TOKEN limit" + TOKEN_LIMIT);
    const file = pdfUpload.files[0];
    const arrayBuffer = await file.arrayBuffer();

    output.innerHTML = "Processing PDF...";
    try {
        const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
        const totalPages = pdf.numPages;

        let currentTokens = 0;
        let currentSplit = [];
        let zip = new JSZip();
        let part = 1;

        for (let i = 1; i <= totalPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map((item) => item.str).join(" ");
         
            const tokens = countTokens(pageText);
            console.log("tokens: " + tokens);
            console.log("currentTokens + tokens: " + (currentTokens + tokens));
            finaltokens = finaltokens + tokens;
            if (currentTokens + tokens > TOKEN_LIMIT) {
                // Save current split to ZIP
                const splitPdf = await createPdfFromPages(currentSplit);
                zip.file(`split_${part}.pdf`, splitPdf);
                part++;
                currentTokens = 0;
                currentSplit = [];
            }

            currentSplit.push(pageText);
            currentTokens += tokens;
        }
        console.log("finaltoens: " + (finaltokens));
        tokens.innerHTML = "<br>Total tokens: " + (finaltokens);
        // Save last split
        if (currentSplit.length > 0) {
            const splitPdf = await createPdfFromPages(currentSplit);
            zip.file(`split_${part}.pdf`, splitPdf);
        }

        const zipBlob = await zip.generateAsync({ type: "blob" });
        const url = URL.createObjectURL(zipBlob);

        const downloadLink = document.createElement("a");
        downloadLink.href = url;
        downloadLink.download = "pdf_splits.zip";
        downloadLink.textContent = "Download PDF Splits";
        output.innerHTML = "<br>";
        output.appendChild(downloadLink);
    } catch (err) {
        output.innerHTML = `Error: ${err.message}`;
    }
});

function countTokens(text) {
    //.split( /(?<=^(?:.{3})+)(?!$)/ )
    //old
    //return text.split(/\s+/).length; // Basic token count approximation
    return text.split( /(?<=^(?:.{4})+)(?!$)/ ).length; // Basic token count approximation
}

async function createPdfFromPages(pages) {
    // Create a new PDF document
    const pdfDoc = await PDFLib.PDFDocument.create();

    // Embed a font (Helvetica in this case)
    const font = await pdfDoc.embedFont(PDFLib.StandardFonts.Helvetica);

    // Define font size and page margins
    const fontSize = 12;
    const margin = 50;

    for (const pageText of pages) {
        // Add a new page
        let page = pdfDoc.addPage();

        const { width, height } = page.getSize();
        const textWidth = width - 2 * margin;

        // Split text into lines that fit within the textWidth
        const lines = splitTextIntoLines(pageText, font, fontSize, textWidth);

        // Start writing text at the top of the page
        let yPosition = height - margin;

        for (const line of lines) {
            if (yPosition < margin) {
                // Add a new page when space runs out
                page = pdfDoc.addPage();
                yPosition = height - margin;
            }
            page.drawText(line, {
                x: margin,
                y: yPosition,
                size: fontSize,
                font: font,
            });
            yPosition -= fontSize + 5; // Adjust line spacing
        }
    }

    // Serialize the PDF document to bytes
    const pdfBytes = await pdfDoc.save();

    // Return a Blob for the generated PDF
    return new Blob([pdfBytes], { type: "application/pdf" });
}

/**
 * Splits a large block of text into lines that fit within a given width.
 *
 * @param {string} text - The text to split.
 * @param {PDFLib.PDFFont} font - The font used for measuring text width.
 * @param {number} fontSize - The font size used.
 * @param {number} maxWidth - The maximum width of each line.
 * @returns {string[]} - An array of lines of text.
 */
function splitTextIntoLines(text, font, fontSize, maxWidth) {
    const words = text.split(/\s+/); // Split text into words
    let lines = [];
    let currentLine = "";

    for (const word of words) {
        const testLine = currentLine ? `${currentLine} ${word}` : word;
        const testWidth = font.widthOfTextAtSize(testLine, fontSize);

        if (testWidth > maxWidth) {
            // Current line is full; push it to lines and start a new line
            if (currentLine) lines.push(currentLine);
            currentLine = word;
        } else {
            // Add the word to the current line
            currentLine = testLine;
        }
    }

    // Add the last line if it exists
    if (currentLine) lines.push(currentLine);

    return lines;
}


