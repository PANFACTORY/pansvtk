module.exports.loadModelFromVTK = (_str) => {
    let model = { POINTS : [], CELLS : [], POINT_DATAS : {}, CELL_DATAS : {} };
    let gridtype = "UNSTRUCTURED_GRID";
    let datamode = "";
    let datasnum = 0;

    const tokens = _str.split(/\t+\r\n|\s+\r\n|\r\n|\t+|\s+|\r|\n/);
    for (let i = 0; i < tokens.length;) {
        if (tokens[i] == 'DATASET') {
            gridtype = tokens[i + 1];
            i += 2;
        } else if (tokens[i] == 'DIMENSIONS' && gridtype == 'STRUCTURED_GRID') {
            i += 1;
            const xlength = parseInt(tokens[i++]);
            const ylength = parseInt(tokens[i++]);
            const zlength = parseInt(tokens[i++]);
            if (ylength == 1 && zlength == 1) {
                for (let x = 0; x < xlength - 1; x++) {
                    model.CELLS.push({ POINTS : [ x, x + 1 ], TYPE : 3 });
                }
            } else if (zlength == 1) {
                for (let x = 0; x < xlength - 1; x++) {
                    for (let y = 0; y < ylength - 1; y++) {
                        model.CELLS.push({ POINTS : [ 
                            x + xlength*y, 
                            (x + 1) + xlength*y, 
                            (x + 1) + xlength*(y + 1), 
                            x + xlength*(y + 1) 
                        ], TYPE : 9 });
                    }
                }
            } else {
                for (let x = 0; x < xlength - 1; x++) {
                    for (let y = 0; y < ylength - 1; y++) {
                        for (let z = 0; z < zlength - 1; z++) {
                            model.CELLS.push({ POINTS : [ 
                                x + xlength*y + xlength*ylength*z, 
                                (x + 1) + xlength*y + xlength*ylength*z, 
                                (x + 1) + xlength*(y + 1) + xlength*ylength*z, 
                                x + xlength*(y + 1) + xlength*ylength*z,
                                x + xlength*y + xlength*ylength*(z + 1), 
                                (x + 1) + xlength*y + xlength*ylength*(z + 1), 
                                (x + 1) + xlength*(y + 1) + xlength*ylength*(z + 1), 
                                x + xlength*(y + 1) + xlength*ylength*(z + 1)
                            ], TYPE : 12 });
                        }
                    }
                }
            }
        } else if (tokens[i] == 'POINTS') {
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
        } else if (tokens[i] == 'POINT_DATA' || tokens[i] == 'CELL_DATA') {
            datamode = tokens[i];
            datasnum = parseInt(tokens[i + 1]);
            i += 2;
        } else if (tokens[i] == 'SCALARS') {
            const tag = tokens[i + 1];
            i += 5;
            if (datamode == "POINT_DATA") {
                model.POINT_DATAS[tag] = { TYPE : "", VALUES : [] };
                model.POINT_DATAS[tag].TYPE = "SCALARS";
                for (let j = 0; j < datasnum; j++) {
                    model.POINT_DATAS[tag].VALUES.push(parseFloat(tokens[i++]));
                }
            } else if (datamode == "CELL_DATA") {
                model.CELL_DATAS[tag] = { TYPE : "", VALUES : [] };
                model.CELL_DATAS[tag].TYPE = "SCALARS";
                for (let j = 0; j < datasnum; j++) {
                    model.CELL_DATAS[tag].VALUES.push(parseFloat(tokens[i++]));
                }
            }
        } else if (tokens[i] == 'VECTORS') {
            const tag = tokens[i + 1];
            i += 3;
            if (datamode == "POINT_DATA") {
                model.POINT_DATAS[tag] = { TYPE : "", VALUES : [] };
                model.POINT_DATAS[tag].TYPE = "VECTORS";
                for (let j = 0; j < datasnum; j++) {
                    model.POINT_DATAS[tag].VALUES.push({ 
                        x : parseFloat(tokens[i++]), 
                        y : parseFloat(tokens[i++]), 
                        z : parseFloat(tokens[i++]) 
                    });
                }
            } else if (datamode == "CELL_DATA") {
                model.CELL_DATAS[tag] = { TYPE : "", VALUES : [] };
                model.CELL_DATAS[tag].TYPE = "VECTORS";
                for (let j = 0; j < datasnum; j++) {
                    model.CELL_DATAS[tag].VALUES.push({ 
                        x : parseFloat(tokens[i++]), 
                        y : parseFloat(tokens[i++]), 
                        z : parseFloat(tokens[i++]) 
                    });
                }
            }
        } else if (tokens[i] == 'TENSORS') {
            const tag = tokens[i + 1];
            i += 3;
            if (datamode == "POINT_DATA") {
                model.POINT_DATAS[tag] = { TYPE : "", VALUES : [] };
                model.POINT_DATAS[tag].TYPE = "TENSORS";
                for (let j = 0; j < datasnum; j++) {
                    model.POINT_DATAS[tag].VALUES.push({ 
                        xx : parseFloat(tokens[i++]), xy : parseFloat(tokens[i++]), xz : parseFloat(tokens[i++]),
                        yx : parseFloat(tokens[i++]), yy : parseFloat(tokens[i++]), yz : parseFloat(tokens[i++]),
                        zx : parseFloat(tokens[i++]), zy : parseFloat(tokens[i++]), zz : parseFloat(tokens[i++])
                    });
                }
            } else if (datamode == "CELL_DATA") {
                model.CELL_DATAS[tag] = { TYPE : "", VALUES : [] };
                model.CELL_DATAS[tag].TYPE = "TENSORS";
                for (let j = 0; j < datasnum; j++) {
                    model.CELL_DATAS[tag].VALUES.push({ 
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