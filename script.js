const uploadArea = document.getElementById('upload-area');
const imageUpload = document.getElementById('image-upload');
const canvasContainer = document.getElementById('canvas-container');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const line1Controls = document.getElementById('line1-controls');
const line2Controls = document.getElementById('line2-controls');
const line3Controls = document.getElementById('line3-controls');
const line4Controls = document.getElementById('line4-controls');
const textInput1 = document.getElementById('text-input-1');
const textInput2 = document.getElementById('text-input-2');
const textInput3 = document.getElementById('text-input-3');
const textInput4 = document.getElementById('text-input-4');
const fontSelector1 = document.getElementById('font-selector-1');
const fontSelector2 = document.getElementById('font-selector-2');
const fontSelector3 = document.getElementById('font-selector-3');
const fontSelector4 = document.getElementById('font-selector-4');
const fontSizeInput1 = document.getElementById('font-size-1');
const fontSizeInput2 = document.getElementById('font-size-2');
const fontSizeInput3 = document.getElementById('font-size-3');
const fontSizeInput4 = document.getElementById('font-size-4');
const colorPicker1 = document.getElementById('color-picker-1');
const colorPicker2 = document.getElementById('color-picker-2');
const colorPicker3 = document.getElementById('color-picker-3');
const colorPicker4 = document.getElementById('color-picker-4');
const outlineToggle1 = document.getElementById('outline-toggle-1');
const outlineToggle2 = document.getElementById('outline-toggle-2');
const outlineToggle3 = document.getElementById('outline-toggle-3');
const outlineToggle4 = document.getElementById('outline-toggle-4');
const outlineColorPicker1 = document.getElementById('outline-color-picker-1');
const outlineColorPicker2 = document.getElementById('outline-color-picker-2');
const outlineColorPicker3 = document.getElementById('outline-color-picker-3');
const outlineColorPicker4 = document.getElementById('outline-color-picker-4');
const caseToggle1 = document.getElementById('case-toggle-1');
const caseToggle2 = document.getElementById('case-toggle-2');
const caseToggle3 = document.getElementById('case-toggle-3');
const caseToggle4 = document.getElementById('case-toggle-4');
const downloadBtn = document.getElementById('download-btn');
const newImageBtn = document.getElementById('new-image-btn');

let image = null;
let draggingLine = null;

// Updated default settings including new lines with empty text
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
    line3: {
        text: '',
        x: 50,
        y: 300,
        color: '#FFFFFF',
        font: 'Impact',
        size: 60,
        uppercase: true,
        outline: true,
        outlineColor: '#000000',
    },
    line4: {
        text: '',
        x: 50,
        y: 400,
        color: '#FFFFFF',
        font: 'Impact',
        size: 60,
        uppercase: true,
        outline: true,
        outlineColor: '#000000',
    },
    footer: {
        text: 'dontcensor.us',
        x: 10,
        y: 0,
        color: '#FFFFFF',
        font: 'Arial',
        size: 20,
        uppercase: false,
        outline: false,
    },
};

// Populate font options for all lines
const fontOptions = [
    'Impact',
    'Arial',
    'Comic Sans MS',
    'Courier New',
    'Georgia',
    'Tahoma',
    'Times New Roman',
    'Trebuchet MS',
    'Verdana',
];
function populateFontSelector(selector) {
    fontOptions.forEach((font) => {
        const option = document.createElement('option');
        option.value = font;
        option.textContent = font;
        selector.appendChild(option);
    });
}
populateFontSelector(fontSelector1);
populateFontSelector(fontSelector2);
populateFontSelector(fontSelector3);
populateFontSelector(fontSelector4);

// Set default values in the controls
function setDefaultControlValues() {
    fontSelector1.value = 'Impact';
    fontSelector2.value = 'Impact';
    fontSelector3.value = 'Impact';
    fontSelector4.value = 'Impact';
    fontSizeInput1.value = 60;
    fontSizeInput2.value = 60;
    fontSizeInput3.value = 60;
    fontSizeInput4.value = 60;
    colorPicker1.value = '#FFFFFF';
    colorPicker2.value = '#FFFFFF';
    colorPicker3.value = '#FFFFFF';
    colorPicker4.value = '#FFFFFF';
    outlineToggle1.checked = true;
    outlineToggle2.checked = true;
    outlineToggle3.checked = true;
    outlineToggle4.checked = true;
    outlineColorPicker1.value = '#000000';
    outlineColorPicker2.value = '#000000';
    outlineColorPicker3.value = '#000000';
    outlineColorPicker4.value = '#000000';
    caseToggle1.checked = true;
    caseToggle2.checked = true;
    caseToggle3.checked = true;
    caseToggle4.checked = true;
    textInput1.value = 'LINE 1 EXAMPLE';
    textInput2.value = 'LINE 2 EXAMPLE';
    textInput3.value = '';
    textInput4.value = '';
}
setDefaultControlValues();

// Show canvas and controls once an image is uploaded
function showCanvasAndControls() {
    canvasContainer.style.display = 'block';
    line1Controls.style.display = 'block';
    line2Controls.style.display = 'block';
    line3Controls.style.display = 'block';
    line4Controls.style.display = 'block';
    downloadBtn.style.display = 'block';
    uploadArea.style.display = 'none';
    newImageBtn.style.display = 'block';
}

