// show/hide sidebar 
function sidebar(state = true) {
  document.querySelector('#views-from').disabled = !state;
  document.querySelector('#views-to').disabled = !state;
  document.querySelector('#name').disabled = !state;
  document.querySelector('#date-from').disabled = !state;
  document.querySelector('#date-to').disabled = !state;
  document.querySelector('.cards-qty').disabled = !state;
  document.querySelectorAll('.action-button').forEach(function(e){e.disabled = !state}); 
  if (state) {
    document.querySelector('.sidebar').style.width = '300px';
    document.querySelector('.content').style.margin = '20px 10px 20px 310px';
  }
  if (!state) {
    document.querySelector('.sidebar').style.width = '0px';
    document.querySelector('.content').style.margin = '20px auto';
  }
}

// filter presets
function isNumber(obj) {
  return obj!== undefined && typeof(obj) === 'number' && !isNaN(obj);
}
function byName(item) {
  let searchString = document.querySelector('#name').value;
  let re = new RegExp('.*' + searchString.toLowerCase() + '.*');
  if (searchString.length > 2) {
    return !!item.name.toLowerCase().match(re);
  }
}
function byProduct(item) {
  let searchString = document.querySelector('#name').value;
  let re = new RegExp('.*' + searchString.toLowerCase() + '.*');
  if (searchString.length > 2) {
    return !!item.product.toLowerCase().match(re);
  }
}
function byDate(item) {
  let dateFrom = 0;
  let dateTo = Infinity;
  if (document.querySelector('#date-from').value) {
    dateFrom = new Date(document.querySelector('#date-from').value).getTime() / 1000;
  }
  if (document.querySelector('#date-to').value) {
    dateTo = new Date(document.querySelector('#date-to').value).getTime() / 1000;
  }
  return !!(isNumber(item.time_create) && item.time_create >= dateFrom && item.time_create <= dateTo);
}
function byViews(item) {
  let viewsFrom = document.querySelector('#views-from').value;
  let viewsTo = document.querySelector('#views-to').value;
  if (viewsTo == 0) {
    viewsTo = Infinity;
  }
  return !!(isNumber(item.views) && item.views >= viewsFrom && item.views <= viewsTo);
}

// input helper
function helper() {
  let inner = '';
  products.filter(byName).forEach(function(e) {
    inner += `
      <p onclick="selectItem(this.innerText)">${e.name}</p>
    `
  })
  document.querySelector('.input-helper').innerHTML = inner;
}
function selectItem(text) {
  document.querySelector('#name').value = text;
  document.querySelector('.input-helper').innerHTML = '';
}

// sidebar filters
function filterData(trigger) {
  let qty = document.querySelector('.cards-qty').value,
      queryString = document.querySelector('#name').value;
  if (trigger) {
    result = blogData.filter(byViews).filter(byDate);     // !!! test data
    if (queryString.length > 2) {
      result = result.filter(byProduct);                  // !!! test data
    }
    if (qty > result.length || qty <= 0) { qty = result.length};
    totalRows = result.length;
    showArticlePreview(0, qty);
  }
  else {
    document.querySelector('#name').value =
    document.querySelector('#views-from').value = 
    document.querySelector('#views-to').value =
    document.querySelector('#date-from').value = 
    document.querySelector('#date-to').value = '';
    result = blogData;
    totalRows = result.length;
    showArticlePreview(0, qty);
  }
  globalStart = 0;
  globalEnd = Number(qty);
}

// init web-app (result = rows fetched from db in json)
let result = blogData,          // !!! test data
    inputHelper = products,     // !!! test data
    totalRows = result.length;  // !!! test data
    globalStart = 0,
    globalEnd = 10;

function init() {
  // listeners
  const cardsQty = document.querySelector('.cards-qty');
  cardsQty.addEventListener('change', function () {
    let previewEnd = totalRows;
    if (Number(globalStart) + Number(this.value) < totalRows) {
      previewEnd = Number(globalStart) + Number(this.value)
    }
    showArticlePreview(globalStart, previewEnd);
  });
  // init first preview
  cardsQty.value = Number(globalEnd) - Number(globalStart);
  showArticlePreview(globalStart, globalEnd);
}

document.addEventListener('DOMContentLoaded', init);