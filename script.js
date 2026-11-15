
// ========================================
// MOCHI & MAPLE - LITTLE CAFE GAME
// ========================================

// DRINK RECIPES

const recipes = [
    {
        id: "maple",
        name: "Maple Latte",
        icon: "☕",
        description: "A warm, sweet little treat.",
        ingredients: ["espresso", "milk", "maple"],
        color: "#b68b63"
    },
    {
        id: "vanilla",
        name: "Iced Vanilla Latte",
        icon: "🧋",
        description: "Cool, creamy and full of vanilla.",
        ingredients: ["espresso", "milk", "ice", "vanilla"],
        color: "#c6a47f"
    },
    {
        id: "matcha",
        name: "Matcha Cloud",
        icon: "🍵",
        description: "A dreamy green tea with cream.",
        ingredients: ["matcha", "milk", "vanilla", "cream"],
        color: "#91a77c"
    }
];

// BAKERY ITEMS

const pastries = [
    {
        id: "croissant",
        name: "Butter Croissant",
        icon: "🥐",
        description: "A crispy, buttery little treat."
    },
    {
        id: "cookie",
        name: "Chocolate Cookie",
        icon: "🍪",
        description: "A soft cookie with chocolate chips."
    },
    {
        id: "cupcake",
        name: "Strawberry Cupcake",
        icon: "🧁",
        description: "A fluffy cupcake with strawberry frosting."
    },
    {
        id: "brownie",
        name: "Chocolate Brownie",
        icon: "🍫",
        description: "A delicious chocolate treat."
    }
];
const allOrders = [...recipes, ...pastries];
let nextOrderIndex = 0;
let currentOrderType = "drink";
let selectedPastry = null;


// INGREDIENT INFORMATION

const ingredientInfo = {
    espresso: { name: "Espresso", icon: "☕" },
    matcha: { name: "Matcha", icon: "🍵" },
    milk: { name: "Milk", icon: "🥛" },
    oat: { name: "Oat Milk", icon: "🌾" },
    maple: { name: "Maple", icon: "🍁" },
    vanilla: { name: "Vanilla", icon: "🤍" },
    ice: { name: "Ice", icon: "🧊" },
    cream: { name: "Cream", icon: "🍦" }
};


// CUSTOMER INFORMATION

const customers = [
    { name: "Mia", emoji: "🌷", greeting: "Something sweet, please!" },
    { name: "Oliver", emoji: "🐻", greeting: "Surprise me with something lovely!" },
    { name: "Luna", emoji: "🌙", greeting: "I need a little coffee magic." },
    { name: "Noah", emoji: "🍂", greeting: "One delicious drink, please!" },
    { name: "Sophie", emoji: "🦋", greeting: "I'm so excited to try your café!" },
    { name: "Leo", emoji: "🌻", greeting: "Hello! What's good today?" }
];


// GAME STATE

let selectedIngredients = [];
let currentOrder = null;
let currentCustomer = null;

let coins = Number(localStorage.getItem("mochiCoins")) || 0;
let ordersServed = Number(localStorage.getItem("mochiOrders")) || 0;

let isServing = false;


// GET HTML ELEMENTS

const coinCount = document.getElementById("coinCount");
const orderCount = document.getElementById("orderCount");

const orderIcon = document.getElementById("orderIcon");
const orderDrink = document.getElementById("orderDrink");
const orderDescription = document.getElementById("orderDescription");

const customerName = document.getElementById("customerName");
const customerSpeech = document.getElementById("customerSpeech");

const selectedIngredientsBox =
    document.getElementById("selectedIngredients");

const selectedCount = document.getElementById("selectedCount");
const cupContent = document.getElementById("cupContent");

const gameMessage = document.getElementById("gameMessage");
const serveButton = document.getElementById("serveButton");
const clearButton = document.getElementById("clearButton");

const ingredientButtons =
    document.querySelectorAll(".ingredient");


// ========================================
// BAKERY CORNER
// ========================================

const bakeryArea = document.createElement("section");

