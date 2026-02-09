document.addEventListener('DOMContentLoaded', () => {
    const logoContainer = document.querySelector('.logo-3d-container');
    const logoCard = document.querySelector('.logo-card');

    if (logoContainer && logoCard) {
        logoContainer.addEventListener('mousemove', (e) => {
            const rect = logoContainer.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Calculate rotation based on cursor position relative to center
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -15; // Max 15deg rotation
            const rotateY = ((x - centerX) / centerX) * 15;

            logoCard.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        logoContainer.addEventListener('mouseleave', () => {
            // Reset to center
            logoCard.style.transform = 'rotateX(0deg) rotateY(0deg)';
        });
    }

    // Contact Form Webhook Integration
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerText;

            // Loading state
            submitBtn.disabled = true;
            submitBtn.innerText = 'Enviando...';
            submitBtn.classList.add('opacity-75', 'cursor-not-allowed');

            const formData = {
                name: document.getElementById('name').value,
                business: document.getElementById('business').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('country-code').value + ' ' + document.getElementById('phone').value,
                message: document.getElementById('message').value,
                timestamp: new Date().toISOString()
            };

            try {
                const response = await fetch('https://n8n.dimotic.uk/webhook/dimotic', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData)
                });

                if (response.ok) {
                    // Success feedback
                    submitBtn.innerText = '¡Mensaje Enviado!';
                    submitBtn.classList.remove('from-brand', 'to-brand-light');
                    submitBtn.classList.add('bg-green-600', 'hover:bg-green-700');
                    contactForm.reset();

                    setTimeout(() => {
                        submitBtn.innerText = originalBtnText;
                        submitBtn.disabled = false;
                        submitBtn.classList.remove('opacity-75', 'cursor-not-allowed', 'bg-green-600', 'hover:bg-green-700');
                        submitBtn.classList.add('from-brand', 'to-brand-light');
                    }, 5000);
                } else {
                    throw new Error('Network response was not ok');
                }
            } catch (error) {
                console.error('Error:', error);
                submitBtn.innerText = 'Error al enviar. Intenta de nuevo.';
                submitBtn.classList.remove('from-brand', 'to-brand-light');
                submitBtn.classList.add('bg-red-600', 'hover:bg-red-700');

                setTimeout(() => {
                    submitBtn.innerText = originalBtnText;
                    submitBtn.disabled = false;
                    submitBtn.classList.remove('opacity-75', 'cursor-not-allowed', 'bg-red-600', 'hover:bg-red-700');
                    submitBtn.classList.add('from-brand', 'to-brand-light');
                }, 3000);
            }
        });
    }
});
