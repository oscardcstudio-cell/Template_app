// État du wizard
let currentStep = 1;
const totalSteps = 5;
const secrets = [];

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    updateProgress();

    // Event listener pour afficher/masquer le token
    document.getElementById('showToken').addEventListener('change', (e) => {
        const tokenInput = document.getElementById('githubToken');
        tokenInput.type = e.target.checked ? 'text' : 'password';
    });

    // Event listener pour le bouton copier
    document.getElementById('copyBtn').addEventListener('click', () => {
        const projectName = document.getElementById('projectName').value;
        if (projectName) {
            navigator.clipboard.writeText(projectName).then(() => {
                const btn = document.getElementById('copyBtn');
                const originalText = btn.innerHTML;
                btn.innerHTML = '✅';
                setTimeout(() => btn.innerHTML = originalText, 2000);
            });
        }
    });

    // Event listener pour activer/désactiver GitHub
    document.getElementById('enableGithub').addEventListener('change', (e) => {
        const isEnabled = e.target.checked;
        const githubSection = document.getElementById('githubSection');
        const githubTokenSection = document.getElementById('githubTokenSection');
        const githubSkippedMsg = document.getElementById('githubSkippedMsg');

        // Gérer l'affichage
        if (isEnabled) {
            githubSection.style.display = 'block';
            githubSection.style.opacity = '1';
            githubSection.style.pointerEvents = 'auto'; // Réactiver les interactions

            githubTokenSection.style.display = 'block';
            githubSkippedMsg.style.display = 'none';
        } else {
            githubSection.style.opacity = '0.5';
            githubSection.style.pointerEvents = 'none'; // Désactiver les interactions

            githubTokenSection.style.display = 'none';
            githubSkippedMsg.style.display = 'block';
        }
    });

    // Initialiser l'état (masquer par défaut car décoché)
    document.getElementById('enableGithub').dispatchEvent(new Event('change'));

    // Charger le token sauvegardé
    loadSavedToken();
});

// Charger le token sauvegardé
async function loadSavedToken() {
    try {
        const response = await fetch('/api/get-saved-token');
        const data = await response.json();
        if (data.token) {
            document.getElementById('githubToken').value = data.token;
            console.log('✅ Token GitHub chargé automatiquement');
        }
    } catch (error) {
        // Pas de token sauvegardé, c'est normal
    }
}

// Navigation
function nextStep() {
    if (currentStep === totalSteps) {
        // Dernière étape avant récapitulatif
        showSummary();
        return;
    }

    if (currentStep === totalSteps + 1) {
        // On est au récapitulatif, créer le projet
        createProject();
        return;
    }

    // Valider l'étape actuelle
    if (!validateStep(currentStep)) {
        return;
    }

    // Passer à l'étape suivante
    currentStep++;
    updateSteps();
    updateProgress();
    updateButtons();
}

function previousStep() {
    if (currentStep > 1) {
        currentStep--;
        updateSteps();
        updateProgress();
        updateButtons();
    }
}

function updateSteps() {
    // Masquer toutes les étapes
    document.querySelectorAll('.step').forEach(step => {
        step.classList.remove('active');
    });

    // Afficher l'étape actuelle
    if (currentStep <= totalSteps) {
        document.getElementById(`step${currentStep}`).classList.add('active');
    } else if (currentStep === totalSteps + 1) {
        document.getElementById('stepSummary').classList.add('active');
    }
}

function updateProgress() {
    const progress = (currentStep / (totalSteps + 1)) * 100;
    document.getElementById('progressBar').style.width = `${progress}%`;

    if (currentStep <= totalSteps) {
        document.getElementById('progressText').textContent = `Étape ${currentStep} sur ${totalSteps}`;
    } else {
        document.getElementById('progressText').textContent = `Récapitulatif`;
    }
}

function updateButtons() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    // Bouton précédent
    if (currentStep === 1) {
        prevBtn.style.display = 'none';
    } else {
        prevBtn.style.display = 'block';
    }

    // Bouton suivant
    if (currentStep === totalSteps + 1) {
        nextBtn.textContent = '🚀 Créer le Projet';
    } else {
        nextBtn.textContent = 'Suivant →';
    }
}

