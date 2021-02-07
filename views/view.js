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
                fillcolor = `hsl(${240*(1 - _model.DATAS["CELL_DATA"][tag].VALUES[cellid])}, 100%, 50%)`;
            } else {
                fillcolor = `hsl(${240*(1 - _model.DATAS["CELL_DATA"][tag].VALUES[cellid][component])}, 100%, 50%)`;
            }
        } else if (type == "point") {
            if (!component) {
                const c0 = _model.DATAS["POINT_DATA"][tag].VALUES[cell.POINTS[0]];
                const c1 = _model.DATAS["POINT_DATA"][tag].VALUES[cell.POINTS[1]];
                const c2 = _model.DATAS["POINT_DATA"][tag].VALUES[cell.POINTS[2]];
                const c3 = _model.DATAS["POINT_DATA"][tag].VALUES[cell.POINTS[3]];
                fillcolor = `hsl(${240*(1 - 0.25*(c0 + c1 + c2 + c3))}, 100%, 50%)`;
            } else {
                const c0 = _model.DATAS["POINT_DATA"][tag].VALUES[cell.POINTS[0]][component];
                const c1 = _model.DATAS["POINT_DATA"][tag].VALUES[cell.POINTS[1]][component];
                const c2 = _model.DATAS["POINT_DATA"][tag].VALUES[cell.POINTS[2]][component];
                const c3 = _model.DATAS["POINT_DATA"][tag].VALUES[cell.POINTS[3]][component];
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
    for (let mode in _model.DATAS) {
        const modeName = mode == "POINT_DATA" ? "point" : "cell";
        for (let tag in _model.DATAS[mode]) {
            if (_model.DATAS[mode][tag].TYPE == "SCALARS") {
                dataoptions += `<option value="${modeName}.${tag}">${modeName}.${tag}</option>`;
            } else if (_model.DATAS[mode][tag].TYPE == "VECTORS") {
                dataoptions += `<option value="${modeName}.${tag}.x">${modeName}.${tag}.x</option><option value="${mode}.${tag}.y">${modeName}.${tag}.y</option><option value="${modeName}.${tag}.z">${modeName}.${tag}.z</option>`;
            } else if (_model.DATAS[mode][tag].TYPE == "TENSORS") {
                dataoptions += `<option value="${modeName}.${tag}.xx">${modeName}.${tag}.xx</option><option value="${modeName}.${tag}.xy">${modeName}.${tag}.xy</option><option value="${modeName}.${tag}.xz">${modeName}.${tag}.xz</option>
                    <option value="${modeName}.${tag}.yx">${modeName}.${tag}.yx</option><option value="${modeName}.${tag}.yy">${modeName}.${tag}.yy</option><option value="${modeName}.${tag}.yz">${modeName}.${tag}.yz</option>
                    <option value="${modeName}.${tag}.zx">${modeName}.${tag}.zx</option><option value="${modeName}.${tag}.zy">${modeName}.${tag}.zy</option><option value="${modeName}.${tag}.zz">${modeName}.${tag}.zz</option>`;
            }
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