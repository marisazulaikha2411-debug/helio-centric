

document.addEventListener("DOMContentLoaded", () => {

    // =====================================
    // 1. DATA KERANJANG
    // =====================================

    const cart = [];

    const rupiah = (number) =>
        new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0
        }).format(number);


    // =====================================
    // 2. STATUS STOK PRODUK
    // Produk 1-7 IN STOCK
    // Produk 8-40 SOLD OUT
    // =====================================

    const products = document.querySelectorAll(".product-card");

    products.forEach((product, index) => {

        const productNumber = index + 1;
        const image = product.querySelector(".product-image");
        const button = product.querySelector(".add-to-cart");

        if (!image || !button) return;

        // Hapus label stok lama jika ada
        image.querySelectorAll(".stock-label").forEach(label => {
            label.remove();
        });

        const label = document.createElement("span");
        label.classList.add("stock-label");

        if (productNumber <= 7) {

            label.classList.add("in-stock");
            label.textContent = "IN STOCK";

            button.disabled = false;
            button.textContent = "Add to Cart";

        } else {

            label.classList.add("sold-out");
            label.textContent = "SOLD OUT";

            button.disabled = true;
            button.textContent = "SOLD OUT";

        }

        image.appendChild(label);

    });


    // =====================================
    // 3. FITUR VIEW ALL / SHOW LESS
    // =====================================

    const viewAllButton = document.getElementById("view-all-btn");
    const productGrid = document.querySelector(".product-grid");

    if (viewAllButton && productGrid) {

        viewAllButton.addEventListener("click", () => {

            const showingAll =
                productGrid.classList.toggle("show-all");

            viewAllButton.textContent = showingAll
                ? "Show Less ↑"
                : "View All ↗";

        });

    }


    // =====================================
    // 4. FITUR SEARCH PRODUCT
    // =====================================

    const searchInput = document.getElementById("product-search");

    if (searchInput && productGrid) {

        const productCards =
            productGrid.querySelectorAll(".product-card");

        searchInput.addEventListener("input", () => {

            const keyword = searchInput.value
                .toLowerCase()
                .trim();

            productCards.forEach(product => {

                const name =
                    product.querySelector("h2");

                const brand =
                    product.querySelector(".brand");

                const details =
                    product.querySelector(".details");

                const searchableText = (
                    (name ? name.textContent : "") + " " +
                    (brand ? brand.textContent : "") + " " +
                    (details ? details.textContent : "")
                ).toLowerCase();

                product.style.display =
                    searchableText.includes(keyword) ? "" : "none";

            });

        });

    }


    // =====================================
    // 5. TAMBAH PRODUK KE KERANJANG
    // =====================================

    document.querySelectorAll(".add-to-cart").forEach(button => {

        button.addEventListener("click", () => {

            // Produk SOLD OUT tidak bisa dibeli
            if (button.disabled) return;

            const name = button.dataset.name;
            const price = Number(button.dataset.price);

            if (
                !name ||
                !Number.isFinite(price) ||
                price < 0
            ) {
                alert("Nama atau harga produk belum benar.");
                return;
            }

            const existingItem = cart.find(
                item => item.name === name
            );

            if (existingItem) {

                existingItem.quantity++;

            } else {

                cart.push({
                    name: name,
                    price: price,
                    quantity: 1
                });

            }

            renderCart();

        });

    });


    // =====================================
    // 6. TAMPILKAN DAN PERBARUI KERANJANG
    // =====================================

    function renderCart() {

        const container =
            document.getElementById("cart-items");

        const totalElement =
            document.getElementById("cart-total");

        const countElement =
            document.getElementById("cart-count");

        if (!container || !totalElement || !countElement) {
            console.warn(
                "Elemen keranjang tidak ditemukan di HTML."
            );
            return;
        }

        // Hitung jumlah seluruh barang
        const totalQuantity = cart.reduce(
            (sum, item) => sum + item.quantity,
            0
        );

        countElement.textContent = totalQuantity;

        container.innerHTML = "";

        if (cart.length === 0) {

            container.innerHTML =
                "<p>Keranjang kamu masih kosong.</p>";

        }

        cart.forEach(item => {

            const row = document.createElement("div");
            row.className = "cart-item";

            const name = document.createElement("strong");
            name.textContent = item.name;

            const price = document.createElement("p");
            price.textContent = rupiah(item.price);

            const minus = document.createElement("button");
            minus.textContent = "−";
            minus.setAttribute(
                "aria-label",
                "Kurangi jumlah"
            );

            const quantity = document.createElement("span");
            quantity.textContent =
                ` Jumlah: ${item.quantity} `;

            const plus = document.createElement("button");
            plus.textContent = "+";
            plus.setAttribute(
                "aria-label",
                "Tambah jumlah"
            );

            const remove = document.createElement("button");
            remove.textContent = "Hapus";

            // Kurangi jumlah
            minus.addEventListener("click", () => {

                item.quantity--;

                if (item.quantity <= 0) {
                    cart.splice(cart.indexOf(item), 1);
                }

                renderCart();

            });

            // Tambah jumlah
            plus.addEventListener("click", () => {

                item.quantity++;

                renderCart();

            });

            // Hapus produk dari keranjang
            remove.addEventListener("click", () => {

                cart.splice(cart.indexOf(item), 1);

                renderCart();

            });

            row.append(
                name,
                price,
                minus,
                quantity,
                plus,
                remove
            );

            container.appendChild(row);

        });


        // Hitung total harga
        const total = cart.reduce(
            (sum, item) =>
                sum + item.price * item.quantity,
            0
        );

        totalElement.textContent = rupiah(total);

    }


    // =====================================
    // 7. TAMPILKAN KONDISI AWAL
    // =====================================

    // CHECKOUT FEATURE
    const checkoutSection = document.getElementById("checkout-section");
    const checkoutButton = document.getElementById("checkout-btn");
    const checkoutForm = document.getElementById("checkout-form");
    const checkoutItems = document.getElementById("checkout-items");
    const checkoutTotal = document.getElementById("checkout-total");
    const orderSuccess = document.getElementById("order-success");
    const backToCart = document.getElementById("back-to-cart");
    const continueShopping = document.getElementById("continue-shopping");

    function renderCheckoutSummary() {
        checkoutItems.innerHTML = "";

        cart.forEach(item => {
            const row = document.createElement("div");
            row.className = "checkout-item";

            const info = document.createElement("div");

            const name = document.createElement("span");
            name.className = "checkout-item-name";
            name.textContent = item.name;

            const quantity = document.createElement("span");
            quantity.className = "checkout-item-quantity";
            quantity.textContent = `Qty: ${item.quantity}`;

            info.append(name, quantity);

            const price = document.createElement("strong");
            price.textContent = rupiah(item.price * item.quantity);

            row.append(info, price);
            checkoutItems.appendChild(row);
        });

        const total = cart.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
        );

        checkoutTotal.textContent = rupiah(total);
    }

    if (checkoutButton && checkoutSection) {
        checkoutButton.addEventListener("click", () => {
            if (cart.length === 0) {
                alert("Your cart is empty. Please add a product first.");
                return;
            }

            renderCheckoutSummary();
            checkoutSection.hidden = false;
            orderSuccess.hidden = true;

            checkoutSection.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        });
    }

    if (backToCart && checkoutSection) {
        backToCart.addEventListener("click", () => {
            checkoutSection.hidden = true;

            const cartElement = document.getElementById("cart-items");
            if (cartElement) {
                cartElement.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });
            }
        });
    }

    if (checkoutForm) {
        checkoutForm.addEventListener("submit", event => {
            event.preventDefault();

            if (cart.length === 0) {
                alert("Your cart is empty.");
                return;
            }

            const customerName =
                document.getElementById("customer-name").value.trim();

            if (!customerName) {
                alert("Please enter your name.");
                return;
            }

            const confirmed = confirm(
                "Place this demo order? No real payment will be processed."
            );

            if (!confirmed) return;

            // Demo only: this does not send an order to a server.
            checkoutForm.hidden = true;
            document.querySelector(".checkout-summary").hidden = true;
            orderSuccess.hidden = false;

            cart.length = 0;
            renderCart();

            orderSuccess.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });
        });
    }

    if (continueShopping) {
        continueShopping.addEventListener("click", () => {
            checkoutSection.hidden = true;
            checkoutForm.hidden = false;
            document.querySelector(".checkout-summary").hidden = false;
            checkoutForm.reset();

            const productsSection = document.getElementById("products");
            if (productsSection) {
                productsSection.scrollIntoView({
                    behavior: "smooth"
                });
            }
        });
    }

    // LOOKBOOK SLIDER - 5 SLIDES
    const lookbookSlides = document.querySelectorAll(".lookbook-slide");
    const lookbookDots = document.querySelectorAll(".lookbook-dot");
    const lookbookPrev = document.querySelector(".lookbook-prev");
    const lookbookNext = document.querySelector(".lookbook-next");

    let currentLook = 0;

    function showLook(index) {
        if (lookbookSlides.length === 0) return;

        currentLook =
            (index + lookbookSlides.length) % lookbookSlides.length;

        lookbookSlides.forEach((slide, i) => {
            slide.classList.toggle("active", i === currentLook);
        });

        lookbookDots.forEach((dot, i) => {
            dot.classList.toggle("active", i === currentLook);
        });
    }

    if (lookbookSlides.length > 0) {
        lookbookPrev?.addEventListener("click", () => {
            showLook(currentLook - 1);
        });

        lookbookNext?.addEventListener("click", () => {
            showLook(currentLook + 1);
        });

        lookbookDots.forEach((dot, i) => {
            dot.addEventListener("click", () => {
                showLook(i);
            });
        });

        showLook(0);
    }

    // FOOTER NEWSLETTER DEMO
    const newsletterForm = document.getElementById("hc-newsletter-form");
    const newsletterEmail = document.getElementById("hc-newsletter-email");
    const newsletterMessage = document.getElementById("hc-newsletter-message");

    if (newsletterForm && newsletterEmail && newsletterMessage) {
        newsletterForm.addEventListener("submit", event => {
            event.preventDefault();

            if (!newsletterEmail.checkValidity()) {
                newsletterEmail.reportValidity();
                return;
            }

            newsletterMessage.textContent =
                "Thanks for your interest in Helio Centric!";
            newsletterForm.reset();
        });
    }

/* HERO BANNER SLIDESHOW */
const heroImages = document.querySelectorAll(".hero-image");
let currentHero = 0;

if (heroImages.length > 1) {
    setInterval(() => {
        heroImages[currentHero].classList.remove("active");

        currentHero = (currentHero + 1) % heroImages.length;

        heroImages[currentHero].classList.add("active");
    }, 5000);
}

    renderCart();

    console.log(
        `Total produk terdeteksi: ${products.length}`
    );

});

