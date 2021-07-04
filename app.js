// BUDGET CONTROLLER 
var budgetController = (function() {
    var Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };

    Expense.prototype.calculatePercentage = function(totalIncome) {
        if(totalIncome > 0) {
            console.log('total income matched    ', totalIncome);
            this.percentage = Math.round(this.value * 100 / totalIncome);
        } else {
            this.percentage = -1;
        }
    };

    Expense.prototype.getPercentage = function() {
        return this.percentage;
    };

    var Income = function(id, description, value) {
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
        },
        budget: 0,
        percentage: -1,
    };

    var calculateTotal = function(type) {
        var sum = 0;
        data.items[type].forEach(function(currentItem) {
            sum += currentItem.value;
        });
        data.totals[type] = sum;
    };

    return {
        newItem: function(type, description, val) {
            var newItem, id;

            if(data.items[type].length > 0) {
                id = data.items[type][data.items[type].length - 1].id + 1
            } else { 
                id = 0;
            }

            if(type === 'income') {
                newItem = new Income(id, description, val);
            } else if(type === 'expense') {
                newItem = new Expense(id, description, val);
            }

            data.items[type].push(newItem);

            return newItem;
        },
        calculateBudget: function() {
            calculateTotal('income');
            calculateTotal('expense');

            data.budget = data.totals.income - data.totals.expense;

            if(data.totals.expense > 0) {
                data.percentage = Math.round(data.totals.expense / data.totals.income * 100);
            } else {
                data.percentage = -1;
            }
        },
        getBudget: function() {
            return {
                budget: data.budget,
                totalIncome: data.totals.income,
                totalExpenses: data.totals.expense,
                percentage: data.percentage
            }
        },
        calculatePercentages: function() {
            data.items.expense.forEach(function(current) {
                current.calculatePercentage(data.totals.income);
            });
        },
        getPercentages: function() {
            var percentages = data.items.expense.map(function(current) {
                return current.getPercentage();
            });
            return percentages;
        },
        deleteItem: function(type, id) {
            data.items[type].map(function(current, index) {
                if(current.id === id){
                    data.items[type].splice(index, 1);
                }
            });
        },
        getBudgetItem: function() {
            return {
                items: data.items, 
                totals: data.totals
            }
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
        expensesContainer: '.expenses__list',
        budgetValue: '.budget__value',
        incomeLabel: '.budget__income--value',
        expenseLabel: '.budget__expenses--value',
        budgetPercentage: '.budget__expenses--percentage',
        container: '.container',
        expenseItemPercentage: '.item__percentage',
        dateItem: '.budget__title--month' 
    };


    var formatNumbers = function(num, type) {
        var numSplit, int, deci;

        num = Math.abs(num);
        num = num.toFixed(2);

        numSplit = num.split('.');
        int = numSplit[0];

        if(int.length > 3) {
            int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, int.length);
        }

        deci = numSplit[1];

        return (type === 'expense' ? '-' : '+') + ' ' + int + '.' + deci;
    };

    var nodeListForEach = function(list, callback) {
        for(var i = 0; i < list.length; i++) {
            callback(list[i], i);
        }
    };

    return {
        getInput: function() {
            return {
                type: document.querySelector(domStrings.inputType).value,
                description : document.querySelector(domStrings.inputDescription).value,
                value: parseFloat(document.querySelector(domStrings.inputValue).value),
            }
        },
        getDomString: function() {
            return domStrings;
        },
        addListItem: function(obj, type) {
            var html, newHtml, element;

            if(type === 'income') {
                element = domStrings.incomeContainer;

                html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            } else if(type === 'expense') {
                element = domStrings.expensesContainer;

                html = '<div class="item clearfix" id ="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">%21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }
            
            html = html.replace('%id%', obj.id);
            newHtml = html.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%',formatNumbers(obj.value, type));
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

        },
        clearFields: function() {

            var fields, fieldsArr;
            fields = document.querySelectorAll(domStrings.inputDescription + ', ' + domStrings.inputValue);

            fieldsArr = Array.prototype.slice.call(fields);

            fieldsArr.forEach(function(current) {
                current.value = "";
                current.description = "";
            });

            fieldsArr[0].focus();
        },
        displayBudget: function(budgetItem) {

            document.querySelector(domStrings.budgetValue).textContent = budgetItem.budget;
            document.querySelector(domStrings.incomeLabel).textContent = budgetItem.totalIncome;
            document.querySelector(domStrings.expenseLabel).textContent = budgetItem.totalExpenses;
            
            if(budgetItem.percentage > 0) {
                document.querySelector(domStrings.budgetPercentage).textContent = budgetItem.percentage +'%';
            } else {
                document.querySelector(domStrings.budgetPercentage).textContent = '---';
            }
        },
        displayPercentage: function(percentages) {
            var fields = document.querySelectorAll(domStrings.expenseItemPercentage);

            nodeListForEach(fields, function(current, index) {
                if(percentages[index] > 0) {
                    current.textContent = percentages[index] + '%';
                } else {
                    current.textContent = '---';
                }
            });
        },
        deleteListItem: function(selectedItem) {
            el = document.getElementById(selectedItem);
            el.parentNode.removeChild(el);
        },
        displayDate: function() {
            var now, month, months, year;

            now = new Date();
            months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

            year = now.getFullYear();
            month = months[now.getMonth()] + ' ' + year;

            document.querySelector(domStrings.dateItem).textContent = month;
        },
        changeType: function() {
            var fields = document.querySelectorAll(domStrings.inputType + ',' + domStrings.inputDescription + ',' + domStrings.inputValue);
            nodeListForEach(fields, function(current) {
                current.classList.toggle('red-focus');
            });

            document.querySelector(domStrings.inputAddBtn).classList.toggle('red');
        }
    }
})();

