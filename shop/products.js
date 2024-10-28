var cardContainer = document.getElementById("cardContainer");

const loadProducts = async () => {
    var baseline = 1;
    var productCount = baseline + 19;

    for (var i = baseline; i <= productCount; i++) {
        const response = await fetch('https://fakestoreapi.com/products/' + i);
        const product = await response.json();

        cardContainer.innerHTML += `<div class="card-container mx-3 my-3  " >
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

loadProducts();