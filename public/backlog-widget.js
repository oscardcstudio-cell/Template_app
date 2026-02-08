/* ==========================================
 * BACKLOG WIDGET - JavaScript Component
 * ==========================================
 * Ajouter ce script en bas de toutes tes pages HTML
 */

(function () {
    'use strict';

    let isBug = false;
    let itemCount = 0;

    // Créer le widget HTML
    function createWidget() {
        const widgetHTML = `
            <div class="backlog-widget">
                <button class="backlog-toggle" id="backlogToggle">
                    📝
                </button>
                
                <div class="backlog-panel" id="backlogPanel">
                    <div class="backlog-header">
                        <h3>Ajouter une tâche</h3>
                        <button class="backlog-close" id="backlogClose">×</button>
                    </div>
                    
                    <div class="backlog-form">
                        <textarea 
                            class="backlog-input" 
                            id="backlogInput" 
                            placeholder="Décris l'idée ou le bug..." 
                            rows="3"
                        ></textarea>
                        
                        <div class="backlog-options">
                            <div class="toggle-container">
                                <div class="toggle-switch" id="bugToggle"></div>
                                <span class="toggle-label" id="toggleLabel">💡 Idée</span>
                            </div>
                        </div>
                        
                        <button class="backlog-submit" id="backlogSubmit">
                            ✅ Ajouter
                        </button>
                    </div>
                    
                    <div class="backlog-count" id="backlogCount">
                        0 tâche(s) en attente
                    </div>
                    
                    <a href="/backlog.html" class="backlog-view-all">
                        📋 Voir toutes les tâches
                    </a>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', widgetHTML);
    }

    // Initialiser les event listeners
    function initEvents() {
        const toggle = document.getElementById('backlogToggle');
        const panel = document.getElementById('backlogPanel');
        const close = document.getElementById('backlogClose');
        const bugToggle = document.getElementById('bugToggle');
        const toggleLabel = document.getElementById('toggleLabel');
        const submit = document.getElementById('backlogSubmit');
        const input = document.getElementById('backlogInput');

        // Toggle panel
        toggle.addEventListener('click', () => {
            panel.classList.toggle('show');
        });

        // Close panel
        close.addEventListener('click', () => {
            panel.classList.remove('show');
        });

        // Toggle bug/idea
        bugToggle.addEventListener('click', () => {
            isBug = !isBug;
            if (isBug) {
                bugToggle.classList.add('active');
                toggleLabel.textContent = '🐛 Bug';
            } else {
                bugToggle.classList.remove('active');
                toggleLabel.textContent = '💡 Idée';
            }
        });

        // Submit
        submit.addEventListener('click', async () => {
            const text = input.value.trim();
            if (!text) {
                alert('Entre une description !');
                return;
            }

            try {
                const response = await fetch('/api/backlog', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        text,
                        type: isBug ? 'bug' : 'idea'
                    })
                });

                if (response.ok) {
                    input.value = '';
                    isBug = false;
                    bugToggle.classList.remove('active');
                    toggleLabel.textContent = '💡 Idée';

                    showNotification('Ajouté au backlog ! 🎉');
                    loadCount();

                    setTimeout(() => {
                        panel.classList.remove('show');
                    }, 1000);
                }
            } catch (error) {
                console.error('Erreur ajout backlog:', error);
                alert('Erreur lors de l\'ajout');
            }
        });

        // Enter to submit
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && e.ctrlKey) {
                submit.click();
            }
        });
    }

    // Charger le nombre de tâches
    async function loadCount() {
        try {
            const response = await fetch('/api/backlog');
            const data = await response.json();
            itemCount = data.items ? data.items.filter(i => !i.completed).length : 0;

            const countEl = document.getElementById('backlogCount');
            if (countEl) {
                countEl.textContent = `${itemCount} tâche(s) en attente`;
            }
        } catch (error) {
            console.error('Erreur chargement count:', error);
        }
    }

    // Afficher une notification
    function showNotification(message) {
        const notif = document.createElement('div');
        notif.className = 'notification';
        notif.textContent = message;
        document.body.appendChild(notif);

        setTimeout(() => {
            notif.remove();
        }, 3000);
    }

    // Initialiser au chargement de la page
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            createWidget();
            initEvents();
            loadCount();
        });
    } else {
        createWidget();
        initEvents();
        loadCount();
    }
})();
