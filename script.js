/* =========================================================
   QH GAMING STORE
   MAIN JAVASCRIPT
   ========================================================= */


/* =========================================================
   DOM
   ========================================================= */

const body = document.body;

const header = document.getElementById("header");

const mobileMenuButton =
    document.getElementById("mobileMenuButton");

const mobileNav =
    document.getElementById("mobileNav");

const searchToggle =
    document.querySelector(".search-toggle");

const searchOverlay =
    document.getElementById("searchOverlay");

const searchClose =
    document.getElementById("searchClose");

const searchInput =
    document.getElementById("searchInput");

const productsGrid =
    document.getElementById("productsGrid");

const productCards =
    [...document.querySelectorAll(".product-card")];

const filterButtons =
    [...document.querySelectorAll(".filter-button")];

const categoryCards =
    [...document.querySelectorAll(".category-card")];

const noResults =
    document.getElementById("noResults");

const cartButton =
    document.getElementById("cartButton");

const cartCount =
    document.getElementById("cartCount");

const cartDrawer =
    document.getElementById("cartDrawer");

const cartOverlay =
    document.getElementById("cartOverlay");

const cartClose =
    document.getElementById("cartClose");

const cartItems =
    document.getElementById("cartItems");

const cartTotal =
    document.getElementById("cartTotal");

const startShopping =
    document.getElementById("startShopping");

const checkoutButton =
    document.getElementById("checkoutButton");

const productModal =
    document.getElementById("productModal");

const modalClose =
    document.getElementById("modalClose");

const modalImage =
    document.getElementById("modalImage");

const modalCategory =
    document.getElementById("modalCategory");

const modalTitle =
    document.getElementById("modalTitle");

const modalDescription =
    document.getElementById("modalDescription");

const modalPrice =
    document.getElementById("modalPrice");

const modalAdd =
    document.getElementById("modalAdd");

const toast =
    document.getElementById("toast");

const toastTitle =
    document.getElementById("toastTitle");

const toastText =
    document.getElementById("toastText");

const currentYear =
    document.getElementById("currentYear");


/* =========================================================
   PRODUCT DATA
   ========================================================= */

const products = {

    ps5: {
        id: "ps5",
        name: "PlayStation 5 Console",
        category: "Consoles",
        price: 499,
        icon: "🎮",
        description:
            "Experience next-generation gaming with the PlayStation 5. Built for fast loading, immersive gameplay and incredible visuals."
    },

    dualsense: {
        id: "dualsense",
        name: "DualSense Wireless Controller",
        category: "Controllers",
        price: 69,
        icon: "🕹️",
        description:
            "A precision wireless controller designed to make every movement, impact and interaction feel more immersive."
    },

    headset: {
        id: "headset",
        name: "Gaming Headset Pro",
        category: "Headsets",
        price: 45,
        icon: "🎧",
        description:
            "Immerse yourself in your games with a comfortable gaming headset designed for clear sound and communication."
    },

    keyboard: {
        id: "keyboard",
        name: "RGB Gaming Keyboard",
        category: "Accessories",
        price: 39,
        icon: "⌨️",
        description:
            "Upgrade your desk with a responsive gaming keyboard and RGB-inspired setup aesthetic."
    }

};


/* =========================================================
   CART STATE
   ========================================================= */

let cart = [];

try {
    const savedCart =
        localStorage.getItem("qhGamingCart");

    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
} catch (error) {
    cart = [];
}


/* =========================================================
   UTILITIES
   ========================================================= */

function saveCart() {

    try {
        localStorage.setItem(
            "qhGamingCart",
            JSON.stringify(cart)
        );
    } catch (error) {
        console.warn("Cart could not be saved.");
    }
}


function formatPrice(price) {
    return `${price.toLocaleString()} JOD`;
}


function lockBody() {
    body.classList.add("no-scroll");
}


function unlockBody() {

    if (
        !cartDrawer.classList.contains("active") &&
        !productModal.classList.contains("active") &&
        !searchOverlay.classList.contains("active") &&
        !mobileNav.classList.contains("active")
    ) {
        body.classList.remove("no-scroll");
    }
}


/* =========================================================
   HEADER
   ========================================================= */

function handleHeader() {

    if (window.scrollY > 30) {
        header.classList.add("scrolled");
    } else {
        header.classList.remove("scrolled");
    }

}

