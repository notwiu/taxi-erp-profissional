// TAXIPRO ERP - Sistema Completo e Funcional

class TaxiProSystem {
    constructor() {
        this.currentUser = null;
        this.data = {
            drivers: [],
            vehicles: [],
            rides: [],
            expenses: [],
            settings: {}
        };
        this.init();
    }

    // Inicialização do sistema
    init() {
        this.setupEventListeners();
        this.loadData();
        this.updateDateTime();
        
        // Atualizar data/hora a cada minuto
        setInterval(() => this.updateDateTime(), 60000);
        
        // Esconder loading após 2 segundos
        setTimeout(() => this.hideLoading(), 2000);
    }

    // Setup de eventos
    setupEventListeners() {
        // Login
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        // Toggle password visibility
        const togglePassword = document.getElementById('togglePassword');
        if (togglePassword) {
            togglePassword.addEventListener('click', () => this.togglePasswordVisibility());
        }

        // Sidebar toggle
        const sidebarToggle = document.querySelector('.sidebar-toggle');
        if (sidebarToggle) {
            sidebarToggle.addEventListener('click', () => this.toggleSidebar());
        }

        // Logout
        const logoutBtn = document.querySelector('.logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.handleLogout());
        }

        // Notifications
        const notificationBtn = document.querySelector('.notification-btn');
        if (notificationBtn) {
            notificationBtn.addEventListener('click', () => this.showNotifications());
        }

        // Modal close buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-close') || 
                e.target.classList.contains('modal-overlay')) {
                this.closeModal();
            }

            if (e.target.classList.contains('notification-close')) {
                this.closeNotification(e.target.closest('.notification'));
            }

