module.exports.loadModelFromVTK = (_str) => {
    let model = { POINTS : [], CELLS : [], DATAS : {} };
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
            model.DATAS[datamode] = {};
            i += 2;
        } else if (tokens[i] == 'SCALARS') {
            const tag = tokens[i + 1];
            i += 5;
            model.DATAS[datamode][tag] = { TYPE : "SCALARS", VALUES : [] };
            for (let j = 0; j < datasnum; j++) {
                model.DATAS[datamode][tag].VALUES.push(parseFloat(tokens[i++]));
            }
            model.DATAS[datamode][tag]["MAX"] = model.DATAS[datamode][tag]["VALUES"].reduce((_a, _b) => {
                return Math.max(_a, _b);
            });
            model.DATAS[datamode][tag]["MIN"] = model.DATAS[datamode][tag]["VALUES"].reduce((_a, _b) => {
                return Math.min(_a, _b);
            });
        } else if (tokens[i] == 'VECTORS') {
            const tag = tokens[i + 1];
            i += 3;
            model.DATAS[datamode][tag] = { TYPE : "VECTORS", VALUES : { x : [], y : [], z : [] } };
            for (let j = 0; j < datasnum; j++) {
                model.DATAS[datamode][tag].VALUES["x"].push(parseFloat(tokens[i++]));
                model.DATAS[datamode][tag].VALUES["y"].push(parseFloat(tokens[i++]));
                model.DATAS[datamode][tag].VALUES["z"].push(parseFloat(tokens[i++]));
            }
            model.DATAS[datamode][tag]["MAX"] = {
                x : model.DATAS[datamode][tag]["VALUES"]["x"].reduce((_a, _b) => { return Math.max(_a, _b); }),
                y : model.DATAS[datamode][tag]["VALUES"]["y"].reduce((_a, _b) => { return Math.max(_a, _b); }),
                z : model.DATAS[datamode][tag]["VALUES"]["z"].reduce((_a, _b) => { return Math.max(_a, _b); }),
            };
            model.DATAS[datamode][tag]["MIN"] = {
                x : model.DATAS[datamode][tag]["VALUES"]["x"].reduce((_a, _b) => { return Math.min(_a, _b); }),
                y : model.DATAS[datamode][tag]["VALUES"]["y"].reduce((_a, _b) => { return Math.min(_a, _b); }),
                z : model.DATAS[datamode][tag]["VALUES"]["z"].reduce((_a, _b) => { return Math.min(_a, _b); }),
            };
        } else if (tokens[i] == 'TENSORS') {
            const tag = tokens[i + 1];
            i += 3;
            model.DATAS[datamode][tag] = { TYPE : "TENSORS", VALUES : { xx : [], xy : [], xz : [], yx : [], yy : [], yz : [], zx : [], zy : [], zz : [] } };
            for (let j = 0; j < datasnum; j++) {
                model.DATAS[datamode][tag].VALUES["xx"].push(parseFloat(tokens[i++]));
                model.DATAS[datamode][tag].VALUES["xy"].push(parseFloat(tokens[i++]));
                model.DATAS[datamode][tag].VALUES["xz"].push(parseFloat(tokens[i++]));
                model.DATAS[datamode][tag].VALUES["yx"].push(parseFloat(tokens[i++]));
                model.DATAS[datamode][tag].VALUES["yy"].push(parseFloat(tokens[i++]));
                model.DATAS[datamode][tag].VALUES["yz"].push(parseFloat(tokens[i++]));
                model.DATAS[datamode][tag].VALUES["zx"].push(parseFloat(tokens[i++]));
                model.DATAS[datamode][tag].VALUES["zy"].push(parseFloat(tokens[i++]));
                model.DATAS[datamode][tag].VALUES["zz"].push(parseFloat(tokens[i++]));
            }
            model.DATAS[datamode][tag]["MAX"] = {
                xx : model.DATAS[datamode][tag]["VALUES"]["xx"].reduce((_a, _b) => { return Math.max(_a, _b); }),
                xy : model.DATAS[datamode][tag]["VALUES"]["xy"].reduce((_a, _b) => { return Math.max(_a, _b); }),
                xz : model.DATAS[datamode][tag]["VALUES"]["xz"].reduce((_a, _b) => { return Math.max(_a, _b); }),
                yx : model.DATAS[datamode][tag]["VALUES"]["yx"].reduce((_a, _b) => { return Math.max(_a, _b); }),
                yy : model.DATAS[datamode][tag]["VALUES"]["yy"].reduce((_a, _b) => { return Math.max(_a, _b); }),
                yz : model.DATAS[datamode][tag]["VALUES"]["yz"].reduce((_a, _b) => { return Math.max(_a, _b); }),
                zx : model.DATAS[datamode][tag]["VALUES"]["zx"].reduce((_a, _b) => { return Math.max(_a, _b); }),
                zy : model.DATAS[datamode][tag]["VALUES"]["zy"].reduce((_a, _b) => { return Math.max(_a, _b); }),
                zz : model.DATAS[datamode][tag]["VALUES"]["zz"].reduce((_a, _b) => { return Math.max(_a, _b); }),
            };
            model.DATAS[datamode][tag]["MIN"] = {
                xx : model.DATAS[datamode][tag]["VALUES"]["xx"].reduce((_a, _b) => { return Math.min(_a, _b); }),
                xy : model.DATAS[datamode][tag]["VALUES"]["xy"].reduce((_a, _b) => { return Math.min(_a, _b); }),
                xz : model.DATAS[datamode][tag]["VALUES"]["xz"].reduce((_a, _b) => { return Math.min(_a, _b); }),
                yx : model.DATAS[datamode][tag]["VALUES"]["yx"].reduce((_a, _b) => { return Math.min(_a, _b); }),
                yy : model.DATAS[datamode][tag]["VALUES"]["yy"].reduce((_a, _b) => { return Math.min(_a, _b); }),
                yz : model.DATAS[datamode][tag]["VALUES"]["yz"].reduce((_a, _b) => { return Math.min(_a, _b); }),
                zx : model.DATAS[datamode][tag]["VALUES"]["zx"].reduce((_a, _b) => { return Math.min(_a, _b); }),
                zy : model.DATAS[datamode][tag]["VALUES"]["zy"].reduce((_a, _b) => { return Math.min(_a, _b); }),
                zz : model.DATAS[datamode][tag]["VALUES"]["zz"].reduce((_a, _b) => { return Math.min(_a, _b); }),
            };
        } else {
            i++;
        }
    }

    return model;
}