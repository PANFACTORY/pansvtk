const vscode = require('vscode');
const views = require('./views/view');
const models = require('./models/model');

module.exports.activate = (context) => {
	context.subscriptions.push(
		vscode.commands.registerCommand('pansvtk.rendering', () => {
			const editer = vscode.window.activeTextEditor;
			if (editer) {
				const panel = vscode.window.createWebviewPanel(
					'catCoding', // Identifies the type of the webview. Used internally
					editer.document.fileName, // Title of the panel displayed to the user
					vscode.ViewColumn.One, // Editor column to show the new webview panel in.
					{
						enableScripts: true
					} // Webview options. More on these later.
				);

				let model = models.loadModelFromVTK(editer.document.getText());
				panel.webview.html = views.getWebviewContent(editer.document.fileName, model);

				panel.webview.onDidReceiveMessage(
					message => {
						panel.webview.html = views.getWebviewContent(editer.document.fileName, model, message.colorTag);
					},
					undefined,
					context.subscriptions
				);
			} else {
				vscode.window.showInformationMessage("No file selected!");
			}
		})
	);
}

module.exports.deactivate = () => {}