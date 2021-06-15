// BUDGET CONTROLLER 
var budgetController = (function() {

    var Expense = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value;
    };

    var Income = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var data = {
        items: {
            expenses: [],
            incomes: []
        },
        totals: {
            totalExpenses: 0,
            totalIncomes: 0
        }
    };
    
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
    var prepareEventListeners = function() {
        var dom = uiCtrl.getDomString();
        document.querySelector(dom.inputAddBtn).addEventListener('click', ctrlAddItem);
        document.addEventListener('keypress', function(e) {
            if(e.keycode === 13 || e.which === 13){
                ctrlAddItem();
            };
        });
    };

    var ctrlAddItem = function(){
        var input = uiCtrl.getInput()
        console.log(input);
    };

    return {
        init: function(){
            console.log('Application started.');
            prepareEventListeners();
        }
    }

})(budgetController, UIController);

controller.init();