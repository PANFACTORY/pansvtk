const svgs = require('./svgs');

module.exports.getWebviewContent = (_fileName, _model, _colorTag="SolidColor") => {
    let svg = "";
    let scale = 5;
    let X0 = 100;
    let Y0 = 500;
    for (let cell of _model.CELLS) {
        let id = _model.CELLS.indexOf(cell);
        const fillcolor = _colorTag == "SolidColor" ? "lime" : `hsl(${240*(1 - _model.CELL_DATAS[_colorTag][id])}, 100%, 50%)`;

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

    let celldataoptions = '<option value="SolidColor">SolidColor</option>';
    for (let tag in _model.CELL_DATAS) {
        celldataoptions += `<option value="${tag}">${tag}</option>`;
    }

	return `<!DOCTYPE html>
<html lang="en" style="width:100%;height:100%;">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${_fileName}</title>
    </head>
    <body style="width:100%;height:100%;margin:0;">
        <select name="selectCelldata" id="selectCelldata" size=1>${celldataoptions}</select>
        <svg x=0 y=0 height="100%" width="100%" style="background-color: #ffffff">${svg}</svg>
        
        <script>
            const vscode = acquireVsCodeApi(); // acquireVsCodeApi can only be invoked once

            const $selectCelldata = document.getElementById("selectCelldata");
            $selectCelldata.value = "${_colorTag}";
            $selectCelldata.addEventListener('change', (event) => {
                vscode.postMessage({ colorTag : $selectCelldata.value });
            });
        </script>
    </body>
</html>`;
}