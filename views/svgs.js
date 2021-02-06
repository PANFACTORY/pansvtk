module.exports.getSvgType5 = (_x1, _y1, _x2, _y2, _x3, _y3, _fill, _stroke, _width) => {
    return `<polygon fill="${_fill}" stroke="${_stroke}" stroke-width="${_width}" points="${_x1},${_y1} ${_x2},${_y2} ${_x3},${_y3}" />`
}

module.exports.getSvgType9 = (_x1, _y1, _x2, _y2, _x3, _y3, _x4, _y4, _fill, _stroke, _width) => {
    return `<polygon fill="${_fill}" stroke="${_stroke}" stroke-width="${_width}" points="${_x1},${_y1} ${_x2},${_y2} ${_x3},${_y3} ${_x4},${_y4}" />`
}