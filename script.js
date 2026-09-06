/* =========================================================
   QH GAMING STORE
   NEON CYBER EDITION
   JAVASCRIPT
   ========================================================= */


/* =========================================================
   DOM
   ========================================================= */

const body =
    document.body;

const header =
    document.getElementById("siteHeader");

const mobileToggle =
    document.getElementById("mobileToggle");

const mobileNav =
    document.getElementById("mobileNav");

const searchButton =
    document.getElementById("searchButton");

const searchLayer =
    document.getElementById("searchLayer");

const searchClose =
    document.getElementById("searchClose");

const searchInput =
    document.getElementById("searchInput");

const productCards =
    [...document.querySelectorAll(".product-card")];

const productsGrid =
    document.getElementById("productsGrid");

const filters =
    [...document.querySelectorAll(".filter")];

const categoryCards =
    [...document.querySelectorAll(".category-card")];

const noResults =
    document.getElementById("noResults");

const viewAllButton =
    document.getElementById("viewAllButton");

const cartButton =
    document.getElementById("cartButton");

const cartCount =
    document.getElementById("cartCount");

const cartOverlay =
    document.getElementById("cartOverlay");

const cartDrawer =
    document.getElementById("cartDrawer");

const cartClose =
    document.getElementById("cartClose");

const cartItems =
    document.getElementById("cartItems");

const cartTotal =
    document.getElementById("cartTotal");

const checkoutButton =
    document.getElementById("checkoutButton");

const startShopping =
    document.getElementById("startShopping");

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
   PRODUCT DATABASE
   ========================================================= */

const products = {

    ps5: {
        id: "ps5",
        name: "PlayStation 5 Console",
        category: "Consoles",
        price: 499,
        icon: "🎮",
        description:
            "Experience next-generation gaming with the PlayStation 5, designed for fast loading, immersive gameplay and incredible visuals."
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
            "Upgrade your battlestation with a responsive gaming keyboard designed to complete your setup."
    }

};


/* =========================================================
   CART STATE
   ========================================================= */

let cart = [];

try {

    const saved =
        localStorage.getItem(
            "qhGamingCart"
        );

    if (saved) {
        cart = JSON.parse(saved);
    }

} catch (error) {

    cart = [];

}


/* =========================================================
   HELPERS
   ========================================================= */

function saveCart() {

    try {

        localStorage.setItem(
            "qhGamingCart",
            JSON.stringify(cart)
        );

    } catch (error) {

        console.warn(
            "Unable to save QH cart."
        );

    }

}


function formatPrice(value) {

    return `${value.toLocaleString()} JOD`;

}


function lockBody() {

    body.classList.add(
        "locked"
    );

}


function unlockBody() {

    const somethingOpen =
        mobileNav.classList.contains("active") ||
        searchLayer.classList.contains("active") ||
        cartDrawer.classList.contains("active") ||
        productModal.classList.contains("active");

    if (!somethingOpen) {

        body.classList.remove(
            "locked"
        );

    }

}


/* =========================================================
   HEADER SCROLL
   ========================================================= */

function updateHeader() {

    if (window.scrollY > 30) {

        header.classList.add(
            "scrolled"
        );

    } else {

        header.classList.remove(
            "scrolled"
        );

    }

}

window.addEventListener(
    "scroll",
    updateHeader,
    { passive: true }
);

updateHeader();


/* =========================================================
   MOBILE MENU
   ========================================================= */

function openMobileMenu() {

    mobileNav.classList.add(
        "active"
    );

    mobileToggle.setAttribute(
        "aria-expanded",
        "true"
    );

    lockBody();

}


function closeMobileMenu() {

    mobileNav.classList.remove(
        "active"
    );

    mobileToggle.setAttribute(
        "aria-expanded",
        "false"
    );

    unlockBody();

}


mobileToggle.addEventListener(
    "click",
    () => {

        if (
            mobileNav.classList.contains(
                "active"
            )
        ) {

            closeMobileMenu();

        } else {

            openMobileMenu();

        }

    }
);


mobileNav
    .querySelectorAll("a")
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

    searchLayer.classList.add(
        "active"
    );

    lockBody();

    setTimeout(
        () => {
            searchInput.focus();
        },
        250
    );

}


function closeSearch() {

    searchLayer.classList.remove(
        "active"
    );

    searchInput.value = "";

    filterProducts(
        "All",
        false
    );

    unlockBody();

}


searchButton.addEventListener(
    "click",
    openSearch
);


searchClose.addEventListener(
    "click",
    closeSearch
);


searchLayer.addEventListener(
    "click",
    event => {

        if (
            event.target ===
            searchLayer
        ) {

            closeSearch();

        }

    }
);


/* SEARCH LIVE FILTER */

searchInput.addEventListener(
    "input",
    () => {

        const query =
            searchInput.value
                .trim()
                .toLowerCase();

        let visible = 0;

        productCards.forEach(
            card => {

                const name =
                    card.dataset.name
                        .toLowerCase();

                const category =
                    card.dataset.category
                        .toLowerCase();

                const match =
                    name.includes(query) ||
                    category.includes(query);

                card.style.display =
                    match
                        ? ""
                        : "none";

                if (match) {
                    visible++;
                }

            }
        );

        noResults.style.display =
            visible === 0
                ? "block"
                : "none";

    }
);


