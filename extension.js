const { clear } = require('console');
const vscode = require('vscode');

const cats = {
	'Coding Cat': 'https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif',
  	'Compiling Cat': 'https://media.giphy.com/media/mlvseq9yvZhba/giphy.gif'
};

module.exports.activate = (context) => {
	context.subscriptions.push(
		vscode.commands.registerCommand('pansvtk.rendering', () => {
			const panel = vscode.window.createWebviewPanel(
				'catCoding', // Identifies the type of the webview. Used internally
				'Cat Coding', // Title of the panel displayed to the user
				vscode.ViewColumn.One, // Editor column to show the new webview panel in.
				{} // Webview options. More on these later.
			);

			let iteration = 0;
			const updateWebview = () => {
				const cat = iteration++ % 2 ? 'Compiling Cat' : 'Coding Cat';
				panel.title = cat;
				panel.webview.html = getWebviewContent(cat);
			};

			updateWebview();
			const interval = setInterval(updateWebview, 1000);

			panel.onDidDispose(() => {
				clearInterval(interval);
			}, null, context.subscriptions);
		})
	);
}

const getWebviewContent = (cat) => {
	return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cat Coding</title>
</head>
<body>
    <img src="${cats[cat]}" width="300" />
</body>
</html>`;
}

module.exports.deactivate = () => {}