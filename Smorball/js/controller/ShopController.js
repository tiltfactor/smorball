function ShopController(config) {
    this.config = config || {};
    ShopController.prototype.init = function () {
        this.config.bag = [];
        this.initial = true;
        loadEvents(this);
        //createDialog(this);
        // this.config.loader.loadShopAssets();
        //this.config.stage = new createjs.Stage("myShopCanvas");
        //setCanvasAttributes(this)
        //this.config.stage.canvas.width = window.innerWidth - 150;//TODO make this better
        //this.config.stage.canvas.height = window.innerHeight - 150;//TODO make this better
        this.config.products = [];
        generateDiv(this)
    }
    var generateDiv = function(me){
        var template = $("#shopComponents").html();
        var compile = _.template(template);
        $(".itemDiv").append(compile({items:shopData}));

    }
    var resetAll = function(me){
        me.config.bag = [];
        me.initial = true;
        me.config.products = [];
    }


    var loadEvents = function (me) {
        EventBus.addEventListener("exitShop", me.hideShop);
        var ab = function(ob){addToBag(me, ob.target)};
        EventBus.addEventListener("addToBag", ab);
        var rb = function(ob){removeFromBag(me, ob.target)};
        EventBus.addEventListener("removeFromBag", rb);
        var ss = function(){showShop(me)}
        EventBus.addEventListener("showShop", ss);
        var lp = function(lc){loadProducts(me, lc)}
        EventBus.addEventListener("loadProducts", lp);
    }


    var showShop = function (me){
        me.score = new Score({"gameState":me.config.gameState});
        var money = me.score.getMyMoney();
        $(".wallet").text("$"+money);
        me.config.stage.removeAllChildren();
        resetAll(me);
        EventBus.dispatch("hideAll");
        setUpgradeStatus(me);
        $("#shopOuterWrapper").css("display","block");
        $('.scrollContainer').slimscroll({
            alwaysVisible: true,
            railVisible: true,
            height: "100%",
            color : 'transparent'
        });

    }
    var setUpgradeStatus = function(me){
        $(".wallet").text("$"+me.score.getMyMoney());
        var innerItems = $(".itemDiv").children().filter(".innerItem").find(".innerDiv");
        _.each(innerItems,function(item){
            $(item).find(".upgrade").unbind( "click" );
            var price = getPrice(item.id);
            if(price>me.score.getMyMoney()){
                $(item).find(".upgrade").css("background-color","#FF3030");
                $(item).find(".upgrade").unbind( "click" );
                $(item).find(".upgrade").css("background-image","url(shapes/btn1_grey.png)");
            }else if(price<me.score.getMyMoney()){
                $(item).find(".upgrade").css("background-color","#a7cb00");
                $(item).find(".upgrade").click(function(){EventBus.dispatch("addToBag", this.parentElement)});
                $(item).find(".upgrade").css("background-image","url(shapes/btn_bg.png)");
            }
            _.each(me.config.myBag.myBag,function(upgrade){
                if (upgrade.shopped>0&& upgrade.getType()== item.id) {
                    var btn = $(item).find(".upgrade");
                    setButtonDown(btn);
                }
            });
            _.each(me.config.gameState.gs.sponserShips,function(sponser){
                if(sponser == item.id){
                    var btn = $(item).find(".upgrade");
                    setButtonDown(btn);
                }
            });
            var btn = $(item).find(".upgrade");
            if(item.id == "strength" && me.config.gameState.gs.knockBack == 0.15){
                setButtonDown(btn)
            }
            if(item.id=="breakfast" && me.config.gameState.gs.extraDamage == 2){
                setButtonDown(btn);
            }
            if(item.id=="nightclass" && me.config.gameState.gs.penalty == 1000){
                setButtonDown(btn)
            }

            
        });

    };
    var setButtonDown = function(btn){
        btn.unbind("click");
        btn.css("background-image","url(shapes/btn1_down.png)");
        btn.click(function(){EventBus.dispatch("removeFromBag", this.parentElement)});
    };
    var getPrice = function(id){
        for(var i=0;i<shopData.length;i++){
            if(id==shopData[i].id){
                return shopData[i].price
            }
        }
    }
    var drawExit = function(me){
        var label = new createjs.Text();
        label.text = "exit";
        label.font = "bold 30px Arial";
        label. color = "red";
        label.x = 300;
        label.y = 300;
        label.addEventListener("click",showMap);
        me.config.stage.addChild(label);
        me.config.stage.update();
    }
    var showMap = function(){
        console.log("clicked exit");
        EventBus.dispatch("exitShop")
    };

    var displayShopProducts = function(me){
        loadProducts(me);
        updateProductLocations(me);

        me.config.stage.update();
        //$( "#dialog-shop" ).dialog("open");
    }

    var updateProductLocations = function(me){
        var x= 0; var y = 0;
        for(var i = 0 ; i< me.config.products.length; i++){
            var product = me.config.products[i];
            product.homeX = x;
            product.homeY = y;
            product.setPosition(x,y);
            x = x + 120;
        }
    }

    var addToBag = function(me,ob){
        console.log(ob);
        var btn = $(ob).find(".upgrade");
        var id = ob.id;
        btn.unbind("click");
        var type = $(ob).find(".title").attr("pType");
        if(type=="powerup"){
            me.config.myBag.addToBagFromShop(id);
        }
        if(type=="sponserShip"){
            var sponser =  id;
            me.config.gameState.gs.sponserShips.push(sponser);
        }
        if(type=="strength"){
            me.config.gameState.gs.knockBack = 0.15;
        }
        if(type=="breakfast"){
            me.config.gameState.gs.extraDamage = 2;
        }
        if(type=="nightclass"){
            me.config.gameState.gs.penalty = 1000;
        }


        me.config.gameState.gs.dollorSpend +=getPrice(id);

        setUpgradeStatus(me)

    }

    var removeFromBag = function(me,ob){

        var btn = $(ob).find(".upgrade");
        btn.unbind("click");
        var id = ob.id;
        var type =  $(ob).find(".title").attr("pType");
        if(type =="powerup"){
            me.config.myBag.removeFromBagToShop(id);
        }
        if(type=="sponserShip"){
            var sponser =  id;
            me.config.gameState.gs.sponserShips.splice(sponser,1);
        }
        if(type=="strength"){
            me.config.gameState.gs.knockBack = 0.1;
        }
        if(type=="breakfast"){
            me.config.gameState.gs.extraDamage = 1;
        }
        if(type=="nightclass"){
            me.config.gameState.gs.penalty = 2000;
        }

        me.config.gameState.gs.dollorSpend -=getPrice(id);
        setUpgradeStatus(me);

    };

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
        EventBus.dispatch("hideAll");
        EventBus.dispatch("showMap");
        //$( "#dialog-shop" ).dialog("close");
    }
    var persist = function(me){
    
}
    
}