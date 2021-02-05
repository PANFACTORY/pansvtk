const vscode = require('vscode');
const model = require('./models/model');

module.exports.activate = (context) => {
	context.subscriptions.push(
		vscode.commands.registerCommand('pansvtk.rendering', () => {
			const editer = vscode.window.activeTextEditor;
			if (editer) {
				const panel = vscode.window.createWebviewPanel(
					'catCoding', // Identifies the type of the webview. Used internally
					editer.document.fileName, // Title of the panel displayed to the user
					vscode.ViewColumn.One, // Editor column to show the new webview panel in.
					{} // Webview options. More on these later.
				);

				panel.webview.html = getWebviewContent(editer.document.fileName, editer.document.getText());
			} else {
				console.log("No file");
			}
		})
	);
}

const getWebviewContent = (fileName, text) => {
	return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${fileName}</title>
</head>
<body>
	${text}
</body>
</html>`;
}

module.exports.deactivate = () => {}