/* =========================================================
   PRODUCT FILTERING
   ========================================================= */

function activateFilter(
    category
) {

    filters.forEach(
        filter => {

            filter.classList.toggle(
                "active",
                filter.dataset.filter ===
                category
            );

        }
    );

}


function filterProducts(
    category = "All",
    updateButtons = true
) {

    let visible = 0;

    productCards.forEach(
        card => {

            const cardCategory =
                card.dataset.category;

            const show =
                category === "All" ||
                cardCategory === category;

            card.style.display =
                show
                    ? ""
                    : "none";

            if (show) {
                visible++;
            }

        }
    );

    noResults.style.display =
        visible === 0
            ? "block"
            : "none";

    if (updateButtons) {
        activateFilter(category);
    }

}


/* FILTER BUTTONS */

filters.forEach(
    filter => {

        filter.addEventListener(
            "click",
            () => {

                filterProducts(
                    filter.dataset.filter
                );

            }
        );

    }
);


/* CATEGORY CARDS */

categoryCards.forEach(
    card => {

        card.addEventListener(
            "click",
            () => {

                const category =
                    card.dataset.category;

                filterProducts(
                    category
                );

                document
                    .getElementById("products")
                    .scrollIntoView({
                        behavior: "smooth"
                    });

            }
        );

    }
);


/* =========================================================
   FOOTER FILTERS
   ========================================================= */

document
    .querySelectorAll(
        "[data-footer-filter]"
    )
    .forEach(
        link => {

            link.addEventListener(
                "click",
                () => {

                    filterProducts(
                        link.dataset.footerFilter
                    );

                }
            );

        }
    );


/* =========================================================
   VIEW ALL
   ========================================================= */

viewAllButton.addEventListener(
    "click",
    () => {

        filterProducts(
            "All"
        );

        viewAllButton.innerHTML =
            `
            All Equipment Visible
            <span>✓</span>
            `;

        setTimeout(
            () => {

                viewAllButton.innerHTML =
                    `
                    View All Equipment
                    <span>→</span>
                    `;

            },
            1800
        );

    }
);


/* =========================================================
   CART FUNCTIONS
   ========================================================= */

function addToCart(
    productId
) {

    const product =
        products[productId];

    if (!product) {
        return;
    }

    const existing =
        cart.find(
            item =>
                item.id === productId
        );

    if (existing) {

        existing.quantity += 1;

    } else {

        cart.push({
            id: productId,
            quantity: 1
        });

    }

    saveCart();

    updateCart();

    showToast(
        "Added to loadout",
        product.name
    );

}


function removeFromCart(
    productId
) {

    cart =
        cart.filter(
            item =>
                item.id !== productId
        );

    saveCart();

    updateCart();

}


