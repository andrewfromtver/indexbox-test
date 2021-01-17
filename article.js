class Article {

  constructor(article) {
    this.id = article.id;
    this.body = article.body;
    this.description = article.description;
    this.href = article.href;
    this.product = article.product;
    this.time_create = article.time_create;
    this.title = article.title;
    this.views = article.views;
  }

  showArticle() {
    document.querySelector('.content').innerHTML = `
      <div class="item-card">
        <h1>${this.title}</h1>
        ${this.body}
        <p>${convertTime(this.time_create)}</p>
        <div class="card-button" onclick="showArticlePreview(${globalStart}, ${globalEnd})">Back</div>
      </div>
    `;
  }
  
  showArticlePreview() {
    document.querySelector('.content').innerHTML += `
      <div class="card">
        <h3 class="card-title">${this.title}</h3>
        ${this.description}
        <p class="card__counter">${this.views}</p>
        <div id="${this.href}" class="card-button" onclick="showArticle(${this.id})">Preview</div>
      </div>
    `;
  }

  editArticle(body, description, product, title) {
    article.body = body;
    article.description = description;
    article.product = product;
    article.title = title;
  }

}
// convert UNIX time
function convertTime(unixTime) {
  var date = new Date(unixTime * 1000);
  var day = date.getDate();
  var month = date.getMonth();
  var year = date.getFullYear();
  var hours = date.getHours();
  var minutes = "0" + date.getMinutes();
  var seconds = "0" + date.getSeconds();
  var formattedTime = day + '.' + month + '.' + year + ' ' + hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);

  return formattedTime
}

// show articles preview
function showArticlePreview(start, end) {
  // !!! get records from db - 
  const cardsQty = Number(document.querySelector('.cards-qty').value);
  sidebar();
  globalStart = Number(start);
  globalEnd = Number(end);
  document.querySelector('.content').innerHTML = '';
  for (let i = start; i < end; i++) {
    let article = new Article(result[i]);      // !!! test data
    article.id = i;                            // !!! test data
    article.showArticlePreview();
  }
  // Prev. & Next buttons
  document.querySelector('.prev').innerHTML = '';
  if (start != 0) {
    let prevStart = 0;
    if (start - cardsQty > 0) {prevStart = start - cardsQty}
    document.querySelector('.prev').innerHTML = `
      <button 
        class="action-button" 
        onclick="showArticlePreview(${prevStart}, ${start})"
      >Prev.</button>
    `;
  }
  document.querySelector('.next').innerHTML = '';
  if (totalRows > end) {
    let nextEnd = Number(totalRows);
    if ((end + cardsQty) < totalRows) {nextEnd = (Number(end) + Number(cardsQty));}
    document.querySelector('.next').innerHTML = `
      <button 
        class="action-button" 
        onclick="showArticlePreview(${end}, ${nextEnd})"
      >Next</button>
    `;
  }
}

// show selected article
function showArticle(id) {
  // !!! get record from db - 
  lastArticleId = id;
  sidebar(false);
  let article = new Article(result[id]);     // !!! test data
  article.showArticle();
  // !!! update record in db - `update blog set views = views+1 where href = ${article.href}`
}
