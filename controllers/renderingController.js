module.exports.getWebviewContent = (_model) => {
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