// Validation
function validateStep(step) {
    if (step === 1) {
        const projectName = document.getElementById('projectName').value.trim();
        if (!projectName) {
            alert('❌ Le nom du projet est requis !');
            return false;
        }
        if (!/^[a-z0-9-]+$/.test(projectName)) {
            alert('❌ Le nom du projet ne peut contenir que des lettres minuscules, chiffres et tirets');
            return false;
        }
    }

    // Vérifier si GitHub est activé
    const isGithubEnabled = document.getElementById('enableGithub').checked;

    if (step === 3 && isGithubEnabled) {
        const githubRepo = document.getElementById('githubRepo').value.trim();
        if (!githubRepo) {
            alert('❌ Le repo GitHub est requis ! (Ou décoche "Configurer GitHub")');
            return false;
        }
        if (!githubRepo.includes('/')) {
            alert('❌ Le repo GitHub doit être au format: username/repo-name');
            return false;
        }
    }

    if (step === 4 && isGithubEnabled) {
        const githubToken = document.getElementById('githubToken').value.trim();
        if (!githubToken) {
            alert('❌ Le token GitHub est requis ! (Ou décoche "Configurer GitHub" à l\'étape précédente)');
            return false;
        }
    }

    return true;
}

// Secrets
function addSecret() {
    const container = document.getElementById('secretsContainer');
    const index = secrets.length;

    const secretDiv = document.createElement('div');
    secretDiv.className = 'secret-item';
    secretDiv.innerHTML = `
        <input type="text" placeholder="NOM_VARIABLE" class="secret-key" data-index="${index}">
        <input type="text" placeholder="valeur" class="secret-value" data-index="${index}">
        <button onclick="removeSecret(${index})">🗑️</button>
    `;

    container.appendChild(secretDiv);
    secrets.push({ key: '', value: '' });
}

function removeSecret(index) {
    const container = document.getElementById('secretsContainer');
    const items = container.querySelectorAll('.secret-item');
    items[index].remove();
    secrets.splice(index, 1);
}

// Récapitulatif
function showSummary() {
    currentStep++;

    const projectName = document.getElementById('projectName').value.trim() || '(non défini)';
    const destinationPath = document.getElementById('destinationPath').value.trim() || '(Défaut)';

    const isGithubEnabled = document.getElementById('enableGithub').checked;
    const githubRepo = isGithubEnabled ? (document.getElementById('githubRepo').value.trim() || '(non défini)') : '(Désactivé)';
    const githubToken = isGithubEnabled ? document.getElementById('githubToken').value.trim() : null;

    // Collecter les secrets
    const secretInputs = document.querySelectorAll('.secret-key');
    const extraSecrets = {};
    secretInputs.forEach((input, index) => {
        const key = input.value.trim();
        const value = document.querySelectorAll('.secret-value')[index].value.trim();
        if (key && value) {
            extraSecrets[key] = value;
        }
    });

    // Générer le récapitulatif
    let summaryHTML = '';

    summaryHTML += createSummaryItem('📝 Nom du projet', projectName);
    summaryHTML += createSummaryItem('📁 Destination', destinationPath === '(Défaut)' ? `[Dossier Utilisateur]\\APPS\\${projectName}` : `${destinationPath}\\${projectName}`);

    if (isGithubEnabled) {
        summaryHTML += createSummaryItem('🔗 GitHub Repo', githubRepo);
        if (githubToken) {
            summaryHTML += createSummaryItem('🔑 GitHub Token', `${githubToken.substring(0, 10)}... (masqué)`, true);
        }
    } else {
        summaryHTML += createSummaryItem('🔗 GitHub', '❌ Configuration ignorée (Mode Local)');
    }

    if (Object.keys(extraSecrets).length > 0) {
        const secretsText = Object.keys(extraSecrets).map(key => `${key}=***`).join(', ');
        summaryHTML += createSummaryItem('🔐 Secrets', secretsText);
    } else {
        summaryHTML += createSummaryItem('🔐 Secrets', '(aucun)');
    }

    document.getElementById('summaryContent').innerHTML = summaryHTML;

    updateSteps();
    updateProgress();
    updateButtons();
}

function createSummaryItem(label, value, masked = false) {
    return `
        <div class="summary-item">
            <div class="summary-label">${label}</div>
            <div class="summary-value ${masked ? 'masked' : ''}">${value}</div>
        </div>
    `;
}

