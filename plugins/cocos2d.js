module.exports = function(_, Handlebars) {
   function jsType2ScalaType(type_name) {
	var js2scala_coversions = {
	    'Array': 'js.Array[js.Any]',
	    'string': 'String',
	    'String': 'String',
	    'number': 'Float',
	    'Number': 'Float',
	    'boolean': 'Boolean',
	    'Boolean': 'Boolean',
            'function': 'js.Function',
            'Function': 'js.Function',
	    'object': 'js.Object',
	    'Object': 'js.Object'
	}
        if (type_name.startsWith('cc.')) {
	    return type_name.split('.').pop()
        }
        if (!js2scala_coversions[type_name]) {
            //console.log("No conversion for " + type_name)
            return 'js.Any'
        }
        return js2scala_coversions[type_name]
    }
    function paramToString(param) {
       var param_type = param.type ? jsType2ScalaType(param.type.names[0]) : 'js.Any'
       return param.name + ':'+ param_type
    }
    Handlebars.registerHelper('propToString', function(data) {
        var tmp = 'var ';
        if (data.description && data.description.match(/<@readonly>/)) {
            tmp = 'val ';
        }
        return tmp + data.name + ': ' + jsType2ScalaType(data.type.names[0]) + ' = js.native'
    });
    Handlebars.registerHelper('paramsToString', function(data) {
        return _.join(_.map(data, paramToString),', ')
    });
    Handlebars.registerHelper('returnsToString', function(data) {
        if (Array.isArray(data)) {
            data = data[0]
        }
        return data ? jsType2ScalaType(data.type.names[0]) : 'Unit';
    });
    Handlebars.registerHelper('augmentsToString', function(data) {
        if (!data || data[0] == 'cc.Class') {
            return 'js.Object';
        } else {
            return data[0].replace(/^cc\./, '')
        }
    });
}
