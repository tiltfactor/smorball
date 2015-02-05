function GameController(config) {
    this.config = config || {};
    GameController.prototype.init = function () {
        this.config.stage = new createjs.Stage("loaderCanvas");
        this.config.popupStage = new createjs.Stage("popupCanvas");
        this.config.utilityStage = new createjs.Stage("utilityCanvas");
        this.config.stage.canvas.width = window.innerWidth ;//TODO make this better
        this.config.stage.canvas.height = window.innerHeight;//TODO make this better


        this.store = new LocalStorage();

        this.config.gameState = new GameState({"store": this.store.getFromStore().gameState});
        this.config.gameState.init();

        loadEvents(this);
        loadImages(this);
        window.onkeydown = onKeyBoardEvents;
    }
    var loadFromStore = function(me){
        var ls = new LocalStorage({"gameState":me.config.gameState});
    }

    var loadImages = function (me) {
       var _doInit = function (me) {
            doInit(me)
        }

        var manifest = Manifest.game;
        var splash = LoaderData[1];
        manifest.push({"src": splash.image, "id" : splash.id});
        me.config.smbLoadQueue = new SmbLoadQueue({"stage": me.config.stage, "gameState":me.config.gameState });
        me.config.smbLoadQueue.loadQueue(manifest, _doInit, me,"start");
    }

    var doInit = function (me) {
        var config = {"loader" : me.config.smbLoadQueue, "gameState" : me.config.gameState};
        me.myBag = new MyBag(config)

        me.config.menuController = new MenuController({
            "gameState": me.config.gameState,
            "loader": me.config.smbLoadQueue
        });
        me.config.menuController.init();

        me.config.soundController = new SoundController({
            "gameState": me.config.gameState,
            "loader": me.config.smbLoadQueue
        });
        me.config.soundController.init();

        me.config.stageController = new StageController({
            "gameState": me.config.gameState,
            "loader": me.config.smbLoadQueue,
            "myBag" : me.myBag
        })
        me.config.stageController.init();

        me.config.shopController = new ShopController({
            "gameState": me.config.gameState,
            "loader": me.config.smbLoadQueue,
            "stage": me.config.popupStage
            ,"myBag" : me.myBag
        })
        me.config.shopController.init();

        me.config.gameLeveController = new GameLevelController({
            "gameState": me.config.gameState,
            "loader": me.config.smbLoadQueue,
            "stage":me.config.utilityStage
        });
        me.config.gameLeveController.init();
        hideAll();
        //EventBus.dispatch("exitShop");
        // EventBus.dispatch("exitMenu");
    }

    var loadEvents = function(me){
        var hl = function(){hideAll(me)};
        EventBus.addEventListener("hideAll",hl);
        var ss = function(){me.save()}
        EventBus.addEventListener("saveToStore", ss);
    }
    var hideAll = function(){
        $("#shop").hide();
        $("#loaderCanvas").hide();
        $("#dialog-utility").hide();
        $("#dialog-shop").hide();
        $("#myCanvas").hide();
        $("#canvasHolder").hide();

        
    }


    var clearStage = function (stage) {
        stage.removeAllChildren();
    }


    const ARROW_KEY_LEFT = 37;
    const ARROW_KEY_UP = 38;
    const ARROW_KEY_RIGHT = 39;
    const ARROW_KEY_DOWN = 40;
    const SPACE_KEY_DOWN = 32;
    const ESC_KEY = 27;
    const SHIFT_KEY = 16;
    const ONE = 49;
    const TWO = 50;
    const THREE = 51;
    const TAB_KEY = 9;


    var onKeyBoardEvents = function (e) {
        switch (e.keyCode) {

            case ARROW_KEY_LEFT:
                // currentActivePlayer.x --;
                break;
            case ARROW_KEY_UP:
                // currentActivePlayer.y --;
                break;
            case ARROW_KEY_RIGHT:
                //currentActivePlayer.x ++;
                break;
            case ARROW_KEY_DOWN:
                //currentActivePlayer.y ++;
                break;
            case SPACE_KEY_DOWN:
                //currentActivePlayer.gotoAndPlay("jump")
                break;
            case ESC_KEY:
                EventBus.dispatch("showTimeoutScreen");
                break;
            case ONE:
                if (e.shiftKey) {
                    console.log("1");
                    EventBus.dispatch("assistText",1);
                }
                break;
            case TWO:
                if (e.shiftKey) {
                    console.log("2");
                    EventBus.dispatch("assistText",2);
                }
                break;
            case THREE:
                if (e.shiftKey) {
                    console.log("3");
                    EventBus.dispatch("assistText",3);
                }
                break;

            case TAB_KEY:
                EventBus.dispatch("selectOnTab");
                $("#inputText").focus();
                break;

        }
    }

    GameController.prototype.persist = function(){
        var data = {};
        data.myBag = this.myBag.persist();
        data.gameState = this.config.gameState.persist();
        var json = JSON.stringify(data);
        return json;
    }
    GameController.prototype.save = function(){
        var object = this.persist();
        this.store.saveToStore(object);
    }


}
