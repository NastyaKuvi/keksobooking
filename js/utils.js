'use strict';
window.utils = (function () {

  var KeyMap = {
    ESC_CODE: 27,
    ENTER_CODE: 13
  };

  var isEnterKeyHandler = function (evt) {
    return evt && evt.keyCode === KeyMap.ENTER_CODE;
  };

  var isEscKeyHandler = function (evt) {
    return evt && evt.keyCode === KeyMap.ESC_CODE;
  };

  var replaceArrayItems = function (array, index1, index2) {
    var item = array[index1];
    array[index1] = array[index2];
    array[index2] = item;
  };

  var getRandomNumber = function (min, max) {
    return Math.floor(min + Math.random() * (max + 1 - min));
  };

  var getRandomItem = function (array) {
    var index = getRandomNumber(0, array.length - 1);
    return array[index];
  };

  var shuffleArray = function (array) {
    var resArray = array.slice(0);
    for (var i = 0; i < resArray.length; i++) {
      var rand = getRandomNumber(i, resArray.length - 1);
      replaceArrayItems(resArray, rand, i);
    }
    return resArray;
  };

  return {
    isEnterKeyHandler: isEnterKeyHandler,
    isEscKeyHandler: isEscKeyHandler,
    getRandomNumber: getRandomNumber,
    getRandomItem: getRandomItem,
    shuffleArray: shuffleArray,
    replaceArrayItems: replaceArrayItems
  };
})();
