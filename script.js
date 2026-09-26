/* MOBILE MENU */
function toggleMenu(){
    document.getElementById("nav").classList.toggle("open");
}

/* CLOSE MOBILE MENU AFTER NAVIGATION */
document.querySelectorAll(".nav a").forEach(link => {
    link.addEventListener("click", () => {
        document.getElementById("nav").classList.remove("open");
    });
});

/* HERO SLIDER */
let currentSlide = 0;
const slides = document.querySelectorAll(".hero-slide");
const dots = document.querySelectorAll(".dot");
let sliderTimer;

function showSlide(index){
    slides.forEach(slide => slide.classList.remove("active"));
    dots.forEach(dot => dot.classList.remove("active"));

    currentSlide = (index + slides.length) % slides.length;
    slides[currentSlide].classList.add("active");
    dots[currentSlide].classList.add("active");

    resetSliderTimer();
}

function changeSlide(direction){
    showSlide(currentSlide + direction);
}

function resetSliderTimer(){
    clearInterval(sliderTimer);
    sliderTimer = setInterval(() => showSlide(currentSlide + 1), 5000);
}
resetSliderTimer();

/* HELPERS */
function scrollToProducts(){
    document.getElementById("products").scrollIntoView({behavior:"smooth"});
}

function showToast(message){
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2200);
}

/* CART */
let cart = JSON.parse(localStorage.getItem("marveCart")) || [];

function addToCart(name, price, image){
    const existing = cart.find(item => item.name === name);

    if(existing){
        existing.quantity++;
    }else{
        cart.push({name, price, image, quantity:1});
    }

    saveCart();
    openCart();
    showToast("Added to cart");
}

function saveCart(){
    localStorage.setItem("marveCart", JSON.stringify(cart));
    updateCart();
}

function updateCart(){
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById("cartCount").textContent = count;

    const container = document.getElementById("cartItems");

    if(cart.length === 0){
        container.innerHTML = "Your cart is empty.";
        document.getElementById("cartTotal").textContent = "৳0";
        return;
    }

    let total = 0;

    container.innerHTML = cart.map((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        return `
            <div class="cart-item">
                <img src="${item.image}" alt="${escapeHtml(item.name)}">
                <div>
                    <h4>${escapeHtml(item.name)}</h4>
                    <p>৳${item.price.toLocaleString()} × ${item.quantity}</p>
                    <button class="remove-item" onclick="removeFromCart(${index})">Remove</button>
                </div>
            </div>
        `;
    }).join("");

    document.getElementById("cartTotal").textContent = "৳" + total.toLocaleString();
}

function removeFromCart(index){
    cart.splice(index, 1);
    saveCart();
    showToast("Removed from cart");
}

function openCart(){
    document.getElementById("cartDrawer").classList.add("open");
}

function closeCart(){
    document.getElementById("cartDrawer").classList.remove("open");
}

/* CHECKOUT */
function checkout(){
    if(cart.length === 0){
        showToast("Your cart is empty");
        return;
    }

    let total = 0;

    document.getElementById("checkoutItems").innerHTML = cart.map(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        return `<p>${escapeHtml(item.name)} × ${item.quantity} — ৳${itemTotal.toLocaleString()}</p>`;
    }).join("");

    document.getElementById("checkoutTotal").textContent = "৳" + total.toLocaleString();

    closeCart();
    document.getElementById("checkoutModal").classList.add("open");
}

function closeCheckout(){
    document.getElementById("checkoutModal").classList.remove("open");
}

function placeOrder(){
    const name = document.getElementById("customerName").value.trim();
    const phone = document.getElementById("customerPhone").value.trim();
    const address = document.getElementById("customerAddress").value.trim();
    const payment = document.getElementById("paymentMethod").value;

    if(!name || !phone || !address){
        alert("Please fill in your name, phone number and delivery address.");
        return;
    }

    if(cart.length === 0){
        alert("Your cart is empty.");
        closeCheckout();
        return;
    }

    let total = 0;

    const orderLines = cart.map(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        return `• ${item.name} × ${item.quantity} = ৳${itemTotal.toLocaleString()}`;
    });

    const message =
`MARVE Fashion Store - New Order

Customer Name: ${name}
Phone: ${phone}
Delivery Address: ${address}
Payment: ${payment}

Order:
${orderLines.join("\n")}

Total: ৳${total.toLocaleString()}`;

    const whatsappUrl =
        "https://wa.me/8801314576664?text=" +
        encodeURIComponent(message);

    window.open(whatsappUrl, "_blank");

    localStorage.removeItem("marveCart");
    cart = [];
    updateCart();
    closeCheckout();
    showToast("Order details opened in WhatsApp");
}

/* SEARCH */
function searchProducts(){
    const search = document.getElementById("searchInput").value.toLowerCase().trim();

    document.querySelectorAll(".product").forEach(product => {
        const name = product.dataset.name.toLowerCase();
        product.classList.toggle("hidden", !name.includes(search));
    });
}

/* CATEGORY FILTER */
function filterCategory(category){
    document.getElementById("searchInput").value = "";

    document.querySelectorAll(".product").forEach(product => {
        product.classList.toggle(
            "hidden",
            product.dataset.category !== category
        );
    });

    document.getElementById("products").scrollIntoView({behavior:"smooth"});
}

function showAllProducts(event){
    if(event) event.preventDefault();

    document.getElementById("searchInput").value = "";

    document.querySelectorAll(".product").forEach(product => {
        product.classList.remove("hidden");
    });

    document.getElementById("products").scrollIntoView({behavior:"smooth"});
}

/* WISHLIST */
function toggleWishlist(button){
    button.classList.toggle("active");
    button.textContent = button.classList.contains("active") ? "♥" : "♡";
}

/* BASIC HTML ESCAPING FOR CART TEXT */
function escapeHtml(text){
    return text.replace(/[&<>"']/g, char => ({
        "&":"&amp;",
        "<":"&lt;",
        ">":"&gt;",
        '"':"&quot;",
        "'":"&#039;"
    }[char]));
}

/* CLOSE CHECKOUT WHEN CLICKING BACKDROP */
document.getElementById("checkoutModal").addEventListener("click", function(e){
    if(e.target === this) closeCheckout();
});

/* INITIALIZE */
updateCart();

function toggleMenu(){document.getElementById("nav").classList.toggle("open")}
function toast(msg){const t=document.getElementById("toast");t.textContent=msg;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2200)}
function subscribe(){const e=document.getElementById("email").value.trim();toast(e?"Thanks for subscribing to MARVE!":"Please enter your email.")}
updateCounts();renderProducts();
