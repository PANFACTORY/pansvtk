const svgs = require('./svgs');

module.exports.getWebviewContent = (_fileName, _model, _dataoption="SolidColor") => {
    let svg = "";
    let scale = 5;
    let X0 = 100;
    let Y0 = 500;
    for (let cell of _model.CELLS) {
        const [ type, tag, component ] = _dataoption.split(".");
        let fillcolor = "lime";
        if (type == "cell") {
            const cellid = _model.CELLS.indexOf(cell);
            if (!component) {
                fillcolor = `hsl(${240*(1 - _model.CELL_DATAS[tag].VALUES[cellid])}, 100%, 50%)`;
            } else {
                fillcolor = `hsl(${240*(1 - _model.CELL_DATAS[tag].VALUES[cellid][component])}, 100%, 50%)`;
            }
        } else if (type == "point") {
            if (!component) {
                const c0 = _model.POINT_DATAS[tag].VALUES[cell.POINTS[0]];
                const c1 = _model.POINT_DATAS[tag].VALUES[cell.POINTS[1]];
                const c2 = _model.POINT_DATAS[tag].VALUES[cell.POINTS[2]];
                const c3 = _model.POINT_DATAS[tag].VALUES[cell.POINTS[3]];
                fillcolor = `hsl(${240*(1 - 0.25*(c0 + c1 + c2 + c3))}, 100%, 50%)`;
            } else {
                const c0 = _model.POINT_DATAS[tag].VALUES[cell.POINTS[0]][component];
                const c1 = _model.POINT_DATAS[tag].VALUES[cell.POINTS[1]][component];
                const c2 = _model.POINT_DATAS[tag].VALUES[cell.POINTS[2]][component];
                const c3 = _model.POINT_DATAS[tag].VALUES[cell.POINTS[3]][component];
                fillcolor = `hsl(${240*(1 - 0.25*(c0 + c1 + c2 + c3))}, 100%, 50%)`;
            }
        }

        if (cell.TYPE == 5) {
            const p0 = _model.POINTS[cell.POINTS[0]];
            const p1 = _model.POINTS[cell.POINTS[1]];
            const p2 = _model.POINTS[cell.POINTS[2]];
            svg += svgs.getSvgType5(X0 + p0.x*scale, Y0 - p0.y*scale, X0 + p1.x*scale, Y0 - p1.y*scale, X0 + p2.x*scale, Y0 - p2.y*scale, fillcolor, "black", 1);
        } else if (cell.TYPE == 9) {
            const p0 = _model.POINTS[cell.POINTS[0]];
            const p1 = _model.POINTS[cell.POINTS[1]];
            const p2 = _model.POINTS[cell.POINTS[2]];
            const p3 = _model.POINTS[cell.POINTS[3]];
            svg += svgs.getSvgType9(X0 + p0.x*scale, Y0 - p0.y*scale, X0 + p1.x*scale, Y0 - p1.y*scale, X0 + p2.x*scale, Y0 - p2.y*scale, X0 + p3.x*scale, Y0 - p3.y*scale, fillcolor, "black", 1);
        }
    }

    let dataoptions = '<option value="SolidColor">SolidColor</option>';
    for (let tag in _model.CELL_DATAS) {
        if (_model.CELL_DATAS[tag].TYPE == "SCALARS") {
            dataoptions += `<option value="cell.${tag}">cell.${tag}</option>`;
        } else if (_model.CELL_DATAS[tag].TYPE == "VECTORS") {
            dataoptions += `<option value="cell.${tag}.x">cell.${tag}.x</option><option value="cell.${tag}.y">cell.${tag}.y</option><option value="cell.${tag}.z">cell.${tag}.z</option>`;
        } else if (_model.CELL_DATAS[tag].TYPE == "TENSORS") {
            dataoptions += `<option value="cell.${tag}.xx">cell.${tag}.xx</option><option value="cell.${tag}.xy">cell.${tag}.xy</option><option value="cell.${tag}.xz">cell.${tag}.xz</option>
                <option value="cell.${tag}.yx">cell.${tag}.yx</option><option value="cell.${tag}.yy">cell.${tag}.yy</option><option value="cell.${tag}.yz">cell.${tag}.yz</option>
                <option value="cell.${tag}.zx">cell.${tag}.zx</option><option value="cell.${tag}.zy">cell.${tag}.zy</option><option value="cell.${tag}.zz">cell.${tag}.zz</option>`;
        }
    }
    for (let tag in _model.POINT_DATAS) {
        if (_model.POINT_DATAS[tag].TYPE == "SCALARS") {
            dataoptions += `<option value="point.${tag}">point.${tag}</option>`;
        } else if (_model.POINT_DATAS[tag].TYPE == "VECTORS") {
            dataoptions += `<option value="point.${tag}.x">point.${tag}.x</option><option value="point.${tag}.y">point.${tag}.y</option><option value="point.${tag}.z">point.${tag}.z</option>`;
        } else if (_model.POINT_DATAS[tag].TYPE == "TENSORS") {
            dataoptions += `<option value="point.${tag}.xx">point.${tag}.xx</option><option value="point.${tag}.xy">point.${tag}.xy</option><option value="point.${tag}.xz">point.${tag}.xz</option>
                <option value="point.${tag}.yx">point.${tag}.yx</option><option value="point.${tag}.yy">point.${tag}.yy</option><option value="point.${tag}.yz">point.${tag}.yz</option>
                <option value="point.${tag}.zx">point.${tag}.zx</option><option value="point.${tag}.zy">point.${tag}.zy</option><option value="point.${tag}.zz">point.${tag}.zz</option>`;
        }
    }

	return `<!DOCTYPE html>
<html lang="en" style="width:100%;height:100%;">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${_fileName}</title>
    </head>
    <body style="width:100%;height:100%;margin:0;">
        <select name="selectdata" id="selectdata" size=1>${dataoptions}</select>
        <svg x=0 y=0 height="100%" width="100%" style="background-color: #ffffff">${svg}</svg>
        
        <script>
            const vscode = acquireVsCodeApi(); // acquireVsCodeApi can only be invoked once

            const $selectdata = document.getElementById("selectdata");
            $selectdata.value = "${_dataoption}";
            $selectdata.addEventListener('change', (event) => {
                vscode.postMessage({ dataoption : $selectdata.value });
            });
        </script>
    </body>
</html>`;
}