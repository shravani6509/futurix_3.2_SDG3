// Global data storage
let healthRecords = [];
let charts = {};

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeMockData();
    initializeCharts();
    initializeForm();
    updateDashboardStats();
    populateRecentEntries();
    initializeFilters();
});

// Navigation
function initializeNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Update active nav item
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
            
            // Show corresponding section
            const section = this.dataset.section;
            document.querySelectorAll('.content-section').forEach(sec => {
                sec.classList.remove('active');
            });
            document.getElementById(section).classList.add('active');
        });
    });
}

// Initialize mock data
function initializeMockData() {
    const regions = ['north', 'south', 'east', 'west'];
    const statuses = ['healthy', 'moderate', 'severe'];
    const names = ['Aarav Kumar', 'Priya Singh', 'Ravi Sharma', 'Anjali Patel', 'Sanjay Reddy', 'Meera Gupta', 'Vikram Joshi', 'Neha Verma'];
    
    for (let i = 0; i < 50; i++) {
        const age = Math.floor(Math.random() * 60) + 1;
        const weight = (Math.random() * 15 + 3).toFixed(1);
        const height = (Math.random() * 40 + 50).toFixed(1);
        const muac = (Math.random() * 5 + 10).toFixed(1);
        
        healthRecords.push({
            id: i + 1,
            name: names[Math.floor(Math.random() * names.length)],
            age: age,
            gender: Math.random() > 0.5 ? 'male' : 'female',
            region: regions[Math.floor(Math.random() * regions.length)],
            weight: parseFloat(weight),
            height: parseFloat(height),
            muac: parseFloat(muac),
            nutritionStatus: statuses[Math.floor(Math.random() * statuses.length)],
            date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        });
    }
}

// Update dashboard statistics
function updateDashboardStats() {
    document.getElementById('totalChildren').textContent = healthRecords.length;
    
    const atRisk = healthRecords.filter(r => r.nutritionStatus === 'severe' || r.nutritionStatus === 'moderate').length;
    document.getElementById('atRiskCount').textContent = atRisk;
    
    const healthyCount = healthRecords.filter(r => r.nutritionStatus === 'healthy').length;
    const avgScore = ((healthyCount / healthRecords.length) * 100).toFixed(1);
    document.getElementById('avgNutriScore').textContent = avgScore + '%';
    
    document.getElementById('interventionsCount').textContent = Math.floor(atRisk * 0.6);
    
    // Predictions
    const severeCount = healthRecords.filter(r => r.nutritionStatus === 'severe').length;
    document.getElementById('nextMonthPrediction').textContent = Math.floor(severeCount * 1.08);
    document.getElementById('threeMonthTrend').textContent = '-12%';
    document.getElementById('highRiskRegions').textContent = '2';
}

// Initialize all charts
function initializeCharts() {
    initializeTrendsChart();
    initializeRiskChart();
    initializeAgeGroupChart();
    initializeIndicatorsChart();
    initializePredictionChart();
    initializeRegionalChart();
    initializeYoYChart();
    initializeHeatmap();
}

// Trends Chart
function initializeTrendsChart() {
    const ctx = document.getElementById('trendsChart').getContext('2d');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    
    charts.trends = new Chart(ctx, {
        type: 'line',
        data: {
            labels: months,
            datasets: [
                {
                    label: 'Severe',
                    data: [15, 18, 14, 12, 10, 8],
                    borderColor: '#f5576c',
                    backgroundColor: 'rgba(245, 87, 108, 0.1)',
                    tension: 0.4,
                    fill: true
                },
                {
                    label: 'Moderate',
                    data: [25, 28, 22, 20, 18, 15],
                    borderColor: '#fbbf24',
                    backgroundColor: 'rgba(251, 191, 36, 0.1)',
                    tension: 0.4,
                    fill: true
                },
                {
                    label: 'Healthy',
                    data: [60, 54, 64, 68, 72, 77],
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    tension: 0.4,
                    fill: true
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        usePointStyle: true,
                        padding: 15,
                        font: { size: 12, weight: '600' }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: '#f1f5f9' },
                    ticks: { font: { size: 11 } }
                },
                x: {
                    grid: { display: false },
                    ticks: { font: { size: 11 } }
                }
            }
        }
    });
}

