// BUDGET CONTROLLER 
var budgetController = (function() {
    
})();


// UI CONTROLLER
var UIController = (function() {
    return {
        getInput: function() {
            return {
                type: document.querySelector('.add__type').value,
                description : document.querySelector('.add__description').value,
                value: document.querySelector('.add__value').value,
            }
        }
    }
})();


// PUBLIC APPLICATION CONTROLLER
var controller = (function(budgetCtrl, uiCtrl) {

    var ctrlAddItem = function(){
        var input = uiCtrl.getInput()
        console.log(input);
    }

    document.querySelector('.add__btn').addEventListener('click', ctrlAddItem);

    document.addEventListener('keypress', function(event){
        if(event.keycode === 13 || event.which === 13){
            ctrlAddItem();
        }
    });

})(budgetController, UIController);


