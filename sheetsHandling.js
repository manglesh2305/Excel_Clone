let sheetFolderCont = document.querySelector(".sheet-folder-cont");
let addSheetBtn = document.querySelector(".sheet-add-icon");

addSheetBtn.addEventListener("click", (e) => {
    let sheet = document.createElement("div");
    sheet.setAttribute("class", "sheet-folder");

    let allSheetFolders = document.querySelectorAll(".sheet-folder")
    sheet.setAttribute("id", allSheetFolders.length);

    sheet.innerHTML = `<div class="sheet-content">Sheet ${allSheetFolders.length + 1}</div>`
    sheetFolderCont.appendChild(sheet);

    //DB
    createSheetDB();
    createGraphComponentMatrix();
    handleSheetActiveness(sheet);
    handleSheetRemoval(sheet);
    sheet.click();
})

function handleSheetRemoval(sheet){
    sheet.addEventListener("mousedown",(e)=>{
        if(e.button !== 2) return ;
        let allSheetFolders = document.querySelectorAll(".sheet-folder");
        if(allSheetFolders.length === 1) {
            alert("You need to have atleast one sheet");
            return ;
        }
        let response = confirm("Are you you want to delete this sheet?");
        if(!response) return;
        let sheetIndex = Number(sheet.getAttribute("id"));
        collectedSheetDB.splice(sheetIndex,1);
        collectedGraphComponent.splice(sheetIndex,1);
        handleSheetUIRemoval(sheet);
        sheetDB = collectedSheetDB[0];
        graphComponentMatrix = collectedGraphComponent[0];
        handleSheetProps();
    })
}

function handleSheetUIRemoval(sheet){
    sheet.remove();
    let allSheetFolders = document.querySelectorAll(".sheet-folder");
    for(let i=0;i<allSheetFolders.length;i++){
        allSheetFolders[i].setAttribute("id",i);
        let sheetContent = allSheetFolders[i].querySelector(".sheet-content");
        sheetContent.innerText = `Sheet ${i+1}`;
        allSheetFolders[i].style.backgroundColor="transparent";
    }
    allSheetFolders[0].style.backgroundColor = "#ced6e0";
}

function handleSheetDB(sheetIndex) {
    sheetDB = collectedSheetDB[sheetIndex];
    graphComponentMatrix = collectedGraphComponent[sheetIndex];
}

function handleSheetProps() {
    for (let i = 0; i < row; i++) {
        for (let j = 0; j < col; j++) {
            let cell = document.querySelector(`.cell[rid="${i}"][cid="${j}"]`)
            cell.click();
        }
    }
    let firstCell = document.querySelector(".cell");
    firstCell.click();
}

function handleSheetUI(sheet){
    let allSheetFolders = document.querySelectorAll(".sheet-folder");
    for(let i=0;i<allSheetFolders.length;i++){
        allSheetFolders[i].style.backgroundColor = "transparent"; 
    }
    sheet.style.backgroundColor="#ced6e0";
}

function handleSheetActiveness(sheet) {
    sheet.addEventListener("click", (e) => {
        let sheetIndex = Number(sheet.getAttribute("id"));
        handleSheetDB(sheetIndex);
        handleSheetProps();
        handleSheetUI(sheet);
    })
}

function createSheetDB() {
    let sheetDB = [];
    for (let i = 0; i < row; i++) {
        let sheetRow = [];
        for (let j = 0; j < col; j++) {
            let cellProp = {
                bold: false,
                italic: false,
                underline: false,
                alignment: "left",
                fontFamily: "monospace",
                fontSize: "14",
                fontColor: "#000000",
                BGColor: "#ecf0f1",
                value: "",
                formula: "",
                children: [],
            }
            sheetRow.push(cellProp);
        }
        sheetDB.push(sheetRow);
    }
    collectedSheetDB.push(sheetDB);
}

function createGraphComponentMatrix() {
    let graphComponentMatrix = [];
    for (let i = 0; i < row; i++) {
        let rows = [];
        for (let j = 0; j < col; j++) {
            rows.push([]);
        }
        graphComponentMatrix.push(rows);
    }
    collectedGraphComponent.push(graphComponentMatrix);
}