// Risk Distribution Chart
function initializeRiskChart() {
    const ctx = document.getElementById('riskChart').getContext('2d');
    const severeCases = healthRecords.filter(r => r.nutritionStatus === 'severe').length;
    const moderateCases = healthRecords.filter(r => r.nutritionStatus === 'moderate').length;
    const healthyCases = healthRecords.filter(r => r.nutritionStatus === 'healthy').length;
    
    charts.risk = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Healthy', 'Moderate', 'Severe'],
            datasets: [{
                data: [healthyCases, moderateCases, severeCases],
                backgroundColor: ['#10b981', '#fbbf24', '#f5576c'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        usePointStyle: true,
                        padding: 15,
                        font: { size: 12, weight: '600' }
                    }
                }
            }
        }
    });
}

// Age Group Chart
function initializeAgeGroupChart() {
    const ctx = document.getElementById('ageGroupChart').getContext('2d');
    const ageGroups = ['0-12', '13-24', '25-36', '37-48', '49-60'];
    
    const groupedData = ageGroups.map(group => {
        const [min, max] = group.split('-').map(Number);
        return healthRecords.filter(r => r.age >= min && r.age <= max).length;
    });
    
    charts.ageGroup = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ageGroups.map(g => g + ' months'),
            datasets: [{
                label: 'Children Count',
                data: groupedData,
                backgroundColor: [
                    '#667eea',
                    '#f5576c',
                    '#4facfe',
                    '#43e97b',
                    '#fbbf24'
                ],
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: '#f1f5f9' },
                    ticks: { font: { size: 11 } }
                },
                x: {
                    grid: { display: false },
                    ticks: { font: { size: 11 } }
                }
            }
        }
    });
}

// Nutritional Indicators Chart
function initializeIndicatorsChart() {
    const ctx = document.getElementById('indicatorsChart').getContext('2d');
    
    charts.indicators = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['Weight-for-Age', 'Height-for-Age', 'Weight-for-Height', 'MUAC', 'BMI'],
            datasets: [{
                label: 'Current',
                data: [72, 68, 75, 70, 73],
                borderColor: '#667eea',
                backgroundColor: 'rgba(102, 126, 234, 0.2)',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        usePointStyle: true,
                        padding: 15,
                        font: { size: 12, weight: '600' }
                    }
                }
            },
            scales: {
                r: {
                    beginAtZero: true,
                    max: 100,
                    ticks: { stepSize: 20, font: { size: 10 } },
                    grid: { color: '#f1f5f9' }
                }
            }
        }
    });
}

// Prediction Chart
function initializePredictionChart() {
    const ctx = document.getElementById('predictionChart').getContext('2d');
    
    charts.prediction = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [
                {
                    label: 'Historical Data',
                    data: [15, 18, 14, 12, 10, 8, null, null, null, null, null, null],
                    borderColor: '#667eea',
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    tension: 0.4,
                    fill: true
                },
                {
                    label: 'Predicted Values',
                    data: [null, null, null, null, null, 8, 7, 6, 5, 4, 4, 3],
                    borderColor: '#f5576c',
                    backgroundColor: 'rgba(245, 87, 108, 0.1)',
                    tension: 0.4,
                    fill: true,
                    borderDash: [5, 5]
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: '#f1f5f9' },
                    ticks: { font: { size: 11 } }
                },
                x: {
                    grid: { display: false },
                    ticks: { font: { size: 11 } }
                }
            }
        }
    });
}

