function ShopController(config) {
    this.config = config || {};
    ShopController.prototype.init = function () {
        this.config.bag = [];
        this.initial = true;
        loadEvents(this);
        createDialog(this);
       // this.config.loader.loadShopAssets();
        //this.config.stage = new createjs.Stage("myShopCanvas");
        this.config.stage.canvas.width = window.innerWidth - 150;//TODO make this better
        this.config.stage.canvas.height = window.innerHeight - 150;//TODO make this better
        this.config.products = [];
    }


    var loadEvents = function (me) {
        EventBus.addEventListener("exitShop", me.hideShop);
        var ab = function(ob){addToBag(me, ob)}
        EventBus.addEventListener("addToBag", ab);
        var rb = function(ob){removeFromBag(me, ob)}
        EventBus.addEventListener("removeFromBag", rb);
        var ss = function(){showShop(me)}
        EventBus.addEventListener("showShop", ss);
        var lp = function(lc){loadProducts(me, lc)}
        EventBus.addEventListener("loadProducts", lp);
    }
    var createDialog = function(me) {
        $( "#dialog-shop" ).dialog({
                dialogClass: "no-close-cart",
                modal: true,
                closeOnEscape: true,
                width: window.innerWidth - 100,
                height: window.innerHeight - 100
        });
    }

    var loadProducts = function(me){
        var pdtJson = [{name: 'Blue-Ball', id: 'blue-ball', price: 200}, {name: 'Red-Ball', id: 'red-ball', price: 300}, {name: 'Green-Ball', id: 'green-ball', price: 400}];
        var data = JSON.parse(JSON.stringify(pdtJson));
        //var loader = lc.target;
        for(var i=0; i<data.length; i++){
            var config = {"image":me.config.loader.getResult(data[i].id), "name" : data[i].name, "price" : data[i].price };
            var product = new sprites.Product(config);
            me.config.products.push(product);
            me.config.stage.addChild(product);
        }
    }

    var showShop = function (me){
        if(me.initial){
            me.initial = false;
            me.config.loader.loadQueue(Manifest.products, displayShopProducts, me);
        }else{
           displayShopProducts(me);
        }


    }

    var displayShopProducts = function(me){
        loadProducts(me);
        updateProductLocations(me);
        me.config.stage.update();
        $( "#dialog-shop" ).dialog("open");
    }

    var updateProductLocations = function(me){
        var x= 0; var y = 0;
        for(var i = 0 ; i< me.config.products.length; i++){
            var product = me.config.products[i];
            product.homeX = x;
            product.homeY = y;
            product.setPosition(x,y);
            x = x+120;
        }
    }

    var addToBag = function(me,ob){
        var product = ob.target;
        me.config.bag.push(product);
        //product.updatePriceTag()
        updateCart(me);
    }

    var removeFromBag = function(me,ob){
        var product = ob.target;
        product.setPosition(product.homeX,product.homeY);
        var index = me.config.bag.indexOf(product)
        me.config.bag.splice(index, 1);
        updateCart(me);
    }

    var updateCart = function(me){
        var x = 0;  var y = 300;
        for(var i = 0 ; i< me.config.bag.length ; i++){
            var product = me.config.bag[i];
            product.setPosition(x,y);
            x += 120;
        }
        me.config.stage.update();
    }

    ShopController.prototype.hideShop = function () {
        $( "#dialog-shop" ).dialog("close");
    }
    
}