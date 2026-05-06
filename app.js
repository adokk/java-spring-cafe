const api = {
    categories: "/api/categories",
    menuItems: "/api/menu-items",
    customers: "/api/customers",
    tables: "/api/tables",
    orders: "/api/orders",
    reservations: "/api/reservations"
};

const state = {
    categories: [],
    menuItems: [],
    customers: [],
    tables: [],
    orders: [],
    reservations: []
};

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

document.addEventListener("DOMContentLoaded", () => {
    bindTabs();
    bindForms();
    bindResetButtons();
    $$("[data-refresh]").forEach((button) => button.addEventListener("click", refreshAll));
    refreshAll();
});

function bindTabs() {
    $$(".tab").forEach((tab) => {
        tab.addEventListener("click", () => {
            $$(".tab").forEach((item) => item.classList.remove("is-active"));
            $$(".view").forEach((view) => view.classList.remove("is-active"));
            tab.classList.add("is-active");
            $(`#${tab.dataset.view}`).classList.add("is-active");
        });
    });
}

function bindResetButtons() {
    $$("[data-reset-form]").forEach((button) => {
        button.addEventListener("click", () => resetForm($(`#${button.dataset.resetForm}`)));
    });
}

function bindForms() {
    $("#categoryForm").addEventListener("submit", submitCategory);
    $("#menuItemForm").addEventListener("submit", submitMenuItem);
    $("#customerForm").addEventListener("submit", submitCustomer);
    $("#tableForm").addEventListener("submit", submitTable);
    $("#orderForm").addEventListener("submit", submitOrder);
    $("#reservationForm").addEventListener("submit", submitReservation);
}

async function refreshAll() {
    try {
        const [categories, menuItems, customers, tables, orders, reservations] = await Promise.all([
            request(api.categories),
            request(api.menuItems),
            request(api.customers),
            request(api.tables),
            request(api.orders),
            request(api.reservations)
        ]);
        Object.assign(state, {categories, menuItems, customers, tables, orders, reservations});
        renderAll();
        setConnection(true);
    } catch (error) {
        setConnection(false);
        showToast(error.message);
    }
}

async function request(url, options = {}) {
    const response = await fetch(url, {
        headers: {
            "Content-Type": "application/json",
            ...(options.headers || {})
        },
        ...options
    });

    if (response.status === 204) {
        return null;
    }

    const contentType = response.headers.get("content-type") || "";
    const body = contentType.includes("application/json") ? await response.json() : await response.text();

    if (!response.ok) {
        const message = typeof body === "string" ? body : body.message || "Ошибка запроса";
        throw new Error(message);
    }
    return body;
}

function setConnection(ok) {
    const status = $("#connectionStatus");
    status.classList.toggle("ok", ok);
    status.classList.toggle("fail", !ok);
    status.textContent = ok ? "API работает" : "API недоступен";
}

function renderAll() {
    renderMetrics();
    renderOptions();
    renderCategories();
    renderMenuItems();
    renderCustomers();
    renderTables();
    renderOrders();
    renderReservations();
}

function renderMetrics() {
    $("#metricCategories").textContent = state.categories.length;
    $("#metricMenu").textContent = state.menuItems.length;
    $("#metricCustomers").textContent = state.customers.length;
    $("#metricTables").textContent = state.tables.filter((table) => table.available).length;
    $("#metricOrders").textContent = state.orders.length;
    renderDashboardLists();
}

function renderDashboardLists() {
    const latestOrders = [...state.orders]
        .sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)))
        .slice(0, 5);
    $("#dashboardOrders").innerHTML = latestOrders.length
        ? latestOrders.map((order) => `
            <article class="item">
                <div class="item-head">
                    <div>
                        <div class="item-title">Заказ #${order.id}</div>
                        <div class="meta">${escapeHtml(order.customer?.fullName || "Клиент")} · ${formatMoney(order.totalAmount)}</div>
                    </div>
                    <span class="pill ${order.status === "COMPLETED" ? "ok" : "warn"}">${order.status}</span>
                </div>
            </article>
        `).join("")
        : empty("Заказов пока нет");

    const upcoming = [...state.reservations]
        .sort((a, b) => String(a.reservationTime).localeCompare(String(b.reservationTime)))
        .slice(0, 5);
    $("#dashboardReservations").innerHTML = upcoming.length
        ? upcoming.map((reservation) => `
            <article class="item">
                <div class="item-head">
                    <div>
                        <div class="item-title">${escapeHtml(reservation.customer?.fullName || "Клиент")}</div>
                        <div class="meta">Столик ${reservation.table?.tableNumber || "-"} · ${formatDate(reservation.reservationTime)}</div>
                    </div>
                    <span class="pill">${reservation.status}</span>
                </div>
            </article>
        `).join("")
        : empty("Броней пока нет");
}

