var exec = require('child_process').exec;
var fs = require('fs');
var path = require('path');

var template = '{"id":%i,"position":{"x":%x,"y":%y,"z":%z},"vertices":"%p","faces":"%t","normals":"%l","volume":%v}';

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

	// voro++ creates a .vol file
	var data = fs.readFileSync(path.join(__dirname,'particles.txt.vol'));
	var json = JSON.parse('['+data.toString().replace(/\n/g,',').replace(/,$/,'')+']');

	// Make each vector array nicer
	for(var i=0; i<json.length; i++){
		json[i].faces = parseVectorArray(json[i].faces, parseInt);
		json[i].vertices = parseVectorArray(json[i].vertices,parseFloat);
	}

	var outPath = path.join(__dirname,'volumes.js');
	fs.writeFileSync(outPath,'volumes='+JSON.stringify(json,2,2));

	// Remove temp files
	fs.unlinkSync(path.join(__dirname,'particles.txt'));
	fs.unlinkSync(path.join(__dirname,'particles.txt.vol'));

	console.log("Created "+outPath)
});


// Parses an array "(1,2,3) (1,2,3) (1,2,3)" to [[1,2,3],[1,2,3],[1,2,3]]
function parseVectorArray(verts,parse){
    var verts = verts.split(' ');
    for(var i=0; i<verts.length; i++){
        verts[i] = verts[i].replace(/[\(\)]/g,'').split(',');
        for(var j=0; j<verts[i].length; j++)
            verts[i][j] = parse(verts[i][j]);
    }
    return verts;
}
