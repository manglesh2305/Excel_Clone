let ctrlKey;

document.addEventListener("keydown", (e) => {
    ctrlKey = e.ctrlKey;
})
document.addEventListener("keyup", (e) => {
    ctrlKey = e.ctrlKey;
})

for (let i = 0; i < row; i++) {
    for (let j = 0; j < col; j++) {
        let cell = document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);
        handleSelectedCell(cell);
    }
}

let copyBtn = document.querySelector(".copy");
let cutBtn = document.querySelector(".cut");
let pasteBtn = document.querySelector(".paste");

let rangeStorage = [];
function handleSelectedCell(cell) {
    cell.addEventListener("click", (e) => {
        //Select range
        if (!ctrlKey) return;
        if (rangeStorage.length >= 2) {
            handleSelectedCellUI();
            rangeStorage = [];
        }

        //UI
        cell.style.border = "3px solid #218c74";

        let rid = Number(cell.getAttribute("rid"));
        let cid = Number(cell.getAttribute("cid"));
        rangeStorage.push([rid, cid]);
    })
}

function handleSelectedCellUI() {
    for (let i = 0; i < rangeStorage.length; i++) {
        let cell = document.querySelector(`.cell[rid="${rangeStorage[i][0]}"][cid="${rangeStorage[i][1]}"]`);
        cell.style.border = "1px solid #dfe4ea";
    }
}
let copyData = [];
copyBtn.addEventListener("click", (e) => {
    if(rangeStorage.length<2) return;
    copyData = [];

    for (let i = rangeStorage[0][0]; i <= rangeStorage[1][0]; i++) {
        let copyRow = [];
        for (let j = rangeStorage[0][1]; j <= rangeStorage[1][1]; j++) {
            let cellProp = sheetDB[i][j];
            copyRow.push(cellProp);
        }
        copyData.push(copyRow);
    }
    handleSelectedCellUI();
})

cutBtn.addEventListener("click",(e)=>{
    if(rangeStorage.length<2) return;
    
    for (let i = rangeStorage[0][0]; i <= rangeStorage[1][0]; i++) {
        for (let j = rangeStorage[0][1]; j <= rangeStorage[1][1]; j++) {
            let cell = document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);
            //DB
            let cellProp = sheetDB[i][j];
            cellProp.value = "";
            cellProp.italic = false;
            cellProp.bold = false;
            cellProp.underline = false;
            cellProp.fontSize = 14;
            cellProp.fontFamily = "monospace";
            cellProp.fontColor = "#000000";
            cellProp.BGColor = "#ecf0f1";
            cellProp.alignment = "left";
            //UI
            cell.click();
        }
    }
    handleSelectedCellUI();
})

pasteBtn.addEventListener("click", (e) => {

    let rowDiff = Math.abs(rangeStorage[0][0] - rangeStorage[1][0]);
    let colDiff = Math.abs(rangeStorage[0][1] - rangeStorage[1][1]);

    let address = addressBar.value;
    let [stRow, stCol] = decodeRIDCIDFromAddress(address);

    for (let i = stRow, r = 0; i <= stRow + rowDiff && i < row; i++, r++) {
        for (let j = stCol, c = 0; j <= stCol + colDiff && j < col; j++, c++) {
            let cell = document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);

            //DB change
            let data = copyData[r][c];
            let cellProp = sheetDB[i][j];
            cellProp.value = data.value;
            cellProp.italic = data.italic;
            cellProp.bold = data.bold;
            cellProp.underline = data.underline;
            cellProp.fontSize = data.fontSize;
            cellProp.fontFamily = data.fontFamily;
            cellProp.fontColor = data.fontColor;
            cellProp.BGColor = data.BGColor;
            cellProp.alignment = data.alignment;

            //UI Change
            cell.click();
        }
    }
})