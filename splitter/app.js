//PDF Splitter & Token Counter
//Created by: Chuck Konkol 11/26/2024
//Aqua-Aerobic Systems.
var downloadfilename = "";
const pdfUpload = document.getElementById("pdfUpload");
const processPdf = document.getElementById("processPdf");
const output = document.getElementById("output");
const tokens = document.getElementById("tokens");
const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay))
var TOKEN_LIMIT = document.getElementById("split").value; // Max tokens per split
console.log("TOKEN LIMIT" + TOKEN_LIMIT);
var finaltokens = 0;
processPdf.addEventListener("click", async () => {
    if (!pdfUpload.files.length) {
        alert("Please select upload a PDF file.");
        return;
    }
    tokens.innerHTML = "";
    output.innerHTML = "<br><span class='blink_text'><b>Processing PDF...Please Wait!</b></span>";
    await sleep(3000)
    TOKEN_LIMIT = document.getElementById("split").value;
    finaltokens = 0;
    console.log("updated TOKEN limit" + TOKEN_LIMIT);
    const file = pdfUpload.files[0];
    const name = file.name;
    const lastDot = name.lastIndexOf('.');
    const fileName = name.substring(0, lastDot);
    console.log("file:" + fileName)
    downloadfilename = fileName;
    const arrayBuffer = await file.arrayBuffer();

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
                zip.file(`${fileName}_${part}.pdf`, splitPdf);
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
            zip.file(`${fileName}_${part}.pdf`, splitPdf);
        }

        const zipBlob = await zip.generateAsync({ type: "blob" });
        const url = URL.createObjectURL(zipBlob);

        const downloadLink = document.createElement("a");
        downloadLink.href = url;
        downloadLink.download = downloadfilename + "_pdf_splits.zip";
        downloadLink.textContent = "Download PDF Split Zip File";
        output.innerHTML = "<br>";
        output.appendChild(downloadLink);
    } catch (err) {
        //console.log(`${error.message} (line ${error.lineNumber})`);
        output.innerHTML = `Error: ${err.message} (line ${err.lineNumber})` ;
    }
});


function countTokens(text) {

    try{
        return text.split( /(?<=^(?:.{4})+)(?!$)/ ).length; // Basic token count approximation
    }catch (err){
        output.innerHTML = `Errors: ${err.message} (line ${err.lineNumber})` ;
    }
   
}

async function createPdfFromPages(pages) {
    // Create a new PDF document
    const pdfDoc = await PDFLib.PDFDocument.create();

    // Embed a font (Helvetica in this case)
    //PDFFont.getCharacterSet()
    const font = await pdfDoc.embedFont(PDFLib.StandardFonts.Helvetica);
   // const font = await pdfDoc.embedFont(PDFFont.getCharacterSet());

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

function splitTextIntoLines(text, font, fontSize, maxWidth) {
    let lines = [];
    var words;
    var testLine;
    var testWidth;
    try{
        text = text.replace(/[^ -~]+/g, "");
        words = text.split(/\s+/); // Split text into words
        let currentLine = "";
    
        for (const word of words) {
            testLine = currentLine ? `${currentLine} ${word}` : word;
            testWidth = font.widthOfTextAtSize(testLine, fontSize);
         
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
    }catch (err){
        console.log("testWidth:" + testWidth);
        console.log("Errorwords:" + words);
        output.innerHTML = `Errorsplit: ${err.message} (line ${err.lineNumber})` ;
        console.log( `Errorsplit: ${err.message} (line ${err.lineNumber})`);
        return lines;
    }

}


