import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/styles.css';
import CurrencyService from './services/currency-service.js';
import { currencyNames } from './services/currency-names.js';

let currencyServiceApiData = null;
const currencyNamesArray = currencyNames;

async function getCurrencyConversionRates() {
  const response = await CurrencyService.getCurrencyConversionRates();
  currencyServiceApiData = response;
  if (response.result === "success") {
    getCurrencyDataAndAddCurrencyNamesToForm();
  } else {
    printError(response);
  }
}

function printError(error) {
  document.querySelector("p#showConvertedCurrency").innerText = `There was an error accessing currency exchange data: ${error}.`;
}

function getCurrencyDataAndAddCurrencyNamesToForm() {
  let currencyExchangeRates = currencyServiceApiData.conversion_rates;

  const currencyCodes = Object.keys(currencyExchangeRates);
  currencyCodes.splice(128, 1);

  const currencyCodeValues = Object.values(currencyExchangeRates);
  currencyCodeValues.splice(128, 1);

  let currencySelection = document.getElementById("currencySelection");

  currencyCodes.forEach((code, index) => {
    const name = currencyNamesArray[index];
    let currency = `${name} (${code})`;
    let currencyElement = document.createElement("option");
    currencyElement.text = currency;
    currencyElement.name = currency;
    currencyElement.value = currencyCodeValues[index];
    currencyElement.id = `${currencyElement.text}`;
    currencySelection.appendChild(currencyElement);
  });

  currencySelection.options[1].style.display = "none";
}

function calculateCurrencyConversion() {
  let currencySelection = document.getElementById("currencySelection");

  let usDollarAmount = parseFloat(document.getElementById("usDollars").value);

  let selectedCurrencyValue = parseFloat(currencySelection.value);

  let selectedCurrencyName = currencySelection.options[currencySelection.selectedIndex];
  let selectedCurrencyId = selectedCurrencyName.id;

  let currencyConversionResult = parseFloat((usDollarAmount * selectedCurrencyValue).toFixed(4));

  document.getElementById("showUsDollarAmount").innerText = `${usDollarAmount.toLocaleString('en-US')} US Dollars \n = `;
  document.getElementById("showConvertedCurrency").innerText = `${currencyConversionResult.toLocaleString('en-US', { minimumFractionDigits: 4 })} ${selectedCurrencyId}`;
}

window.addEventListener("load", function() {
  getCurrencyConversionRates();
  document.getElementById("conversionForm").addEventListener("submit", function(event) {
    event.preventDefault();
    document.getElementById("showConvertedCurrency").removeAttribute("class", "hidden");
    calculateCurrencyConversion();
  });
});