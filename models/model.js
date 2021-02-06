module.exports.loadModelFromVTK = (_str) => {
    let model = { POINTS : [], CELLS : [], POINT_DATAS : [], CELL_DATAS : [] };

    const tokens = _str.split(/\t+\r\n|\s+\r\n|\r\n|\t+|\s+|\r|\n/);
    for (let i = 0; i < tokens.length;) {
        if (tokens[i] == 'POINTS') {
            const pointsnum = parseInt(tokens[i + 1]);
            i += 3;
            for (let j = 0; j < pointsnum; j++) {
                model.POINTS.push({ x : parseFloat(tokens[i++]), y : parseFloat(tokens[i++]), z : parseFloat(tokens[i++]) });
            }
        } else if (tokens[i] == 'CELLS') {
            const cellsnum = parseInt(tokens[i + 1]);
            i += 3;
            for (let j = 0; j < cellsnum; j++) {
                const pointnum = parseInt(tokens[i++]);
                let cell = { POINTS : [], TYPE : -1 };
                for (let k = 0; k < pointnum; k++) {
                    cell.POINTS.push(parseInt(tokens[i++]));
                }
                model.CELLS.push(cell);
            }
        } else if (tokens[i] == 'CELL_TYPES') {
            const cellsnum = parseInt(tokens[i + 1]);
            i += 2;
            for (let j = 0; j < cellsnum; j++) {
                model.CELLS[j].TYPE = parseInt(tokens[i++]);
            }
        } else if (tokens[i] == 'POINT_DATA') {
            const pointsnum = parseInt(tokens[i + 1]);
            let pointdata = { TAG : tokens[i + 1], VALUES : [] };

            if (tokens[i + 2] == 'SCALARS') {
                i += 7;
                for (let j = 0; j < pointsnum; j++) {
                    pointdata.VALUES.push(parseFloat(tokens[i++]));
                }
            } else if (tokens[i + 2] == 'VECTORS') {
                i += 5;
                for (let j = 0; j < pointsnum; j++) {
                    pointdata.VALUES.push({ x : parseFloat(tokens[i++]), y : parseFloat(tokens[i++]), z : parseFloat(tokens[i++]) });
                }
            } else if (tokens[i + 2] == 'TENSORS') {
                i += 5;
            }

            model.POINT_DATAS.push(pointdata);
        } else if (tokens[i] == 'CELL_DATA') {
            const cellsnum = parseInt(tokens[i + 1]);
            let celldata = { TAG : tokens[i + 3], VALUES : [] };
            
            if (tokens[i + 2] == 'SCALARS') {
                i += 7;
                for (let j = 0; j < cellsnum; j++) {
                    celldata.VALUES.push(parseFloat(tokens[i++]));
                }
            } else if (tokens[i + 2] == 'VECTORS') {
                i += 5;
                for (let j = 0; j < cellsnum; j++) {
                    celldata.VALUES.push({ x : parseFloat(tokens[i++]), y : parseFloat(tokens[i++]), z : parseFloat(tokens[i++]) });
                }
            } else if (tokens[i + 2] == 'TENSORS') {
                i += 5;
            }

            model.CELL_DATAS.push(celldata);
        } else {
            i++;
        }
    }

    return model;
}