function changeQuantity(
    productId,
    amount
) {

    const item =
        cart.find(
            cartItem =>
                cartItem.id ===
                productId
        );

    if (!item) {
        return;
    }

    item.quantity += amount;

    if (item.quantity <= 0) {

        removeFromCart(
            productId
        );

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


/* =========================================================
   CART RENDER
   ========================================================= */

function updateCart() {

    cartCount.textContent =
        getCartQuantity();

    cartTotal.textContent =
        formatPrice(
            getCartTotal()
        );

    renderCart();

}


function renderCart() {

    if (cart.length === 0) {

        cartItems.innerHTML =
            `
            <div class="empty-cart">

                <div class="empty-icon">
                    ◈
                </div>

                <h3>
                    Nothing here yet.
                </h3>

                <p>
                    Add your first piece of gear
                    to your loadout.
                </p>

                <button
                    class="neon-button ghost"
                    id="newStartShopping"
                    type="button"
                >
                    Start Shopping
                </button>

            </div>
            `;

        const button =
            document.getElementById(
                "newStartShopping"
            );

        button.addEventListener(
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
        cart
            .map(
                item => {

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

                            <h4>
                                ${product.name}
                            </h4>

                            <p>
                                ${formatPrice(
                                    product.price
                                )}
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
                            aria-label="Remove product"
                            data-action="remove"
                            data-id="${product.id}"
                        >
                            ×
                        </button>

                    </div>
                    `;

                }
            )
            .join("");


    cartItems
        .querySelectorAll(
            "[data-action]"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        const action =
                            button.dataset.action;

                        const id =
                            button.dataset.id;

                        if (
                            action ===
                            "increase"
                        ) {

                            changeQuantity(
                                id,
                                1
                            );

                        }

                        if (
                            action ===
                            "decrease"
                        ) {

                            changeQuantity(
                                id,
                                -1
                            );

                        }

                        if (
                            action ===
                            "remove"
                        ) {

                            removeFromCart(
                                id
                            );

                        }

                    }
                );

            }
        );

}


/* =========================================================
   CART DRAWER
   ========================================================= */

function openCart() {

    cartDrawer.classList.add(
        "active"
    );

    cartOverlay.classList.add(
        "active"
    );

    lockBody();

}


function closeCart() {

    cartDrawer.classList.remove(
        "active"
    );

    cartOverlay.classList.remove(
        "active"
    );

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
   ADD BUTTONS
   ========================================================= */

document
    .querySelectorAll(
        ".add-button"
    )
    .forEach(
        button => {

            button.addEventListener(
                "click",
                event => {

                    event.stopPropagation();

                    addToCart(
                        button.dataset.id
                    );

                }
            );

        }
    );


/* =========================================================
   PRODUCT MODAL
   ========================================================= */

let currentModalProduct = null;


function openProductModal(
    productId
) {

    const product =
        products[productId];

    if (!product) {
        return;
    }

    currentModalProduct =
        productId;

    modalCategory.textContent =
        product.category
            .toUpperCase();

    modalTitle.textContent =
        product.name;

    modalDescription.textContent =
        product.description;

    modalPrice.textContent =
        formatPrice(
            product.price
        );

    modalImage.innerHTML =
        `
        <div>
            ${product.icon}
        </div>
        `;

    productModal.classList.add(
        "active"
    );

    lockBody();

}


function closeProductModal() {

    productModal.classList.remove(
        "active"
    );

    currentModalProduct = null;

    unlockBody();

}


document
    .querySelectorAll(
        ".quick-view"
    )
    .forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    const product =
                        Object.values(
                            products
                        ).find(
                            item =>
                                item.name ===
                                button.dataset.product
                        );

                    if (product) {

                        openProductModal(
                            product.id
                        );

                    }

                }
            );

        }
    );


modalClose.addEventListener(
    "click",
    closeProductModal
);


productModal.addEventListener(
    "click",
    event => {

        if (
            event.target ===
            productModal
        ) {

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
                "Loadout is empty",
                "Add some gear before checking out."
            );

            return;

        }

        showToast(
            "Checkout ready",
            "The ordering and payment system can be connected next."
        );

    }
);


/* =========================================================
   TOAST
   ========================================================= */

let toastTimer;


function showToast(
    title,
    message
) {

    toastTitle.textContent =
        title;

    toastText.textContent =
        message;

    toast.classList.add(
        "active"
    );

    clearTimeout(
        toastTimer
    );

    toastTimer =
        setTimeout(
            () => {

                toast.classList.remove(
                    "active"
                );

            },
            3000
        );

}


/* =========================================================
   SCROLL REVEAL
   ========================================================= */

const revealElements =
    document.querySelectorAll(
        ".reveal"
    );


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
            threshold: .12
        }
    );


revealElements.forEach(
    element => {

        revealObserver.observe(
            element
        );

    }
);


/* =========================================================
   ACTIVE NAV LINK
   ========================================================= */

const sections =
    document.querySelectorAll(
        "main section[id]"
    );

const navLinks =
    document.querySelectorAll(
        ".nav-link"
    );


const navObserver =
    new IntersectionObserver(
        entries => {

            entries.forEach(
                entry => {

                    if (
                        entry.isIntersecting
                    ) {

                        navLinks.forEach(
                            link => {

                                link.classList.remove(
                                    "active"
                                );

                                if (
                                    link.getAttribute(
                                        "href"
                                    ) ===
                                    `#${entry.target.id}`
                                ) {

                                    link.classList.add(
                                        "active"
                                    );

                                }

                            }
                        );

                    }

                }
            );

        },
        {
            rootMargin:
                "-35% 0px -55% 0px"
        }
    );


sections.forEach(
    section => {

        navObserver.observe(
            section
        );

    }
);


/* =========================================================
   ESCAPE KEY
   ========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key !==
            "Escape"
        ) {
            return;
        }

        closeSearch();
        closeCart();
        closeProductModal();
        closeMobileMenu();

    }
);


/* =========================================================
   CURRENT YEAR
   ========================================================= */

currentYear.textContent =
    new Date().getFullYear();


/* =========================================================
   HERO 3D INTERACTION
   ========================================================= */

const heroStage =
    document.querySelector(
        ".hero-stage"
    );

const hologram =
    document.querySelector(
        ".hologram"
    );


if (
    heroStage &&
    hologram &&
    window.matchMedia(
        "(pointer:fine)"
    ).matches
) {

    heroStage.addEventListener(
        "mousemove",
        event => {

            const rect =
                heroStage.getBoundingClientRect();

            const x =
                (
                    event.clientX -
                    rect.left
                ) /
                rect.width -
                .5;

            const y =
                (
                    event.clientY -
                    rect.top
                ) /
                rect.height -
                .5;

            hologram.style.transform =
                `
                perspective(900px)
                rotateX(${y * -4}deg)
                rotateY(${x * 7}deg)
                rotateZ(2deg)
                translateY(-3px)
                `;

        }
    );


    heroStage.addEventListener(
        "mouseleave",
        () => {

            hologram.style.transform =
                "rotate(2deg)";

        }
    );

}


/* =========================================================
   INITIALIZE
   ========================================================= */

updateCart();

filterProducts(
    "All"
);