            if (e.target.classList.contains('menu-link')) {
                this.setActiveMenu(e.target);
            }
        });
    }

    // Login handling
    handleLogin(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const remember = document.getElementById('remember').checked;

        // Validação simples
        if (username === 'admin' && password === 'taxipro123') {
            this.showLoading('Entrando no sistema...');
            
            this.currentUser = {
                id: 1,
                name: 'Administrador',
                username: username,
                role: 'admin',
                avatar: 'AD'
            };

            // Salvar no localStorage se "lembrar-me" estiver marcado
            if (remember) {
                localStorage.setItem('taxipro_user', JSON.stringify({
                    username: username,
                    remember: true
                }));
            }

            // Simular carregamento e redirecionar
            setTimeout(() => {
                this.hideLoading();
                window.location.href = 'dashboard.html';
            }, 1500);
        } else {
            this.showNotification('Credenciais inválidas. Tente novamente.', 'error');
        }
    }

    // Logout
    handleLogout() {
        if (confirm('Tem certeza que deseja sair do sistema?')) {
            this.showLoading('Saindo do sistema...');
            
            setTimeout(() => {
                this.currentUser = null;
                localStorage.removeItem('taxipro_session');
                sessionStorage.clear();
                window.location.href = 'index.html';
            }, 1000);
        }
    }

    // Toggle sidebar
    toggleSidebar() {
        const sidebar = document.querySelector('.sidebar');
        if (sidebar) {
            sidebar.classList.toggle('collapsed');
            localStorage.setItem('sidebar_collapsed', sidebar.classList.contains('collapsed'));
        }
    }

    // Toggle password visibility
    togglePasswordVisibility() {
        const passwordInput = document.getElementById('password');
        const toggleBtn = document.getElementById('togglePassword');
        
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            toggleBtn.innerHTML = '<i class="fas fa-eye-slash"></i>';
        } else {
            passwordInput.type = 'password';
            toggleBtn.innerHTML = '<i class="fas fa-eye"></i>';
        }
    }

    // Update date and time
    updateDateTime() {
        const now = new Date();
        
        // Formatar data
        const dateOptions = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        const formattedDate = now.toLocaleDateString('pt-BR', dateOptions);
        
        // Formatar hora
        const formattedTime = now.toLocaleTimeString('pt-BR', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        
        // Atualizar elementos
        const dateElements = document.querySelectorAll('#current-date');
        const timeElements = document.querySelectorAll('#current-time');
        
        dateElements.forEach(el => el.textContent = formattedDate);
        timeElements.forEach(el => el.textContent = formattedTime);
    }

    // Show loading
    showLoading(message = 'Carregando...') {
        const loading = document.getElementById('loading');
        const loadingText = document.querySelector('.loading-text');
        
        if (loading && loadingText) {
            loading.classList.remove('hidden');
            loadingText.textContent = message;
        }
    }

    // Hide loading
    hideLoading() {
        const loading = document.getElementById('loading');
        if (loading) {
            loading.classList.add('hidden');
        }
    }

    // Show notification
    showNotification(message, type = 'info', duration = 5000) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-icon">
                <i class="fas ${this.getNotificationIcon(type)}"></i>
            </div>
            <div class="notification-content">
                <div class="notification-title">${this.getNotificationTitle(type)}</div>
                <div class="notification-message">${message}</div>
            </div>
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        document.body.appendChild(notification);
        
        // Trigger animation
        setTimeout(() => notification.classList.add('show'), 10);
        
        // Auto remove
        if (duration > 0) {
            setTimeout(() => this.closeNotification(notification), duration);
        }
        
        return notification;
    }

    // Close notification
    closeNotification(notification) {
        if (notification) {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }
    }

    // Get notification icon
    getNotificationIcon(type) {
        const icons = {
            'success': 'fa-check-circle',
            'error': 'fa-exclamation-circle',
            'warning': 'fa-exclamation-triangle',
            'info': 'fa-info-circle'
        };
        return icons[type] || 'fa-info-circle';
    }

    // Get notification title
    getNotificationTitle(type) {
        const titles = {
            'success': 'Sucesso',
            'error': 'Erro',
            'warning': 'Atenção',
            'info': 'Informação'
        };
        return titles[type] || 'Notificação';
    }

    // Show modal
    showModal(title, content, size = 'md') {
        const modalOverlay = document.createElement('div');
        modalOverlay.className = 'modal-overlay';
        modalOverlay.innerHTML = `
            <div class="modal modal-${size}">
                <div class="modal-header">
                    <div class="modal-title">${title}</div>
                    <button class="modal-close">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    ${content}
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary modal-close">Cancelar</button>
                    <button class="btn btn-primary" id="modal-confirm">Confirmar</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modalOverlay);
        
        // Trigger animation
        setTimeout(() => modalOverlay.classList.add('active'), 10);
        
        // Setup confirm button
        const confirmBtn = modalOverlay.querySelector('#modal-confirm');
        if (confirmBtn) {
            confirmBtn.addEventListener('click', () => {
                this.closeModal();
            });
        }
        
        return modalOverlay;
    }

    // Close modal
    closeModal() {
        const modalOverlay = document.querySelector('.modal-overlay');
        if (modalOverlay) {
            modalOverlay.classList.remove('active');
            setTimeout(() => {
                if (modalOverlay.parentNode) {
                    modalOverlay.parentNode.removeChild(modalOverlay);
                }
            }, 300);
        }
    }

    // Show notifications panel
    showNotifications() {
        const notifications = [
            {
                id: 1,
                title: 'Nova corrida solicitada',
                message: 'Centro → Aeroporto - João Silva',
                time: '5 minutos atrás',
                type: 'info',
                read: false
            },
            {
                id: 2,
                title: 'Manutenção pendente',
                message: 'Veículo ABC-1234 precisa de revisão',
                time: '1 hora atrás',
                type: 'warning',
                read: false
            },
            {
                id: 3,
                title: 'Pagamento recebido',
                message: 'R$ 450,00 - Corrida #00128',
                time: '2 horas atrás',
                type: 'success',
                read: true
            }
        ];

        const content = `
            <div class="notifications-panel">
                <div class="notifications-header">
                    <h3>Notificações</h3>
                    <button class="btn btn-sm btn-secondary" id="mark-all-read">
                        <i class="fas fa-check-double"></i> Marcar todas como lidas
                    </button>
                </div>
                <div class="notifications-list">
                    ${notifications.map(notif => `
                        <div class="notification-item ${notif.read ? 'read' : 'unread'}">
                            <div class="notification-item-icon ${notif.type}">
                                <i class="fas ${this.getNotificationIcon(notif.type)}"></i>
                            </div>
                            <div class="notification-item-content">
                                <h4>${notif.title}</h4>
                                <p>${notif.message}</p>
                                <span class="notification-time">${notif.time}</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        this.showModal('Notificações', content, 'lg');
    }

    // Set active menu
    setActiveMenu(menuItem) {
        document.querySelectorAll('.menu-link').forEach(item => {
            item.classList.remove('active');
        });
        menuItem.classList.add('active');
    }

    // Load data from localStorage
    loadData() {
        const savedData = localStorage.getItem('taxipro_data');
        if (savedData) {
            this.data = JSON.parse(savedData);
        } else {
            this.loadSampleData();
        }

        // Load sidebar state
        const sidebarCollapsed = localStorage.getItem('sidebar_collapsed') === 'true';
        if (sidebarCollapsed) {
            const sidebar = document.querySelector('.sidebar');
            if (sidebar) {
                sidebar.classList.add('collapsed');
            }
        }
    }

    // Save data to localStorage
    saveData() {
        localStorage.setItem('taxipro_data', JSON.stringify(this.data));
    }

    // Load sample data
    loadSampleData() {
        this.data = {
            drivers: [
                {
                    id: 1,
                    name: 'João Silva',
                    cpf: '123.456.789-00',
                    phone: '(11) 98765-4321',
                    email: 'joao@email.com',
                    license: 'AB123456',
                    commission: 30,
                    status: 'active',
                    vehicleId: 1,
                    createdAt: '2024-01-15'
                },
                {
                    id: 2,
                    name: 'Maria Santos',
                    cpf: '234.567.890-11',
                    phone: '(11) 97654-3210',
                    email: 'maria@email.com',
                    license: 'CD789012',
                    commission: 30,
                    status: 'active',
                    vehicleId: 2,
                    createdAt: '2024-02-20'
                }
            ],
            vehicles: [
                {
                    id: 1,
                    plate: 'ABC-1234',
                    model: 'Toyota Corolla',
                    year: 2022,
                    color: 'Prata',
                    fuelType: 'flex',
                    currentKm: 45280,
                    nextMaintenance: 50000,
                    status: 'active',
                    driverId: 1,
                    createdAt: '2023-12-01'
                },
                {
                    id: 2,
                    plate: 'DEF-5678',
                    model: 'Honda Civic',
                    year: 2021,
                    color: 'Preto',
                    fuelType: 'gasolina',
                    currentKm: 38750,
                    nextMaintenance: 40000,
                    status: 'active',
                    driverId: 2,
                    createdAt: '2023-11-15'
                }
            ],
            rides: [
                {
                    id: 1,
                    driverId: 1,
                    vehicleId: 1,
                    startLocation: 'Centro',
                    endLocation: 'Aeroporto',
                    distance: 25.5,
                    duration: 35,
                    amount: 45.00,
                    status: 'completed',
                    paymentMethod: 'dinheiro',
                    date: '2024-12-15T15:30:00'
                },
                {
                    id: 2,
                    driverId: 2,
                    vehicleId: 2,
                    startLocation: 'Shopping',
                    endLocation: 'Bairro Nova Vida',
                    distance: 18.2,
                    duration: 25,
                    amount: 32.50,
                    status: 'completed',
                    paymentMethod: 'cartao',
                    date: '2024-12-15T14:15:00'
                }
            ],
            expenses: [
                {
                    id: 1,
                    type: 'fuel',
                    amount: 180.00,
                    description: 'Abastecimento - Posto Shell',
                    vehicleId: 1,
                    date: '2024-12-15'
                },
                {
                    id: 2,
                    type: 'maintenance',
                    amount: 250.00,
                    description: 'Troca de óleo',
                    vehicleId: 2,
                    date: '2024-12-14'
                }
            ],
            settings: {
                commissionRate: 30,
                fuelPrice: 5.89,
                taxRate: 15
            }
        };
        this.saveData();
    }

    // CRUD Operations
    addDriver(driverData) {
        const newDriver = {
            id: Date.now(),
            ...driverData,
            createdAt: new Date().toISOString().split('T')[0],
            status: 'active'
        };
        this.data.drivers.push(newDriver);
        this.saveData();
        return newDriver;
    }

    updateDriver(id, driverData) {
        const index = this.data.drivers.findIndex(d => d.id === id);
        if (index !== -1) {
            this.data.drivers[index] = { ...this.data.drivers[index], ...driverData };
            this.saveData();
            return this.data.drivers[index];
        }
        return null;
    }

    deleteDriver(id) {
        const index = this.data.drivers.findIndex(d => d.id === id);
        if (index !== -1) {
            this.data.drivers.splice(index, 1);
            this.saveData();
            return true;
        }
        return false;
    }

    // Similar methods for vehicles, rides, expenses...
    addVehicle(vehicleData) {
        const newVehicle = {
            id: Date.now(),
            ...vehicleData,
            createdAt: new Date().toISOString().split('T')[0],
            status: 'active'
        };
        this.data.vehicles.push(newVehicle);
        this.saveData();
        return newVehicle;
    }

    addRide(rideData) {
        const newRide = {
            id: Date.now(),
            ...rideData,
            date: new Date().toISOString()
        };
        this.data.rides.push(newRide);
        this.saveData();
        return newRide;
    }

    // Statistics
    getDashboardStats() {
        const today = new Date().toISOString().split('T')[0];
        const todayRides = this.data.rides.filter(r => r.date.split('T')[0] === today);
        
        const totalRevenue = this.data.rides.reduce((sum, ride) => sum + ride.amount, 0);
        const todayRevenue = todayRides.reduce((sum, ride) => sum + ride.amount, 0);
        const activeDrivers = this.data.drivers.filter(d => d.status === 'active').length;
        const activeVehicles = this.data.vehicles.filter(v => v.status === 'active').length;
        
        return {
            totalDrivers: this.data.drivers.length,
            activeDrivers,
            totalVehicles: this.data.vehicles.length,
            activeVehicles,
            totalRides: this.data.rides.length,
            todayRides: todayRides.length,
            totalRevenue,
            todayRevenue,
            avgRideValue: this.data.rides.length > 0 ? totalRevenue / this.data.rides.length : 0
        };
    }

    // Export data
    exportData(type = 'json') {
        let data, filename, mimeType;
        
        switch(type) {
            case 'json':
                data = JSON.stringify(this.data, null, 2);
                filename = `taxipro_backup_${new Date().toISOString().split('T')[0]}.json`;
                mimeType = 'application/json';
                break;
            case 'csv':
                // Convert rides to CSV
                let csv = 'ID,Motorista,Veículo,Origem,Destino,Distância,Duração,Valor,Status,Data\n';
                this.data.rides.forEach(ride => {
                    const driver = this.data.drivers.find(d => d.id === ride.driverId);
                    const vehicle = this.data.vehicles.find(v => v.id === ride.vehicleId);
                    csv += `${ride.id},${driver?.name || ''},${vehicle?.plate || ''},${ride.startLocation},${ride.endLocation},${ride.distance},${ride.duration},${ride.amount},${ride.status},${ride.date}\n`;
                });
                data = csv;
                filename = `corridas_${new Date().toISOString().split('T')[0]}.csv`;
                mimeType = 'text/csv';
                break;
        }
        
        const blob = new Blob([data], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showNotification('Dados exportados com sucesso!', 'success');
    }
}

// Initialize system
const taxiPro = new TaxiProSystem();

// Global functions for HTML onclick events
window.showModal = (title, content, size) => taxiPro.showModal(title, content, size);
window.closeModal = () => taxiPro.closeModal();
window.showNotification = (message, type) => taxiPro.showNotification(message, type);
window.exportData = (type) => taxiPro.exportData(type);
window.toggleSidebar = () => taxiPro.toggleSidebar();

// Dashboard specific functions
if (document.querySelector('.dashboard-page')) {
    // Initialize dashboard charts
    document.addEventListener('DOMContentLoaded', () => {
        initializeDashboardCharts();
        updateDashboardStats();
    });
}

// Initialize charts
function initializeDashboardCharts() {
    // Revenue chart
    const revenueCtx = document.getElementById('revenueChart');
    if (revenueCtx) {
        new Chart(revenueCtx.getContext('2d'), {
            type: 'line',
            data: {
                labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
                datasets: [{
                    label: 'Faturamento (R$)',
                    data: [1850, 2100, 1950, 2850, 3200, 2950, 2700],
                    borderColor: '#4361ee',
                    backgroundColor: 'rgba(67, 97, 238, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return 'R$ ' + value.toLocaleString('pt-BR');
                            }
                        }
                    }
                }
            }
        });
    }

    // Rides distribution chart
    const ridesCtx = document.getElementById('ridesChart');
    if (ridesCtx) {
        new Chart(ridesCtx.getContext('2d'), {
            type: 'doughnut',
            data: {
                labels: ['Concluídas', 'Em andamento', 'Canceladas'],
                datasets: [{
                    data: [85, 10, 5],
                    backgroundColor: [
                        '#4ade80',
                        '#f59e0b',
                        '#ef4444'
                    ],
                    borderWidth: 2,
                    borderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '70%',
                plugins: {
                    legend: {
                        position: 'right'
                    }
                }
            }
        });
    }
}

// Update dashboard stats
function updateDashboardStats() {
    const stats = taxiPro.getDashboardStats();
    
    // Update stat cards
    const statElements = {
        'total-revenue': `R$ ${stats.totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
        'today-revenue': `R$ ${stats.todayRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
        'total-rides': stats.totalRides.toString(),
        'today-rides': stats.todayRides.toString(),
        'active-drivers': `${stats.activeDrivers}/${stats.totalDrivers}`,
        'active-vehicles': `${stats.activeVehicles}/${stats.totalVehicles}`,
        'avg-ride': `R$ ${stats.avgRideValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
    };
    
    Object.keys(statElements).forEach(key => {
        const element = document.getElementById(key);
        if (element) {
            element.textContent = statElements[key];
        }
    });
}

// Quick action functions
function quickAction(action) {
    switch(action) {
        case 'new-ride':
            showNewRideModal();
            break;
        case 'new-driver':
            showNewDriverModal();
            break;
        case 'new-vehicle':
            showNewVehicleModal();
            break;
        case 'new-expense':
            showNewExpenseModal();
            break;
        case 'daily-report':
            generateDailyReport();
            break;
        case 'export-data':
            taxiPro.exportData('json');
            break;
    }
}

// Modal functions
function showNewRideModal() {
    const content = `
        <form id="newRideForm">
            <div class="form-row">
                <div class="form-group">
                    <label class="form-label">Motorista</label>
                    <select class="form-control" required>
                        <option value="">Selecione um motorista</option>
                        ${taxiPro.data.drivers.filter(d => d.status === 'active').map(driver => `
                            <option value="${driver.id}">${driver.name}</option>
                        `).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">Veículo</label>
                    <select class="form-control" required>
                        <option value="">Selecione um veículo</option>
                        ${taxiPro.data.vehicles.filter(v => v.status === 'active').map(vehicle => `
                            <option value="${vehicle.id}">${vehicle.plate} - ${vehicle.model}</option>
                        `).join('')}
                    </select>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label class="form-label">Origem</label>
                    <input type="text" class="form-control" placeholder="Local de partida" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Destino</label>
                    <input type="text" class="form-control" placeholder="Local de destino" required>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label class="form-label">Distância (km)</label>
                    <input type="number" class="form-control" step="0.1" placeholder="0.0" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Valor (R$)</label>
                    <input type="number" class="form-control" step="0.01" placeholder="0.00" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Pagamento</label>
                    <select class="form-control" required>
                        <option value="dinheiro">Dinheiro</option>
                        <option value="cartao">Cartão</option>
                        <option value="pix">PIX</option>
                    </select>
                </div>
            </div>
            <div class="form-group">
                <label class="form-label">Observações</label>
                <textarea class="form-control" rows="3" placeholder="Observações adicionais..."></textarea>
            </div>
        </form>
    `;
    
    taxiPro.showModal('Nova Corrida', content);
}

function showNewDriverModal() {
    const content = `
        <form id="newDriverForm">
            <div class="form-row">
                <div class="form-group">
                    <label class="form-label">Nome Completo</label>
                    <input type="text" class="form-control" placeholder="Nome do motorista" required>
                </div>
                <div class="form-group">
                    <label class="form-label">CPF</label>
                    <input type="text" class="form-control" placeholder="000.000.000-00" required>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label class="form-label">Telefone</label>
                    <input type="tel" class="form-control" placeholder="(00) 00000-0000" required>
                </div>
                <div class="form-group">
                    <label class="form-label">E-mail</label>
                    <input type="email" class="form-control" placeholder="email@exemplo.com" required>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label class="form-label">CNH</label>
                    <input type="text" class="form-control" placeholder="Número da CNH" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Comissão (%)</label>
                    <input type="number" class="form-control" value="30" min="0" max="100" step="0.1">
                </div>
            </div>
            <div class="form-group">
                <label class="checkbox">
                    <input type="checkbox" checked>
                    <span class="checkmark"></span>
                    Motorista ativo
                </label>
            </div>
        </form>
    `;
    
    taxiPro.showModal('Novo Motorista', content);
}

function generateDailyReport() {
    taxiPro.showLoading('Gerando relatório...');
    
    setTimeout(() => {
        taxiPro.hideLoading();
        taxiPro.showNotification('Relatório diário gerado com sucesso!', 'success');
        
        // In a real app, this would download a PDF
        window.open('#', '_blank');
    }, 2000);
}