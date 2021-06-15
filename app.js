// BUDGET CONTROLLER 
var budgetController = (function() {
    
})();


// UI CONTROLLER
var UIController = (function() {

    var domStrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputAddBtn: '.add__btn' 
    }

    return {
        getInput: function() {
            return {
                type: document.querySelector(domStrings.inputType).value,
                description : document.querySelector(domStrings.inputDescription).value,
                value: document.querySelector(domStrings.inputValue).value,
            }
        },
        getDomString: function() {
            return domStrings;
        }
    }
})();


// PUBLIC APPLICATION CONTROLLER
var controller = (function(budgetCtrl, uiCtrl) {
    var dom = uiCtrl.getDomString();
    console.log(dom);
    var ctrlAddItem = function(){
        var input = uiCtrl.getInput()
        console.log(input);
    }

    document.querySelector(dom.inputAddBtn).addEventListener('click', ctrlAddItem);

    document.addEventListener('keypress', function(event){
        if(event.keycode === 13 || event.which === 13){
            ctrlAddItem();
        }
    });

})(budgetController, UIController);


