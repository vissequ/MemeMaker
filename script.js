const uploadArea = document.getElementById('upload-area');
const imageUpload = document.getElementById('image-upload');
const canvasContainer = document.getElementById('canvas-container');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const line1Controls = document.getElementById('line1-controls');
const line2Controls = document.getElementById('line2-controls');
const textInput1 = document.getElementById('text-input-1');
const textInput2 = document.getElementById('text-input-2');
const fontSelector1 = document.getElementById('font-selector-1');
const fontSelector2 = document.getElementById('font-selector-2');
const fontSizeInput1 = document.getElementById('font-size-1');
const fontSizeInput2 = document.getElementById('font-size-2');
const colorPicker1 = document.getElementById('color-picker-1');
const colorPicker2 = document.getElementById('color-picker-2');
const outlineToggle1 = document.getElementById('outline-toggle-1');
const outlineToggle2 = document.getElementById('outline-toggle-2');
const outlineColorPicker1 = document.getElementById('outline-color-picker-1');
const outlineColorPicker2 = document.getElementById('outline-color-picker-2');
const caseToggle1 = document.getElementById('case-toggle-1');
const caseToggle2 = document.getElementById('case-toggle-2');
const downloadBtn = document.getElementById('download-btn');
const newImageBtn = document.getElementById('new-image-btn');

let image = null;
let draggingLine = null;

// Updated default settings
let textData = {
    line1: {
        text: 'LINE 1 EXAMPLE',
        x: 50,
        y: 100,
        color: '#FFFFFF',
        font: 'Impact',
        size: 60,
        uppercase: true,
        outline: true,
        outlineColor: '#000000',
    },
    line2: {
        text: 'LINE 2 EXAMPLE',
        x: 50,
        y: 200,
        color: '#FFFFFF',
        font: 'Impact',
        size: 60,
        uppercase: true,
        outline: true,
        outlineColor: '#000000',
    },
};

// Image upload logic
uploadArea.addEventListener('click', () => imageUpload.click());
uploadArea.addEventListener('dragover', (e) => e.preventDefault());
uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) loadImage(file);
});
imageUpload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) loadImage(file);
});

function loadImage(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        image = new Image();
        image.src = e.target.result;
        image.onload = () => {
            drawCanvas();
            showCanvasAndControls();
        };
    };
    reader.readAsDataURL(file);
}

function showCanvasAndControls() {
    canvasContainer.style.display = 'block';
    line1Controls.style.display = 'block';
    line2Controls.style.display = 'block';
    downloadBtn.style.display = 'block';
    uploadArea.style.display = 'none';
    newImageBtn.style.display = 'block';
}

// Draw the canvas
function drawCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (image) {
        const aspectRatio = image.width / image.height;
        if (image.width > image.height) {
            canvas.width = 800;
            canvas.height = canvas.width / aspectRatio;
        } else {
            canvas.height = 600;
            canvas.width = canvas.height * aspectRatio;
        }
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    }

    drawTextLine(textData.line1);
    drawTextLine(textData.line2);
}

// Draw text
function drawTextLine(line) {
    if (line.text.trim()) {
        ctx.font = `${line.size}px ${line.font}`;
        const displayText = line.uppercase ? line.text.toUpperCase() : line.text;

        if (line.outline) {
            ctx.strokeStyle = line.outlineColor;
            ctx.lineWidth = 4;
            ctx.strokeText(displayText, line.x, line.y);
        }

        ctx.fillStyle = line.color;
        ctx.fillText(displayText, line.x, line.y);
    }
}

// ✅ Function to draw the watermark ONLY on the downloaded image
function drawWatermark() {
    const watermarkText = "@connorfabiano";
    const fontSize = 30;
    const padding = 20;

    ctx.font = `${fontSize}px Arial`;
    ctx.fillStyle = "rgba(255, 255, 255, 0.5)"; // ✅ White text with 50% transparency

    const textWidth = ctx.measureText(watermarkText).width;
    const xPos = canvas.width - textWidth - padding; // Bottom-right corner
    const yPos = canvas.height - padding;

    ctx.fillText(watermarkText, xPos, yPos);
}

// ✅ Save as JPG with watermark
downloadBtn.addEventListener('click', () => {
    // Clone canvas so we don't modify the on-screen preview
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tempCtx = tempCanvas.getContext('2d');

    // Copy the existing canvas content
    tempCtx.drawImage(canvas, 0, 0);

    // Add the watermark to the new canvas
    tempCtx.font = "30px Arial";
    tempCtx.fillStyle = "rgba(255, 255, 255, 0.5)"; // ✅ White with 50% transparency
    const watermarkText = "@connorfabiano";
    const textWidth = tempCtx.measureText(watermarkText).width;
    const xPos = tempCanvas.width - textWidth - 20; // Bottom-right
    const yPos = tempCanvas.height - 20;
    tempCtx.fillText(watermarkText, xPos, yPos);

    // Convert to JPEG and download
    const imageURL = tempCanvas.toDataURL("image/jpeg", 0.9);
    const link = document.createElement('a');
    link.href = imageURL;
    link.download = 'meme.jpg';
    link.click();
});

// Reset editor
newImageBtn.addEventListener('click', resetEditor);

function resetEditor() {
    image = null;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    canvasContainer.style.display = 'none';
    line1Controls.style.display = 'none';
    line2Controls.style.display = 'none';
    downloadBtn.style.display = 'none';
    newImageBtn.style.display = 'none';
    uploadArea.style.display = 'block';
    textData.line1 = { ...textData.line1, text: 'LINE 1 EXAMPLE' };
    textData.line2 = { ...textData.line2, text: 'LINE 2 EXAMPLE' };
}
