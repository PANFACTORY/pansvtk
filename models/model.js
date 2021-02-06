module.exports.loadModelFromVTK = (_str) => {
    let model = { POINTS : [], CELLS : [], POINT_DATAS : {}, CELL_DATAS : {} };

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
            const tag = tokens[i + 3];
            model.POINT_DATAS[tag] = [];

            if (tokens[i + 2] == 'SCALARS') {
                i += 7;
                for (let j = 0; j < pointsnum; j++) {
                    model.POINT_DATAS[tag].push(parseFloat(tokens[i++]));
                }
            } else if (tokens[i + 2] == 'VECTORS') {
                i += 5;
                for (let j = 0; j < pointsnum; j++) {
                    model.POINT_DATAS[tag].push({ x : parseFloat(tokens[i++]), y : parseFloat(tokens[i++]), z : parseFloat(tokens[i++]) });
                }
            } else if (tokens[i + 2] == 'TENSORS') {
                i += 5;
                for (let j = 0; j < pointsnum; j++) {
                    model.POINT_DATAS[tag].push({ 
                        xx : parseFloat(tokens[i++]), xy : parseFloat(tokens[i++]), xz : parseFloat(tokens[i++]),
                        yx : parseFloat(tokens[i++]), yy : parseFloat(tokens[i++]), yz : parseFloat(tokens[i++]),
                        zx : parseFloat(tokens[i++]), zy : parseFloat(tokens[i++]), zz : parseFloat(tokens[i++])
                    });
                }
            }
        } else if (tokens[i] == 'CELL_DATA') {
            const cellsnum = parseInt(tokens[i + 1]);
            const tag = tokens[i + 3];
            model.CELL_DATAS[tag] = [];
            
            if (tokens[i + 2] == 'SCALARS') {
                i += 7;
                for (let j = 0; j < cellsnum; j++) {
                    model.CELL_DATAS[tag].push(parseFloat(tokens[i++]));
                }
            } else if (tokens[i + 2] == 'VECTORS') {
                i += 5;
                for (let j = 0; j < cellsnum; j++) {
                    model.CELL_DATAS[tag].push({ x : parseFloat(tokens[i++]), y : parseFloat(tokens[i++]), z : parseFloat(tokens[i++]) });
                }
            } else if (tokens[i + 2] == 'TENSORS') {
                i += 5;
                for (let j = 0; j < cellsnum; j++) {
                    model.CELL_DATAS[tag].push({ 
                        xx : parseFloat(tokens[i++]), xy : parseFloat(tokens[i++]), xz : parseFloat(tokens[i++]),
                        yx : parseFloat(tokens[i++]), yy : parseFloat(tokens[i++]), yz : parseFloat(tokens[i++]),
                        zx : parseFloat(tokens[i++]), zy : parseFloat(tokens[i++]), zz : parseFloat(tokens[i++])
                    });
                }
            }
        } else {
            i++;
        }
    }

    return model;
}