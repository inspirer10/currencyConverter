const getCurrencyOptions = async() => {
    const response = await fetch('https://api.exchangerate.host/symbols');
    const json = await response.json();
    return json.symbols;
};

const getCurrencyRate = async(fromCurrency, toCurrency) => {
    const currencyConvertUrl = new URL('https://api.exchangerate.host/convert');

    currencyConvertUrl.searchParams.append('from', fromCurrency);
    currencyConvertUrl.searchParams.append('to', toCurrency);

    const resposne = await fetch(currencyConvertUrl);
    const json = await resposne.json();
    return json.result;
};

const appendOptionToSelect = (selectElement, optionItem) => {
    const optionElement = document.createElement('option');
    optionElement.value = optionItem.code;
    optionElement.textContent = optionItem.description;

    selectElement.appendChild(optionElement);
};

const populateSelectElement = (selectElement, optionList) => {
    optionList.forEach((optionItem) => {
        appendOptionToSelect(selectElement, optionItem);
    });
};

const setupCurrencies = async() => {
    const fromCurrencyElem = document.querySelector('#fromCurrency');
    const toCurrencyElem = document.querySelector('#toCurrency');

    const currencyOptions = await getCurrencyOptions();

    const currencies = Object.keys(currencyOptions).map(
        (key) => currencyOptions[key]
    );

    populateSelectElement(fromCurrencyElem, currencies);
    populateSelectElement(toCurrencyElem, currencies);
};

const setupEventListener = () => {
    const formElement = document.querySelector('#convertForm');

    formElement.addEventListener('submit', async event => {
        event.preventDefault();

        const fromCurrency = document.querySelector('#fromCurrency');
        const toCurrency = document.querySelector('#toCurrency');
        const amount = document.querySelector('#amount');
        const convertResultElem = document.querySelector('#convertResult');
        const rate = await getCurrencyRate(
            fromCurrency.value,
            toCurrency.value
        );

        const amountValue = Number(amount.value);
        const converstionResult = Number(amountValue * rate).toFixed(2);
        convertResultElem.textContent = `${amountValue} ${fromCurrency.value} = ${converstionResult} ${toCurrency.value}`;
    });
};

setupCurrencies()
setupEventListener()