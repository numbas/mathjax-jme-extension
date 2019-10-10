import {Configuration}  from '../js/input/tex/Configuration.js';
import {CommandMap} from '../js/input/tex/SymbolMap.js';
import TexParser from '../js/input/tex/TexParser.js';
import TexError from '../js/input/tex/TexError.js';

const JMEMethods = {};

JMEMethods.Var = function(parser, name) {
    const settings_string = parser.GetBrackets(name);
    const expr = parser.GetArgument(name);

    const scope = parser.configuration['jme-scope'] || Numbas.jme.builtinScope;
    const settings = {};
    if(settings_string!==undefined) {
        settings_string.split(/\s*,\s*/g).forEach(function(v) {
            var setting = v.trim().toLowerCase();
            settings[setting] = true;
        });
    }

    try {
        const v = scope.evaluate(expr);
        const tex = Numbas.jme.display.texify({tok: v},settings);
        parser.Push(new TexParser(tex, parser.stack.env, parser.configuration).mml());
    } catch(e) {
        throw(new Numbas.Error('mathjax.math processing error',{message:e.message,expression:expr}));
    }
}

JMEMethods.Simplify = function(parser, name) {
    let rules = parser.GetBrackets(name);
    if(rules===undefined) {
        rules = 'all';
    }
    const expr = parser.GetArgument(name);
    const scope = parser.configuration['jme-scope'] || Numbas.jme.builtinScope;
    
    try {
        const subbed_expr = Numbas.jme.subvars(expr,scope);
        const tex = Numbas.jme.display.exprToLaTeX(subbed_expr,rules,scope);
        parser.Push(new TexParser(tex, parser.stack.env, parser.configuration).mml());
    } catch(e) {
        throw(new Numbas.Error('mathjax.math processing error',{message:e.message,expression:expr}));
    }
}

/**
 *  The macro mapping of control sequence to function calls
 */
const JMEMap = new CommandMap('jmeMap', {
    'var': 'Var',
    'simplify': 'Simplify'
}, JMEMethods);


function setScope(arg) {
    const textnode = arg.math.start.node;
    let node = textnode.parentElement;
    while(node && node.getAttribute('data-jme-scope')==null) {
        node = node.parentElement;
    }
    if(node) {
        const key = node.getAttribute('data-jme-scope');
        const scope = Numbas.display.scopes[key] || Numbas.jme.builtinScope;
        arg.data['jme-scope'] = scope;
    }
}

/**
 * The configuration used to enable the MathML macros
 */
const JMEConfiguration = Configuration.create(
    'jme', 
    {
        handler: {macro: ['jmeMap']},
        preprocessors: [
            [setScope, 1]
        ]
    }
);
