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

    public translatedNodes: {node: HTMLElement, defaultValue: string, index: number, type: string, attributeName?: string, key: string}[] = [];

    constructor(
        public element: HTMLElement,
        public language: string,
        public dictionaries: Dictionaries,
        public defaultRegex: RegExp = /!#(\w+)#!/
    ) {
        // this._translationElements = element.querySelectorAll<HTMLElement>('[translate]');
        // this._translationAttributes = element.querySelectorAll<HTMLElement>('[translateattribute]');
        // this.setArrays();
        // this.init(this.language);
        this.setTranslatedNodes(this.element);
        this.translateNodes(this.language);
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

    public initNew(lang) {
        if (!this.dictionaries[lang]) {
            return;
        }
        this.reset();
        Translator.handleChildNodes(this.element, this.dictionaries[lang], this.defaultRegex);
        // for (let i = 0; i < this._defaultElementsState.length; i++) {
        //     let translate = Translator.translate(this._translationElements[i].innerText, this.dictionaries[lang], this.defaultRegex);
        // }
        // for (let i = 0; i < this._defaultAttributeState.length; i++) {
        //     let attr = this._defaultAttributeState[i].attributeName;
        //     let trans = Translator.translate(this._defaultAttributeState[i].value, this.dictionaries[lang], this.defaultRegex);
        //     this._defaultAttributeState[i].item.setAttribute(attr, trans);
        // }
    }


    public static handleChildNodes(node: Node, dictionary: Dictionary, regex: RegExp) {
        node.childNodes.forEach((value: HTMLInputElement) => {
            if (value.nodeType === 1) {
                Translator.handleChildNodes(value, dictionary, regex);
                Translator.translateAttributes(value.attributes, dictionary, regex);
            } else if (value.nodeType === 3) {
                Translator.translateText(value, dictionary, regex);
            }
        });
    }

    public translateNodes(lang) {
        this.resetNodes();
        let dictionary = this.dictionaries[lang];
        this.translatedNodes.map(item => {
            if (item.type == 'attribute') {
                item.node.setAttribute(item.attributeName, replaceAt(item.node.getAttribute(item.attributeName), item.defaultValue, dictionary[item.key], item.index));
            } else if (item.type == 'text') {
                item.node.nodeValue = replaceAt(item.node.nodeValue, item.defaultValue, dictionary[item.key], item.index);
            }
        });
    }

    public resetNodes() {
        this.translatedNodes.map(item => {
            if (item.type == 'attribute') {
                item.node.setAttribute(item.attributeName, item.defaultValue);
            } else if (item.type == 'text') {
                item.node.nodeValue = item.defaultValue;
            }
        })
    }

    public setTranslatedNodes(parent: HTMLElement) {
        console.log('parent', parent);
        parent.childNodes.forEach((value: any) => {
            console.log('value', value.nodeValue);
            if (value.nodeType === 1) {
                console.log(value.attributes);
                let a = value.nodeType;
                let names = value.getAttributeNames();

                let attrs = Translator.getAttrsForTranslate(value, this.defaultRegex);

                for (let item of attrs) {
                    this.translatedNodes.push({
                        ...item,
                        type: 'attribute',
                        node: value
                    });
                }
                this.setTranslatedNodes(value);
            } else if (value.nodeType === 3) {
                console.log(value.nodeValue);
                let texts = Translator.getTextForTranslate(value, this.defaultRegex);
                console.log('texts', texts);
                for (let item of texts) {
                    this.translatedNodes.push({
                        ...item,
                        type: 'text',
                        node: value
                    });
                    console.log('push item', value);
                }
            }
        });
    }

    public static getTextForTranslate(element: Node, regex: RegExp): {defaultValue: string, index: number, key: string}[] {
        let result = [];
        let newRegex = new RegExp(regex, 'g');
        let rr;
        let text = element.nodeValue;
        console.log(element);
        while ((rr = newRegex.exec(text)) !== null) {
            result.push({
                defaultValue: rr[0],
                index: rr.index,
                key: rr[1]
            });
        }
        return result;
    }

    public static getAttrsForTranslate(element: HTMLElement, regex: RegExp): {defaultValue: string, index: number, attributeName: string, key: string}[] {
        let result = [];
        let keys = element.getAttributeNames();
        let i = 0;
        let newRegex = new RegExp(regex, 'g');
        for (let key of keys) {
            let rr;
            let attrValue = element.getAttribute(key);
            while ((rr = newRegex.exec(attrValue)) !== null) {
                result.push({
                    defaultValue: rr[0],
                    index: rr.index,
                    attributeName: key,
                    key: rr[1]
                });
                i++;
            }
        }
        return result;
    }

    public static translateText(node: Node, dictionary: Dictionary, regex: RegExp) {
        node.nodeValue = Translator.translate(node.nodeValue, dictionary, regex);
        console.log('new text value', node.nodeValue);
    }

    public static translateAttributes(attributes: NamedNodeMap, dictionary: Dictionary, regex: RegExp) {
        let keys = Object.keys(attributes);
        for (let key of keys) {
            attributes[key].value = Translator.translate(attributes[key].value, dictionary, regex);
            console.log('new attribute value', attributes[key].value);
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
