'use strict';

var HIDDEN = 'hidden';

var KeyMap = {
  ESC_CODE: 27,
  ENTER_CODE: 13
};

var PinSize = {
  WIDTH: 56,
  HEIGHT: 75
};

var DataMap = {
  DATA_LENGTH: 8,
  TIMES_CHEKC_IN_OUT: ['12:00', '13:00', '14:00'],
  OFFER_TYPES: ['flat', 'house', 'bungalo'],
  FEATURES: ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'],
  TITLES: ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде']
};

var TYPES_MAP = {flat: 'Квартира', house: 'Дом', bungalo: 'Бунгало'};

var tokioMap = document.querySelector('.tokyo__pin-map');
var lodgetemplate = document.querySelector('#lodge-template').content;
var offerDialog = document.querySelector('#offer-dialog');
var offerDialogTitle = offerDialog.querySelector('.dialog__title');
var offerDialogImg = offerDialogTitle.querySelector('img');
var offerDialogClose = offerDialogTitle.querySelector('.dialog__close');
var activePin = null;

var replaceArrayItems = function (array, index1, index2) {
  var item = array[index1];
  array[index1] = array[index2];
  array[index2] = item;
};

var formatUserNumber = function (number) {
  return number > 9 ? number : '0' + number;
};

var getRandomNumder = function (min, max) {
  return Math.floor(min + Math.random() * (max + 1 - min));
};

var getRandomItem = function (array) {
  var index = getRandomNumder(0, array.length - 1);
  return array[index];
};

var shuffleArray = function (array) {
  var resArray = array.slice(0, array.length);
  for (var i = 0; i < resArray.length; i++) {
    var rand = getRandomNumder(i, resArray.length - 1);
    replaceArrayItems(resArray, rand, i);
  }

  return resArray;
};

var getUnicFeatures = function () {
  var length = getRandomNumder(0, DataMap.FEATURES.length);
  return shuffleArray(DataMap.FEATURES).slice(0, length);
};

var createData = function (count) {
  var shuffledTitles = shuffleArray(DataMap.TITLES);
  var resultdata = [];

  for (var i = 0; i < count; i++) {
    var object = {
      author: {
        avatar: 'img/avatars/user' + formatUserNumber(i + 1) + '.png'
      },
      offer: {
        title: shuffledTitles[i],
        address: function () {
          return object.location.x + ', ' + object.location.y;
        },
        price: getRandomNumder(1000, 1000000),
        type: TYPES_MAP[getRandomItem(DataMap.OFFER_TYPES)],
        rooms: getRandomNumder(1, 5),
        guests: getRandomNumder(1, 10),
        checkin: getRandomItem(DataMap.TIMES_CHEKC_IN_OUT),
        checkout: getRandomItem(DataMap.TIMES_CHEKC_IN_OUT),
        features: getUnicFeatures(),
        description: '',
        photos: []
      },
      location: {
        x: getRandomNumder(300, 900),
        y: getRandomNumder(100, 500)
      }
    };

    resultdata.push(object);
  }
  return resultdata;
};

var setActivePin = function (curPin) {
  if (curPin !== null && activePin !== curPin) {
    activePin = curPin;
    curPin.classList.add('pin--active');
  }
};

var unsetActivePin = function () {
  if (activePin !== null) {
    activePin.classList.remove('pin--active');
  }
};

var changeActivePin = function (curActivePin) {
  unsetActivePin();
  setActivePin(curActivePin);
};

var hideCurrentOfferDialog = function () {
  offerDialog.classList.add(HIDDEN);
  unsetActivePin();
};

var escKeyDownHandler = function (evt) {
  if (evt.keyCode === KeyMap.ESC_CODE) {
    hideCurrentOfferDialog();
    document.removeEventListener('keydown', escKeyDownHandler);
  }
};

var renderPin = function (dataElem) {
  var resElement = document.createElement('div');
  resElement.classList.add('pin');
  resElement.tabIndex = 0;
  resElement.style.left = (dataElem.location.x - PinSize.WIDTH / 2) + 'px';
  resElement.style.top = (dataElem.location.y - PinSize.HEIGHT) + 'px';
  var imgElement = '<img src="' + dataElem.author.avatar + '" class="rounded" width="40" height="40">';
  resElement.insertAdjacentHTML('afterbegin', imgElement);

  resElement.addEventListener('click', function (evt) {
    changeActivePin(evt.currentTarget);
    renderNewOfferDialog(dataElem);
  });

  resElement.addEventListener('keydown', function (evt) {
    if (evt.keyCode === KeyMap.ENTER_CODE) {
      changeActivePin(evt.currentTarget);
      renderNewOfferDialog(dataElem);
    }
  });
  return resElement;
};

var renderLodgeElement = function (offer) {
  var lodgeElement = lodgetemplate.cloneNode(true);
  lodgeElement.querySelector('.lodge__title').textContent = offer.title;
  lodgeElement.querySelector('.lodge__address').textContent = offer.address();
  lodgeElement.querySelector('.lodge__price').innerHTML = offer.price + ' &#x20bd;/ночь';
  lodgeElement.querySelector('.lodge__type').textContent = offer.type;
  lodgeElement.querySelector('.lodge__rooms-and-guests').textContent = 'Для ' + offer.guests + ' гостей в ' + offer.rooms + ' комнатах';
  lodgeElement.querySelector('.lodge__checkin-time').textContent = 'Заезд после ' + offer.checkin + ', выезд до ' + offer.checkout;
  for (var i = 0; i < offer.features.length; i++) {
    var span = '<span class="feature__image feature__image--' + offer.features[i] + '">';
    lodgeElement.querySelector('.lodge__features').insertAdjacentHTML('afterbegin', span);
  }
  lodgeElement.querySelector('.lodge__description').textContent = offer.description;
  return lodgeElement;
};

var renderNewOfferDialog = function (data) {
  offerDialogImg.setAttribute('src', data.author.avatar);
  offerDialog.replaceChild(renderLodgeElement(data.offer), offerDialog.querySelector('.dialog__panel'));
  if (offerDialog.classList.contains(HIDDEN)) {
    offerDialog.classList.remove(HIDDEN);
    document.addEventListener('keydown', escKeyDownHandler);
  }
};

offerDialogClose.addEventListener('click', function () {
  hideCurrentOfferDialog();
});

var data = createData(DataMap.DATA_LENGTH).sort(function (a, b) {
  return a.location.y - b.location.y;
});

var fragment = document.createDocumentFragment();
data.forEach(function (elem) {
  fragment.appendChild(renderPin(elem));
});
tokioMap.appendChild(fragment);