bakeryArea.className = "bakery-area";

bakeryArea.innerHTML = `
    <h2>🥐 The Little Bakery</h2>
    <p>Freshly baked happiness!</p>
    <div class="pastry-grid" id="pastryGrid"></div>
    <p id="pastryMessage">Choose a pastry for your customer.</p>
`;

const gamePanel = document.querySelector(".game-panel");

if (gamePanel) {
    gamePanel.appendChild(bakeryArea);
} else {
    document.body.appendChild(bakeryArea);
}

const pastryGrid = document.getElementById("pastryGrid");
const pastryMessage = document.getElementById("pastryMessage");

// IMPORTANT: Keep bakery visible all the time.
bakeryArea.style.display = "block";


// BAKERY APPEARANCE

const bakeryStyle = document.createElement("style");

bakeryStyle.textContent = `
.bakery-area {
    background: #fff4e5;
    border: 2px solid #dfc29d;
    border-radius: 18px;
    padding: 20px;
    margin-top: 20px;
    color: #684b36;
}

.bakery-area h2 {
    font-family: 'Playfair Display', serif;
}

.pastry-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    margin-top: 15px;
}

.pastry-button {
    background: #fffdf8;
    border: 2px solid #ead8bd;
    border-radius: 14px;
    padding: 15px 8px;
    cursor: pointer;
    color: #654b38;
    transition: 0.2s;
}

.pastry-button:hover {
    transform: translateY(-3px);
    background: #f5e8d6;
}

.pastry-button.selected {
    background: #e5eddf;
    border-color: #829778;
}
`;

document.head.appendChild(bakeryStyle);


// DISPLAY PASTRIES

function renderPastries() {

    pastryGrid.innerHTML = "";

    pastries.forEach(pastry => {

        const button = document.createElement("button");

        button.className = "pastry-button";

        button.innerHTML = `
            <div style="font-size:32px">${pastry.icon}</div>
            <strong>${pastry.name}</strong>
        `;

        button.addEventListener("click", () => {

            if (isServing) return;

            if (currentOrderType !== "pastry") {
                pastryMessage.textContent =
                    "Wait for a pastry order from your customer! 🥐";
                return;
            }

            selectedPastry = pastry.id;

            document.querySelectorAll(".pastry-button")
                .forEach(btn => btn.classList.remove("selected"));

            button.classList.add("selected");

            pastryMessage.textContent =
                "Selected: " + pastry.name + " ♡";
        });

        pastryGrid.appendChild(button);
    });
}

renderPastries();


// ========================================
// UPDATE SCORE DISPLAY
// ========================================

function updateStats() {

    coinCount.textContent = coins;
    orderCount.textContent = ordersServed;

    localStorage.setItem("mochiCoins", coins);
    localStorage.setItem("mochiOrders", ordersServed);
}


function createNewOrder() {

    // Select the next item in rotation
    currentOrder = allOrders[nextOrderIndex];

    // Move to the next item
    nextOrderIndex = (nextOrderIndex + 1) % allOrders.length;

    // Identify drink or pastry
    if (pastries.some(pastry => pastry.id === currentOrder.id)) {

        currentOrderType = "pastry";

        bakeryArea.style.display = "block";

        pastryMessage.textContent =
            "Choose the customer's pastry! 🥐";

        ingredientButtons.forEach(button => {
            button.style.display = "none";
        });

    } else {

        currentOrderType = "drink";

        bakeryArea.style.display = "block";

        pastryMessage.textContent =
            "The bakery is open! Pastry orders will arrive soon. 🥐";

        ingredientButtons.forEach(button => {
            button.style.display = "";
        });
    }

    // Choose a customer
    let randomCustomer =
        customers[Math.floor(Math.random() * customers.length)];

    if (currentCustomer) {
        while (randomCustomer.name === currentCustomer.name) {
            randomCustomer =
                customers[Math.floor(Math.random() * customers.length)];
        }
    }

    currentCustomer = randomCustomer;

    // Update order display
    orderIcon.textContent = currentOrder.icon;
    orderDrink.textContent = currentOrder.name;
    orderDescription.textContent = currentOrder.description;

    customerName.textContent =
        currentCustomer.emoji + " " + currentCustomer.name;

    customerSpeech.textContent = currentCustomer.greeting;

    // Reset selections
    selectedPastry = null;

    document.querySelectorAll(".pastry-button")
        .forEach(button => button.classList.remove("selected"));

    clearIngredients();

    gameMessage.textContent =
        "A new customer has arrived. Let's make something lovely!";

    gameMessage.className = "game-message";
}

