const getSvgLine = (_x1, _y1, _x2, _y2) => {
    return `<line x1="${_x1}" y1="${_y1}" x2="${_x2}" y2="${_y2}" stroke="aqua" stroke-width="1" />`;
}

const getSvgRectangle = (_x1, _y1, _x2, _y2, _x3, _y3, _x4, _y4) => {
    return getSvgLine(_x1, _y1, _x2, _y2) + getSvgLine(_x2, _y2, _x3, _y3) + getSvgLine(_x3, _y3, _x4, _y4) + getSvgLine(_x4, _y4, _x1, _y1);
}

module.exports.getWebviewContent = (_fileName, _model) => {
    let svg = "";
    let scale = 5;
    let X0 = 10;
    let Y0 = 300;
    for (let cell of _model.CELLS) {
        const p0 = _model.POINTS[cell.POINTS[0]];
        const p1 = _model.POINTS[cell.POINTS[1]];
        const p2 = _model.POINTS[cell.POINTS[2]];
        const p3 = _model.POINTS[cell.POINTS[3]];
        svg += getSvgRectangle(X0 + p0.x*scale, Y0 - p0.y*scale, X0 + p1.x*scale, Y0 - p1.y*scale, X0 + p2.x*scale, Y0 - p2.y*scale, X0 + p3.x*scale, Y0 - p3.y*scale);
    }
	return `<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${_fileName}</title>
    </head>
    <body>
        <svg x=0 y=0 width=100% height=500 style="background-color: #000000">${svg}</svg>
    </body>
</html>`;
}