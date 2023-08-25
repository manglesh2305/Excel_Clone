for (let i = 0; i < row; i++) {
    for (let j = 0; j < col; j++) {
        let cell = document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);
        cell.addEventListener("blur", (e) => {
            let address = addressBar.value;
            let [activecell, cellProp] = activeCell(address);
            let enterdData = activecell.innerText;

            if (enterdData === cellProp.value) return;

            cellProp.value = enterdData;

            //if data modifies update 
            removeChildFromParent(cellProp.formula);
            cellProp.formula = "";
            updateChildrenCells(address);
            //console.log(cellProp);
        })
    }
}

let formulaBar = document.querySelector(".formula-bar");

formulaBar.addEventListener("keydown", (e) => {
    let inputFormula = formulaBar.value;
    if (e.key === "Enter" && inputFormula) {

        //If change in formula break old P-C relation
        let address = addressBar.value;
        let [cell, cellProp] = activeCell(address);
        if (inputFormula !== cellProp.formula) removeChildFromParent(cellProp.formula);

        addChildToGraphComponent(inputFormula, address);
        // Check formula is cyclic or not, then only evaluate
        if (isGraphCyclic(graphComponentMatrix)) {
            alert("Your formula is cyclic");
            removeChildFromGraphComponent(inputFormula, address);
            return;
        }

        let evalueatedValue = evaluateFormula(inputFormula);
        setCellUIAndCellProp(evalueatedValue, inputFormula, address);
        addChildToParent(inputFormula);
        updateChildrenCells(address);
        //console.log(sheetDB);
    }
})

function removeChildFromGraphComponent(formula, childAddress) {
    let [crid, ccid] = decodeRIDCIDFromAddress(childAddress);
    let encodedFormula = formula.split(" ");
    for (let i = 0; i < encodedFormula.length; i++) {
        let asciiValue = encodedFormula[i].charCodeAt(0);
        if (asciiValue >= 65 && asciiValue <= 90) {
            let [prid, pcid] = decodeRIDCIDFromAddress(encodedFormula[i]);
            graphComponentMatrix[prid][pcid].pop();
        }
    }
}

function addChildToGraphComponent(formula, childAddress) {
    let [crid, ccid] = decodeRIDCIDFromAddress(childAddress);
    let encodedFormula = formula.split(" ");
    for (let i = 0; i < encodedFormula.length; i++) {
        let asciiValue = encodedFormula[i].charCodeAt(0);
        if (asciiValue >= 65 && asciiValue <= 90) {
            let [prid, pcid] = decodeRIDCIDFromAddress(encodedFormula[i]);
            graphComponentMatrix[prid][pcid].push([crid, ccid]);
        }
    }
}

function addChildToParent(inputFormula) {
    let childAddress = addressBar.value;
    let encodedFormula = inputFormula.split(" ");
    for (let i = 0; i < encodedFormula.length; i++) {
        let asciiValue = encodedFormula[i].charCodeAt(0);
        if (asciiValue >= 65 && asciiValue <= 90) {
            let [parentCell, parentCellProp] = activeCell(encodedFormula[i]);
            parentCellProp.children.push(childAddress);
        }
    }
}

function removeChildFromParent(formula) {
    let childAddress = addressBar.value;
    let encodedFormula = formula.split(" ");
    for (let i = 0; i < encodedFormula.length; i++) {
        let asciiValue = encodedFormula[i].charCodeAt(0);
        if (asciiValue >= 65 && asciiValue <= 90) {
            let [parentCell, parentCellProp] = activeCell(encodedFormula[i]);
            let index = parentCellProp.children.indexOf(childAddress);
            parentCellProp.children.splice(index, 1);
        }
    }
}

function updateChildrenCells(parentAddress) {
    let [parentCell, parentCellProp] = activeCell(parentAddress);
    let children = parentCellProp.children;
    for (let i = 0; i < children.length; i++) {
        let childAddress = children[i];
        let [childCell, childCellProp] = activeCell(childAddress);
        let childFormula = childCellProp.formula;

        let evalueatedValue = evaluateFormula(childFormula);
        setCellUIAndCellProp(evalueatedValue, childFormula, childAddress);
        updateChildrenCells(childAddress);
    }

}

function evaluateFormula(formula) {
    let encodedFormula = formula.split(" ");
    for (let i = 0; i < encodedFormula.length; i++) {
        let asciiValue = encodedFormula[i].charCodeAt(0);
        if (asciiValue >= 65 && asciiValue <= 90) {
            let [cell, cellProp] = activeCell(encodedFormula[i]);
            encodedFormula[i] = cellProp.value;
        }
    }
    let decodedFormula = encodedFormula.join(" ");
    return eval(decodedFormula);
}

function setCellUIAndCellProp(evalueatedValue, formula, address) {
    //let address = addressBar.value;
    let [cell, cellProp] = activeCell(address);
    cell.innerText = evalueatedValue;
    cellProp.value = evalueatedValue;
    cellProp.formula = formula;
}