var img = document.getElementById("img");
var title = document.getElementById("title");
var webtitle = document.getElementById("webtitle");
var price = document.getElementById("price");
var description = document.getElementById("description");
var imgContainer = document.getElementById("imgContainer");

const loadOneProduct = async (productId) => {
    const response = await fetch(`https://fakestoreapi.com/products/${productId}`);
    const product = await response.json();

    title.innerHTML = product.title;
    price.innerHTML = "$" + product.price;
    description.innerHTML = product.description;
    img.src = product.image;
    webtitle.innerHTML = "Shoppyfy | " + product.title;
};

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

if (urlParams.has('productId')) { 
    const productId = urlParams.get('productId');
    loadOneProduct(productId);
}

