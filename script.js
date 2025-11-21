// Variables globales
let patients = [];
let inventory = {
    med1: 100,
    med2: 100,
    med1Initial: 100,
    med2Initial: 100
};

// Función para categorizar paciente según presión arterial
function categorizePatient(systolic, diastolic) {
    const s = parseInt(systolic);
    const d = parseInt(diastolic);

    // Validar rangos específicos según la tabla
    
    // Hipertensión (presión muy baja) - SOLO MEDICAMENTO 2
    if (s < 69 && d < 48) {
        return { category: 'hipertensión', medicationType: 'Medicamento 2', med1Doses: 0, med2Doses: 6 };
    }
    
    // Óptima [69-98] y [48-66]
    if (s >= 69 && s <= 98 && d >= 48 && d <= 66) {
        return { category: 'Optima', medicationType: 'Ninguno', med1Doses: 0, med2Doses: 0 };
    }
    
    // Común [98-143] y [66-92]
    if (s > 98 && s <= 143 && d > 66 && d <= 92) {
        return { category: 'Común', medicationType: 'Ninguno', med1Doses: 0, med2Doses: 0 };
    }
    
    // Pre HTA [143-177] y [92-124] - SOLO MEDICAMENTO 1
    if (s > 143 && s <= 177 && d > 92 && d <= 124) {
        return { category: 'Pre HTA', medicationType: 'Medicamento 1', med1Doses: 6, med2Doses: 0 };
    }
    
    // HTAG1 [177-198] y [124-142] - SOLO MEDICAMENTO 1
    if (s > 177 && s <= 198 && d > 124 && d <= 142) {
        return { category: 'HTAG1', medicationType: 'Medicamento 1', med1Doses: 10, med2Doses: 0 };
    }
    
    // HTAG2 [198-246] y [142-169] - SOLO MEDICAMENTO 1
    if (s > 198 && s <= 246 && d > 142 && d <= 169) {
        return { category: 'HTAG2', medicationType: 'Medicamento 1', med1Doses: 18, med2Doses: 0 };
    }
    
    // HTAG3 >= 246 o >= 169 - SOLO MEDICAMENTO 1
    if (s > 246 || d > 169) {
        return { category: 'HTAG3', medicationType: 'Medicamento 1', med1Doses: 35, med2Doses: 0 };
    }
    
    // HTASS >= 162 y < 86 - SOLO MEDICAMENTO 1
    if (s >= 162 && d < 86) {
        return { category: 'HTASS', medicationType: 'Medicamento 1', med1Doses: 17, med2Doses: 0 };
    }
    
    // Si no coincide con ningún rango, retornar null
    return null;
}

// Función para verificar disponibilidad de inventario
function checkInventoryAvailability(med1Needed, med2Needed) {
    if (med1Needed > 0 && inventory.med1 < med1Needed) {
        return { available: false, message: 'Inventario insuficiente de Medicamento 1' };
    }
    if (med2Needed > 0 && inventory.med2 < med2Needed) {
        return { available: false, message: 'Inventario insuficiente de Medicamento 2' };
    }
    return { available: true };
}

// Función para actualizar inventario
function updateInventory(med1Used, med2Used) {
    inventory.med1 -= med1Used;
    inventory.med2 -= med2Used;
    
    // Actualizar display del inventario
    updateInventoryDisplay();
}

