var Translation = function (element, language, dictionaries) {

    var translationElements = element.querySelectorAll('[translate]');
    var translationAttributes = element.querySelectorAll('[translateattribute]');

    var defaultElementsState = [];
    var defaultAttributeState = [];

    if (!dictionaries[language])
        console.error('dictionary is undefined');

    function init(lang) {
        reset();
        for (let i = 0; i < defaultElementsState.length; i++) {
            defaultElementsState[i].item.innerText = translate(translationElements[i].innerText, dictionaries[lang]);
        }
        for (let i = 0; i < defaultAttributeState.length; i++) {
            var attr = defaultAttributeState[i].attributeName;
            var trans = translateAttribute(defaultAttributeState[i].value, dictionaries[lang]);
            defaultAttributeState[i].item.setAttribute(attr, trans);
        }
    }

    function reset() {
        for (let i = 0; i < defaultElementsState.length; i++) {
            defaultElementsState[i].item.innerText = defaultElementsState[i].text;
        }
    }

    function replaceAt(string, substring, replace, index) {
        return string.substring(0, index) + replace + string.substring(index + substring.length);
    }

    function translateAttribute(text, dictionary) {
        return dictionary[text];
    }

    function translate(text, dictionary) {
        var mutableText = text;
        var orgText = text;
        var regex = /!#(\w+)#!/g;
        var result;
        while((result = regex.exec(mutableText)) !== null) {
            if (dictionary[result[1]] !== undefined) {
                console.log(result);
                orgText = replaceAt(mutableText, result[0], dictionary[result[1]], result.index);
            }
        }
        return orgText;
    }



    return {
        init: init,
        reset: reset
    }
};

export interface Dictionary {
    [key: string]: string;
}

export interface Dictionaries {
    [key: string]: Dictionary;
}

export function replaceAt(string: string, substring: string, replace: string, index: number) {
    return string.substring(0, index) + replace + string.substring(index + substring.length);
}

export class Translator {

    private _translationElements: NodeListOf<HTMLElement>;
    private _translationAttributes: NodeListOf<HTMLElement>;

    private _defaultElementsState: {item: HTMLElement, text: string}[] = [];
    private _defaultAttributeState: {item: HTMLElement, attributeName: string, value: string, key: string}[] = [];

    constructor(
        public element: HTMLElement,
        public language: string,
        public dictionaries: Dictionaries,
        public defaultRegex: RegExp = /!#(\w+)#!/
    ) {
        this._translationElements = element.querySelectorAll<HTMLElement>('[translate]');
        this._translationAttributes = element.querySelectorAll<HTMLElement>('[translateattribute]');
        this.setArrays();
        this.init(this.language);
    }

    private setArrays() {
        for (var i = 0; i < this._translationElements.length; i++) {
            this._defaultElementsState.push({item: this._translationElements[i], text: this._translationElements[i].innerText});
        }

        for (var i = 0; i < this._translationAttributes.length; i++) {
            let value = this._translationAttributes[i].getAttribute(this._translationAttributes[i].dataset.attr);
            let regExpExecArray = this.defaultRegex.exec(value);
            if (regExpExecArray) {
                this._defaultAttributeState.push({
                    item: this._translationAttributes[i],
                    attributeName: this._translationAttributes[i].dataset.attr,
                    value: this._translationAttributes[i].getAttribute(this._translationAttributes[i].dataset.attr),
                    key: regExpExecArray[1]
                });
            }
        }
    }

    public init(lang) {
        if (!this.dictionaries[lang]) {
            return;
        }
        this.reset();
        for (let i = 0; i < this._defaultElementsState.length; i++) {
            this._defaultElementsState[i].item.innerText = Translator.translate(this._translationElements[i].innerText, this.dictionaries[lang], this.defaultRegex);
        }
        for (let i = 0; i < this._defaultAttributeState.length; i++) {
            let attr = this._defaultAttributeState[i].attributeName;
            let trans = Translator.translate(this._defaultAttributeState[i].value, this.dictionaries[lang], this.defaultRegex);
            this._defaultAttributeState[i].item.setAttribute(attr, trans);
        }
    }

    public reset() {
        for (let i = 0; i < this._defaultElementsState.length; i++) {
            this._defaultElementsState[i].item.innerText = this._defaultElementsState[i].text;
        }
        for (let i = 0; i < this._defaultAttributeState.length; i++) {
            let attr = this._defaultAttributeState[i].attributeName;
            let trans = this._defaultAttributeState[i].value;
            this._defaultAttributeState[i].item.setAttribute(attr, trans);
        }
    }

    public static translateAttribute(text: string, dictionary: Dictionary) {
        let regex = /!#(\w+)#!/;
        return dictionary[text];
    }

    public static translate(text: string, dictionary: Dictionary, regex: RegExp): string {
        let mutableText = text;
        let orgText = text;
        let result;
        let newRegex = new RegExp(regex, 'g');
        while((result = newRegex.exec(mutableText)) !== null) {
            if (dictionary[result[1]] !== undefined) {
                orgText = replaceAt(orgText, result[0], dictionary[result[1]], result.index);
            }
        }
        return orgText;
    }
}

export default Translator;
