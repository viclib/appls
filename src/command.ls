require! {exec:child_process.exec,path,fs}

browserify = path.join(path.dirname(fs.realpathSync(__filename)), '../node_modules/browserify/bin')
lsc = path.join(path.dirname(fs.realpathSync(__filename)), '../node_modules/LiveScript/bin')

file = process.argv[2]

if not file?
	console.log "File not found!"
	process.exit!

if (file.indexOf ".ls") != -1
	file .= slice 0 (file.indxOf ".ls")

console.log "Appls: compiling " + file
exec lsc + '/lsc -cp '+file+'.ls > '+file+'.js' ->
	exec '(echo "<!doctype html><html><body><script>" && node '+browserify+'/cmd.js --ig '+file+'.js && echo "</script></body></html>") > '+file+'.html' ->
		exec 'rm '+file+'.js' ->
			console.log "Done!"