function renderOptions() {
    fillSelect("#menuItemForm select[name='categoryId']", state.categories, "Выберите категорию", (item) => item.name);
    fillSelect("#orderForm select[name='customerId']", state.customers, "Выберите клиента", (item) => `${item.fullName} (${item.phone})`);
    fillSelect("#orderForm select[name='tableId']", state.tables, "Без столика", (item) => `Столик ${item.tableNumber}, ${item.seats} мест`);
    fillSelect("#orderForm select[name='menuItemId']", state.menuItems.filter((item) => item.available), "Выберите блюдо", (item) => `${item.name} · ${formatMoney(item.price)}`);
    fillSelect("#reservationForm select[name='customerId']", state.customers, "Выберите клиента", (item) => `${item.fullName} (${item.phone})`);
    fillSelect("#reservationForm select[name='tableId']", state.tables, "Выберите столик", (item) => `Столик ${item.tableNumber}, ${item.seats} мест`);
}

function fillSelect(selector, items, placeholder, labelFn) {
    const select = $(selector);
    const currentValue = select.value;
    select.innerHTML = `<option value="">${placeholder}</option>` + items.map((item) =>
        `<option value="${item.id}">${escapeHtml(labelFn(item))}</option>`
    ).join("");
    if ([...select.options].some((option) => option.value === currentValue)) {
        select.value = currentValue;
    }
}

function renderCategories() {
    $("#categoryList").innerHTML = state.categories.length
        ? state.categories.map((category) => `
            <article class="item">
                <div class="item-head">
                    <div>
                        <div class="item-title">${escapeHtml(category.name)}</div>
                        <div class="meta">${escapeHtml(category.description || "Без описания")}</div>
                    </div>
                    <span class="pill">#${category.id}</span>
                </div>
                <div class="actions">
                    <button class="small" onclick="editCategory(${category.id})">Изменить</button>
                    <button class="danger" onclick="removeEntity('${api.categories}', ${category.id})">Удалить</button>
                </div>
            </article>
        `).join("")
        : empty("Категорий пока нет");
}

function renderMenuItems() {
    $("#menuItemList").innerHTML = state.menuItems.length
        ? state.menuItems.map((item) => `
            <article class="item">
                <div class="item-head">
                    <div>
                        <div class="item-title">${escapeHtml(item.name)}</div>
                        <div class="meta">${escapeHtml(item.category?.name || "Без категории")}</div>
                    </div>
                    <div class="price">${formatMoney(item.price)}</div>
                </div>
                <p class="meta">${escapeHtml(item.description || "Без описания")}</p>
                <span class="pill ${item.available ? "ok" : "warn"}">${item.available ? "Доступно" : "Скрыто"}</span>
                <div class="actions">
                    <button class="small" onclick="editMenuItem(${item.id})">Изменить</button>
                    <button class="danger" onclick="removeEntity('${api.menuItems}', ${item.id})">Удалить</button>
                </div>
            </article>
        `).join("")
        : empty("Меню пока пустое");
}

function renderCustomers() {
    $("#customerRows").innerHTML = state.customers.length
        ? state.customers.map((customer) => `
            <tr>
                <td>${customer.id}</td>
                <td>${escapeHtml(customer.fullName)}</td>
                <td>${escapeHtml(customer.phone)}</td>
                <td>${escapeHtml(customer.email || "-")}</td>
                <td>
                    <div class="actions">
                        <button class="small" onclick="editCustomer(${customer.id})">Изменить</button>
                        <button class="danger" onclick="removeEntity('${api.customers}', ${customer.id})">Удалить</button>
                    </div>
                </td>
            </tr>
        `).join("")
        : `<tr><td colspan="5">${empty("Клиентов пока нет")}</td></tr>`;
}