window.addEventListener(
    "scroll",
    handleHeader,
    { passive: true }
);

handleHeader();


/* =========================================================
   MOBILE MENU
   ========================================================= */

function openMobileMenu() {

    mobileNav.classList.add("active");

    mobileMenuButton.setAttribute(
        "aria-expanded",
        "true"
    );

    lockBody();
}


function closeMobileMenu() {

    mobileNav.classList.remove("active");

    mobileMenuButton.setAttribute(
        "aria-expanded",
        "false"
    );

    unlockBody();
}


mobileMenuButton.addEventListener(
    "click",
    () => {

        if (mobileNav.classList.contains("active")) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }

    }
);


document
    .querySelectorAll(".mobile-nav a")
    .forEach(link => {

        link.addEventListener(
            "click",
            closeMobileMenu
        );

    });


/* =========================================================
   SEARCH
   ========================================================= */

function openSearch() {

    searchOverlay.classList.add("active");

    lockBody();

    setTimeout(() => {
        searchInput.focus();
    }, 250);
}


function closeSearch() {

    searchOverlay.classList.remove("active");

    searchInput.value = "";

    filterProducts(
        "All",
        false
    );

    unlockBody();
}


if (searchToggle) {
    searchToggle.addEventListener(
        "click",
        openSearch
    );
}

searchClose.addEventListener(
    "click",
    closeSearch
);


searchOverlay.addEventListener(
    "click",
    event => {

        if (event.target === searchOverlay) {
            closeSearch();
        }

    }
);


searchInput.addEventListener(
    "input",
    () => {

        const query =
            searchInput.value
                .trim()
                .toLowerCase();

        let visible = 0;

        productCards.forEach(card => {

            const name =
                card.dataset.name.toLowerCase();

            const category =
                card.dataset.category.toLowerCase();

            const match =
                name.includes(query) ||
                category.includes(query);

            card.style.display =
                match ? "" : "none";

            if (match) {
                visible++;
            }

        });

        noResults.style.display =
            visible === 0 ? "block" : "none";

    }
);


/* =========================================================
   PRODUCT FILTERING
   ========================================================= */

function setActiveFilter(category) {

    filterButtons.forEach(button => {

        button.classList.toggle(
            "active",
            button.dataset.filter === category
        );

    });

}


function filterProducts(
    category = "All",
    updateButtons = true
) {

    let visible = 0;

    productCards.forEach(card => {

        const cardCategory =
            card.dataset.category;

        const show =
            category === "All" ||
            cardCategory === category;

        card.style.display =
            show ? "" : "none";

        if (show) {
            visible++;
        }

    });

    noResults.style.display =
        visible === 0 ? "block" : "none";

    if (updateButtons) {
        setActiveFilter(category);
    }

}


filterButtons.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            filterProducts(
                button.dataset.filter
            );

            document
                .getElementById("products")
                .scrollIntoView({
                    behavior: "smooth"
                });

        }
    );

});


categoryCards.forEach(card => {

    card.addEventListener(
        "click",
        () => {

            const category =
                card.dataset.category;

            filterProducts(category);

            document
                .getElementById("products")
                .scrollIntoView({
                    behavior: "smooth"
                });

        }
    );

});


/* =========================================================
   FOOTER FILTER LINKS
   ========================================================= */

document
    .querySelectorAll("[data-footer-filter]")
    .forEach(link => {

        link.addEventListener(
            "click",
            () => {

                filterProducts(
                    link.dataset.footerFilter
                );

            }
        );

    });


/* =========================================================
   VIEW ALL
   ========================================================= */

const viewAllButton =
    document.getElementById("viewAllButton");

viewAllButton.addEventListener(
    "click",
    () => {

        filterProducts("All");

        viewAllButton.textContent =
            "All Products Visible ✓";

        setTimeout(() => {

            viewAllButton.innerHTML =
                `View All Products <span>→</span>`;

        }, 1800);

    }
);


/* =========================================================
   CART
   ========================================================= */

function addToCart(productId) {

    const product =
        products[productId];

    if (!product) {
        return;
    }

    const existing =
        cart.find(
            item => item.id === productId
        );

    if (existing) {
        existing.quantity += 1;
    } else {

        cart.push({
            id: product.id,
            quantity: 1
        });

    }

    saveCart();

    updateCart();

    showToast(
        "Added to cart",
        product.name
    );

}