// Función para actualizar display del inventario
function updateInventoryDisplay() {
    // Medicamento 1
    const med1Percentage = ((inventory.med1 / inventory.med1Initial) * 100).toFixed(2);
    document.getElementById('med1Stock').textContent = inventory.med1;
    document.getElementById('med1StockPercentage').textContent = `${med1Percentage}% en stock`;
    document.getElementById('med1Progress').style.width = `${med1Percentage}%`;
    
    // Actualizar estado y color del medicamento 1
    const med1Status = document.getElementById('med1Status');
    const med1Progress = document.getElementById('med1Progress');
    
    if (inventory.med1 === 0) {
        med1Status.textContent = 'Agotado';
        med1Status.className = 'inventory-badge out';
        med1Progress.className = 'progress-fill critical';
    } else if (med1Percentage <= 20) {
        med1Status.textContent = 'Crítico';
        med1Status.className = 'inventory-badge critical';
        med1Progress.className = 'progress-fill critical';
    } else if (med1Percentage <= 50) {
        med1Status.textContent = 'Bajo';
        med1Status.className = 'inventory-badge low';
        med1Progress.className = 'progress-fill low';
    } else {
        med1Status.textContent = 'Disponible';
        med1Status.className = 'inventory-badge available';
        med1Progress.className = 'progress-fill';
    }
    
    // Medicamento 2
    const med2Percentage = ((inventory.med2 / inventory.med2Initial) * 100).toFixed(2);
    document.getElementById('med2Stock').textContent = inventory.med2;
    document.getElementById('med2StockPercentage').textContent = `${med2Percentage}% en stock`;
    document.getElementById('med2Progress').style.width = `${med2Percentage}%`;
    
    // Actualizar estado y color del medicamento 2
    const med2Status = document.getElementById('med2Status');
    const med2Progress = document.getElementById('med2Progress');
    
    if (inventory.med2 === 0) {
        med2Status.textContent = 'Agotado';
        med2Status.className = 'inventory-badge out';
        med2Progress.className = 'progress-fill critical';
    } else if (med2Percentage <= 20) {
        med2Status.textContent = 'Crítico';
        med2Status.className = 'inventory-badge critical';
        med2Progress.className = 'progress-fill critical';
    } else if (med2Percentage <= 50) {
        med2Status.textContent = 'Bajo';
        med2Status.className = 'inventory-badge low';
        med2Progress.className = 'progress-fill low';
    } else {
        med2Status.textContent = 'Disponible';
        med2Status.className = 'inventory-badge available';
        med2Progress.className = 'progress-fill';
    }
}

// Función para agregar paciente
function addPatient() {
    const systolicBP = document.getElementById('systolicBP').value;
    const diastolicBP = document.getElementById('diastolicBP').value;

    // Validar que los campos no estén vacíos
    if (!systolicBP || !diastolicBP) {
        alert('Por favor ingrese ambos valores de presión arterial');
        return;
    }

    // Validar que sean números positivos
    if (parseInt(systolicBP) < 0 || parseInt(diastolicBP) < 0) {
        alert('Los valores de presión arterial deben ser positivos');
        return;
    }

    // Categorizar paciente
    const patientData = categorizePatient(systolicBP, diastolicBP);

    // Mostrar alerta si los valores no están clasificados
    if (!patientData) {
        showWarningAlert();
        return;
    }

    // Verificar disponibilidad de inventario
    const inventoryCheck = checkInventoryAvailability(patientData.med1Doses, patientData.med2Doses);
    if (!inventoryCheck.available) {
        alert(inventoryCheck.message + '. No se puede registrar el paciente.');
        return;
    }

    // Ocultar alerta de advertencia si estaba visible
    hideWarningAlert();

    // Agregar paciente al array
    const newPatient = {
        id: patients.length + 1,
        systolic: parseInt(systolicBP),
        diastolic: parseInt(diastolicBP),
        category: patientData.category,
        medicationType: patientData.medicationType,
        med1Doses: patientData.med1Doses,
        med2Doses: patientData.med2Doses,
        totalDoses: patientData.med1Doses + patientData.med2Doses
    };

    patients.push(newPatient);

    // Actualizar inventario
    updateInventory(patientData.med1Doses, patientData.med2Doses);

    // Actualizar interfaz
    updateResults();
    updateTable();
    
    // Limpiar campos
    document.getElementById('systolicBP').value = '';
    document.getElementById('diastolicBP').value = '';
    
    // Ocultar alerta de información
    document.getElementById('infoAlert').style.display = 'none';
}

