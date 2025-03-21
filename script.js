document.addEventListener("DOMContentLoaded", () => {
    // Datos iniciales (simulando una base de datos)
    const defaultFamilies = [
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

    const defaultProducts = [
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

    const defaultTables = [
        { id: 1, name: "Mesa 1", products: [] },
        { id: 2, name: "Mesa 2", products: [] },
        { id: 3, name: "Mesa 3", products: [] }
    ];

    // Cargar datos desde localStorage o usar los valores por defecto
    let families, products, tables;
    try {
        families = JSON.parse(localStorage.getItem("families")) || defaultFamilies;
        products = JSON.parse(localStorage.getItem("products")) || defaultProducts;
        tables = JSON.parse(localStorage.getItem("tables")) || defaultTables;
    } catch (error) {
        console.error("Error al cargar datos de localStorage:", error);
        families = defaultFamilies;
        products = defaultProducts;
        tables = defaultTables;
    }

    let selectedFamilyId = families.length ? families[0].id : null; // Familia seleccionada por defecto
    let selectedTableId = null; // Mesa seleccionada
    let modalSelectedFamilyId = families.length ? families[0].id : null; // Familia seleccionada en el modal

    // Funciones para guardar datos en localStorage
    function saveToLocalStorage() {
        try {
            localStorage.setItem("families", JSON.stringify(families));
            localStorage.setItem("products", JSON.stringify(products));
            localStorage.setItem("tables", JSON.stringify(tables));
        } catch (error) {
            console.error("Error al guardar datos en localStorage:", error);
        }
    }

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
    const familyModalTitle = document.getElementById("family-modal-title"); // Añadido
    const productModalTitle = document.getElementById("product-modal-title"); // Añadido
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
        if (!selectedFamilyId) return;
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
            if (!product) return; // Saltar si el producto no existe
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
            if (!product) return; // Saltar si el producto no existe
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
        if (!modalSelectedFamilyId) return;
        const filteredProducts = products.filter(product => product.familyId === modalSelectedFamilyId);
        filteredProducts.forEach(product => {
            const productBtn = document.createElement("div");
            productBtn.classList.add("modal-product-btn");
            productBtn.innerHTML = `
                ${product.name}
                <span class="product-price">${product.price.toFixed(2)} €</span>
            `;
            productBtn.onclick = () => {
                console.log(`Producto ${product.name} clicado en el modal`);
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
                saveToLocalStorage();
            };
            modalProductList.appendChild(productBtn);
        });
    }

    // Funciones para manejar familias
    addFamilyBtn.onclick = () => {
        console.log("Botón Añadir Familia clicado");
        familyModalTitle.textContent = "Añadir Familia";
        document.getElementById("family-name").value = "";
        document.getElementById("family-id").value = "";
        familyModal.style.display = "flex";
    };

    closeFamilyModal.onclick = () => {
        console.log("Botón Cerrar Modal Familia clicado");
        familyModal.style.display = "none";
    };

    familyForm.onsubmit = (e) => {
        e.preventDefault();
        console.log("Formulario de Familia enviado");
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
            if (!selectedFamilyId) selectedFamilyId = newFamily.id;
            if (!modalSelectedFamilyId) modalSelectedFamilyId = newFamily.id;
        }

        familyModal.style.display = "none";
        renderFamilies();
        renderModalFamilies();
        saveToLocalStorage();
    };

    function editFamily(id) {
        console.log(`Botón Editar Familia ${id} clicado`);
        const family = families.find(f => f.id === id);
        familyModalTitle.textContent = "Editar Familia";
        document.getElementById("family-name").value = family.name;
        document.getElementById("family-id").value = family.id;
        familyModal.style.display = "flex";
    }

    function deleteFamily(id) {
        console.log(`Botón Eliminar Familia ${id} clicado`);
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
            saveToLocalStorage();
        }
    }

    // Funciones para manejar productos
    addProductBtn.onclick = () => {
        console.log("Botón Añadir Producto clicado");
        if (!selectedFamilyId) {
            alert("Por favor, crea una familia primero.");
            return;
        }
        productModalTitle.textContent = "Añadir Producto";
        document.getElementById("product-name").value = "";
        document.getElementById("product-price").value = "";
        document.getElementById("product-id").value = "";
        document.getElementById("product-family").value = selectedFamilyId;
        productModal.style.display = "flex";
    };

    closeProductModal.onclick = () => {
        console.log("Botón Cerrar Modal Producto clicado");
        productModal.style.display = "none";
    };

    productForm.onsubmit = (e) => {
        e.preventDefault();
        console.log("Formulario de Producto enviado");
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
        saveToLocalStorage();
    };

    function editProduct(id) {
        console.log(`Botón Editar Producto ${id} clicado`);
        const product = products.find(p => p.id === id);
        productModalTitle.textContent = "Editar Producto";
        document.getElementById("product-name").value = product.name;
        document.getElementById("product-price").value = product.price;
        document.getElementById("product-id").value = product.id;
        document.getElementById("product-family").value = product.familyId;
        productModal.style.display = "flex";
    }

    function deleteProduct(id) {
        console.log(`Botón Eliminar Producto ${id} clicado`);
        if (confirm("¿Estás seguro de que deseas eliminar este producto?")) {
            products = products.filter(p => p.id !== id);
            tables.forEach(table => {
                table.products = table.products.filter(item => item.productId !== id);
            });
            renderProducts();
            renderTables();
            renderTicketTable();
            renderModalProducts();
            saveToLocalStorage();
        }
    }

    // Funciones para manejar mesas
    addTableBtn.onclick = () => {
        console.log("Botón Añadir Mesa clicado");
        const newTableId = tables.length ? Math.max(...tables.map(t => t.id)) + 1 : 1;
        const newTableName = `Mesa ${newTableId}`;
        const newTable = {
            id: newTableId,
            name: newTableName,
            products: []
        };
        tables.push(newTable);
        renderTables();
        saveToLocalStorage();
    };

    function editTable(id) {
        console.log(`Botón Editar Mesa ${id} clicado`);
        const table = tables.find(t => t.id === id);
        const newName = prompt("Introduce el nuevo nombre de la mesa:", table.name);
        if (newName) {
            table.name = newName;
            renderTables();
            if (selectedTableId === id) {
                tableProductsModalTitle.textContent = `Añadir Productos a ${table.name}`;
            }
            saveToLocalStorage();
        }
    }

    function deleteTable(id) {
        console.log(`Botón Eliminar Mesa ${id} clicado`);
        if (confirm("¿Estás seguro de que deseas eliminar esta mesa?")) {
            tables = tables.filter(t => t.id !== id);
            if (selectedTableId === id) {
                selectedTableId = null;
                tableProductsModal.style.display = "none";
            }
            renderTables();
            renderTicketTable();
            saveToLocalStorage();
        }
    }

    function openTableProductsModal() {
        if (!selectedTableId) return;
        console.log(`Abriendo modal para Mesa ${selectedTableId}`);
        const table = tables.find(t => t.id === selectedTableId);
        tableProductsModalTitle.textContent = `Añadir Productos a ${table.name}`;
        modalSelectedFamilyId = families.length ? families[0].id : null;
        renderModalFamilies();
        renderModalProducts();
        renderTableProductsList();
        tableProductsModal.style.display = "flex";
    }

    closeTableProductsModal.onclick = () => {
        console.log("Botón Cerrar Modal Mesa clicado");
        tableProductsModal.style.display = "none";
    };

    function removeProductFromTable(index) {
        console.log(`Botón Eliminar Producto de Mesa (índice ${index}) clicado`);
        const table = tables.find(t => t.id === selectedTableId);
        table.products.splice(index, 1);
        renderTableProductsList();
        renderTables();
        renderTicketTable();
        saveToLocalStorage();
    }

    generateTicketBtn.onclick = () => {
        console.log("Botón Generar Ticket clicado");
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
            if (!product) return;
            const importe = item.quantity * product.price;
            total += importe;
            ticket += `${product.name} x${item.quantity}: ${importe.toFixed(2)} €\n`;
        });
        ticket += "------------------------\n";
        ticket += `Total: ${total.toFixed(2)} €`;

        alert(ticket);
    };

    clearTableBtn.onclick = () => {
        console.log("Botón Limpiar Mesa clicado");
        if (confirm("¿Estás seguro de que deseas limpiar esta mesa?")) {
            const table = tables.find(t => t.id === selectedTableId);
            table.products = [];
            renderTableProductsList();
            renderTables();
            renderTicketTable();
            saveToLocalStorage();
        }
    };

    // Inicializar la interfaz
    renderFamilies();
    renderProducts();
    renderTables();
    renderTicketTable();
});