import {Dictionary, replaceAt, Translator} from "./index";

describe("test translator functions", function () {
    it("test replace At function", function () {
        const str = '!#test#!, !#test#! and !#test#! has come to the city.';
        const substr = '!#test#!';
        const replace = 'pogChamp';
        const index = 0;
        const result = replaceAt(str, substr, replace, index);
        expect(result).toEqual('pogChamp, !#test#! and !#test#! has come to the city.');
    });

    it("test translate function", function () {
        const str = '!#test#!, !#test#! and !#test#! has come to the city.';
        const dictionary: Dictionary = {
            "test": "pogChamp"
        };
        const result = Translator.translate(str, dictionary, /!#(\w+)#!/g);
        expect(result).toEqual('pogChamp, pogChamp and pogChamp has come to the city.');
    });

    it("test translate attribute", function () {
        const parent = document.createElement('div');
        parent.innerHTML = `<div id="child" alt="!#test#!" translateattribute data-attr="alt">tt</div>`;
        let t = new Translator(parent, 'ru', {ru: {test: 'test 228'}});
        expect(parent.querySelector('#child').getAttribute('alt')).toEqual('test 228');
    });

    it('change translate after few seconds', function (done) {
        const parent = document.createElement('div');
        parent.innerHTML = `<div id="child" alt="!#test#!" translateattribute data-attr="alt">tt</div>`;
        let t = new Translator(parent, 'ru', {ru: {test: 'ru translate'}, en: {test: 'eng translate'}});
        expect(parent.querySelector('#child').getAttribute('alt')).toEqual('ru translate');
        setTimeout(() => {
            t.translateNodes('en');
        }, 100);
        setTimeout(() => {
            expect(parent.querySelector('#child').getAttribute('alt')).not.toEqual('ru translate');
            expect(parent.querySelector('#child').getAttribute('alt')).toEqual('eng translate');
            done();
        }, 1000);
    });

    it('translateAttributes function', function () {
       const element = document.createElement('div');
       element.setAttribute('alt', 'text');
       element.setAttribute('title', '!#test#!');
       Translator.translateAttributes(element.attributes,  {test: 'test 228'}, /!#(\w+)#!/);
       expect(element.getAttribute('title')).toEqual('test 228');
    });

    it('handle child nodes function', function () {
       const element = document.createElement('div');
        element.innerHTML = `<div id="child" alt="!#test#!">!#test2#!</div>`;
        Translator.handleChildNodes(element,  {test: 'test 228', test2: 'test 229'}, /!#(\w+)#!/);
        expect(element.querySelector('#child').getAttribute('alt')).toEqual('test 228');
        expect(element.querySelector('#child').textContent).toEqual('test 229');
    });

    it('getAttrsForTranslate testing', function () {
        const element = document.createElement('div');
        element.setAttribute('alt', 'text');
        element.setAttribute('title', '!#test#!, !#test#!, !#dfafads#!');
        let result = Translator.getAttrsForTranslate(element,  /!#(\w+)#!/);
        expect(result.length).toEqual(3);
    });

    it('getTextForTranslate testing', function () {
        const element = document.createElement('div');
        element.innerHTML = "!#test#!, !#test2#!";
        let result = Translator.getTextForTranslate(element,  /!#(\w+)#!/);
        expect(result.length).toEqual(2);
    });


    it('testing child nodes algorytm', function () {
        const parent = document.createElement('div');
        parent.innerHTML = `<div alt="!#test#!">!#test 228#!</div>`;
        let t = new Translator(parent, 'ru', {ru: {test: 'test 228'}});
        expect(t.translatedNodes.length).not.toEqual(0);
    });


});
