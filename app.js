let budgetController = (function () {

    let Expense = function (id, description, payment, value) {
        this.id = id;
        this.description = description;
        this.payment = payment;
        this.value = value;
        this.percentage = -1;
    };

    Expense.prototype.calcPercentage = function (totalInc) {

        if (totalInc > 0) {
            this.percentage = Math.round((this.value / totalInc) * 100);
        } else {
            this.percentage = -1;
        }
    };

    Expense.prototype.getPercentage = function () {
        return this.percentage;
    };

    let Income = function (id, description, payment, value) {
        this.id = id;
        this.description = description;
        this.payment = payment;
        this.value = value;
    };



    let calculateTotal = function (type) {
        let sum = 0;
        data.allItems[type].forEach(function (current) {
            sum += current.value
        });
        data.total[type] = sum;
    };

    let data = {
        allItems: {
            exp: [],
            inc: [],
        },
        total: {
            exp: 0,
            inc: 0,
        },
        budget: 0,
        percentage: -1
    };

    return {

        addItems: function (type, des, payment, val) {
            let newItem, ID;

            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }


            if (type === 'exp') {
                newItem = new Expense(ID, des, payment, val);
            }
            if (type === 'inc') {
                newItem = new Income(ID, des, payment, val);
            }

            data.allItems[type].push(newItem);

            return newItem;
        },

        deleteItems: function (type, id) {

            let ids = data.allItems[type].map(function (cur) {
                return cur.id
            });

            let index = ids.indexOf(id);

            if (index !== -1) {
                data.allItems[type].splice(index, 1);
            }
        },

        calculateBudget: function () {

            calculateTotal('exp');
            calculateTotal('inc');

            data.budget = data.total.inc - data.total.exp;

            if (data.total.inc > 0) {
                data.percentage = Math.round((data.total.exp / data.total.inc) * 100);
            } else {
                data.percentage = -1;
            }

        },

        calculatePercentage: function () {

            data.allItems.exp.forEach(curEl => {
                curEl.calcPercentage(data.total.inc);
            });

        },

        getPercentages: function () {

            let allPerc = data.allItems.exp.map((cur) => {
                return cur.getPercentage();
            });
            return allPerc;
        },

        getBudget: function () {
            return {
                budget: data.budget,
                totalInc: data.total.inc,
                totalExp: data.total.exp,
                percentage: data.percentage,
            }
        },

    };



})();