// ========================================
// SELECT AN INGREDIENT
// ========================================

ingredientButtons.forEach(button => {

    button.addEventListener("click", () => {

        if (isServing) return;

        const ingredient = button.dataset.ingredient;

        if (selectedIngredients.includes(ingredient)) {

            selectedIngredients =
                selectedIngredients.filter(item => item !== ingredient);

            button.classList.remove("selected");

        } else {

            selectedIngredients.push(ingredient);

            button.classList.add("selected");
        }

        updateDrinkDisplay();
    });

});


// ========================================
// UPDATE THE CUP AND INGREDIENT LIST
// ========================================

function updateDrinkDisplay() {

    selectedIngredientsBox.innerHTML = "";

    selectedIngredients.forEach(ingredient => {

        const info = ingredientInfo[ingredient];

        const chip = document.createElement("span");
        chip.className = "ingredient-chip";

        chip.textContent = info.icon + " " + info.name;

        selectedIngredientsBox.appendChild(chip);
    });


    if (selectedIngredients.length === 0) {

        selectedCount.textContent =
            "No ingredients selected yet";

        cupContent.style.height = "15%";
        cupContent.style.background = "#b68b63";

        return;
    }


    selectedCount.textContent =
        selectedIngredients.length + " ingredient(s) added";


    let drinkColor = "#b68b63";

    if (selectedIngredients.includes("matcha")) {
        drinkColor = "#91a77c";
    } else if (selectedIngredients.includes("espresso")) {
        drinkColor = "#a87950";
    }

    if (selectedIngredients.includes("cream")) {
        drinkColor = "#d4bd9c";
    }

    cupContent.style.height =
        Math.min(30 + selectedIngredients.length * 14, 90) + "%";

    cupContent.style.background = drinkColor;
}


// ========================================
// CLEAR THE CUP
// ========================================

function clearIngredients() {

    selectedIngredients = [];

    ingredientButtons.forEach(button => {
        button.classList.remove("selected");
    });

    updateDrinkDisplay();
}


// CLEAR BUTTON

clearButton.addEventListener("click", () => {

    if (isServing) return;

    clearIngredients();

    gameMessage.textContent =
        "Your cup is ready for a fresh start!";

    gameMessage.className = "game-message";
});


// ========================================
// CHECK THE RECIPE OR PASTRY
// ========================================

function checkRecipe() {

    // CHECK PASTRY

    if (currentOrderType === "pastry") {
        return selectedPastry === currentOrder.id;
    }

    // CHECK DRINK

    const correctIngredients =
        [...currentOrder.ingredients].sort();

    const chosenIngredients =
        [...selectedIngredients].sort();

    if (correctIngredients.length !== chosenIngredients.length) {
        return false;
    }

    return correctIngredients.every(
        (ingredient, index) =>
            ingredient === chosenIngredients[index]
    );
}


// ========================================
// SERVE THE CUSTOMER
// ========================================

