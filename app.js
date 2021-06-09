var budgetController = (function() {
    var x = 26;
    var add = function(a){
        return x + a;
    }

    return {
        publicTest: function(b){
            return add(b);
        }
    }

})();

var UIController = (function() {
    // some code here
})();

var controller = (function(budgetCtrl, uiCtrl) {
    var z = budgetCtrl.publicTest(23);
    return {
        secondPublic: function(){
            console.log(z);
        }
    }
})(budgetController, UIController);