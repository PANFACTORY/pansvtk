const vscode = require('vscode');
const views = require('./views/view');
const models = require('./models/model');
const controllers = require('./controllers/renderingController');

module.exports.activate = (context) => {
	context.subscriptions.push(
		vscode.commands.registerCommand('pansvtk.rendering', () => {
			const editer = vscode.window.activeTextEditor;
			if (editer) {
				let model = models.loadModelFromVTK(editer.document.getText());
				console.log(model);

				const panel = vscode.window.createWebviewPanel(
					'catCoding', // Identifies the type of the webview. Used internally
					editer.document.fileName, // Title of the panel displayed to the user
					vscode.ViewColumn.Beside, // Editor column to show the new webview panel in.
					{
						enableScripts: true,
						retainContextWhenHidden: true
					} // Webview options. More on these later.
				);
				panel.webview.html = views.getWebviewContent(editer.document.fileName);

				panel.webview.postMessage({ command : "options", data : controllers.getOptions(model) });
				panel.webview.postMessage({ command : "svgs", data : controllers.getSvgs(model) });

				panel.webview.onDidReceiveMessage(
					message => {
						console.log(message);
						panel.webview.postMessage({ command : "svgs", data : controllers.getSvgs(model, message.dataoption) });
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