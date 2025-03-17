var shoes = [
    {
        "pic": "img/jordan1.png",
        "shoetitle": "JORDAN 1",
        "shoesubtitle": "LOST AND FOUND",
        "price": "$180"
    },

    {
        "pic": "img/j1UniBlue.png",
        "shoetitle": "JORDAN 1",
        "shoesubtitle": "UNIVERSITY BLUE",
        "price": "$156"
    },

    {
        "pic": "img/j4PurePlat.png",
        "shoetitle": "JORDAN 4",
        "shoesubtitle": "PURE PLATINUM",
        "price": "$800"
    },

    {
        "pic": "img/nikeReax.png",
        "shoetitle": "NIKE REAX",
        "shoesubtitle": "TR",
        "price": "$90"
    },

    {
        "pic": "img/j1Mid.png",
        "shoetitle": "JORDAN 1",
        "shoesubtitle": "MID",
        "price": "$125"
    },

    {
        "pic": "img/panda.png",
        "shoetitle": "SB DUNKS",
        "shoesubtitle": "PANDA",
        "price": "$115"
    },

    {
        "pic": "img/pegasus.png",
        "shoetitle": "NIKE AIR",
        "shoesubtitle": "PEGASUS 2005",
        "price": "$150"
    },

    {
        "pic": "img/vomero.png",
        "shoetitle": "NIKE ZOOM",
        "shoesubtitle": "VOMERO 5",
        "price": "$160"
    },

    {
        "pic": "img/uptempo.png",
        "shoetitle": "NIKE AIR",
        "shoesubtitle": "MORE UPTEMPO 96",
        "price": "$143"
    },

    {
        "pic": "img/jumpman.png",
        "shoetitle": "JORDAN",
        "shoesubtitle": "JUMPMAN MVP",
        "price": "$123"
    },

    {
        "pic": "img/V2K.png",
        "shoetitle": "NIKE V2K",
        "shoesubtitle": "RUN",
        "price": "$80"
    },

    {
        "pic": "img/nrg.png",
        "shoetitle": "AIR JORDAN 9",
        "shoesubtitle": "NRG",
        "price": "$230"
    },




];

for (var i = 0; i < shoes.length; i++) {
    var myContainer = document.getElementById("cardContainer"); myContainer.innerHTML += `<div class="col-6 col-sm-6 col-md-4 col-lg-3 mb-4 rounded-4" id="c`+ i +`" onmouseenter= "addShadow('c`+ i +`')" onmouseleave= "removeShadow('c`+ i +`')" >
    <div class="card hover-card">
      <img src="  `+ shoes[i]['pic']+` " class="card-img-top" alt="...">
      <div class="card-body">
        <div class="row pb-3">
          <div class="col-6 text-start shoe-title">
          `+ shoes[i]['shoetitle']+`<br><span style="font-size: 15px;">`+ shoes[i]['shoesubtitle']+`</span>
          </div>
          <div class="col-6 text-end shoe-price"> <span style="font-size: 15px;">PRICE</span>
          `+ shoes[i]['price']+`
          </div>
        </div>
        <button class="btn btn-primary d-flex align-item-center btn-add-to-cart">Add to Cart</button>
      </div>
    </div>
  </div> `}
  
  function addShadow(id){
    document.getElementById(id).classList.add("shadow");
  }

  function removeShadow(id){
    document.getElementById(id).classList.remove("shadow");
  }

  


    function expandContent(){
      var footer = document.getElementById("footer");
      var btnExpand = document.getElementById("btnExpand");

      if(display == "none") {
        footer.style.display = "block";
        display = "block";
        btnExpand.innerHTML = "COLLAPSE";
      } else {
        footer.style.display = "none";
        display = "none";
        btnExpand.innerHTML = "MORE INFO";
      }
    }

    var colorMode = "light";
    function changeMode() {
      var bodyElement = document.getElementById("body");
      colorMode = colorMode == "dark" ? "light" : "dark";
      bodyElement.setAttribute("data-bs-theme", colorMode);
    }


 