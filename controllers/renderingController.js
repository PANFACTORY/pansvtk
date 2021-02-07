module.exports.getOptions = (_model) => {
    let dataoptions = [];
    for (let mode in _model.DATAS) {
        const modeName = mode == "POINT_DATA" ? "point" : "cell";
        for (let tag in _model.DATAS[mode]) {
            if (_model.DATAS[mode][tag].TYPE == "SCALARS") {
                dataoptions.push(`${modeName}.${tag}`);
            } else if (_model.DATAS[mode][tag].TYPE == "VECTORS") {
                dataoptions.push(`${modeName}.${tag}.x`);
                dataoptions.push(`${modeName}.${tag}.y`);
                dataoptions.push(`${modeName}.${tag}.z`);
            } else if (_model.DATAS[mode][tag].TYPE == "TENSORS") {
                dataoptions.push(`${modeName}.${tag}.xx`);
                dataoptions.push(`${modeName}.${tag}.xy`);
                dataoptions.push(`${modeName}.${tag}.xz`);
                dataoptions.push(`${modeName}.${tag}.yx`);
                dataoptions.push(`${modeName}.${tag}.yy`);
                dataoptions.push(`${modeName}.${tag}.yz`);
                dataoptions.push(`${modeName}.${tag}.zx`);
                dataoptions.push(`${modeName}.${tag}.zy`);
                dataoptions.push(`${modeName}.${tag}.zz`);
            }
        }   
    }
    return dataoptions;
}

module.exports.getSvgs = (_model, _dataoption="SolidColor") => {
    let datacells = [];
    for (let cell of _model.CELLS) {
        const [ type, tag, component ] = _dataoption.split(".");
        let fillcolor = "lime";
        if (type == "cell") {
            const cellid = _model.CELLS.indexOf(cell);
            if (!component) {
                const range = _model.DATAS["CELL_DATA"][tag]["MAX"] - _model.DATAS["CELL_DATA"][tag]["MIN"];
                fillcolor = `hsl(${240*(_model.DATAS["CELL_DATA"][tag]["MAX"] - _model.DATAS["CELL_DATA"][tag].VALUES[cellid])/range}, 100%, 50%)`;
            } else {
                const range = _model.DATAS["CELL_DATA"][tag]["MAX"][component] - _model.DATAS["CELL_DATA"][tag]["MIN"][component];
                fillcolor = `hsl(${240*(_model.DATAS["CELL_DATA"][tag]["MAX"][component] - _model.DATAS["CELL_DATA"][tag].VALUES[component][cellid])/range}, 100%, 50%)`;
            }
        } else if (type == "point") {
            if (!component) {
                const range = _model.DATAS["POINT_DATA"][tag]["MAX"] - _model.DATAS["POINT_DATA"][tag]["MIN"];
                const c0 = _model.DATAS["POINT_DATA"][tag].VALUES[cell.POINTS[0]];
                const c1 = _model.DATAS["POINT_DATA"][tag].VALUES[cell.POINTS[1]];
                const c2 = _model.DATAS["POINT_DATA"][tag].VALUES[cell.POINTS[2]];
                const c3 = _model.DATAS["POINT_DATA"][tag].VALUES[cell.POINTS[3]];
                fillcolor = `hsl(${240*(_model.DATAS["POINT_DATA"][tag]["MAX"] - 0.25*(c0 + c1 + c2 + c3))/range}, 100%, 50%)`;
            } else {
                const range = _model.DATAS["POINT_DATA"][tag]["MAX"][component] - _model.DATAS["POINT_DATA"][tag]["MIN"][component];
                const c0 = _model.DATAS["POINT_DATA"][tag].VALUES[component][cell.POINTS[0]];
                const c1 = _model.DATAS["POINT_DATA"][tag].VALUES[component][cell.POINTS[1]];
                const c2 = _model.DATAS["POINT_DATA"][tag].VALUES[component][cell.POINTS[2]];
                const c3 = _model.DATAS["POINT_DATA"][tag].VALUES[component][cell.POINTS[3]];
                fillcolor = `hsl(${240*(_model.DATAS["POINT_DATA"][tag]["MAX"][component] - 0.25*(c0 + c1 + c2 + c3))/range}, 100%, 50%)`;
            }
        }

        if (cell.TYPE == 5) {
            datacells.push({ POINTS : [
                { x : _model.POINTS[cell.POINTS[0]].x, y : _model.POINTS[cell.POINTS[0]].y },
                { x : _model.POINTS[cell.POINTS[1]].x, y : _model.POINTS[cell.POINTS[1]].y },
                { x : _model.POINTS[cell.POINTS[2]].x, y : _model.POINTS[cell.POINTS[2]].y }
            ], COLOR : fillcolor });
        } else if (cell.TYPE == 9) {
            datacells.push({ POINTS : [
                { x : _model.POINTS[cell.POINTS[0]].x, y : _model.POINTS[cell.POINTS[0]].y },
                { x : _model.POINTS[cell.POINTS[1]].x, y : _model.POINTS[cell.POINTS[1]].y },
                { x : _model.POINTS[cell.POINTS[2]].x, y : _model.POINTS[cell.POINTS[2]].y },
                { x : _model.POINTS[cell.POINTS[3]].x, y : _model.POINTS[cell.POINTS[3]].y }
            ], COLOR : fillcolor });
        }
    }
    return datacells;
}