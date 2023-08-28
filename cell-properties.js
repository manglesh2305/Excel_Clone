let collectedSheetDB = []; //Contains all sheet DB
let sheetDB = [];

{
    let addSheetBtn = document.querySelector(".sheet-add-icon");
    addSheetBtn.click();
    //handleSheetProps() ;
}

// for (let i = 0; i < row; i++) {
//     let sheetRow = [];
//     for (let j = 0; j < col; j++) {
//         let cellProp = {
//             bold: false,
//             italic: false,
//             underline: false,
//             alignment: "left",
//             fontFamily: "monospace",
//             fontSize: "14",
//             fontColor: "#000000",
//             BGColor: "#ecf0f1",
//             value:"",
//             formula:"",
//             children:[],
//         }
//         sheetRow.push(cellProp);
//     }
//     sheetDB.push(sheetRow);
// }

let fontFamily = document.querySelector(".font-family-prop");
let bold = document.querySelector(".bold");
let italic = document.querySelector(".italic");
let underline = document.querySelector(".underline");
let fontSize = document.querySelector(".font-size-prop");
let fontColor = document.querySelector(".font-color-prop");
let BGColor = document.querySelector(".bg-color-prop");
let alignment = document.querySelectorAll(".alignment");
let leftAlign = alignment[0];
let centerAlign = alignment[1];
let rightAlign = alignment[2];

let activeColorProp = "#d1d8e0";
let inactiveColorProp = "#ecf0f1";

bold.addEventListener("click", (e) => {
    let address = addressBar.value;
    let [cell, cellProp] = activeCell(address);

    //Modification
    cellProp.bold = !cellProp.bold;
    cell.style.fontWeight = cellProp.bold ? "bold" : "normal";
    bold.style.backgroundColor = cellProp.bold ? activeColorProp : inactiveColorProp;
})

italic.addEventListener("click", (e) => {
    let address = addressBar.value;
    let [cell, cellProp] = activeCell(address);

    //Modification
    cellProp.italic = !cellProp.italic;
    cell.style.fontStyle = cellProp.italic ? "italic" : "normal";
    italic.style.backgroundColor = cellProp.italic ? activeColorProp : inactiveColorProp;
})

underline.addEventListener("click", (e) => {
    let address = addressBar.value;
    let [cell, cellProp] = activeCell(address);

    //Modification
    cellProp.underline = !cellProp.underline;
    cell.style.textDecoration = cellProp.underline ? "underline" : "none";
    underline.style.backgroundColor = cellProp.underline ? activeColorProp : inactiveColorProp;
})

fontSize.addEventListener("change", (e) => {
    let address = addressBar.value;
    let [cell, cellProp] = activeCell(address);

    cellProp.fontSize = fontSize.value;
    cell.style.fontSize = cellProp.fontSize + "px";
    fontSize.value = cellProp.fontSize;
})

fontFamily.addEventListener("change", (e) => {
    let address = addressBar.value;
    let [cell, cellProp] = activeCell(address);

    cellProp.fontFamily = fontFamily.value;
    cell.style.fontFamily = cellProp.fontFamily;
    fontFamily.value = cellProp.fontFamily;
})

fontColor.addEventListener("change", (e) => {
    let address = addressBar.value;
    let [cell, cellProp] = activeCell(address);

    cellProp.fontColor = fontColor.value;
    cell.style.color = cellProp.fontColor;
    fontColor.value = cellProp.fontColor;
})

BGColor.addEventListener("change", (e) => {
    let address = addressBar.value;
    let [cell, cellProp] = activeCell(address);

    cellProp.BGColor = BGColor.value;
    cell.style.backgroundColor = cellProp.BGColor;
    BGColor.value = cellProp.BGColor;
})

alignment.forEach((alignElement) => {
    alignElement.addEventListener("click", (e) => {
        let address = addressBar.value;
        let [cell, cellProp] = activeCell(address);
        let alignValue = e.target.classList[0];
        cellProp.alignment = alignValue;
        cell.style.textAlign = cellProp.alignment;

        switch (alignValue) {
            case ("left"):
                leftAlign.style.backgroundColor = activeColorProp;
                centerAlign.style.backgroundColor = inactiveColorProp;
                rightAlign.style.backgroundColor = inactiveColorProp;
                break;
            case ("center"):
                leftAlign.style.backgroundColor = inactiveColorProp;
                centerAlign.style.backgroundColor = activeColorProp;
                rightAlign.style.backgroundColor = inactiveColorProp;
                break;
            case ("right"):
                leftAlign.style.backgroundColor = inactiveColorProp;
                centerAlign.style.backgroundColor = inactiveColorProp;
                rightAlign.style.backgroundColor = activeColorProp;
                break;
        }

    })
})

let allCells = document.querySelectorAll(".cell");
for (let i = 0; i < allCells.length; i++) {
    addListenerToAttachCellProps(allCells[i]);
}

function addListenerToAttachCellProps(cell) {
    cell.addEventListener("click", (e) => {
        let address = addressBar.value;
        let [rid, cid] = decodeRIDCIDFromAddress(address)
        let cellProp = sheetDB[rid][cid];

        cell.style.backgroundColor = cellProp.BGColor;
        cell.style.color = cellProp.fontColor;
        cell.style.fontWeight = cellProp.bold ? "bold" : "normal";
        cell.style.fontFamily = cellProp.fontFamily;
        cell.style.fontSize = cellProp.fontSize + "px";
        cell.style.textDecoration = cellProp.underline ? "underline" : "none";
        cell.style.textAlign = cellProp.alignment;



        BGColor.value = cellProp.BGColor;
        fontColor.value = cellProp.fontColor;
        fontFamily.value = cellProp.fontFamily;
        fontSize.value = cellProp.fontSize;
        underline.style.backgroundColor = cellProp.underline ? activeColorProp : inactiveColorProp;
        italic.style.backgroundColor = cellProp.italic ? activeColorProp : inactiveColorProp;
        bold.style.backgroundColor = cellProp.bold ? activeColorProp : inactiveColorProp;
        switch (cellProp.alignment) {
            case ("left"):
                leftAlign.style.backgroundColor = activeColorProp;
                centerAlign.style.backgroundColor = inactiveColorProp;
                rightAlign.style.backgroundColor = inactiveColorProp;
                break;
            case ("center"):
                leftAlign.style.backgroundColor = inactiveColorProp;
                centerAlign.style.backgroundColor = activeColorProp;
                rightAlign.style.backgroundColor = inactiveColorProp;
                break;
            case ("right"):
                leftAlign.style.backgroundColor = inactiveColorProp;
                centerAlign.style.backgroundColor = inactiveColorProp;
                rightAlign.style.backgroundColor = activeColorProp;
                break;
        }
        let formulaBar = document.querySelector(".formula-bar");
        formulaBar.value = cellProp.formula;
        cell.innerText = cellProp.value;
    })
}

function activeCell(address) {
    let [rid, cid] = decodeRIDCIDFromAddress(address);
    let cell = document.querySelector(`.cell[rid="${rid}"][cid="${cid}"]`);     //***************// 
    let cellProp = sheetDB[rid][cid];
    return [cell, cellProp];
}

function decodeRIDCIDFromAddress(address) {
    let rid = Number(address.slice(1)) - 1;
    let cid = Number(address.charCodeAt(0)) - 65;
    return [rid, cid];
}