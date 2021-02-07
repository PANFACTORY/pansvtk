module.exports.getWebviewContent = (_fileName) => {
	return `<!DOCTYPE html>
<html lang="en" style="width:100%;height:100%;">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${_fileName}</title>
    </head>
    <body style="width:100%;height:100%;margin:0;padding:0;">
        <div style="width:100%;height:100%;poition:relative;">
            <svg id="svgs" x=0 y=0 height="100%" width="100%" style="background-color: #ffffff"></svg>
            <div style="position:absolute;top:0;">
                <select id="selectdata" size=1><option value="SolidColor">SolidColor</option></select>
            </div>
        </div>
        
        <script>
            const vscode = acquireVsCodeApi(); // acquireVsCodeApi can only be invoked once

            let scale = 5;
            let X0 = 100;
            let Y0 = 500;

            const $selectdata = document.getElementById("selectdata");
            $selectdata.addEventListener('change', (event) => {
                vscode.postMessage({ dataoption : $selectdata.value });
            });

            const $svgs = document.getElementById("svgs");
            let text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('x', 10);
            text.setAttribute('y', 50);
            text.textContent = "Hello";
            $svgs.appendChild(text);

            window.addEventListener('message', event => {
                const message = event.data;
                if (message.command == "options") {
                    for (let tag of message.data) {
                        let $option = document.createElement('option');
                        $option.setAttribute('value', tag);
                        $option.innerHTML = tag;
                        selectdata.appendChild($option);
                    }
                } else if (message.command == "svgs") {
                    for (let cell of message.data) {
                        let $svg = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
                        $svg.setAttribute('fill', cell.COLOR);
                        $svg.setAttribute('stroke', 'black');
                        $svg.setAttribute('stroke-width', 1);
                        let pointlist = "";
                        for (let point of cell.POINTS) {
                            pointlist += (X0 + scale*point.x) + "," + (Y0 - scale*point.y) + " ";
                        }
                        $svg.setAttribute('points', pointlist);
                        $svgs.appendChild($svg);
                    }
                }
            });
        </script>
    </body>
</html>`;
}