function renderTables() {
    $("#tableList").innerHTML = state.tables.length
        ? state.tables.map((table) => `
            <article class="item">
                <div class="item-head">
                    <div>
                        <div class="item-title">Столик ${table.tableNumber}</div>
                        <div class="meta">${table.seats} мест · ${escapeHtml(table.location || "Зал")}</div>
                    </div>
                    <span class="pill ${table.available ? "ok" : "warn"}">${table.available ? "Свободен" : "Занят"}</span>
                </div>
                <div class="actions">
                    <button class="small" onclick="editTable(${table.id})">Изменить</button>
                    <button class="danger" onclick="removeEntity('${api.tables}', ${table.id})">Удалить</button>
                </div>
            </article>
        `).join("")
        : empty("Столиков пока нет");
}

function renderOrders() {
    $("#orderList").innerHTML = state.orders.length
        ? state.orders.map((order) => `
            <article class="item">
                <div class="item-head">
                    <div>
                        <div class="item-title">Заказ #${order.id}</div>
                        <div class="meta">${escapeHtml(order.customer?.fullName || "Клиент")} · ${formatDate(order.createdAt)}</div>
                    </div>
                    <div class="price">${formatMoney(order.totalAmount)}</div>
                </div>
                <div class="meta">
                    ${order.table ? `Столик ${order.table.tableNumber}` : "Без столика"} ·
                    ${order.items.map((item) => `${escapeHtml(item.menuItem.name)} x ${item.quantity}`).join(", ")}
                </div>
                <div class="actions">
                    <select aria-label="Статус заказа" onchange="changeOrderStatus(${order.id}, this.value)">
                        ${["NEW", "CONFIRMED", "PREPARING", "READY", "COMPLETED", "CANCELLED"].map((status) =>
                            `<option value="${status}" ${status === order.status ? "selected" : ""}>${status}</option>`
                        ).join("")}
                    </select>
                    <button class="danger" onclick="removeEntity('${api.orders}', ${order.id})">Удалить</button>
                </div>
            </article>
        `).join("")
        : empty("Заказов пока нет");
}

function renderReservations() {
    $("#reservationList").innerHTML = state.reservations.length
        ? state.reservations.map((reservation) => `
            <article class="item">
                <div class="item-head">
                    <div>
                        <div class="item-title">${escapeHtml(reservation.customer?.fullName || "Клиент")}</div>
                        <div class="meta">Столик ${reservation.table?.tableNumber || "-"} · ${formatDate(reservation.reservationTime)}</div>
                    </div>
                    <span class="pill">${reservation.status}</span>
                </div>
                <div class="meta">${reservation.guestCount} гостей · ${escapeHtml(reservation.comment || "Без комментария")}</div>
                <div class="actions">
                    <button class="small" onclick="editReservation(${reservation.id})">Изменить</button>
                    <button class="danger" onclick="removeEntity('${api.reservations}', ${reservation.id})">Удалить</button>
                </div>
            </article>
        `).join("")
        : empty("Броней пока нет");
}

async function submitCategory(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = formData(form);
    await saveEntity(api.categories, data.id, {
        name: data.name,
        description: data.description
    });
    resetForm(form);
}

async function submitMenuItem(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = formData(form);
    await saveEntity(api.menuItems, data.id, {
        name: data.name,
        description: data.description,
        price: Number(data.price),
        available: form.elements.available.checked,
        categoryId: Number(data.categoryId)
    });
    resetForm(form);
}

async function submitCustomer(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = formData(form);
    await saveEntity(api.customers, data.id, {
        fullName: data.fullName,
        phone: data.phone,
        email: data.email || null
    });
    resetForm(form);
}

async function submitTable(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = formData(form);
    await saveEntity(api.tables, data.id, {
        tableNumber: Number(data.tableNumber),
        seats: Number(data.seats),
        location: data.location,
        available: form.elements.available.checked
    });
    resetForm(form);
}

