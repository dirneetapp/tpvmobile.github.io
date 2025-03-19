// Datos iniciales (simulando una base de datos)
let families = [
    { id: 1, name: "Bebidas" },
    { id: 2, name: "Cafés" },
    { id: 3, name: "Cervezas" },
    { id: 4, name: "Vinos" },
    { id: 5, name: "Alcohol" },
    { id: 6, name: "Bocadillos" },
    { id: 7, name: "Entrantes" },
    { id: 8, name: "Primeros" },
    { id: 9, name: "Segundos" },
    { id: 10, name: "Postres" },
    { id: 11, name: "Tapas" }
];

let products = [
    { id: 1, name: "Coca Cola", familyId: 1, price: 1.30 },
    { id: 2, name: "F. Naranja", familyId: 1, price: 1.30 },
    { id: 3, name: "F. Limón", familyId: 1, price: 1.30 },
    { id: 4, name: "Bote Coca", familyId: 1, price: 1.50 },
    { id: 5, name: "Bote Fanta", familyId: 1, price: 1.50 },
    { id: 6, name: "Bio Solan", familyId: 1, price: 1.80 },
    { id: 7, name: "Agua 1/4", familyId: 1, price: 0.80 },
    { id: 8, name: "Agua con Gas", familyId: 1, price: 1.00 },
    { id: 9, name: "Z. Natural", familyId: 1, price: 2.00 },
    { id: 10, name: "Zumos", familyId: 1, price: 1.50 },
    { id: 11, name: "Bitter Kas", familyId: 1, price: 1.30 },
    { id: 12, name: "Mosto", familyId: 1, price: 1.20 },
    { id: 13, name: "Agua 1/2", familyId: 1, price: 1.00 },
    { id: 14, name: "Agua 1", familyId: 1, price: 1.50 },
    { id: 15, name: "Trinaranjus", familyId: 1, price: 1.30 },
    { id: 16, name: "Casera 0,5", familyId: 1, price: 1.00 },
    { id: 17, name: "Tónica", familyId: 1, price: 1.20 },
    { id: 18, name: "Combinado", familyId: 1, price: 3.50 }
];

let tables = [
    { id: 1, name: "Mesa 1", products: [] },
    { id: 2, name: "Mesa 2", products: [] },
    { id: 3, name: "Mesa 3", products: [] }
];

let selectedFamilyId = 1; // Familia seleccionada por defecto (sección principal)
let selectedTableId = null; // Mesa seleccionada
let modalSelectedFamilyId = 1; // Familia seleccionada en el modal

// Elementos del DOM
const familyList = document.getElementById("family-list");
const productList = document.getElementById("product-list");
const tableList = document.getElementById("table-list");
const ticketTableBody = document.getElementById("ticket-table-body");
const addFamilyBtn = document.getElementById("add-family-btn");
const addProductBtn = document.getElementById("add-product-btn");
const addTableBtn = document.getElementById("add-table-btn");

// Modales
const familyModal = document.getElementById("family-modal");
const productModal = document.getElementById("product-modal");
const tableProductsModal = document.getElementById("table-products-modal");
const closeFamilyModal = document.getElementById("close-family-modal");
const closeProductModal = document.getElementById("close-product-modal");
const closeTableProductsModal = document.getElementById("close-table-products-modal");
const familyForm = document.getElementById("family-form");
const productForm = document.getElementById("product-form");
const tableProductsModalTitle = document.getElementById("table-products-modal-title");
const tableProductsList = document.getElementById("table-products-list");
const modalFamilyList = document.getElementById("modal-family-list");
const modalProductList = document.getElementById("modal-product-list");
const generateTicketBtn = document.getElementById("generate-ticket-btn");
const clearTableBtn = document.getElementById("clear-table-btn");

