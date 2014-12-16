function MenuController(config) {
    this.config = config || {};
    MenuController.prototype.init = function(){
        createDialog();
        loadEvents(this);
    }

    var loadEvents = function (me) {
        EventBus.addEventListener("exitMenu", me.hideMenu);
        EventBus.addEventListener("showMenu", me.showMenu);
    }

    MenuController.prototype.showMenu = function () {
        $( "#dialog-message" ).dialog("open");
    }
    MenuController.prototype.hideMenu = function () {
        $( "#dialog-message" ).dialog("close")
    }

    var createDialog = function(){
        $( "#dialog-message" ).dialog(
            {
                dialogClass: "no-close",
                modal: true,
                closeOnEscape: false
            });
        $("#dialog-message Button" ).button();
    }
}