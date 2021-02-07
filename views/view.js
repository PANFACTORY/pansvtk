const { FoldingRangeKind } = require('vscode');
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

	return `<!DOCTYPE html>
<html lang="en" style="width:100%;height:100%;">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${_fileName}</title>
    </head>
    <body style="width:100%;height:100%;margin:0;">
        <select name="selectdata" id="selectdata" size=1><option value="SolidColor">SolidColor</option></select>
        <svg id="svgs" x=0 y=0 height="100%" width="100%" style="background-color: #ffffff">${svg}</svg>
        
        <script>
            const vscode = acquireVsCodeApi(); // acquireVsCodeApi can only be invoked once

            const $selectdata = document.getElementById("selectdata");
            $selectdata.value = "${_dataoption}";
            $selectdata.addEventListener('change', (event) => {
                vscode.postMessage({ dataoption : $selectdata.value });
            });

            const $svgs = document.getElementById("svgs");
            window.addEventListener('message', event => {
                const message = event.data;
                if (message.command == "options") {
                    for (let tag of message.data) {
                        let $option = document.createElement('option');
                        $option.setAttribute('value', tag);
                        $option.innerHTML = tag;
                        selectdata.appendChild($option);
                    }
                }
            });
        </script>
    </body>
</html>`;
}