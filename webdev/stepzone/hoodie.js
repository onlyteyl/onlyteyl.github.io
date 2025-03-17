var hoodies = [
    {
        "pic": "img2/hoodie1.png",
        "hoodietitle": "NIKE TECH",
        "hoodieubtitle": "WIND RUNNER GRAY",
        "price": "$135"
    },

    {
        "pic": "img2/hoodie2.png",
        "hoodietitle": "NIKE TECH",
        "hoodieubtitle": "WIND RUNNER BLACK",
        "price": "$160"
    },

    {
        "pic": "img2/hoodie3.png",
        "hoodietitle": "NIKE SB",
        "hoodieubtitle": "SKATE FLEECE HOODIE",
        "price": "$90"
    },

    {
        "pic": "img2/hoodie4.png",
        "hoodietitle": "NIKE CLUB",
        "hoodieubtitle": "PULLOVER HOODIE",
        "price": "$85"
    },

];

for (var i = 0; i < hoodies.length; i++) {
    var hoodieContainer = document.getElementById("hoodieContainer"); hoodieContainer.innerHTML += 
    `<div class="hoodie-container mx-3 rounded-4" id="c`+ i +`" onmouseenter= "addShadow('c`+ i +`')" onmouseleave= "removeShadow('c`+ i +`')">
      <div class="img-hoodie-container">
        <img src="`+ hoodies[i]['pic'] + `">
      </div>
      <div clas="hoodie-content-container">
        <div class="row pb-3">
          <div class="col-6 text-start shoe-title">
          `+ hoodies[i]['hoodietitle'] + `<br><span style="font-size: 15px;">` + hoodies[i]['hoodieubtitle'] + `</span>
          </div>
          <div class="col-6 text-end shoe-price"> <span style="font-size: 15px;">PRICE</span>
          `+ hoodies[i]['price'] + `
          </div>
        </div>
        <button class="btn btn-primary d-flex align-item-center btn-add-to-cart">Add to Cart</button>
      </div>
    </div>`}

  function addShadow(id){
    document.getElementById(id).classList.add("shadow");
  }

  function removeShadow(id){
    document.getElementById(id).classList.remove("shadow");
  }

  var display = "none";
  function expandContentHoodie(){
    var hoodie = document.getElementById("hoodie");
    var btnExpandHoodie = document.getElementById("btnExpandHoodie");

    if(display == "none") {
      hoodie.style.display = "block";
      display = "block";
      btnExpandHoodie.innerHTML = "CLICK HERE";
    } else {
      hoodie.style.display = "none";
      display = "none";
      btnExpandHoodie.innerHTML = "CLICK HERE!";
    }
  }
