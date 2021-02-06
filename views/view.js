const getSvgLine = (_x1, _y1, _x2, _y2) => {
    return `<line x1="${_x1}" y1="${_y1}" x2="${_x2}" y2="${_y2}" stroke="aqua" stroke-width="1" />`;
}

const getSvgType9 = (_x1, _y1, _x2, _y2, _x3, _y3, _x4, _y4, _fill, _stroke, _width) => {
    return `<polygon fill="${_fill}" stroke="${_stroke}" stroke-width="${_width}" points="${_x1},${_y1} ${_x2},${_y2} ${_x3},${_y3} ${_x4},${_y4}" />`
}

module.exports.getWebviewContent = (_fileName, _model) => {
    let svg = "";
    let scale = 5;
    let X0 = 10;
    let Y0 = 500;
    for (let cell of _model.CELLS) {
        const p0 = _model.POINTS[cell.POINTS[0]];
        const p1 = _model.POINTS[cell.POINTS[1]];
        const p2 = _model.POINTS[cell.POINTS[2]];
        const p3 = _model.POINTS[cell.POINTS[3]];

        let id = _model.CELLS.indexOf(cell);
        const R0 = 256*_model.CELL_DATAS[0].VALUES[id];
        const R = ("0" + R0.toString(16)).slice(-2);

        const fillcolor = `#${R}0000`

        svg += getSvgType9(X0 + p0.x*scale, Y0 - p0.y*scale, X0 + p1.x*scale, Y0 - p1.y*scale, X0 + p2.x*scale, Y0 - p2.y*scale, X0 + p3.x*scale, Y0 - p3.y*scale, fillcolor, "black", 1);
    }
	return `<!DOCTYPE html>
<html lang="en" style="width:100%;height:100%;">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${_fileName}</title>
    </head>
    <body style="width:100%;height:100%;margin:0;">
        <svg x=0 y=0 height="100%" width="100%" style="background-color: #ffffff">${svg}</svg>
    </body>
</html>`;
}