// Regional Chart
function initializeRegionalChart() {
    const ctx = document.getElementById('regionalChart').getContext('2d');
    const regions = ['North', 'South', 'East', 'West'];
    
    const regionalData = regions.map(region => {
        return healthRecords.filter(r => r.region === region.toLowerCase()).length;
    });
    
    charts.regional = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: regions,
            datasets: [
                {
                    label: 'Healthy',
                    data: regions.map(r => {
                        const regionRecords = healthRecords.filter(rec => rec.region === r.toLowerCase());
                        return regionRecords.filter(rec => rec.nutritionStatus === 'healthy').length;
                    }),
                    backgroundColor: '#10b981'
                },
                {
                    label: 'Moderate',
                    data: regions.map(r => {
                        const regionRecords = healthRecords.filter(rec => rec.region === r.toLowerCase());
                        return regionRecords.filter(rec => rec.nutritionStatus === 'moderate').length;
                    }),
                    backgroundColor: '#fbbf24'
                },
                {
                    label: 'Severe',
                    data: regions.map(r => {
                        const regionRecords = healthRecords.filter(rec => rec.region === r.toLowerCase());
                        return regionRecords.filter(rec => rec.nutritionStatus === 'severe').length;
                    }),
                    backgroundColor: '#f5576c'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        usePointStyle: true,
                        padding: 15,
                        font: { size: 12, weight: '600' }
                    }
                }
            },
            scales: {
                y: {
                    stacked: true,
                    beginAtZero: true,
                    grid: { color: '#f1f5f9' },
                    ticks: { font: { size: 11 } }
                },
                x: {
                    stacked: true,
                    grid: { display: false },
                    ticks: { font: { size: 11 } }
                }
            }
        }
    });
}

// Year-over-Year Chart
function initializeYoYChart() {
    const ctx = document.getElementById('yoyChart').getContext('2d');
    
    charts.yoy = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Q1', 'Q2', 'Q3', 'Q4'],
            datasets: [
                {
                    label: '2024',
                    data: [42, 38, 35, 30],
                    borderColor: '#cbd5e1',
                    backgroundColor: 'rgba(203, 213, 225, 0.1)',
                    tension: 0.4
                },
                {
                    label: '2025',
                    data: [38, 32, 28, 22],
                    borderColor: '#667eea',
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    tension: 0.4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        usePointStyle: true,
                        padding: 15,
                        font: { size: 12, weight: '600' }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: '#f1f5f9' },
                    ticks: { font: { size: 11 } }
                },
                x: {
                    grid: { display: false },
                    ticks: { font: { size: 11 } }
                }
            }
        }
    });
}

// Heatmap
function initializeHeatmap() {
    const container = document.getElementById('heatmapContainer');
    const regions = ['North', 'South', 'East', 'West'];
    const ageGroups = ['0-12m', '13-24m', '25-36m', '37-48m', '49-60m'];
    
    // Create header row
    const headerCell = document.createElement('div');
    headerCell.className = 'heatmap-cell';
    headerCell.style.background = 'transparent';
    headerCell.style.color = '#475569';
    headerCell.style.fontWeight = '600';
    container.appendChild(headerCell);
    
    ageGroups.forEach(age => {
        const cell = document.createElement('div');
        cell.className = 'heatmap-cell';
        cell.style.background = '#f1f5f9';
        cell.style.color = '#475569';
        cell.style.fontWeight = '600';
        cell.textContent = age;
        container.appendChild(cell);
    });
    
    // Create data rows
    regions.forEach(region => {
        const labelCell = document.createElement('div');
        labelCell.className = 'heatmap-cell';
        labelCell.style.background = '#f1f5f9';
        labelCell.style.color = '#475569';
        labelCell.style.fontWeight = '600';
        labelCell.textContent = region;
        container.appendChild(labelCell);
        
        ageGroups.forEach(() => {
            const value = Math.floor(Math.random() * 100);
            const cell = document.createElement('div');
            cell.className = 'heatmap-cell';
            cell.textContent = value + '%';
            
            if (value >= 75) {
                cell.style.background = '#10b981';
            } else if (value >= 50) {
                cell.style.background = '#fbbf24';
            } else {
                cell.style.background = '#f5576c';
            }
            
            container.appendChild(cell);
        });
    });
}

