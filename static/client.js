"use strict";

const renderButton = document.getElementById("renderButton");
const renderPlaceholder = document.getElementById("renderPlaceholder");
const renderStat = document.getElementById("renderStat");
const renderPicesNumber = document.getElementById("renderPicesNumber");

renderButton.onclick = startRendering;

class Stat {
  constructor() {
    this.startTime = Date.now();
    this.piecesReceived = 0;
  }
  newPieceReceived() {
    this.piecesReceived++;
  }
  display() {
    renderStat.innerHTML = `
        Elapsed time: ${(Date.now() - this.startTime) / 1000}s<br>
        Pieces: ${this.piecesReceived}
        `;
  }
}

function startRendering() {
  const nodes = renderPlaceholder.getElementsByTagName("table");
  if (nodes.length) {
    nodes[0].remove();
  }

  const stat = new Stat();
  stat.display();
  const table = document.createElement("table");
  table.style.borderCollapse = "collapse";

  const selectedSize = parseInt(
    renderPicesNumber.options[renderPicesNumber.selectedIndex].value
  );

  const pictureWidth = 512;
  const pictureHeight = 512;
  const numRows = selectedSize;
  const numCols = selectedSize;
  const rowHeight = pictureHeight / numRows;
  const colWidth = pictureWidth / numCols;

  for (let r = 0; r < numRows; r++) {
    const row = table.insertRow(0);
    for (let c = 0; c < numCols; c++) {
      const startX = Math.round(c * colWidth);
      const endX = Math.round(startX + colWidth);
      const startY = Math.round(r * rowHeight);
      const endY = Math.round(startY + rowHeight);
      const image = document.createElement("img");

      image.src = `/render?startX=${startX}&startY=${startY}&endX=${endX}&endY=${endY}`;
      image.width = colWidth;
      image.height = rowHeight;
      image.onload = () => {
        stat.newPieceReceived();
        stat.display();
      };

      const cell = row.insertCell(0);
      cell.appendChild(image);
    }
  }

  renderPlaceholder.innerHTML = "";
  renderPlaceholder.appendChild(table);
}
