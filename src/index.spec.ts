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
        parent.innerHTML = `<div id="child" alt="!#test#!">tt</div>`;
        let t = new Translator(parent, 'ru', {ru: {test: 'rutranslate'}, en: {test: 'engtranslate'}});
        expect(parent.querySelector('#child').getAttribute('alt')).toEqual('rutranslate');
        setTimeout(() => {
            console.log(parent.querySelector('#child').getAttribute('alt'));
            t.translateNodes('en');
            console.log(parent.querySelector('#child').getAttribute('alt'));
        }, 100);
        setTimeout(() => {
            expect(parent.querySelector('#child').getAttribute('alt')).not.toEqual('rutranslate');
            expect(parent.querySelector('#child').getAttribute('alt')).toEqual('engtranslate');
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
        element.innerHTML = "<div id='child'>!#test#!</div>";
        const child = element.querySelector('#child');
        let result = Translator.getTextForTranslate(child.childNodes[0],  /!#(\w+).?(\w+)?#!/);
        expect(result.length).toEqual(1);
    });


    it('testing child nodes algorytm', function () {
        const parent = document.createElement('div');
        parent.innerHTML = `<div alt="!#test#!">!#test 228#!</div>`;
        let t = new Translator(parent, 'ru', {ru: {test: 'test 228'}});
        expect(t.translatedNodes.length).not.toEqual(0);
    });


});
