//Storage

let graphComponentMatrix = [];

for (let i = 0; i < row; i++) {
    let rows = [];
    for (let j = 0; j < col; j++) {
        rows.push([]);
    }
    graphComponentMatrix.push(rows);
}

function isGraphCyclic(graphComponentMatrix) {
    let visited = [];
    let dfsVisited = [];

    for (let i = 0; i < row; i++) {
        let visitedRow = [];
        let dfsVisitedRow = [];
        for (let j = 0; j < col; j++) {
            visitedRow.push(false);
            dfsVisitedRow.push(false);
        }
        visited.push(visitedRow);
        dfsVisited.push(dfsVisitedRow);
    }

    for (let i = 0; i < row; i++) {
        for (let j = 0; j < col; j++) {
            if (visited[i][j] === false) {
                if (dfsCycleDetection(graphComponentMatrix, i, j, visited, dfsVisited)) {
                    return [i,j];
                }
            }
        }
    }
    return null;
}

function dfsCycleDetection(graphComponentMatrix, i, j, visited, dfsVisited) {

    visited[i][j] = true;
    dfsVisited[i][j] = true;

    for (let children = 0; children < graphComponentMatrix[i][j].length; children++) {
        let [crid, ccid] = graphComponentMatrix[i][j][children];
        if (visited[crid][ccid] === false) {
            if (dfsCycleDetection(graphComponentMatrix, crid, ccid, visited, dfsVisited)) {
                return true;
            }
        }
        else if (dfsVisited[crid][ccid] === true) {
            return true;
        }
    }

    dfsVisited[i][j] = false;
    return false;
}