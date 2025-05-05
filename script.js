document.addEventListener('DOMContentLoaded', () => {
    const cartCountElement = document.getElementById('cart-count');
    const cartItemsElement = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');
    const checkoutButton = document.getElementById('checkout-button');

    // Функция для получения корзины из localStorage
    function getCart() {
        const cart = localStorage.getItem('cart');
        return cart ? JSON.parse(cart) : [];
    }

    // Функция для сохранения корзины в localStorage
    function saveCart(cart) {
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        updateCartTotal();
        displayCartItems();
    }

    // Функция для добавления товара в корзину
    function addToCart(item) {
        const cart = getCart();
        cart.push(item);
        saveCart(cart);
    }

    // Функция для удаления товара из корзины
    function removeFromCart(itemId) {
        const cart = getCart();
        const updatedCart = cart.filter(item => item.id !== itemId);
        saveCart(updatedCart);
    }

    // Функция для обновления количества товаров в корзине (в header)
    function updateCartCount() {
        const cart = getCart();
        cartCountElement.innerText = cart.length;
    }

    // Функция для вычисления общей стоимости корзины
    function updateCartTotal() {
        const cart = getCart();
        let total = 0;
        cart.forEach(item => {
            total += item.price;
        });
        cartTotalElement.innerText = total;
    }

    // Функция для отображения товаров в корзине (на странице cart.html)
    function displayCartItems() {
        if (!cartItemsElement) return; // Проверяем, существует ли элемент cartItemsElement

        const cart = getCart();
        cartItemsElement.innerHTML = ''; // Очищаем содержимое

        if (cart.length === 0) {
            cartItemsElement.innerHTML = '<p>Корзина пуста</p>';
            checkoutButton.disabled = true; // Отключаем кнопку "Оформить заказ"
            return;
        }

        checkoutButton.disabled = false; // Включаем кнопку "Оформить заказ"

        cart.forEach(item => {
            const cartItemDiv = document.createElement('div');
            cartItemDiv.classList.add('cart-item');
            cartItemDiv.innerHTML = `
                <p>${item.name} - ${item.price} руб.</p>
                <button class="remove-from-cart" data-id="${item.id}">Удалить</button>
            `;
            cartItemsElement.appendChild(cartItemDiv);
        });
    }

    // Обработчик события для добавления товара в корзину
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', () => {
            const itemId = button.dataset.id;
            const itemName = button.dataset.name;
            const itemPrice = parseFloat(button.dataset.price);

            const item = {
                id: itemId,
                name: itemName,
                price: itemPrice
            };

            addToCart(item);
            alert(`${itemName} добавлен в корзину!`);
        });
    });

    // Обработчик события для удаления товара из корзины (только на странице cart.html)
    if (cartItemsElement) { // Проверяем, находимся ли мы на странице cart.html
        cartItemsElement.addEventListener('click', (event) => {
            if (event.target.classList.contains('remove-from-cart')) {
                const itemId = event.target.dataset.id;
                removeFromCart(itemId);
            }
        });
    }

    // Инициализация: обновление количества товаров и отображение корзины
    updateCartCount();
    updateCartTotal();
    displayCartItems(); // Вызываем только на странице cart.html
});
