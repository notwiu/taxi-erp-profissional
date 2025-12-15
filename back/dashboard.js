// Dashboard específico para o TaxiControl PRO

// Inicializar dashboard
function initializeDashboard() {
    updateRealTimeStats();
    loadRecentActivity();
    initializeVehicleMap();
    setupQuickActions();
}

// Atualizar estatísticas em tempo real
function updateRealTimeStats() {
    // Simular atualização de dados em tempo real
    setInterval(() => {
        // Atualizar contadores
        const pendingRides = Math.floor(Math.random() * 5) + 1;
        const activeDrivers = Math.floor(Math.random() * 5) + 18;
        
        // Atualizar elementos se existirem
        const pendingElement = document.getElementById('pending-rides');
        const driversElement = document.getElementById('active-drivers');
        
        if (pendingElement) pendingElement.textContent = pendingRides;
        if (driversElement) driversElement.textContent = activeDrivers;
    }, 30000); // Atualizar a cada 30 segundos
}

// Carregar atividade recente
function loadRecentActivity() {
    const activityData = [
        {
            type: 'ride',
            driver: 'Maria Santos',
            action: 'finalizou uma corrida',
            amount: 'R$ 32,50',
            time: '2 minutos atrás',
            icon: 'fa-route'
        },
        {
            type: 'maintenance',
            vehicle: 'DEF-5678',
            action: 'entrou em manutenção',
            details: 'Troca de pneus',
            time: '15 minutos atrás',
            icon: 'fa-tools'
        },
        {
            type: 'payment',
            driver: 'Carlos Oliveira',
            action: 'realizou um pagamento',
            amount: 'R$ 280,00',
            time: '1 hora atrás',
            icon: 'fa-money-bill-wave'
        },
        {
            type: 'new',
            driver: 'Ana Pereira',
            action: 'cadastrou-se no sistema',
            time: '3 horas atrás',
            icon: 'fa-user-plus'
        }
    ];
    
    const activityList = document.getElementById('activity-list');
    if (activityList) {
        activityList.innerHTML = activityData.map(item => `
            <div class="activity-item ${item.type}">
                <div class="activity-icon">
                    <i class="fas ${item.icon}"></i>
                </div>
                <div class="activity-content">
                    <p><strong>${item.driver || item.vehicle}</strong> ${item.action}</p>
                    ${item.amount ? `<span class="activity-amount">${item.amount}</span>` : ''}
                    ${item.details ? `<small>${item.details}</small>` : ''}
                    <span class="activity-time">${item.time}</span>
                </div>
            </div>
        `).join('');
    }
}

// Inicializar mapa de veículos (simulado)
function initializeVehicleMap() {
    const mapContainer = document.getElementById('vehicle-map');
    if (!mapContainer) return;
    
    // Simular posições de veículos
    const vehicles = [
        { id: 1, plate: 'ABC-1234', lat: -23.5505, lng: -46.6333, status: 'active' },
        { id: 2, plate: 'DEF-5678', lat: -23.5605, lng: -46.6433, status: 'active' },
        { id: 3, plate: 'GHI-9012', lat: -23.5705, lng: -46.6533, status: 'maintenance' },
        { id: 4, plate: 'JKL-3456', lat: -23.5805, lng: -46.6633, status: 'inactive' }
    ];
    
    // Em uma implementação real, usaria Google Maps ou Leaflet
    mapContainer.innerHTML = `
        <div class="map-placeholder">
            <i class="fas fa-map-marked-alt"></i>
            <h3>Mapa de Rastreamento</h3>
            <p>${vehicles.filter(v => v.status === 'active').length} veículos ativos no momento</p>
            <div class="vehicle-dots">
                ${vehicles.map(vehicle => `
                    <div class="vehicle-dot ${vehicle.status}" 
                         style="left: ${50 + Math.random() * 40}%; 
                                top: ${50 + Math.random() * 40}%;"
                         title="${vehicle.plate}">
                        <i class="fas fa-car"></i>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

// Configurar ações rápidas
function setupQuickActions() {
    const quickActions = document.querySelectorAll('.quick-action-btn');
    
    quickActions.forEach(button => {
        button.addEventListener('click', function() {
            const action = this.querySelector('span').textContent;
            
            switch(action) {
                case 'Nova Corrida':
                    showRideForm();
                    break;
                case 'Novo Motorista':
                    showDriverForm();
                    break;
                case 'Novo Veículo':
                    showVehicleForm();
                    break;
                case 'Lançar Despesa':
                    showExpenseForm();
                    break;
                case 'Relatório Diário':
                    generateDailyReport();
                    break;
                case 'Escala do Dia':
                    showSchedule();
                    break;
            }
        });
    });
}

// Mostrar formulário de corrida
function showRideForm() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3><i class="fas fa-route"></i> Nova Corrida</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <form id="new-ride-form">
                    <div class="form-row">
                        <div class="form-group">
                            <label>Motorista</label>
                            <select required>
                                <option value="">Selecione um motorista</option>
                                <option value="1">João Silva</option>
                                <option value="2">Maria Santos</option>
                                <option value="3">Carlos Oliveira</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Veículo</label>
                            <select required>
                                <option value="">Selecione um veículo</option>
                                <option value="1">ABC-1234 (Corolla)</option>
                                <option value="2">DEF-5678 (Civic)</option>
                                <option value="3">GHI-9012 (Onix)</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label>Origem</label>
                        <input type="text" placeholder="Local de partida" required>
                    </div>
                    
                    <div class="form-group">
                        <label>Destino</label>
                        <input type="text" placeholder="Local de destino" required>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label>Distância (km)</label>
                            <input type="number" step="0.1" placeholder="0.0" required>
                        </div>
                        <div class="form-group">
                            <label>Valor (R$)</label>
                            <input type="number" step="0.01" placeholder="0.00" required>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label>Observações</label>
                        <textarea placeholder="Observações adicionais..."></textarea>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button class="btn-secondary" onclick="closeModal()">Cancelar</button>
                <button class="btn-primary" onclick="saveNewRide()">Salvar Corrida</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Fechar modal
    modal.querySelector('.modal-close').addEventListener('click', closeModal);
    modal.addEventListener('click', function(e) {
        if (e.target === this) closeModal();
    });
}

