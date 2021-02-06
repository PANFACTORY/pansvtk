module.exports.loadModelFromVTK = (_str) => {
    let model = { POINTS : [], CELLS : [] };

    const tokens = _str.split(/\t+\r\n|\s+\r\n|\r\n|\t+|\s+|\r|\n/);
    for (let i = 0; i < tokens.length; i++) {
        if (tokens[i] == 'POINTS') {
            const pointsnum = parseInt(tokens[i + 1]);
            i += 3;
            for (let j = 0; j < pointsnum; j++) {
                let point = { x : parseFloat(tokens[i]), y : parseFloat(tokens[i + 1]), z : parseFloat(tokens[i + 2]) };
                model.POINTS.push(point);
                i += 3;
            }
        } else if (tokens[i] == 'CELLS') {
            const cellsnum = parseInt(tokens[i + 1]);
            i += 3;
            for (let j = 0; j < cellsnum; j++) {
                const pointnum = parseInt(tokens[i]);
                let cell = { POINTS : [], TYPE : -1 };
                for (let k = 1; k <= pointnum; k++) {
                    cell.POINTS.push(parseInt(tokens[i + k]));
                }
                model.CELLS.push(cell);
                i += pointnum + 1;
            }
        } else if (tokens[i] == 'CELL_TYPES') {
            const cellsnum = parseInt(tokens[i + 1]);
            i += 2;
            for (let j = 0; j < cellsnum; j++) {
                model.CELLS[j].TYPE = parseInt(tokens[i]);
                i++;
            }
        }
    }

    return model;
}