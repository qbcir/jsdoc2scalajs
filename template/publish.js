var fs = require('fs'),
    template = require('jsdoc/template'),
    _ = require('lodash'),
    Handlebars = require('handlebars')

exports.publish = function(data, opts) {
    data({undocumented: true}).remove();
    var docs = data().get();
    var methods_by_class = _.groupBy(_.filter(docs, x => x.kind === 'function'), x => x.memberof);
    var classes_by_file = _.groupBy(_.filter(docs, x => x.kind === 'class'), x => x.meta.filename);
    opts.helpers.forEach(p => {
        var plugin;
        var pluginPath = __dirname + '/../plugins/' + p + '.js';
        if (fs.existsSync(pluginPath)) {
            plugin = require('../plugins/'+p);
        } else {
            plugin = require(p);
        }
        plugin(_, Handlebars);
    })
    var class_templ = fs.readFileSync(opts.template + '/default.templ');
    class_templ = Handlebars.compile(class_templ.toString());
    if (!fs.existsSync(opts.destination)) {
	fs.mkdirSync(opts.destination);
    } 
    for (filename in classes_by_file) {
        var classes = classes_by_file[filename];
	var path = opts.destination + '/' + filename.replace(/\.js$/, '') + '.scala';
	var data = class_templ({
            subpackage: classes[0].memberof,
	    classes: classes,
            methods_by_class: methods_by_class,
            package_name : opts.packageName
        })
	fs.writeFileSync(path, data);
    }
}
