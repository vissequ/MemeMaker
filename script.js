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
};

// Populate font options
const fontOptions = ['Impact', 'Arial', 'Comic Sans MS', 'Courier New', 'Georgia', 'Tahoma', 'Times New Roman', 'Trebuchet MS', 'Verdana'];
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

// Set default values
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

// Show canvas and controls
function showCanvasAndControls() {
    canvasContainer.style.display = 'block';
    line1Controls.style.display = 'block';
    line2Controls.style.display = 'block';
    downloadBtn.style.display = 'block';
    uploadArea.style.display = 'none';
    newImageBtn.style.display = 'block';
}

// Reset editor
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

// Live update listeners
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

// Save as JPG
downloadBtn.addEventListener('click', () => {
    const imageURL = canvas.toDataURL("image/jpeg", 0.9);
    const link = document.createElement('a');
    link.href = imageURL;
    link.download = 'meme.jpg';
    link.click();
});

// Reset button
newImageBtn.addEventListener('click', resetEditor);
