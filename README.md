# Numbas JME extension for MathJax

This MathJax v3 extension add the TeX commands \var and \simplify, which Numbas uses to substitute variable values and simplified expressions into TeX.

# To build

Clone [MathJax-src](https://github.com/mathjax/MathJax-src) into a local directory `mathjax-src`

In `mathjax-src`, run the following to build MathJax:

```
npm install
npm run compile
npm run make-components
```

Clone this repository into `mathjax-src/jme`.

In `mathjax-src/jme`, run `make` (or `npx webpack`) to create `jme.min.js`.

`jme.min.js` is the finished extension.

# To use

Put `jme.min.js` in the `standalone_scripts` folder of your Numbas theme.

Add the extension to the MathJax config, like so:

```
window.MathJax = {
    loader: {
        load: ['[numbas]/jme.min.js'],
        paths: {numbas: './standalone_scripts'}
    },
    tex: {
        packages: {'[+]': ['jme']}
    }
};
```
