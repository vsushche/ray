'use strict';

const renderButton = document.getElementById('renderButton');
const renderPlaceholder = document.getElementById('renderPlaceholder');
const renderStat = document.getElementById('renderStat');
const renderPicesNumber = document.getElementById('renderPicesNumber');

renderButton.onclick = startRendering;

const stat = {
    startTime: 0,
    pieces: 0
}

function startStat() {
    stat.startTime = Date.now();
    pieces = 0;
    printStat()
}
function printStat() {
    renderStat.innerHTML = `
    Elapsed time: ${(Date.now() - stat.startTime) / 1000}s<br>
    Pieces: ${stat.pieces}
    `;
}


function startRendering() {
    renderPlaceholder.innerHTML = '';
    const table = document.createElement('table');
    table.style.borderCollapse = 'collapse';

    const selectedSize = parseInt(renderPicesNumber.options[renderPicesNumber.selectedIndex].value);
    
    const pictureWidth = 512;
    const pictureHeight = 512;
    const numRows = selectedSize;
    const numCols = selectedSize;
    const rowHeight = pictureHeight / numRows;
    const colWidth = pictureWidth / numCols;
    
    for(let r = 0; r < numRows; r++) {
        const row = table.insertRow(0);
        for(let c = 0; c < numCols; c++) {
            const cell = row.insertCell(0);
            const image = document.createElement('img');
            const startX = Math.round(c * colWidth);
            const endX = Math.round(startX + colWidth);
            const startY = Math.round(r * rowHeight);
            const endY = Math.round(startY + rowHeight);
            image.src = `/render?startX=${startX}&startY=${startY}&endX=${endX}&endY=${endY}`;
            image.width = colWidth;
            image.height = rowHeight;
            image.onload = () => {
                stat.pieces++;
                printStat();
            }
            cell.appendChild(image);
        }
    }

    renderPlaceholder.innerHTML = '';
    renderPlaceholder.appendChild(table);
    startStat();
}