// Création du projet
async function createProject() {
    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');

    // Désactiver les boutons
    nextBtn.disabled = true;
    prevBtn.disabled = true;
    nextBtn.innerHTML = '<div class="spinner"></div>';

    // Collecter les données
    const projectName = document.getElementById('projectName').value.trim();
    const destinationPath = document.getElementById('destinationPath').value.trim(); // Peut être vide

    const isGithubEnabled = document.getElementById('enableGithub').checked;
    const githubRepo = isGithubEnabled ? document.getElementById('githubRepo').value.trim() : null;
    const githubToken = isGithubEnabled ? document.getElementById('githubToken').value.trim() : null;

    // Collecter les secrets
    const secretInputs = document.querySelectorAll('.secret-key');
    const extraSecrets = {};
    secretInputs.forEach((input, index) => {
        const key = input.value.trim();
        const value = document.querySelectorAll('.secret-value')[index].value.trim();
        if (key && value) {
            extraSecrets[key] = value;
        }
    });

    try {
        const response = await fetch('/api/create-project', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                projectName,
                destinationPath,
                githubRepo,
                githubToken,
                extraSecrets: Object.keys(extraSecrets).length > 0 ? extraSecrets : null
            })
        });

        const result = await response.json();

        if (response.ok) {
            showSuccess(result);
        } else {
            showError(result.error || 'Une erreur est survenue');
        }

    } catch (error) {
        showError(`Erreur de connexion: ${error.message}`);
    } finally {
        nextBtn.disabled = false;
        prevBtn.disabled = false;
    }
}

function showSuccess(result) {
    const stepResult = document.getElementById('stepResult');
    const resultContent = document.getElementById('resultContent');

    // Générer le step npm install seulement si nécessaire
    const npmInstallStep = !result.npmInstallSuccess ? `
        <li>
            <strong>⚠️ Installer les dépendances (REQUIS)</strong><br>
            Ouvre un terminal dans le dossier du projet et lance :<br>
            <code>npm install</code><br>
            <small style="color: #666;">Les dépendances n'ont pas pu être installées automatiquement</small>
        </li>
    ` : '';

    resultContent.innerHTML = `
        <div class="result-success">
            <div class="icon">🎉</div>
            <h2>Projet Créé avec Succès !</h2>
            <p>Hamdoulilah, tout s'est bien passé !</p>
            
            <div class="project-path">
                📁 ${result.projectPath}
            </div>
            
            ${result.npmInstallSuccess ? '<div style="padding: 10px; background: #d4edda; color: #155724; border-radius: 8px; margin: 15px 0;">✅ Dépendances installées automatiquement</div>' : ''}
            
            <div class="next-steps">
                <h3>🎯 Prochaines Étapes</h3>
                <ol>
                    ${npmInstallStep}
                    <li>
                        <strong>Ouvrir le projet dans Antigravity</strong><br>
                        Dans Antigravity → <code>File</code> → <code>Open Folder</code><br>
                        Sélectionne : <code>${result.projectPath}</code>
                    </li>
                    <li>
                        <strong>Lire START.md</strong><br>
                        Ouvre le fichier <code>START.md</code> dans le projet<br>
                        Il contient la question à copier-coller dans Antigravity
                    </li>
                    <li>
                        <strong>Copie-colle la question dans Antigravity</strong><br>
                        L'IA va te poser des questions et créer tout le projet pour toi !
                    </li>
                    <li>
                        <strong>Tester en local (plus tard)</strong><br>
                        Double-clic sur <code>test-local.bat</code> quand l'IA a terminé
                    </li>
                </ol>
                <div style="margin-top: 20px; padding: 15px; background: #e3f2fd; border-radius: 8px;">
                    <strong>💡 Astuce :</strong> Tu n'as plus besoin de scripts batch !<br>
                    Tout se passe directement dans Antigravity. L'IA gère tout ! 🚀
                </div>
            </div>
        </div>
    `;

    // Masquer toutes les étapes
    document.querySelectorAll('.step').forEach(step => {
        step.classList.remove('active');
    });

    // Afficher le résultat
    stepResult.style.display = 'block';

    // Masquer les boutons de navigation
    document.querySelector('.navigation').style.display = 'none';
}

function showError(errorMessage) {
    const stepResult = document.getElementById('stepResult');
    const resultContent = document.getElementById('resultContent');

    resultContent.innerHTML = `
        <div class="result-error">
            <div class="icon">❌</div>
            <h2>Erreur</h2>
            <p>Miskin, quelque chose s'est mal passé...</p>
            
            <div class="error-message">
                ${errorMessage}
            </div>
            
            <button class="btn btn-primary" onclick="location.reload()">
                🔄 Recommencer
            </button>
        </div>
    `;

    // Masquer toutes les étapes
    document.querySelectorAll('.step').forEach(step => {
        step.classList.remove('active');
    });

    // Afficher le résultat
    stepResult.style.display = 'block';

    // Masquer les boutons de navigation
    document.querySelector('.navigation').style.display = 'none';
}