// PUBLIC APPLICATION CONTROLLER
var controller = (function(budgetCtrl, uiCtrl) {''
    var prepareEventListeners = function() {
        var dom = uiCtrl.getDomString();

        document.querySelector(dom.inputAddBtn).addEventListener('click', ctrlAddItem);

        document.querySelector(dom.container).addEventListener('click', ctrlDeleteItem);

        document.querySelector(dom.inputType).addEventListener('change', uiCtrl.changeType);

        document.addEventListener('keypress', function(e) {
            if(e.keycode === 13 || e.which === 13){
                ctrlAddItem();
            };
        });
    };

    var updateBudget = function(){
        budgetCtrl.calculateBudget();

        var budget = budgetCtrl.getBudget();
        
        uiCtrl.displayBudget(budget);
    };

    var updatePercentage = function() {
        budgetCtrl.calculatePercentages();

        var percentages = budgetCtrl.getPercentages();

        uiCtrl.displayPercentage(percentages);
    };

    var ctrlDeleteItem = function(e) {
        var itemId, newId;

        itemId = e.target.parentNode.parentNode.parentNode.parentNode.id;
        
        if(itemId) {
            newId = itemId.split('-');
            
            type = newId[0];
            id = newId[1];
            budgetCtrl.deleteItem(type, parseInt(id));

            uiCtrl.deleteListItem(itemId);

            updateBudget();

            updatePercentage();
        }
    };

    var ctrlAddItem = function() {

        var input = uiCtrl.getInput()

        if(input.description !== "" ** !isNaN(input.value) && input.value > 0) {

            var newItem = budgetCtrl.newItem(input.type, input.description, input.value);
    
            uiCtrl.addListItem(newItem, input.type);
    
            uiCtrl.clearFields();

            updateBudget();

            updatePercentage();
        }

    };

    return {
        init: function() {
            console.log('Application started.');
            uiCtrl.displayDate();
            uiCtrl.displayBudget({
                budget: 0,
                totalIncome: 0,
                totalExpenses: 0,
                percentage: 0
            });

            prepareEventListeners();
        }
    }

})(budgetController, UIController);

controller.init();