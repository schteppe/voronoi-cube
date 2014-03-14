var exec = require('child_process').exec;
var fs = require('fs');
var path = require('path');

var template = '{"id":%i,"position":{"x":%x,"y":%y,"z":%z},"vertices":"%p","faces":"%t","normals":"%l","volume":%v},';

// Generate particle data
var data = '';
if(false){
	data = '1 0 0 0';
} else {
	var N = 70;
	for(var i=0; i<N; i++){
		data += [i,Math.random(),Math.random(),Math.random()].join(' ')+'\n';
	}
}
fs.writeFileSync(path.join(__dirname,'particles.txt'),data);

var cmd = "voro++ -c '"+template+"' -1 1 -1 1 -1 1 particles.txt";

exec(cmd,function(err,stdout,stderr){
	if(err){
		throw err;
	}
	var data = fs.readFileSync(path.join(__dirname,'particles.txt.vol'));
	fs.writeFileSync(path.join(__dirname,'volumes.js'),'volumes=['+data+']');
	console.log("Done.")
});
