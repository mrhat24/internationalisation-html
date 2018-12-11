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
            t.init('en');
        }, 100);
        setTimeout(() => {
            expect(parent.querySelector('#child').getAttribute('alt')).not.toEqual('ru translate');
            expect(parent.querySelector('#child').getAttribute('alt')).toEqual('eng translate');
            done();
        }, 1000);
    });

});
