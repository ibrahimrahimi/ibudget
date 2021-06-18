// BUDGET CONTROLLER 
var budgetController = (function() {
    var Expense = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var Income = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var data = {
        items: {
            expense: [],
            income: []
        },
        totals: {
            totalExpenses: 0,
            totalIncomes: 0
        }
    };

    return {
        newItem: function(type, description, val){
            var newItem, id;

            if(data.items[type].length > 0){
                id = data.items[type][data.items[type].length - 1].id + 1
            } else{ 
                id = 0;
            }

            if(type === 'income'){
                newItem = new Income(id, description, val);
            } else if(type === 'expense'){
                newItem = new Expense(id, description, val);
            }

            data.items[type].push(newItem);
            return newItem;
        }
    }
    
})();

// UI CONTROLLER
var UIController = (function() {
    var domStrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputAddBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list' 
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
        },
        addListItem: function(obj, type) {
            var html, newHtml, element;

            if(type === 'income'){
                element = domStrings.incomeContainer;

                html = '<div class="item clearfix" id="%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            } else if(type === 'expense') {
                element = domStrings.expensesContainer;

                html = '<div class="item clearfix" id ="%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">20%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }
            
            html = html.replace('%id%', obj.id);
            newHtml = html.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);

            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

        },
        clearFields: function(){
            var fields, fieldsArr;
            fields = document.querySelectorAll(domStrings.inputDescription + ', ' + domStrings.inputValue);

            fieldsArr = Array.prototype.slice.call(fields);

            fieldsArr.forEach(function(current, index, Array) {
                current.value = "";
                current.description = "";
            });

            fieldsArr[0].focus();
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

        var newItem = budgetCtrl.newItem(input.type, input.description, input.value);

        uiCtrl.addListItem(newItem, input.type);

        uiCtrl.clearFields();
    };

    return {
        init: function(){
            console.log('Application started.');
            prepareEventListeners();
        }
    }

})(budgetController, UIController);

controller.init();