// Funciones para renderizar familias, productos y mesas
function renderFamilies() {
    familyList.innerHTML = "";
    families.forEach(family => {
        const familyBtn = document.createElement("div");
        familyBtn.classList.add("family-btn");
        if (family.id === selectedFamilyId) {
            familyBtn.classList.add("selected");
        }
        familyBtn.innerHTML = `
            ${family.name}
            <button class="edit-btn" onclick="editFamily(${family.id})">✏️</button>
            <button class="delete-btn" onclick="deleteFamily(${family.id})">🗑️</button>
        `;
        familyBtn.onclick = () => {
            selectedFamilyId = family.id;
            renderFamilies();
            renderProducts();
        };
        familyList.appendChild(familyBtn);
    });

    // Actualizar las opciones del select en el formulario de productos
    const productFamilySelect = document.getElementById("product-family");
    productFamilySelect.innerHTML = "";
    families.forEach(family => {
        const option = document.createElement("option");
        option.value = family.id;
        option.textContent = family.name;
        productFamilySelect.appendChild(option);
    });
}

function renderProducts() {
    productList.innerHTML = "";
    const filteredProducts = products.filter(product => product.familyId === selectedFamilyId);
    filteredProducts.forEach(product => {
        const productBtn = document.createElement("div");
        productBtn.classList.add("product-btn");
        productBtn.innerHTML = `
            ${product.name}
            <span class="product-price">${product.price.toFixed(2)} €</span>
            <button class="edit-btn" onclick="editProduct(${product.id})">✏️</button>
            <button class="delete-btn" onclick="deleteProduct(${product.id})">🗑️</button>
        `;
        productList.appendChild(productBtn);
    });
}

function renderTables() {
    tableList.innerHTML = "";
    tables.forEach(table => {
        const tableBtn = document.createElement("div");
        tableBtn.classList.add("table-btn");
        if (table.products.length > 0) {
            tableBtn.classList.add("occupied");
        }
        if (table.id === selectedTableId) {
            tableBtn.classList.add("selected");
        }
        tableBtn.innerHTML = `
            ${table.name}
            ${table.products.length > 0 ? '<div class="table-status">Ocupada</div>' : ''}
            <button class="edit-btn" onclick="editTable(${table.id})">✏️</button>
            <button class="delete-btn" onclick="deleteTable(${table.id})">🗑️</button>
        `;
        tableBtn.onclick = () => {
            selectedTableId = table.id;
            renderTables();
            renderTicketTable();
            openTableProductsModal();
        };
        tableList.appendChild(tableBtn);
    });
}

