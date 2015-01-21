function GameController(config) {
    this.config = config || {};
    GameController.prototype.init = function () {
        this.config.stage = new createjs.Stage("loaderCanvas");
        this.config.popupStage = new createjs.Stage("popupCanvas");
        //this.config.stage.canvas.width = window.innerWidth - 150;//TODO make this better
       // this.config.stage.canvas.height = window.innerHeight - 150;//TODO make this better
        loadImages(this);
        window.onkeydown = onKeyBoardEvents;
    }

    var loadImages = function (me) {
        var _doInit = function (me) {
            doInit(me)
        }
        me.config.smbLoadQueue = new SmbLoadQueue({"stage": me.config.stage});
        me.config.smbLoadQueue.loadQueue(Manifest.game, _doInit, me);
    }

    var doInit = function (me) {
        me.config.gameState = new GameState();
        me.config.gameState.init();
        me.config.menuController = new MenuController({
            "gameState": me.config.gameState,
            "loader": me.config.smbLoadQueue
        });
        me.config.menuController.init();
        me.config.stageController = new StageController({
            "gameState": me.config.gameState,
            "loader": me.config.smbLoadQueue
        })
        me.config.stageController.init();
        me.config.shopController = new ShopController({
            "gameState": me.config.gameState,
            "loader": me.config.smbLoadQueue,
            "stage": me.config.popupStage
        })
        me.config.shopController.init();
        me.config.gameLeveController = new GameLevelController({
            "gameState": me.config.gameState,
            "loader": me.config.smbLoadQueue
        });
        me.config.gameLeveController.init();

        EventBus.dispatch("exitShop");
        // EventBus.dispatch("exitMenu");
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


        }
    }


}