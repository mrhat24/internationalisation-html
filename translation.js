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

    for (var i = 0; i < translationElements.length; i++) {
        defaultElementsState.push({item: translationElements[i], text: translationElements[i].innerText});
    }

    for (var i = 0; i < translationAttributes.length; i++) {
        defaultAttributeState.push({item: translationAttributes[i], attributeName: translationAttributes[i].dataset.attr, value: translationAttributes[i].getAttribute(translationAttributes[i].dataset.attr)});
    }

    return {
        init: init,
        reset: reset
    }
};


var t = new Translation(document.getElementById('translation'), 'ru', {ru: {test: 'тест', 'TEST_TRANSLATE_PLACEHOLDER': '10.10'}, cn: {test: '测试', 'TEST_TRANSLATE_PLACEHOLDER': 88}});
t.init('ru');
setTimeout(() => {
    t.init('cn');
}, 1000);