function removeFromCart(productId) {

    cart =
        cart.filter(
            item => item.id !== productId
        );

    saveCart();

    updateCart();

}


function changeQuantity(
    productId,
    change
) {

    const item =
        cart.find(
            cartItem =>
                cartItem.id === productId
        );

    if (!item) {
        return;
    }

    item.quantity += change;

    if (item.quantity <= 0) {
        removeFromCart(productId);
        return;
    }

    saveCart();

    updateCart();

}


function getCartQuantity() {

    return cart.reduce(
        (total, item) =>
            total + item.quantity,
        0
    );

}


function getCartTotal() {

    return cart.reduce(
        (total, item) => {

            const product =
                products[item.id];

            if (!product) {
                return total;
            }

            return total +
                product.price *
                item.quantity;

        },
        0
    );

}


function updateCart() {

    const quantity =
        getCartQuantity();

    const total =
        getCartTotal();

    cartCount.textContent =
        quantity;

    cartTotal.textContent =
        formatPrice(total);

    renderCartItems();

}


function renderCartItems() {

    if (cart.length === 0) {

        cartItems.innerHTML = `
            <div class="empty-cart">

                <div class="empty-cart-icon">🛒</div>

                <h3>Your cart is empty</h3>

                <p>
                    Add some gaming gear and it'll show up here.
                </p>

                <button
                    class="button button-secondary"
                    id="startShopping"
                    type="button"
                >
                    Start Shopping
                </button>

            </div>
        `;

        const newStartShopping =
            document.getElementById(
                "startShopping"
            );

        newStartShopping.addEventListener(
            "click",
            () => {

                closeCart();

                document
                    .getElementById("products")
                    .scrollIntoView({
                        behavior: "smooth"
                    });

            }
        );

        return;
    }


    cartItems.innerHTML =
        cart.map(item => {

            const product =
                products[item.id];

            if (!product) {
                return "";
            }

            return `
                <div class="cart-item">

                    <div class="cart-item-image">
                        ${product.icon}
                    </div>

                    <div class="cart-item-info">

                        <h4>${product.name}</h4>

                        <p>
                            ${formatPrice(product.price)}
                        </p>

                        <div class="quantity-controls">

                            <button
                                type="button"
                                data-action="decrease"
                                data-id="${product.id}"
                            >
                                −
                            </button>

                            <span>
                                ${item.quantity}
                            </span>

                            <button
                                type="button"
                                data-action="increase"
                                data-id="${product.id}"
                            >
                                +
                            </button>

                        </div>

                    </div>

                    <button
                        class="remove-item"
                        type="button"
                        aria-label="Remove ${product.name}"
                        data-action="remove"
                        data-id="${product.id}"
                    >
                        ×
                    </button>

                </div>
            `;

        }).join("");


    cartItems
        .querySelectorAll("[data-action]")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const action =
                        button.dataset.action;

                    const id =
                        button.dataset.id;

                    if (action === "increase") {
                        changeQuantity(id, 1);
                    }

                    if (action === "decrease") {
                        changeQuantity(id, -1);
                    }

                    if (action === "remove") {
                        removeFromCart(id);
                    }

                }
            );

        });

}


/* =========================================================
   CART DRAWER
   ========================================================= */

function openCart() {

    cartDrawer.classList.add("active");
    cartOverlay.classList.add("active");

    lockBody();

}


function closeCart() {

    cartDrawer.classList.remove("active");
    cartOverlay.classList.remove("active");

    unlockBody();

}


cartButton.addEventListener(
    "click",
    openCart
);

cartClose.addEventListener(
    "click",
    closeCart
);

cartOverlay.addEventListener(
    "click",
    closeCart
);


/* =========================================================
   ADD TO CART BUTTONS
   ========================================================= */

document
    .querySelectorAll(".add-cart")
    .forEach(button => {

        button.addEventListener(
            "click",
            event => {

                event.stopPropagation();

                addToCart(
                    button.dataset.id
                );

            }
        );

    });


/* =========================================================
   PRODUCT MODAL
   ========================================================= */

let currentModalProduct = null;


