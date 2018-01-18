'use strict';

var PIN_WIDTH = 56;
var PIN_HEIGHT = 75;
var TIMES_CHEKC_IN_OUT = ['12:00', '13:00', '14:00'];
var TYPES = [{type: 'flat', name: 'Квартира'},
             {type: 'house', name: 'Дом'},
             {type: 'bungalo', name: 'Бунгало'}];

var features = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var titles = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];

var tokioMap = document.querySelector('.tokyo__pin-map');
var lodgetemplate = document.querySelector('#lodge-template').content;
var offerDialog = document.querySelector('#offer-dialog');
var dialogPanel = offerDialog.querySelector('.dialog__panel');

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

var getRandomUnicItem = function (array, index) {
  var rand = getRandomNumder(index, array.length - 1);
  replaceArrayItems(array, rand, index);
  return array[index];
};

var getRandomItem = function (array) {
  var index = getRandomNumder(0, array.length - 1);
  return array[index];
};

var getUnicFeatures = function (length) {
  var resultFeatures = [];
  for (var i = 0; i < length; i++) {
    resultFeatures.push(getRandomUnicItem(features, i));
  }
  return resultFeatures;
};

var createData = function (count) {
  var resultdata = [];
  for (var i = 0; i < count; i++) {
    var object = {
      author: {
        avatar: 'img/avatars/user' + formatUserNumber(i + 1) + '.png'
      },
      offer: {
        title: getRandomUnicItem(titles, i),
        address: function () {
          return object.location.x + ', ' + object.location.y;
        },
        price: getRandomNumder(1000, 1000000),
        type: getRandomItem(TYPES).name,
        rooms: getRandomNumder(1, 5),
        guests: getRandomNumder(1, 10),
        checkin: getRandomItem(TIMES_CHEKC_IN_OUT),
        checkout: getRandomItem(TIMES_CHEKC_IN_OUT),
        features: getUnicFeatures(getRandomNumder(0, features.length)),
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

var renderPin = function (data) {
  var resElement = document.createElement('div');
  resElement.classList.add('pin');
  resElement.style.left = (data.location.x - PIN_WIDTH / 2) + 'px';
  resElement.style.top = (data.location.y - PIN_HEIGHT) + 'px';
  var htmlString = '<img src="' + data.author.avatar + '" class="rounded" width="40" height="40">';
  resElement.insertAdjacentHTML('afterbegin', htmlString);

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

var renderNewOffer = function (data) {
  offerDialog.querySelector('.dialog__title').querySelector('img').setAttribute('src', data.author.avatar);
  offerDialog.replaceChild(renderLodgeElement(data.offer), dialogPanel);
};

var data = createData(8).sort(function (a,b) {
  return a.location.y - b.location.y;
});
var fragment = document.createDocumentFragment();

data.forEach(function (elem) {
  fragment.appendChild(renderPin(elem));
});

tokioMap.appendChild(fragment);
renderNewOffer(data[0]);
