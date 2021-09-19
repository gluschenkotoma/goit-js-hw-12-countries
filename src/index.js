import './sass/main.scss';
//templates
import countriesCardTpl from './templates/countries-card.hbs';
import listCountryTpl from './templates/countries-list.hbs';

//js folder
import API from './js/fetch-api.js';
import getRefs from './js/refs.js';

//pnotify
import '@pnotify/core/dist/BrightTheme.css';
import { info } from '@pnotify/core';
import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/BrightTheme.css';
import * as Confirm from '@pnotify/confirm';
import '@pnotify/confirm/dist/PNotifyConfirm.css';
import { SameValueZero } from 'es-abstract';

//refs
const refs = getRefs();

//------------------------------------поиск по форме
refs.serchInput.addEventListener('input', _.debounce(onInputSearch, 1000));

function onInputSearch(event) {
  event.preventDefault();

  const input = event.target;
  const searchCountry = input.value.toLowerCase();

  if (searchCountry === '') {
    refs.cardContainer.innerHTML = '';
    return;
  }

  API.fetchCountriesByName(searchCountry)
    .then(createCountries)
    .catch(error => {
      console.log(error);
    });
}

//запрос от пользователя
function createCountries(countries) {
  refs.cardContainer.innerHTML = '';

  if (countries.length > 1) {
    if (countries.length <= 10) {
      renderList(countries);
    } else {
      onError();
    }
  } else {
    if (countries.length === undefined) {
      onSerchError(countries);
    } else {
      renderCountries(countries);
    }
  }
}

//---------------------------------ошибка поиска
function onSerchError(value) {
  info({
    text: 'Country was not found 🕵. Please, try again.',
  });
}

// }

//--------------------------------specific query
function onError() {
  info({
    text: 'Too many matches found. Please entry a more specific query!',
  });
}

//render стран
function renderCountries(country) {
  const markup = countriesCardTpl(country[0]);
  refs.cardContainer.innerHTML = markup;
}

//render списка
function renderList(country) {
  const markup = listCountryTpl(country);
  refs.cardContainer.insertAdjacentHTML('beforeend', markup);
}