function openProductModal(productId) {

    const product =
        products[productId];

    if (!product) {
        return;
    }

    currentModalProduct =
        productId;

    modalCategory.textContent =
        product.category.toUpperCase();

    modalTitle.textContent =
        product.name;

    modalDescription.textContent =
        product.description;

    modalPrice.textContent =
        formatPrice(product.price);

    modalImage.innerHTML = `
        <div style="
            font-size:100px;
            filter:drop-shadow(0 25px 35px rgba(0,0,0,.45));
        ">
            ${product.icon}
        </div>
    `;

    productModal.classList.add("active");

    lockBody();

}


function closeProductModal() {

    productModal.classList.remove("active");

    currentModalProduct = null;

    unlockBody();

}


document
    .querySelectorAll(".quick-view")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const product =
                    Object.values(products)
                        .find(
                            item =>
                                item.name ===
                                button.dataset.product
                        );

                if (product) {
                    openProductModal(product.id);
                }

            }
        );

    });


modalClose.addEventListener(
    "click",
    closeProductModal
);


productModal.addEventListener(
    "click",
    event => {

        if (event.target === productModal) {
            closeProductModal();
        }

    }
);


modalAdd.addEventListener(
    "click",
    () => {

        if (!currentModalProduct) {
            return;
        }

        addToCart(
            currentModalProduct
        );

        closeProductModal();

        setTimeout(
            openCart,
            200
        );

    }
);


/* =========================================================
   CHECKOUT
   ========================================================= */

checkoutButton.addEventListener(
    "click",
    () => {

        if (cart.length === 0) {

            showToast(
                "Your cart is empty",
                "Add a product before checking out."
            );

            return;
        }

        /*
         * FUTURE:
         * Connect this button to the store's
         * real checkout/order system.
         */

        showToast(
            "Checkout coming next",
            "The cart is working. Payment/order processing can now be connected."
        );

    }
);


/* =========================================================
   TOAST
   ========================================================= */

let toastTimer;


function showToast(
    title,
    text
) {

    toastTitle.textContent =
        title;

    toastText.textContent =
        text;

    toast.classList.add("active");

    clearTimeout(toastTimer);

    toastTimer =
        setTimeout(
            () => {
                toast.classList.remove("active");
            },
            2800
        );

}


/* =========================================================
   SCROLL REVEAL
   ========================================================= */

const revealElements =
    document.querySelectorAll(".reveal");


const revealObserver =
    new IntersectionObserver(
        entries => {

            entries.forEach(
                entry => {

                    if (
                        entry.isIntersecting
                    ) {

                        entry.target.classList.add(
                            "visible"
                        );

                        revealObserver.unobserve(
                            entry.target
                        );

                    }

                }
            );

        },
        {
            threshold: 0.12
        }
    );


revealElements.forEach(
    element =>
        revealObserver.observe(element)
);


/* =========================================================
   CLOSE EVERYTHING WITH ESCAPE
   ========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (event.key !== "Escape") {
            return;
        }

        closeSearch();
        closeCart();
        closeProductModal();
        closeMobileMenu();

    }
);


/* =========================================================
   YEAR
   ========================================================= */

currentYear.textContent =
    new Date().getFullYear();


/* =========================================================
   INITIALIZE
   ========================================================= */

updateCart();


/* =========================================================
   SMALL INTERACTION:
   HERO CARD PARALLAX
   ========================================================= */

const heroVisual =
    document.querySelector(".hero-visual");

if (
    heroVisual &&
    window.matchMedia("(pointer:fine)").matches
) {

    heroVisual.addEventListener(
        "mousemove",
        event => {

            const rect =
                heroVisual.getBoundingClientRect();

            const x =
                (event.clientX - rect.left) /
                rect.width -
                0.5;

            const y =
                (event.clientY - rect.top) /
                rect.height -
                0.5;

            const card =
                heroVisual.querySelector(
                    ".hero-card"
                );

            if (!card) {
                return;
            }

            card.style.transform =
                `
                rotateX(${y * -5}deg)
                rotateY(${x * 7}deg)
                rotateZ(2deg)
                translateY(-3px)
                `;

        }
    );


    heroVisual.addEventListener(
        "mouseleave",
        () => {

            const card =
                heroVisual.querySelector(
                    ".hero-card"
                );

            if (!card) {
                return;
            }

            card.style.transform =
                "rotate(2deg)";

        }
    );

}
