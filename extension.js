const vscode = require('vscode');

function activate(context) {
	console.log('Congratulations, your extension "pansvtk" is now active!');

	let disposable = vscode.commands.registerCommand('pansvtk.helloWorld', function () {
		vscode.window.showInformationMessage('Hello World from PANSVTK!');
	});

	context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = {
	activate,
	deactivate
}