serveButton.addEventListener("click", () => {

    if (isServing) return;


    // Only require ingredients for drink orders.
    if (
        currentOrderType === "drink" &&
        selectedIngredients.length === 0
    ) {

        showMessage(
            "Choose some ingredients before serving! 🌷",
            "error"
        );

        return;
    }


    // CHECK ORDER

    if (checkRecipe()) {

        isServing = true;

        // REWARD PLAYER

        coins += 15;
        ordersServed++;

        updateStats();


        // CUSTOMER REACTION

        customerSpeech.textContent =
            "Mmm! This is absolutely delicious! ♡";


        showMessage(
            currentOrderType === "pastry"
                ? "Delicious pastry served! You earned 15 coins! 🪙"
                : "Perfect drink served! You earned 15 coins! 🪙",
            "success"
        );

        serveButton.textContent = "Order Completed ✓";


        // NEXT CUSTOMER

        setTimeout(() => {

            isServing = false;

            serveButton.innerHTML =
                'Serve Order <span>♡</span>';

            createNewOrder();

        }, 1800);

    }

    // WRONG ORDER

    else {

        showMessage(
            "Oops! That's not quite the order. Try again! 🍂",
            "error"
        );

        customerSpeech.textContent =
            "Hmm... I think my order needs something different!";
    }

});


// ========================================
// SHOW GAME MESSAGES
// ========================================

function showMessage(message, type) {

    gameMessage.textContent = message;
    gameMessage.className = "game-message " + type;
}


// ========================================
// RECIPE BOOK
// ========================================

const cafeRecipes = [

    {
        name: "Maple Latte",
        icon: "🍁",
        description: "A warm and comforting latte with a sweet maple flavour.",

        ingredients: [
            "☕ Espresso",
            "🥛 Milk",
            "🍁 Maple Syrup"
        ],

        steps: [
            "Prepare your espresso.",
            "Add milk to the espresso.",
            "Mix in maple syrup.",
            "Serve with a little love!"
        ]
    },

    {
        name: "Iced Vanilla Latte",
        icon: "🧊",
        description: "A refreshing iced coffee with a smooth vanilla taste.",

        ingredients: [
            "☕ Espresso",
            "🥛 Milk",
            "🧊 Ice",
            "🤍 Vanilla"
        ],

        steps: [
            "Prepare your espresso.",
            "Fill a glass with ice.",
            "Pour in the milk.",
            "Add espresso and vanilla.",
            "Stir and serve chilled!"
        ]
    },

    {
        name: "Matcha Cloud",
        icon: "🍵",
        description: "A dreamy matcha drink topped with a soft creamy cloud.",

        ingredients: [
            "🍵 Matcha",
            "🥛 Milk",
            "🤍 Vanilla",
            "🍦 Cream"
        ],

        steps: [
            "Prepare your matcha.",
            "Add milk and vanilla.",
            "Mix everything together.",
            "Add cream on top.",
            "Serve your beautiful Matcha Cloud!"
        ]
    }
];


// GET RECIPE BOOK ELEMENTS

const recipeBookButton =
    document.getElementById("recipeBookButton");

const recipeBook =
    document.getElementById("recipeBook");

const closeBook =
    document.getElementById("closeBook");

const recipePages =
    document.getElementById("recipePages");


// DISPLAY RECIPES

recipePages.innerHTML = cafeRecipes.map(recipe => `

    <div class="recipe-card">

        <span class="recipe-tag">Mochi & Maple Special</span>

        <h3>${recipe.icon} ${recipe.name}</h3>

        <p>${recipe.description}</p>

        <h4>Ingredients</h4>

        <ul>
            ${recipe.ingredients.map(item =>
                `<li>${item}</li>`
            ).join("")}
        </ul>

        <h4>How to Make</h4>

        <ol>
            ${recipe.steps.map(step =>
                `<li>${step}</li>`
            ).join("")}
        </ol>

    </div>

`).join("");


// OPEN THE BOOK

recipeBookButton.addEventListener("click", () => {
    recipeBook.classList.add("show");
});


// CLOSE THE BOOK

closeBook.addEventListener("click", () => {
    recipeBook.classList.remove("show");
});


// CLOSE WHEN CLICKING OUTSIDE THE BOOK

recipeBook.addEventListener("click", (event) => {

    if (event.target === recipeBook) {
        recipeBook.classList.remove("show");
    }

});


// ========================================
// START THE CAFÉ
// ========================================

function startCafe() {

    updateStats();

    createNewOrder();
}

startCafe();