// Fechar modal
function closeModal() {
    const modal = document.querySelector('.modal');
    if (modal) {
        modal.classList.add('fade-out');
        setTimeout(() => {
            document.body.removeChild(modal);
        }, 300);
    }
}

// Salvar nova corrida
function saveNewRide() {
    const form = document.getElementById('new-ride-form');
    if (form.checkValidity()) {
        showLoading('Salvando corrida...');
        
        // Simular salvamento
        setTimeout(() => {
            closeModal();
            showAlert('Corrida cadastrada com sucesso!', 'success');
            
            // Atualizar dashboard
            updateDashboardStats();
        }, 1500);
    } else {
        form.reportValidity();
    }
}

// Gerar relatório diário
function generateDailyReport() {
    showLoading('Gerando relatório...');
    
    setTimeout(() => {
        const reportData = {
            date: new Date().toLocaleDateString('pt-BR'),
            totalRides: 47,
            totalRevenue: 2850.00,
            averageRide: 60.64,
            activeDrivers: 22,
            activeVehicles: 18,
            topDriver: 'João Silva',
            topDriverRevenue: 450.00
        };
        
        // Criar relatório em nova janela
        const reportWindow = window.open('', '_blank');
        reportWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Relatório Diário - ${reportData.date}</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 40px; }
                    h1 { color: #2d5be3; }
                    .report-header { text-align: center; margin-bottom: 40px; }
                    .stats-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin: 30px 0; }
                    .stat-box { background: #f5f7fb; padding: 20px; border-radius: 8px; border-left: 4px solid #2d5be3; }
                    .stat-value { font-size: 24px; font-weight: bold; color: #2d5be3; }
                    .footer { margin-top: 50px; text-align: center; color: #666; }
                </style>
            </head>
            <body>
                <div class="report-header">
                    <h1>Relatório Diário - TaxiControl PRO</h1>
                    <p>Data: ${reportData.date}</p>
                </div>
                
                <div class="stats-grid">
                    <div class="stat-box">
                        <h3>Total de Corridas</h3>
                        <div class="stat-value">${reportData.totalRides}</div>
                    </div>
                    <div class="stat-box">
                        <h3>Faturamento Total</h3>
                        <div class="stat-value">R$ ${reportData.totalRevenue.toFixed(2)}</div>
                    </div>
                    <div class="stat-box">
                        <h3>Ticket Médio</h3>
                        <div class="stat-value">R$ ${reportData.averageRide.toFixed(2)}</div>
                    </div>
                    <div class="stat-box">
                        <h3>Motoristas Ativos</h3>
                        <div class="stat-value">${reportData.activeDrivers}</div>
                    </div>
                </div>
                
                <div class="highlight">
                    <h2>Destaque do Dia</h2>
                    <p>Motorista com maior faturamento: <strong>${reportData.topDriver}</strong></p>
                    <p>Faturamento: <strong>R$ ${reportData.topDriverRevenue.toFixed(2)}</strong></p>
                </div>
                
                <div class="footer">
                    <p>Relatório gerado automaticamente pelo TaxiControl PRO</p>
                    <p>© ${new Date().getFullYear()} - Sistema ERP para Gestão de Frota de Táxis</p>
                </div>
            </body>
            </html>
        `);
        reportWindow.document.close();
        
        showAlert('Relatório gerado com sucesso!', 'success');
    }, 2000);
}

// Inicializar quando a página carregar
if (document.querySelector('.dashboard-page')) {
    document.addEventListener('DOMContentLoaded', initializeDashboard);
}