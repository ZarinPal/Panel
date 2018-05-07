Vue.filter('persianNumbers', function(value) {
  if (typeof value == 'undefined') {
    return value;
  }
  var value = typeof value === 'number' ? value.toString() : value;
  return value.toString().replace(/\d/g, function(match) {
    return ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'][parseInt(match)];
  });
});
Vue.filter('jalali', function(date, format) {
  return moment(date, 'YYYY-MM-DD HH:mm:ss').format(format);
});

Vue.filter('fromNow', function(date) {
  return moment(date, 'YYYY-MM-DD HH:mm:ss').fromNow();
});
Vue.filter('numberFormat', function(num) {
  if (typeof num == 'undefined') {
    return num;
  }
  // let number = typeof num === "number" ? num.toString() : num;
  let number = num;
  if (/,/g.test(num))
    number = num.replace(/,/g, '');

  return number.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1' + ',');
});
Vue.filter('less', function(value, length = 20) {
  if (value.length < length) {
    return value;
  }
  let trimmedString = value.substr(0, length);
  trimmedString = trimmedString.substr(0,
      Math.min(trimmedString.length, trimmedString.lastIndexOf(' ')));
  return trimmedString + '...';
});

Vue.filter('ltrText', function(value) {
  return '\u200E' + value + '\u200F';
});
Vue.filter('month', function(value) {
  return value.substring(5);
});
Vue.filter('year', function(value) {
  return value.substring(2, 4);
});
Vue.filter('code', function(value) {
  let regex = /{کد}([\s\S]*?){\/کد}/g;
  return value.replace(regex, '<div class=\'code\'>$1</div>');
});
Vue.filter('cardNumber', function(number) {
  // let text = number.replace(/[^\d]/g, "");
  let text = number;
  let result = [];
  while (text.length > 4) {
    result.push(text.substring(0, 4));
    text = text.substring(4);
  }
  result.push(text);
  return result.join('-');
});