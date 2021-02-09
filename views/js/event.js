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