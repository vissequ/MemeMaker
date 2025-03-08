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
    footer: {
        text: 'GIFit.net',
        x: 10,
        y: 0,
        color: '#FFFFFF',
        font: 'Arial',
        size: 20,
        uppercase: false,
        outline: false,
    },
};

const fontOptions = [
    'Impact', 'Arial', 'Comic Sans MS', 'Courier New', 'Georgia',
    'Tahoma', 'Times New Roman', 'Trebuchet MS', 'Verdana',
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

function setDefaultControlValues() {
    fontSelector1.value = 'Impact';
    fontSelector2.value = 'Impact';
    fontSizeInput1.value = 60;
    fontSizeInput2.value = 60;
    colorPicker1.value = '#FFFFFF';
    colorPicker2.value = '#FFFFFF';
    outlineToggle1.checked = true;
    outlineToggle2.checked = true;
    outlineColorPicker1.value = '#000000';
    outlineColorPicker2.value = '#000000';
    caseToggle1.checked = true;
    caseToggle2.checked = true;
    textInput1.value = 'LINE 1 EXAMPLE';
    textInput2.value = 'LINE 2 EXAMPLE';
}
setDefaultControlValues();

function showCanvasAndControls() {
    canvasContainer.style.display = 'block';
    line1Controls.style.display = 'block';
    line2Controls.style.display = 'block';
    downloadBtn.style.display = 'block';
    uploadArea.style.display = 'none';
    newImageBtn.style.display = 'block';
}

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
    setDefaultControlValues();
}

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
            textData.line1.x = canvas.width / 2;
            textData.line1.y = canvas.height * 0.15;
            textData.line2.x = canvas.width / 2;
            textData.line2.y = canvas.height * 0.85;
            textData.footer.x = 10;  // Left-aligned
            textData.footer.y = canvas.height - 10;  // Bottom
            drawCanvas();
            showCanvasAndControls();
        };
    };
    reader.readAsDataURL(file);
}

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

    // Draw footer separately
    ctx.font = '20px Arial';
    ctx.textAlign = 'left';
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText('GIFit.net', 10, canvas.height - 10);
}

function drawTextLine(line) {
    if (line !== textData.footer && line.text.trim()) {
        ctx.font = `${line.size}px ${line.font}`;
        ctx.textAlign = 'center';
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

addLiveUpdateListeners('line1', textInput1, fontSelector1, fontSizeInput1, colorPicker1, outlineToggle1, outlineColorPicker1, caseToggle1);
addLiveUpdateListeners('line2', textInput2, fontSelector2, fontSizeInput2, colorPicker2, outlineToggle2, outlineColorPicker2, caseToggle2);

canvas.addEventListener('mousedown', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (isMouseOverText(x, y, textData.line1)) {
        draggingLine = textData.line1;
    } else if (isMouseOverText(x, y, textData.line2)) {
        draggingLine = textData.line2;
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

function isMouseOverText(x, y, line) {
    ctx.font = `${line.size}px ${line.font}`;
    ctx.textAlign = 'center';
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
