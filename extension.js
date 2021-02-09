const path = require('path');
const fs = require('fs');
const vscode = require('vscode');
const models = require('./models/model');
const controllers = require('./controllers/renderingController');

module.exports.activate = (context) => {
	context.subscriptions.push(
		vscode.commands.registerCommand('pansvtk.rendering', () => {
			const editer = vscode.window.activeTextEditor;
			if (editer) {
				let model = models.loadModelFromVTK(editer.document.getText());
				let fName = path.basename(editer.document.fileName);
				console.log(fName, model);

				const panel = vscode.window.createWebviewPanel('catCoding', fName, vscode.ViewColumn.Beside, {
					enableScripts: true,
					retainContextWhenHidden: true,
				});
				
				fs.readFile(path.join(context.extensionPath, 'views/index.html'), (err, data) => {
					if (err) {
						console.error(err)
					}
					panel.webview.html = data.toString();
				});

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