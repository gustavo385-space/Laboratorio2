// Variables globales
let patients = [];

// Función para categorizar paciente según presión arterial
function categorizePatient(systolic, diastolic) {
    const s = parseInt(systolic);
    const d = parseInt(diastolic);

    // Hipertensión (presión muy baja)
    if (s < 69 || d < 48) {
        return { category: 'hipertensión', type: 2, doses: 6 };
    }
    
    // Óptima
    if (s >= 69 && s <= 98 && d >= 48 && d <= 66) {
        return { category: 'Optima', type: 0, doses: 0 };
    }
    
    // Común
    if (s >= 98 && s <= 143 && d >= 66 && d <= 92) {
        return { category: 'Común', type: 0, doses: 0 };
    }
    
    // Pre HTA
    if (s >= 143 && s <= 177 && d >= 92 && d <= 124) {
        return { category: 'Pre HTA', type: 1, doses: 6 };
    }
    
    // HTAG1
    if (s >= 177 && s <= 198 && d >= 124 && d <= 142) {
        return { category: 'HTAG1', type: 1, doses: 10 };
    }
    
    // HTAG2
    if (s >= 198 && s <= 246 && d >= 142 && d <= 169) {
        return { category: 'HTAG2', type: 1, doses: 18 };
    }
    
    // HTAG3
    if (s >= 246 || d >= 169) {
        return { category: 'HTAG3', type: 1, doses: 35 };
    }
    
    // HTASS
    if (s >= 162 && d < 86) {
        return { category: 'HTASS', type: 1, doses: 17 };
    }
    
    return null;
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

    // Categorizar paciente
    const patientData = categorizePatient(systolicBP, diastolicBP);

    if (!patientData) {
        alert('No se encontró la categoría del paciente en el registro.');
        return;
    }

    // Agregar paciente al array
    const newPatient = {
        id: patients.length + 1,
        systolic: parseInt(systolicBP),
        diastolic: parseInt(diastolicBP),
        category: patientData.category,
        type: patientData.type,
        doses: patientData.doses
    };

    patients.push(newPatient);

    // Actualizar interfaz
    updateResults();
    updateTable();
    
    // Limpiar campos
    document.getElementById('systolicBP').value = '';
    document.getElementById('diastolicBP').value = '';
    
    // Ocultar alerta de información
    document.getElementById('infoAlert').style.display = 'none';
}

// Función para calcular y actualizar resultados
function updateResults() {
    const totalPatients = patients.length;
    
    // Contar pacientes que reciben medicamento 1 (type 1 o 2)
    const med1Patients = patients.filter(p => p.type === 1 || p.type === 2).length;
    
    // Contar pacientes que reciben medicamento 2 (solo type 2)
    const med2Patients = patients.filter(p => p.type === 2).length;
    
    // Calcular porcentajes
    const med1Percentage = totalPatients > 0 ? ((med1Patients / totalPatients) * 100).toFixed(2) : '0.00';
    const med2Percentage = totalPatients > 0 ? ((med2Patients / totalPatients) * 100).toFixed(2) : '0.00';

    // Actualizar el DOM
    document.getElementById('totalPatients').textContent = totalPatients;
    document.getElementById('med1Patients').textContent = med1Patients;
    document.getElementById('med2Patients').textContent = med2Patients;
    document.getElementById('med1Percentage').textContent = `(${med1Percentage}%)`;
    document.getElementById('med2Percentage').textContent = `(${med2Percentage}%)`;

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

        // Determinar tipo de medicamento
        let medicationType = '';
        if (patient.type === 0) {
            medicationType = 'Ninguno';
        } else if (patient.type === 1) {
            medicationType = 'Medicamento 1';
        } else if (patient.type === 2) {
            medicationType = 'Medicamentos 1 y 2';
        }

        row.innerHTML = `
            <td><strong>${patient.id}</strong></td>
            <td>${patient.systolic}</td>
            <td>${patient.diastolic}</td>
            <td><span class="${badgeClass}">${patient.category}</span></td>
            <td>${medicationType}</td>
            <td><strong>${patient.doses}</strong></td>
        `;

        tbody.appendChild(row);
    });

    // Mostrar tabla
    document.getElementById('tableSection').style.display = 'block';
}

// Función para reiniciar el sistema
function resetSystem() {
    patients = [];
    document.getElementById('systolicBP').value = '';
    document.getElementById('diastolicBP').value = '';
    document.getElementById('resultsSection').style.display = 'none';
    document.getElementById('tableSection').style.display = 'none';
    document.getElementById('infoAlert').style.display = 'flex';
    document.getElementById('patientsTableBody').innerHTML = '';
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
});