document.addEventListener("DOMContentLoaded", function() {
    const apiUrl = 'https://669a77e99ba098ed61ffc202.mockapi.io/products/cars';
    const carForm = document.getElementById('carForm');
    const carList = document.getElementById('carList');
    const carIdInput = document.getElementById('carId');
    const carNameInput = document.getElementById('carName');
    const carModelInput = document.getElementById('carModel');

    
    async function fetchCars() {
        const response = await fetch(apiUrl);
        const cars = await response.json();
        carList.innerHTML = '';
        cars.forEach(car => {
            const li = document.createElement('li');
            li.className = 'car-item';
            li.innerHTML = `
                <span>${car.name} (${car.model})</span>
                <div>
                    <button onclick="editCar(${car.id})">Edit</button>
                    <button onclick="deleteCar(${car.id})">Delete</button>
                </div>
            `;
            carList.appendChild(li);
        });
    }

    carForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const id = carIdInput.value;
        const name = carNameInput.value;
        const model = carModelInput.value;
        const method = id ? 'PUT' : 'POST';
        const url = id ? `${apiUrl}/${id}` : apiUrl;
        const response = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, model })
        });
        if (response.ok) {
            carForm.reset();
            fetchCars();
        }
    });

   
    window.editCar = async function(id) {
        const response = await fetch(`${apiUrl}/${id}`);
        const car = await response.json();
        carIdInput.value = car.id;
        carNameInput.value = car.name;
        carModelInput.value = car.model;
        carForm.querySelector('button').textContent = 'Update Car';
    }

    
    window.deleteCar = async function(id) {
        if (confirm('Are you sure you want to delete this car?')) {
            const response = await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
            if (response.ok) {
                fetchCars();
            }
        }
    }

    fetchCars();
});