function renderTicketTable() {
    ticketTableBody.innerHTML = "";
    if (!selectedTableId) return;

    const table = tables.find(t => t.id === selectedTableId);
    let total = 0;
    table.products.forEach(item => {
        const product = products.find(p => p.id === item.productId);
        const importe = item.quantity * product.price;
        total += importe;
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${product.id}</td>
            <td>${product.name}</td>
            <td>${item.quantity}</td>
            <td>${product.price.toFixed(2)}</td>
            <td>0,00</td>
            <td>${importe.toFixed(2)}</td>
        `;
        ticketTableBody.appendChild(row);
    });

    // Actualizar el total en el encabezado
    document.querySelector(".total-amount").textContent = total.toFixed(2);
}

function renderTableProductsList() {
    tableProductsList.innerHTML = "";
    const table = tables.find(t => t.id === selectedTableId);
    table.products.forEach((item, index) => {
        const product = products.find(p => p.id === item.productId);
        const li = document.createElement("li");
        li.innerHTML = `
            ${product.name} - Cantidad: ${item.quantity} - ${(item.quantity * product.price).toFixed(2)} €
            <button onclick="removeProductFromTable(${index})">🗑️</button>
        `;
        tableProductsList.appendChild(li);
    });
}

function renderModalFamilies() {
    modalFamilyList.innerHTML = "";
    families.forEach(family => {
        const familyBtn = document.createElement("div");
        familyBtn.classList.add("modal-family-btn");
        if (family.id === modalSelectedFamilyId) {
            familyBtn.classList.add("selected");
        }
        familyBtn.innerHTML = family.name;
        familyBtn.onclick = () => {
            modalSelectedFamilyId = family.id;
            renderModalFamilies();
            renderModalProducts();
        };
        modalFamilyList.appendChild(familyBtn);
    });
}

function renderModalProducts() {
    modalProductList.innerHTML = "";
    const filteredProducts = products.filter(product => product.familyId === modalSelectedFamilyId);
    filteredProducts.forEach(product => {
        const productBtn = document.createElement("div");
        productBtn.classList.add("modal-product-btn");
        productBtn.innerHTML = `
            ${product.name}
            <span class="product-price">${product.price.toFixed(2)} €</span>
        `;
        productBtn.onclick = () => {
            const table = tables.find(t => t.id === selectedTableId);
            const existingProduct = table.products.find(item => item.productId === product.id);
            if (existingProduct) {
                existingProduct.quantity += 1;
            } else {
                table.products.push({ productId: product.id, quantity: 1 });
            }
            renderTableProductsList();
            renderTables();
            renderTicketTable();
        };
        modalProductList.appendChild(productBtn);
    });
}

// Funciones para manejar familias
addFamilyBtn.onclick = () => {
    familyModalTitle.textContent = "Añadir Familia";
    document.getElementById("family-name").value = "";
    document.getElementById("family-id").value = "";
    familyModal.style.display = "flex";
};

closeFamilyModal.onclick = () => {
    familyModal.style.display = "none";
};

familyForm.onsubmit = (e) => {
    e.preventDefault();
    const familyName = document.getElementById("family-name").value;
    const familyId = document.getElementById("family-id").value;

    if (familyId) {
        const family = families.find(f => f.id == familyId);
        family.name = familyName;
    } else {
        const newFamily = {
            id: families.length ? Math.max(...families.map(f => f.id)) + 1 : 1,
            name: familyName
        };
        families.push(newFamily);
    }

    familyModal.style.display = "none";
    renderFamilies();
    renderModalFamilies();
};

function editFamily(id) {
    const family = families.find(f => f.id === id);
    familyModalTitle.textContent = "Editar Familia";
    document.getElementById("family-name").value = family.name;
    document.getElementById("family-id").value = family.id;
    familyModal.style.display = "flex";
}

function deleteFamily(id) {
    if (confirm("¿Estás seguro de que deseas eliminar esta familia? Los productos asociados también se eliminarán.")) {
        families = families.filter(f => f.id !== id);
        products = products.filter(p => p.familyId !== id);
        tables.forEach(table => {
            table.products = table.products.filter(item => {
                const product = products.find(p => p.id === item.productId);
                return product !== undefined;
            });
        });
        if (selectedFamilyId === id) {
            selectedFamilyId = families.length ? families[0].id : null;
        }
        if (modalSelectedFamilyId === id) {
            modalSelectedFamilyId = families.length ? families[0].id : null;
        }
        renderFamilies();
        renderProducts();
        renderTables();
        renderTicketTable();
        renderModalFamilies();
        renderModalProducts();
    }
}

// Funciones para manejar productos
addProductBtn.onclick = () => {
    productModalTitle.textContent = "Añadir Producto";
    document.getElementById("product-name").value = "";
    document.getElementById("product-price").value = "";
    document.getElementById("product-id").value = "";
    document.getElementById("product-family").value = selectedFamilyId;
    productModal.style.display = "flex";
};

closeProductModal.onclick = () => {
    productModal.style.display = "none";
};

productForm.onsubmit = (e) => {
    e.preventDefault();
    const productName = document.getElementById("product-name").value;
    const productPrice = parseFloat(document.getElementById("product-price").value);
    const productFamilyId = parseInt(document.getElementById("product-family").value);
    const productId = document.getElementById("product-id").value;

    if (productId) {
        const product = products.find(p => p.id == productId);
        product.name = productName;
        product.price = productPrice;
        product.familyId = productFamilyId;
    } else {
        const newProduct = {
            id: products.length ? Math.max(...products.map(p => p.id)) + 1 : 1,
            name: productName,
            price: productPrice,
            familyId: productFamilyId
        };
        products.push(newProduct);
    }

    productModal.style.display = "none";
    renderProducts();
    renderModalProducts();
};

function editProduct(id) {
    const product = products.find(p => p.id === id);
    productModalTitle.textContent = "Editar Producto";
    document.getElementById("product-name").value = product.name;
    document.getElementById("product-price").value = product.price;
    document.getElementById("product-id").value = product.id;
    document.getElementById("product-family").value = product.familyId;
    productModal.style.display = "flex";
}

function deleteProduct(id) {
    if (confirm("¿Estás seguro de que deseas eliminar este producto?")) {
        products = products.filter(p => p.id !== id);
        tables.forEach(table => {
            table.products = table.products.filter(item => item.productId !== id);
        });
        renderProducts();
        renderTables();
        renderTicketTable();
        renderModalProducts();
    }
}

// Funciones para manejar mesas
addTableBtn.onclick = () => {
    const tableName = prompt("Introduce el nombre de la mesa:");
    if (tableName) {
        const newTable = {
            id: tables.length ? Math.max(...tables.map(t => t.id)) + 1 : 1,
            name: tableName,
            products: []
        };
        tables.push(newTable);
        renderTables();
    }
};

function editTable(id) {
    const table = tables.find(t => t.id === id);
    const newName = prompt("Introduce el nuevo nombre de la mesa:", table.name);
    if (newName) {
        table.name = newName;
        renderTables();
        if (selectedTableId === id) {
            tableProductsModalTitle.textContent = `Añadir Productos a ${table.name}`;
        }
    }
}

function deleteTable(id) {
    if (confirm("¿Estás seguro de que deseas eliminar esta mesa?")) {
        tables = tables.filter(t => t.id !== id);
        if (selectedTableId === id) {
            selectedTableId = null;
            tableProductsModal.style.display = "none";
        }
        renderTables();
        renderTicketTable();
    }
}

function openTableProductsModal() {
    if (!selectedTableId) return;
    const table = tables.find(t => t.id === selectedTableId);
    tableProductsModalTitle.textContent = `Añadir Productos a ${table.name}`;
    modalSelectedFamilyId = 1; // Reiniciar la familia seleccionada en el modal
    renderModalFamilies();
    renderModalProducts();
    renderTableProductsList();
    tableProductsModal.style.display = "flex";
}

closeTableProductsModal.onclick = () => {
    tableProductsModal.style.display = "none";
};

function removeProductFromTable(index) {
    const table = tables.find(t => t.id === selectedTableId);
    table.products.splice(index, 1);
    renderTableProductsList();
    renderTables();
    renderTicketTable();
}

generateTicketBtn.onclick = () => {
    const table = tables.find(t => t.id === selectedTableId);
    if (table.products.length === 0) {
        alert("La mesa no tiene productos para generar un ticket.");
        return;
    }

    let ticket = `Ticket - ${table.name}\n`;
    ticket += "------------------------\n";
    let total = 0;
    table.products.forEach(item => {
        const product = products.find(p => p.id === item.productId);
        const importe = item.quantity * product.price;
        total += importe;
        ticket += `${product.name} x${item.quantity}: ${importe.toFixed(2)} €\n`;
    });
    ticket += "------------------------\n";
    ticket += `Total: ${total.toFixed(2)} €`;

    alert(ticket);
};

clearTableBtn.onclick = () => {
    if (confirm("¿Estás seguro de que deseas limpiar esta mesa?")) {
        const table = tables.find(t => t.id === selectedTableId);
        table.products = [];
        renderTableProductsList();
        renderTables();
        renderTicketTable();
    }
};

// Inicializar la interfaz
renderFamilies();
renderProducts();
renderTables();
renderTicketTable();