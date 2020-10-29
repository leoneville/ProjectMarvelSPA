const chave_Publica = 'e55ab7d65862a33beadfb9c9d4ff0531';
const ts = '1603996009387';
const md5 = '9b7a8da15058372730129823f3f98478';
const elemento_Personagens = document.querySelector('.personagens');
const elemento_Snap = document.querySelector('#snap');
const elemento_Thanos = document.querySelector('#thanos');
const elemento_ClicarThanos = document.querySelector('#clicar_Thanos');
const ultimato = document.querySelector('#ultimato');
const introSound = document.querySelector('#intro-sound');
const snapSound = document.querySelector('#snap-sound');
const funeralSound = document.querySelector('#funeral-sound');
const avengersSound = document.querySelector('#avengers-sound');

const personagensURL = 'https://gateway.marvel.com/v1/public/events/29/characters?limit=100&apikey='+chave_Publica+'&ts='+ts+'&hash='+md5;

function getPersonagemData() {
    if (localStorage.personagemData) {
        return Promise.resolve(JSON.parse(localStorage.personagemData));
    }

    return fetch(personagensURL)
        .then(response => response.json())
        .then(data => {
            localStorage.personagemData = JSON.stringify(data);
            return data;
        });
}

const personagensOcultos = {
    1009652: true,
    1009165: true,
    1009726: true,
    1009299: true
};

function addPersonagensNaPagina(personagemData) {
    elemento_Personagens.innerHTML = '';
    console.log(elemento_Personagens);
    personagemData.data.results.forEach(result => {
        if (!personagensOcultos[result.id]) {
            const imagem_Personagem = result.thumbnail.path + '/standard_medium.jpg';
            const elemento_Personagem = document.createElement('div');
            elemento_Personagem.style.transform = 'scale(1)';
            elemento_Personagem.className = 'personagem vivo';

            const elemento_imagem = document.createElement('img');
            elemento_imagem.src = imagem_Personagem;
            elemento_Personagem.appendChild(elemento_imagem);

            const nomePersonagem = result.name.replace(/\(.*\)/, '');
            const elemento_nomePersonagem = document.createElement('h3');
            elemento_nomePersonagem.textContent = nomePersonagem;
            elemento_Personagem.appendChild(elemento_nomePersonagem);

            elemento_Personagens.appendChild(elemento_Personagem);
        }
    });
    elemento_Thanos.classList.add('hover');
    elemento_Thanos.addEventListener('click', thanosClick);
    elemento_ClicarThanos.style.display = '';
}

getPersonagemData()
    .then(addPersonagensNaPagina);

function thanosClick() {
    elemento_ClicarThanos.style.display = 'none';
    elemento_Thanos.classList.remove('hover');
    avengersSound.pause();
    introSound.play();
    elemento_Thanos.removeEventListener('click', thanosClick);
    elemento_Snap.style.opacity = '1';
    elemento_Personagens.style.opacity = '0.2';

    setTimeout(() => {
        introSound.pause();
        snapSound.play();
        elemento_Snap.style.opacity = '0';

        setTimeout(() => {
            funeralSound.play();
            equilibrioUniverso();    
        }, 2000);
    }, 5000);
}

function equilibrioUniverso() {
    const personagens = [...document.querySelectorAll('.personagem')];

    let mortesRestantes = Math.floor(personagens.length / 2);
    console.log('Equilibrando o universo, iniciando a matança ...', mortesRestantes, 'Personagens');
    elemento_Personagens.style.opacity = '1';
    morte(personagens, mortesRestantes);
}

function morte(personagens, mortesRestantes) {
    if (mortesRestantes > 0) {
        const aleatorio = Math.floor(Math.random() * personagens.length);
        const [escolhaPersonagem] = personagens.splice(aleatorio, 1);

        escolhaPersonagem.style.opacity = '0.2';
        escolhaPersonagem.classList.remove('vivo');
        escolhaPersonagem.classList.add('morto');

        console.log('Matando...', escolhaPersonagem.querySelector('h3').textContent);

        setTimeout(() => {
            escolhaPersonagem.style.transform = 'scale(0)';
            escolhaPersonagem.style.width = '0px';
            escolhaPersonagem.style.height = '0px';
            morte(personagens, mortesRestantes - 1);
        }, 1300);
    
    }
    else {
        ultimato.style.opacity = '1';
        diminuirFuneralSound();
    }
}

function diminuirFuneralSound() {
    if (funeralSound.volume > 0) {
        const novoVolume = funeralSound.volume - 0.1;
        funeralSound.volume = +novoVolume.toFixed(1);
        setTimeout(() => {
            diminuirFuneralSound();
        }, 800);
    }
    else {
        funeralSound.pause();
    }
}