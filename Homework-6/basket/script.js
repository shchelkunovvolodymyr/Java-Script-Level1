let listProducts = [
    {title: 'Product-1', size: '24"', price: 124},
    {title: 'Product-2', size: '42"', price: 54},
    {title: 'Product-3', size: '24"', price: 8},
    {title: 'Product-4', size: '86"', price: 42}
];

let basket = {
    userBasket: [],

    putToBasket(id) {
        let prod = this.findProductByClass(id);
        this.userBasket.push(prod);
    },

    removeFromBasket(id) {
        let prod = this.findProductByClass(id);
        //indexOf возвращает индекс первого найденного эл-та, или -1, если индекс не был найден
        let prodIndex = this.userBasket.indexOf(prod);
        //если эл-т был найден в корзине, то удаляем его оттуда
        if (prodIndex !== -1) {
            this.userBasket.splice(prodIndex, 1);
        }
    },

    //ищем эл-т title которого совпадает с классом карточки, на которой была нажата кнопка
    findProductByClass(cls) {
        for (let i = 0; i < listProducts.length; i++) {
            if (listProducts[i].title === cls) {
                return listProducts[i];
            }
        }
    },

    countTotalNumber() {
        let totalAmount = 0;
        for (let i = 0; i < this.userBasket.length; i++) {
            totalAmount++;
        }
        return totalAmount;
    },

    countTotalPrice() {
        let sum = 0;
        for (let i = 0; i < this.userBasket.length; i++) {
            sum += this.userBasket[i].price;
        }
        return sum;
    }
};

let shopCreator = {
    lastChangedProduct: "basketProductList",
    userProducts: [],
    createShop() {
        this.createProductCards();
        this.createBasket();
    },

    createProductCards() {
        //находим div products, а в нем создаем в нем карточки товаров
        let products = document.createElement("div");
        products.setAttribute("class", "products");
        document.body.insertBefore(products, userShopBasket);
        listProducts.forEach((product) => {
            this.addNewCard(product, products);
        });
    },

    addNewCard(prod, parent) {
        let card = document.createElement("div");
        parent.appendChild(card);
        card.setAttribute("class", "productCard " + prod.title);
        card.insertAdjacentHTML("afterbegin", prod.title + "<br>" + prod.size + "<br>" + prod.price + "<br>");

        this.addButton("add", card);
        this.addButton("remove", card);
    },

    addButton(type, card) {
        let button = document.createElement("button");
        let buttonText = type === "add" ? "+" : "-";
        let action = type === "add" ? (id) => basket.putToBasket(id) : (id) => basket.removeFromBasket(id);
        button.innerText = buttonText;
        button.addEventListener("click", event => {
            let prodId = this.getProdTitle(event.target.parentElement.classList);
            action(prodId);
            this.createBasket();
        });
        card.appendChild(button);
    },

    getProdTitle(classList) {
        for (let i = 0; i < classList.length; i++) {
            let cls = classList[i];
            if (basket.findProductByClass(cls)) {
                this.lastChangedProduct = cls;
                return cls;
            }
        }
    },

    createBasket() {
        this.createUserProductsList();
        this.clearBasket();
        this.renderUserProducts();
        this.createMessage();
        this.scrollToLastChanged();
    },

    scrollToLastChanged() {
        let cls = this.lastChangedProduct;
        let elem = document.querySelector(".basketProductList ." + cls);
        if (elem) {
            //скролим на каждую карточку, добавляемую в корзину
            elem.scrollIntoView({behavior: "smooth"}); // скролить плавно
        }
    },

    clearBasket() {
        document.getElementById("userShopBasket").innerHTML = "";
    },

    createUserProductsList() {
        this.userProducts = [];
        for (let i = 0; i < basket.userBasket.length; i++) {
            let currentProduct = basket.userBasket[i];
            let userProductIndex = this.inUserProducts(currentProduct);
            if (userProductIndex >= 0) {
                this.userProducts[userProductIndex].count++;
            } else {
                this.userProducts.push(currentProduct);
                this.userProducts[this.userProducts.length - 1].count = 1;
            }
        }
    },
    //ф-ция проверяет есть ли элемент в корзине
    inUserProducts(prod) {
        for (let i = 0; i < this.userProducts.length; i++) {
            if (prod.title === this.userProducts[i].title) {
                return i;
            }
        }
        return -1;
    },

    addProductCount(prod, parent) {
        let countDiv = document.createElement("div");
        countDiv.setAttribute("class", "productCount");
        countDiv.innerText = "x " + prod.count;
        parent.appendChild(countDiv);
    },

    renderUserProducts() {
        let basket = document.getElementById("userShopBasket");
        let div = document.createElement("div");
        div.setAttribute("class", "basketProductList");
        basket.appendChild(div);
        this.userProducts.forEach((product) => {
            this.addNewCard(product, div);
            this.addProductCount(product, div)
        });
    },

    createMessage() {
        let userShopBasket = document.getElementById("userShopBasket");
        let p = document.createElement("p");
        let message = "";
        if (basket.userBasket.length === 0) {
            message = "Корзина пуста";
        } else {
            let amount = basket.countTotalNumber();
            let totalPrice = basket.countTotalPrice();
            message = "В корзине " + amount + " товаров на сумму: " + totalPrice + " рублей"
        }
        p.innerText = message;
        userShopBasket.appendChild(p);
        p.scrollIntoView({behavior: 'smooth'});
    }
};

shopCreator.createShop();
