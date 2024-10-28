var cardContainer = document.getElementById("cardContainer");

const loadProducts = async () => {
    var baseline = 1;
    var productCount = baseline + 3;

    for (var i = baseline; i <= productCount; i++) {
        const response = await fetch('https://fakestoreapi.com/products/' + i);
        const product = await response.json();

        cardContainer.innerHTML += `<div class="card-container mx-3 my-3  animate__animated animate__bounceIn" >
      <div class="img-card-container">
        <img src="` + product.image + `">
      </div>
      <div class="content-card-container">
        <div class="row">
          <div class="col-8 ps-3 py-2">
            <div class="product-title">
            ` + product.title + `
            </div>
            <div class="product-price">
            $` + product.price + `
            </div>
          </div>
          <div class="col-4 text-center py-2">
            <a href="view.html?productId=` + product.id + `"><button type="button" class="btn btn-secondary product-btn">...</button></a>
          </div>
        </div>
      </div>
    </div>`;
    }
}


//   trigger on load

loadProducts();


var img = document.getElementById("img");
var title = document.getElementById("title");
var price = document.getElementById("price");
var description = document.getElementById("description");
var imgContainer = document.getElementById("imgContainer");

const loadOneProduct = async () => {
    const response = await fetch('https://fakestoreapi.com/products/14');
    const product = await response.json();

    title.innerHTML = product.title;
    price.innerHTML = "$" + product.price;
    description.innerHTML = product.description;
    img.src = product.image;
};

loadOneProduct();

var img2 = document.getElementById("img2");
var title2 = document.getElementById("title2");
var price2 = document.getElementById("price2");
var description2 = document.getElementById("description2");
var imgContainer2 = document.getElementById("imgContainer2");

const loadOneProduct2 = async () => {
    const response = await fetch('https://fakestoreapi.com/products/8');
    const product = await response.json();

    title2.innerHTML = product.title;
    price2.innerHTML = "$" + product.price;
    description2.innerHTML = product.description;
    img2.src = product.image;
};

loadOneProduct2();