// Reset the editor for a new image
function resetEditor() {
    image = null;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    canvasContainer.style.display = 'none';
    line1Controls.style.display = 'none';
    line2Controls.style.display = 'none';
    line3Controls.style.display = 'none';
    line4Controls.style.display = 'none';
    downloadBtn.style.display = 'none';
    newImageBtn.style.display = 'none';
    uploadArea.style.display = 'block';
    textData.line1 = { ...textData.line1, text: 'LINE 1 EXAMPLE' };
    textData.line2 = { ...textData.line2, text: 'LINE 2 EXAMPLE' };
    textData.line3 = { ...textData.line3, text: '' };
    textData.line4 = { ...textData.line4, text: '' };
    setDefaultControlValues();
}

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
            const aspectRatio = image.width / image.height;
            if (image.width > image.height) {
                canvas.width = 800;
                canvas.height = canvas.width / aspectRatio;
            } else {
                canvas.height = 600;
                canvas.width = canvas.height * aspectRatio;
            }
            
            // Update text positions
            textData.line1.x = canvas.width / 2;
            textData.line1.y = canvas.height * 0.15;
            textData.line2.x = canvas.width / 2;
            textData.line2.y = canvas.height * 0.85;
            textData.line3.x = canvas.width / 2;
            textData.line3.y = canvas.height * 0.35;
            textData.line4.x = canvas.width / 2;
            textData.line4.y = canvas.height * 0.65;
            textData.footer.x = canvas.width / 2;
            textData.footer.y = canvas.height - 20;

            drawCanvas();
            showCanvasAndControls();
        };
    };
    reader.readAsDataURL(file);
}

// Draw canvas
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

    if (textData.footer.y === 0) {
        textData.footer.y = canvas.height - 10;
    }

    // Draw all text lines
    drawTextLine(textData.line1);
    drawTextLine(textData.line2);
    drawTextLine(textData.line3);
    drawTextLine(textData.line4);
    drawTextLine(textData.footer);
}

// Draw text line
function drawTextLine(line) {
    if (line.text.trim()) {
        // ctx.font = `${line.size}px ${line.font}`;
        ctx.textAlign = "center";
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

// Event listeners for live updates
function addLiveUpdateListeners(lineKey, textInput, fontSelector, fontSizeInput, colorPicker, outlineToggle, outlineColorPicker, caseToggle) {
    textInput.addEventListener('input', (e) => {
        textData[lineKey].text = e.target.value;
        drawCanvas();
    });
    fontSelector.addEventListener('change', (e) => {
        textData[lineKey].font = e.target.value;
        drawCanvas();
    });
    fontSizeInput.addEventListener('input', (e) => {
        textData[lineKey].size = parseInt(e.target.value, 10);
        drawCanvas();
    });
    colorPicker.addEventListener('input', (e) => {
        textData[lineKey].color = e.target.value;
        drawCanvas();
    });
    outlineToggle.addEventListener('change', (e) => {
        textData[lineKey].outline = e.target.checked;
        outlineColorPicker.style.display = e.target.checked ? 'block' : 'none';
        drawCanvas();
    });
    outlineColorPicker.addEventListener('input', (e) => {
        textData[lineKey].outlineColor = e.target.value;
        drawCanvas();
    });
    caseToggle.addEventListener('change', (e) => {
        textData[lineKey].uppercase = e.target.checked;
        drawCanvas();
    });
}

// Add listeners for all editable lines
addLiveUpdateListeners('line1', textInput1, fontSelector1, fontSizeInput1, colorPicker1, outlineToggle1, outlineColorPicker1, caseToggle1);
addLiveUpdateListeners('line2', textInput2, fontSelector2, fontSizeInput2, colorPicker2, outlineToggle2, outlineColorPicker2, caseToggle2);
addLiveUpdateListeners('line3', textInput3, fontSelector3, fontSizeInput3, colorPicker3, outlineToggle3, outlineColorPicker3, caseToggle3);
addLiveUpdateListeners('line4', textInput4, fontSelector4, fontSizeInput4, colorPicker4, outlineToggle4, outlineColorPicker4, caseToggle4);

// Dragging logic
canvas.addEventListener('mousedown', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (isMouseOverText(x, y, textData.line1)) {
        draggingLine = textData.line1;
    } else if (isMouseOverText(x, y, textData.line2)) {
        draggingLine = textData.line2;
    } else if (isMouseOverText(x, y, textData.line3)) {
        draggingLine = textData.line3;
    } else if (isMouseOverText(x, y, textData.line4)) {
        draggingLine = textData.line4;
    } else if (isMouseOverText(x, y, textData.footer)) {
        draggingLine = textData.footer;
    }
});
canvas.addEventListener('mousemove', (e) => {
    if (draggingLine) {
        const rect = canvas.getBoundingClientRect();
        draggingLine.x = e.clientX - rect.left;
        draggingLine.y = e.clientY - rect.top;
        drawCanvas();
    }
});
canvas.addEventListener('mouseup', () => {
    draggingLine = null;
});

// Hit detection
function isMouseOverText(x, y, line) {
    ctx.font = `${line.size}px ${line.font}`;
    ctx.textAlign = "center";
    const displayText = line.uppercase ? line.text.toUpperCase() : line.text;
    const textWidth = ctx.measureText(displayText).width;
    const textHeight = line.size;
    const left = line.x - textWidth / 2;
    const right = line.x + textWidth / 2;
    const top = line.y - textHeight;
    const bottom = line.y;
    return x > left && x < right && y > top && y < bottom;
}

downloadBtn.addEventListener('click', () => {
    draggingLine = null;
    drawCanvas();
    const dataURL = canvas.toDataURL('image/jpeg');
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = 'meme.jpg';
    link.click();
});

newImageBtn.addEventListener('click', resetEditor);