// Form handling
function initializeForm() {
    const form = document.getElementById('healthForm');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const newRecord = {
            id: healthRecords.length + 1,
            name: document.getElementById('childName').value,
            age: parseInt(document.getElementById('childAge').value),
            gender: document.getElementById('childGender').value,
            region: document.getElementById('region').value,
            weight: parseFloat(document.getElementById('weight').value),
            height: parseFloat(document.getElementById('height').value),
            muac: parseFloat(document.getElementById('muac').value) || 0,
            nutritionStatus: document.getElementById('nutritionStatus').value,
            date: new Date().toISOString().split('T')[0]
        };
        
        healthRecords.push(newRecord);
        
        // Show success message
        const successMsg = document.getElementById('successMessage');
        successMsg.classList.add('show');
        setTimeout(() => {
            successMsg.classList.remove('show');
        }, 3000);
        
        // Reset form
        form.reset();
        
        // Update dashboard
        updateDashboardStats();
        populateRecentEntries();
        updateCharts();
    });
}

// Populate recent entries table
function populateRecentEntries() {
    const tbody = document.getElementById('entriesTableBody');
    tbody.innerHTML = '';
    
    const recentRecords = healthRecords.slice(-10).reverse();
    
    recentRecords.forEach(record => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${record.name}</td>
            <td>${record.age}m</td>
            <td>${record.region.charAt(0).toUpperCase() + record.region.slice(1)}</td>
            <td>${record.weight} kg</td>
            <td>${record.height} cm</td>
            <td><span class="status-badge ${record.nutritionStatus}">${record.nutritionStatus.charAt(0).toUpperCase() + record.nutritionStatus.slice(1)}</span></td>
            <td>${record.date}</td>
        `;
        tbody.appendChild(row);
    });
}

// Update charts with new data
function updateCharts() {
    // Update risk chart
    const severeCases = healthRecords.filter(r => r.nutritionStatus === 'severe').length;
    const moderateCases = healthRecords.filter(r => r.nutritionStatus === 'moderate').length;
    const healthyCases = healthRecords.filter(r => r.nutritionStatus === 'healthy').length;
    
    charts.risk.data.datasets[0].data = [healthyCases, moderateCases, severeCases];
    charts.risk.update();
    
    // Update age group chart
    const ageGroups = ['0-12', '13-24', '25-36', '37-48', '49-60'];
    const groupedData = ageGroups.map(group => {
        const [min, max] = group.split('-').map(Number);
        return healthRecords.filter(r => r.age >= min && r.age <= max).length;
    });
    
    charts.ageGroup.data.datasets[0].data = groupedData;
    charts.ageGroup.update();
}

// Initialize filters
function initializeFilters() {
    const timeFilter = document.getElementById('timeFilter');
    timeFilter.addEventListener('change', function() {
        console.log('Time filter changed to:', this.value);
        // Implement filtering logic here
    });
    
    const regionFilter = document.getElementById('regionFilter');
    regionFilter.addEventListener('change', function() {
        console.log('Region filter changed to:', this.value);
        // Implement regional filtering logic here
    });
}

// Export report
function generateReport(type) {
    alert(`Generating ${type} report... This feature would export data to PDF/Excel format.`);
    console.log(`Report type: ${type}`);
    
    // In a real application, this would:
    // 1. Collect relevant data based on report type
    // 2. Format data appropriately
    // 3. Use a library like jsPDF or xlsx to generate files
    // 4. Trigger download
}

// Export button in header
document.getElementById('exportBtn').addEventListener('click', function() {
    generateReport('monthly');
});