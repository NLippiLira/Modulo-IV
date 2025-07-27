// Generador de IDs de personajes
function* characterIdGenerator(start, end) {
    for (let i = start; i <= end; i++) {
        yield i;
    }
}

document.querySelectorAll('.range').forEach(range => {
    let loading = false;

    range.addEventListener('mouseenter', async () => {
        if (loading) return;
        loading = true;

        const [start, end] = range.getAttribute('data-range').split('-').map(Number);
        const infoDiv = document.getElementById(`info-${start}-${end}`);
        if (!infoDiv) return;

        // Evita repetir personajes si ya están cargados
        if (infoDiv.childElementCount >= end - start + 1) return;

        const generator = characterIdGenerator(start, end);
        let next = generator.next();

        while (!next.done) {
            const id = next.value;
            try {
                const response = await fetch(`https://swapi.dev/api/people/${id}/`);
                if (!response.ok) throw new Error('Error al cargar personaje');

                const data = await response.json();
                const characterDiv = document.createElement('div');
                characterDiv.classList.add('character');

                let iconClass = 'red';
                if (start >= 6 && start <= 11) iconClass = 'green';
                else if (start >= 12 && start <= 17) iconClass = 'yellow';

                characterDiv.innerHTML = `
                    <span class="icon ${iconClass}">
                        ${iconClass === 'red' ? '🔴' : iconClass === 'green' ? '🟢' : '🟡'}
                    </span>
                    <div>
                        <p><strong>Nombre:</strong> ${data.name}</p>
                        <p><strong>Estatura:</strong> ${data.height} cm</p>
                        <p><strong>Peso:</strong> ${data.mass} kg</p>
                    </div>
                `;

                infoDiv.appendChild(characterDiv);
            } catch (error) {
                console.error(error);
                break;
            }

            next = generator.next();
        }

        loading = false;
    });

    range.addEventListener('mouseleave', () => {
        const [start, end] = range.getAttribute('data-range').split('-').map(Number);
        const infoDiv = document.getElementById(`info-${start}-${end}`);
        if (infoDiv) {
            infoDiv.innerHTML = ''; // Limpia los personajes al salir
        }
    });
});