let userInterface = (function () {

    let DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetValue: '.budget__value',
        budgetIncomeValue: '.budget__income--value',
        budgetExpensesValue: '.budget__expenses--value',
        budgetExpensesPercentage: '.budget__expenses--percentage',
        container: '.container',
        expPercentage: '.item__percentage',
        dateLabel: '.budget__title--month',
        paymentMethod: '.payment__method',
    };

    let nodeList = function (list, callback) {

        for (let i = 0; i < list.length; i++) {
            callback(list[i], i);

        }
    };

    return {

        getInput: function () {


            return {
                type: document.querySelector(DOMstrings.inputType).value,
                description: document.querySelector(DOMstrings.inputDescription).value,
                paymentMethod: document.querySelector(DOMstrings.paymentMethod).value,
                value: document.querySelector(DOMstrings.inputValue).value,
                
            }
            
        },

        addListItem: function (obj, type) {
            let html, newHtml, element;

            if (type === 'inc') {

                element = DOMstrings.incomeContainer;

                html = `
                <div class="item clearfix" id="inc-%id%">
                    <div class="item__description">%description%</div>
                    <div class="payment_type">%payment%</div>
                        <div class="right clearfix">
                            <div class="item__value">%value%</div>
                    <div class="item__delete">
                         <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                     </div>
                     </div>
                </div>`
            }
            if (type === 'exp') {

                element = DOMstrings.expensesContainer;

                html = `<div class="item clearfix" id="exp-%id%">
                <div class="item__description">%description%</div>
                <div class="payment_type">%payment%</div>
                     <div class="right clearfix">
                        <div class="item__value">%value%</div>
                            <div class="item__percentage">%percentage%</div>
                                 <div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                          </div>
                        </div>
                    </div>`
            }

            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);
            newHtml = newHtml.replace('%payment%', obj.payment)

            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml)

        },

        clearFields: function () {
            let fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue)

            let fieldsArr = Array.prototype.slice.call(fields);


            fieldsArr.forEach((current, index, arr) => {
                current.value = '';
            });

            fieldsArr[0].focus();
        },

        displayBudget: function (obj) {

            document.querySelector(DOMstrings.budgetValue).textContent = obj.budget;
            document.querySelector(DOMstrings.budgetIncomeValue).textContent = obj.totalInc;
            document.querySelector(DOMstrings.budgetExpensesValue).textContent = obj.totalExp;


            if (obj.percentage > 0) {
                document.querySelector(DOMstrings.budgetExpensesPercentage).textContent = obj.percentage + '%';
            } else {
                document.querySelector(DOMstrings.budgetExpensesPercentage).textContent = '--';
            }
        },

        displayDate: function () {

            let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

            let timeNow = new Date();

            let year = timeNow.getFullYear();
            let month = timeNow.getMonth();

            document.querySelector(DOMstrings.dateLabel).textContent = months[month] + ' ' + year;
        },

        changeType: function () {

            let field = document.querySelectorAll(DOMstrings.inputType + ',' + DOMstrings.inputDescription + ',' + DOMstrings.inputValue);

            nodeList(field, function (cur) {
                cur.classList.toggle('red-focus');
            });

            document.querySelector(DOMstrings.inputBtn).classList.toggle('red');
        },

        deleteListItem: function (selectId) {

            let el = document.getElementById(selectId);
            el.parentNode.removeChild(el);
        },

        displayPercentage: function (percentage) {

            let rows = document.querySelectorAll(DOMstrings.expPercentage);



            nodeList(rows, function (cur, index) {


                if (percentage[index] > 0) {
                    cur.textContent = percentage[index] + '%';
                } else {
                    cur.textContent = '--';
                }
            });

        },

        getDOMstrings: function () {
            return DOMstrings;
        }
    };

})();




let appController = (function (budCtrl, UIcntr) {

    let eventListeners = function () {

        let DOM = UIcntr.getDOMstrings();

        document.querySelector(DOM.inputBtn).addEventListener('click', itemCtrl);

        document.addEventListener('keypress', (e) => {

            if (e.key === "Enter" || e.code === 13) {
                itemCtrl();
            }

        });

        document.querySelector(DOM.container).addEventListener('click', cntrlDeleteItem)

        document.querySelector(DOM.inputType).addEventListener('change', UIcntr.changeType)
    };

    let updateBudget = function () {

        budCtrl.calculateBudget();

        let budget = budCtrl.getBudget();

        UIcntr.displayBudget(budget);

    };

    let updatePerncetage = function () {

        budCtrl.calculatePercentage();

        let perc = budCtrl.getPercentages();


        UIcntr.displayPercentage(perc);

    };


    let itemCtrl = function () {

        let input = UIcntr.getInput();

        if (input.description !== '' && input.value !== NaN && input.value > 0) {

            let newItems = budCtrl.addItems(input.type, input.description, input.paymentMethod, Number(input.value));
           
            UIcntr.addListItem(newItems, input.type)

            UIcntr.clearFields();

            updateBudget();

            updatePerncetage();

        }


    };

    let cntrlDeleteItem = function (event) {

        let splitId, type, id;
        let idItem = event.target.parentNode.parentNode.parentNode.parentNode.id;

        if (idItem) {

            splitId = idItem.split('-');
            type = splitId[0];
            id = Number(splitId[1]);

            budCtrl.deleteItems(type, id);

            UIcntr.deleteListItem(idItem);

            updateBudget();

            updatePerncetage();

        }


    };

    return {

        initialization: function () {
            UIcntr.displayDate();
            UIcntr.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1,
            });


            eventListeners();

        }

    };




})(budgetController, userInterface);

appController.initialization();