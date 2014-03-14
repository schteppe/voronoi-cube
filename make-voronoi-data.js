var exec = require('child_process').exec;
var fs = require('fs');
var path = require('path');

var template = '{"id":%i,"position":{"x":%x,"y":%y,"z":%z},"vertices":"%p","faces":"%t","normals":"%l","volume":%v},';

// Generate particle data
var data = '';
var N = 70;
for(var i=0; i<N; i++){
	data += [i,Math.random(),Math.random(),Math.random()].join(' ')+'\n';
}
fs.writeFileSync(path.join(__dirname,'particles.txt'),data);

// Run voro++
var cmd = "voro++ -c '"+template+"' -1 1 -1 1 -1 1 particles.txt";
exec(cmd,function(err,stdout,stderr){
	if(err)
		throw err;

	var data = fs.readFileSync(path.join(__dirname,'particles.txt.vol'));
	fs.writeFileSync(path.join(__dirname,'volumes.js'),'volumes=['+data+']');

	// Remove temp files
	fs.unlinkSync(path.join(__dirname,'particles.txt'));
	fs.unlinkSync(path.join(__dirname,'particles.txt.vol'));

	console.log("Created volumes.js")
});