async function submitOrder(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = formData(form);
    await request(api.orders, {
        method: "POST",
        body: JSON.stringify({
            customerId: Number(data.customerId),
            tableId: data.tableId ? Number(data.tableId) : null,
            items: [{
                menuItemId: Number(data.menuItemId),
                quantity: Number(data.quantity)
            }]
        })
    });
    resetForm(form);
    showToast("Заказ создан");
    await refreshAll();
}

async function submitReservation(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = formData(form);
    await saveEntity(api.reservations, data.id, {
        customerId: Number(data.customerId),
        tableId: Number(data.tableId),
        reservationTime: data.reservationTime,
        guestCount: Number(data.guestCount),
        status: data.status || null,
        comment: data.comment
    });
    resetForm(form);
}

async function saveEntity(baseUrl, id, payload) {
    try {
        await request(id ? `${baseUrl}/${id}` : baseUrl, {
            method: id ? "PUT" : "POST",
            body: JSON.stringify(payload)
        });
        showToast(id ? "Изменения сохранены" : "Запись создана");
        await refreshAll();
    } catch (error) {
        showToast(error.message);
    }
}

async function removeEntity(baseUrl, id) {
    if (!confirm("Удалить запись?")) {
        return;
    }
    try {
        await request(`${baseUrl}/${id}`, {method: "DELETE"});
        showToast("Запись удалена");
        await refreshAll();
    } catch (error) {
        showToast(error.message);
    }
}

async function changeOrderStatus(id, status) {
    try {
        await request(`${api.orders}/${id}/status`, {
            method: "PATCH",
            body: JSON.stringify({status})
        });
        showToast("Статус заказа обновлен");
        await refreshAll();
    } catch (error) {
        showToast(error.message);
    }
}

function editCategory(id) {
    const item = state.categories.find((category) => category.id === id);
    fillForm("#categoryForm", item);
}

function editMenuItem(id) {
    const item = state.menuItems.find((menuItem) => menuItem.id === id);
    fillForm("#menuItemForm", {
        ...item,
        categoryId: item.category.id
    });
}

function editCustomer(id) {
    const item = state.customers.find((customer) => customer.id === id);
    fillForm("#customerForm", item);
}

function editTable(id) {
    const item = state.tables.find((table) => table.id === id);
    fillForm("#tableForm", item);
}

function editReservation(id) {
    const item = state.reservations.find((reservation) => reservation.id === id);
    fillForm("#reservationForm", {
        ...item,
        customerId: item.customer.id,
        tableId: item.table.id,
        reservationTime: toLocalInputDate(item.reservationTime)
    });
}

function fillForm(selector, values) {
    const form = $(selector);
    Object.entries(values).forEach(([key, value]) => {
        const field = form.elements[key];
        if (!field) {
            return;
        }
        if (field.type === "checkbox") {
            field.checked = Boolean(value);
        } else {
            field.value = value ?? "";
        }
    });
    form.scrollIntoView({behavior: "smooth", block: "start"});
}

function resetForm(form) {
    form.reset();
    if (form.elements.id) {
        form.elements.id.value = "";
    }
    if (form.id === "menuItemForm" || form.id === "tableForm") {
        form.elements.available.checked = true;
    }
    if (form.id === "orderForm") {
        form.elements.quantity.value = 1;
    }
    if (form.id === "reservationForm") {
        form.elements.guestCount.value = 2;
    }
}

function formData(form) {
    return Object.fromEntries(new FormData(form).entries());
}

function showToast(message) {
    const toast = $("#toast");
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => toast.classList.remove("show"), 2800);
}

function empty(message) {
    return `<div class="empty">${message}</div>`;
}

function formatMoney(value) {
    return new Intl.NumberFormat("ru-RU", {
        style: "currency",
        currency: "KZT",
        maximumFractionDigits: 0
    }).format(Number(value || 0));
}

function formatDate(value) {
    if (!value) {
        return "-";
    }
    return new Intl.DateTimeFormat("ru-RU", {
        dateStyle: "medium",
        timeStyle: "short"
    }).format(new Date(value));
}

function toLocalInputDate(value) {
    if (!value) {
        return "";
    }
    const date = new Date(value);
    const offset = date.getTimezoneOffset();
    const local = new Date(date.getTime() - offset * 60000);
    return local.toISOString().slice(0, 16);
}

function escapeHtml(value) {
    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}
