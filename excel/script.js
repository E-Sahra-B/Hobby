const gridContainer = document.getElementById('grid-container');
const selectedCellInput = document.getElementById('selected-cell');
const colorPicker = document.getElementById('color-picker');
const colorButton = document.getElementById('color-button');

const COLS = 26;
const ROWS = 100;
const STORAGE_KEY = 'excelSheetData';

let selectedCell = null;

// --- Veri Yönetimi ---
function getSheetData() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
}

function saveSheetData(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function loadSheetData() {
    const sheetData = getSheetData();
    for (const cellId in sheetData) {
        const cell = document.getElementById(cellId);
        if (cell) {
            const data = sheetData[cellId];
            // Değeri değil, formülü veya metni hücreye yükle
            cell.textContent = data.formula || data.text || '';
            if (data.color) {
                cell.style.backgroundColor = data.color;
            }
        }
    }
    recalculateSheet(); // Tüm formülleri hesapla
}

// --- Formül Motoru ---

// A1:B3 gibi bir aralığı ['A1', 'A2', ...] şeklinde hücre ID'lerine çevirir
function parseRange(rangeStr) {
    const [start, end] = rangeStr.split(':');
    const startCol = start.match(/[A-Z]+/)[0];
    const startRow = parseInt(start.match(/[0-9]+/)[0], 10);
    const endCol = end.match(/[A-Z]+/)[0];
    const endRow = parseInt(end.match(/[0-9]+/)[0], 10);

    const startColIndex = startCol.charCodeAt(0) - 65;
    const endColIndex = endCol.charCodeAt(0) - 65;

    const cellIds = [];
    for (let c = startColIndex; c <= endColIndex; c++) {
        for (let r = startRow; r <= endRow; r++) {
            cellIds.push(`${String.fromCharCode(65 + c)}${r}`);
        }
    }
    return cellIds;
}

// Bir hücrenin sayısal değerini alır
function getCellValue(cellId) {
    const sheetData = getSheetData();
    const data = sheetData[cellId];
    if (!data) return 0;
    // Değer formül sonucundan veya doğrudan metinden gelebilir
    const value = data.value !== undefined ? data.value : data.text;
    return parseFloat(value) || 0;
}

function evaluateFormula(formula) {
    // =ŞİMDİ() veya =NOW()
    if (formula.toUpperCase() === '=ŞİMDİ()' || formula.toUpperCase() === '=NOW()') {
        return new Date().toLocaleString('tr-TR');
    }

    // =TOPLA(...) veya =SUM(...)
    const sumMatch = formula.match(/^=(?:TOPLA|SUM)\((.+)\)$/i);
    if (sumMatch) {
        const range = sumMatch[1];
        const cellIds = parseRange(range);
        return cellIds.reduce((acc, cellId) => acc + getCellValue(cellId), 0);
    }

    return formula; // Formül tanınmazsa kendisini döndür
}

function recalculateSheet() {
    const sheetData = getSheetData();
    let changed = false;
    for (const cellId in sheetData) {
        const data = sheetData[cellId];
        if (data.formula) {
            const newValue = evaluateFormula(data.formula);
            if (newValue !== data.value) {
                data.value = newValue;
                changed = true;
            }
        }
    }

    if (changed) {
        saveSheetData(sheetData);
    }
    updateAllCellDisplays();
}

function updateAllCellDisplays() {
    const sheetData = getSheetData();
    for (let r = 1; r <= ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            const cellId = `${String.fromCharCode(65 + c)}${r}`;
            const cell = document.getElementById(cellId);
            if (cell) {
                const data = sheetData[cellId];
                if (data) {
                    cell.textContent = data.value !== undefined ? data.value : (data.text || '');
                } else {
                    cell.textContent = '';
                }
            }
        }
    }
}

// --- Grid ve Olay Yöneticileri ---

function createGrid() {
    const grid = document.createElement('div');
    grid.className = 'grid';
    const corner = document.createElement('div');
    corner.className = 'cell header corner';
    grid.appendChild(corner);
    for (let i = 0; i < COLS; i++) {
        const header = document.createElement('div');
        header.className = 'cell header';
        header.textContent = String.fromCharCode(65 + i);
        grid.appendChild(header);
    }
    for (let i = 1; i <= ROWS; i++) {
        const rowHeader = document.createElement('div');
        rowHeader.className = 'cell row-header';
        rowHeader.textContent = i;
        grid.appendChild(rowHeader);
        for (let j = 0; j < COLS; j++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.id = `${String.fromCharCode(65 + j)}${i}`;
            grid.appendChild(cell);
        }
    }
    gridContainer.appendChild(grid);
}

gridContainer.addEventListener('click', (e) => {
    const target = e.target;
    if (target.classList.contains('cell') && !target.classList.contains('header') && !target.classList.contains('row-header')) {
        if (selectedCell) {
            selectedCell.classList.remove('selected');
        }
        selectedCell = target;
        selectedCell.classList.add('selected');
        selectedCellInput.value = selectedCell.id;
    }
});

gridContainer.addEventListener('dblclick', (e) => {
    const target = e.target;
    if (target === selectedCell) {
        const sheetData = getSheetData();
        const data = sheetData[target.id];
        // Düzenleme için formülü göster
        if (data && data.formula) {
            target.textContent = data.formula;
        } 
        target.contentEditable = true;
        target.focus();
    }
});

function finishEditing(cell) {
    if (!cell || !cell.isContentEditable) return;
    cell.contentEditable = false;

    const sheetData = getSheetData();
    const cellId = cell.id;
    const text = cell.textContent;

    if (!sheetData[cellId]) sheetData[cellId] = {};

    if (text.startsWith('=')) {
        sheetData[cellId].formula = text;
        delete sheetData[cellId].text; // Eski metin değerini sil
    } else {
        sheetData[cellId].text = text;
        delete sheetData[cellId].formula; // Eski formül değerini sil
        delete sheetData[cellId].value; // Eski hesaplanmış değeri sil
    }
    
    saveSheetData(sheetData);
    recalculateSheet();
}

gridContainer.addEventListener('blur', (e) => {
    if (e.target.isContentEditable) {
        finishEditing(e.target);
    }
}, true);

gridContainer.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.target.isContentEditable) {
        e.preventDefault();
        finishEditing(e.target);
    }
});

colorButton.addEventListener('click', () => {
    if (selectedCell) {
        const color = colorPicker.value;
        selectedCell.style.backgroundColor = color;
        const sheetData = getSheetData();
        const cellId = selectedCell.id;
        if (!sheetData[cellId]) sheetData[cellId] = {};
        sheetData[cellId].color = color;
        saveSheetData(sheetData);
    }
});

// --- Başlangıç ---
createGrid();
loadSheetData();