// Función para mostrar alerta de advertencia
function showWarningAlert() {
    const warningAlert = document.getElementById('warningAlert');
    warningAlert.style.display = 'flex';
    
    // Scroll suave hacia la alerta
    warningAlert.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    // Auto-ocultar después de 5 segundos
    setTimeout(() => {
        hideWarningAlert();
    }, 5000);
}

// Función para ocultar alerta de advertencia
function hideWarningAlert() {
    document.getElementById('warningAlert').style.display = 'none';
}

// Función para calcular y actualizar resultados
function updateResults() {
    const totalPatients = patients.length;
    
    // Contar pacientes que reciben medicamento 1
    const med1Patients = patients.filter(p => p.med1Doses > 0).length;
    
    // Contar pacientes que reciben medicamento 2
    const med2Patients = patients.filter(p => p.med2Doses > 0).length;
    
    // Calcular porcentajes con 2 decimales
    const med1Percentage = totalPatients > 0 ? ((med1Patients / totalPatients) * 100).toFixed(2) : '0.00';
    const med2Percentage = totalPatients > 0 ? ((med2Patients / totalPatients) * 100).toFixed(2) : '0.00';

    // Actualizar el DOM
    document.getElementById('totalPatients').textContent = totalPatients;
    document.getElementById('med1Patients').textContent = med1Patients;
    document.getElementById('med2Patients').textContent = med2Patients;


    // Mostrar sección de resultados
    document.getElementById('resultsSection').style.display = 'block';
}

// Función para actualizar tabla de pacientes
function updateTable() {
    const tbody = document.getElementById('patientsTableBody');
    tbody.innerHTML = '';

    patients.forEach((patient, index) => {
        const row = document.createElement('tr');
        
        // Determinar clase de badge según categoría
        let badgeClass = 'badge ';
        if (patient.category.includes('HTAG')) {
            badgeClass += 'badge-red';
        } else if (patient.category === 'Pre HTA') {
            badgeClass += 'badge-yellow';
        } else if (patient.category === 'hipertensión') {
            badgeClass += 'badge-orange';
        } else {
            badgeClass += 'badge-green';
        }

        row.innerHTML = `
            <td><strong>${patient.id}</strong></td>
            <td>${patient.systolic}</td>
            <td>${patient.diastolic}</td>
            <td><span class="${badgeClass}">${patient.category}</span></td>
            <td>${patient.medicationType}</td>
            <td><strong>${patient.totalDoses}</strong></td>
        `;

        tbody.appendChild(row);
    });

    // Mostrar tabla
    document.getElementById('tableSection').style.display = 'block';
}

// Función para reiniciar el sistema
function resetSystem() {
    if (patients.length > 0) {
        const confirmReset = confirm('¿Está seguro que desea reiniciar el sistema? Se perderán todos los datos registrados y se restablecerá el inventario.');
        if (!confirmReset) {
            return;
        }
    }
    
    // Reiniciar variables
    patients = [];
    inventory.med1 = inventory.med1Initial;
    inventory.med2 = inventory.med2Initial;
    
    // Actualizar interfaz
    document.getElementById('systolicBP').value = '';
    document.getElementById('diastolicBP').value = '';
    document.getElementById('resultsSection').style.display = 'none';
    document.getElementById('tableSection').style.display = 'none';
    document.getElementById('infoAlert').style.display = 'flex';
    document.getElementById('warningAlert').style.display = 'none';
    document.getElementById('patientsTableBody').innerHTML = '';
    
    // Actualizar inventario
    updateInventoryDisplay();
}

// Permitir envío con Enter
document.addEventListener('DOMContentLoaded', function() {
    const inputs = document.querySelectorAll('input[type="number"]');
    inputs.forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                addPatient();
            }
        });
    });
    
    // Inicializar display del inventario
    updateInventoryDisplay();
});