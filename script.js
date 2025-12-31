


// ===== CHAT AGENDAMENTO =====
const chatModal = document.getElementById('chatModal');
const openChatBtn = document.getElementById('openChat');
const closeChatBtn = document.getElementById('closeChat');
const chatMessages = document.getElementById('chatMessages');
const chatForm = document.getElementById('chatForm');
const chatInput = document.getElementById('chatInput');

openChatBtn.onclick = () => {
  chatModal.style.display = 'flex';
  startChat();
};

closeChatBtn.onclick = () => {
  chatModal.style.display = 'none';
  chatMessages.innerHTML = '';
  step = 0;
  data = {};
};

let step = 0;
let data = {};

const flow = [
  {
    question: 'Oi! Seja muito bem-vinda(o) 😊✨\nPra começarmos, qual é o seu nome?',
    key: 'nome'
  },
  {
    question: 'Perfeito! 💕\nQual serviço você gostaria de agendar hoje?\n\n💇‍♀️ Cabelo\n💅 Unhas\n✨ Outro serviço',
    key: 'servico'
  },
  {
    question: 'Ótima escolha! 😍\nAgora me diga, para qual data você prefere o atendimento?\n\n📅 Exemplo: 12/01',
    key: 'data'
  },
  {
    question: 'Quase lá! ⏰✨\nQual horário fica melhor para você?\n\n🕒 Exemplo: 14:30',
    key: 'horario'
  }
];


function botMessage(text){
  const div = document.createElement('div');
  div.className = 'msg bot';
  div.textContent = text;
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function userMessage(text){
  const div = document.createElement('div');
  div.className = 'msg user';
  div.textContent = text;
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function startChat(){
  botMessage(flow[0].question);
}

chatForm.onsubmit = e => {
  e.preventDefault();
  const value = chatInput.value.trim();
  if(!value) return;

  userMessage(value);
  data[flow[step].key] = value;
  chatInput.value = '';

  step++;

  setTimeout(() => {
    if(step < flow.length){
      botMessage(flow[step].question);
    } else {
      botMessage(
        `Perfeito! ✨\n\nResumo do agendamento:\n
Nome: ${data.nome}
Serviço: ${data.servico}
Data: ${data.data}
Horário: ${data.horario}

Em breve entraremos em contato para confirmar 💖`
      );

      console.log('AGENDAMENTO:', data);
    }
  }, 600);
};


// ===== IMAGE EXPAND FIX FINAL =====
document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('imageModal');
  const modalImg = document.getElementById('modalImg');
  const closeImg = document.getElementById('closeImg');

  if (!modal || !modalImg || !closeImg) {
    console.error('Modal não encontrado no DOM');
    return;
  }

  document.querySelectorAll('.slide img').forEach(img => {
    img.addEventListener('click', e => {
      e.stopPropagation();
      modalImg.src = img.src;
      modal.classList.add('active');
    });
  });

  closeImg.addEventListener('click', () => {
    modal.classList.remove('active');
  });

  modal.addEventListener('click', e => {
    if (e.target === modal) {
      modal.classList.remove('active');
    }
  });
});



// Lightbox simples para o carrossel
const images = document.querySelectorAll(".carousel-track img");

const overlay = document.createElement("div");
overlay.style.position = "fixed";
overlay.style.top = 0;
overlay.style.left = 0;
overlay.style.width = "100%";
overlay.style.height = "100%";
overlay.style.background = "rgba(0,0,0,0.85)";
overlay.style.display = "flex";
overlay.style.alignItems = "center";
overlay.style.justifyContent = "center";
overlay.style.zIndex = "9999";
overlay.style.cursor = "pointer";
overlay.style.opacity = "0";
overlay.style.transition = "opacity 0.3s ease";

const overlayImg = document.createElement("img");
overlayImg.style.maxWidth = "90%";
overlayImg.style.maxHeight = "90%";
overlayImg.style.borderRadius = "12px";
overlay.appendChild(overlayImg);

images.forEach(img => {
  img.addEventListener("click", () => {
    overlayImg.src = img.src;
    document.body.appendChild(overlay);
    requestAnimationFrame(() => overlay.style.opacity = "1");
  });
});

overlay.addEventListener("click", () => {
  overlay.style.opacity = "0";
  setTimeout(() => overlay.remove(), 300);
});




// ==========================
// AUTOPLAY DO HERO CAROUSEL
// ==========================

const carousel = document.querySelector(".carousel-track");
const carouselImages = carousel.querySelectorAll("img");

let currentIndex = 0;
const intervalTime = 1500; // 1.5 segundos

function autoScrollCarousel() {
  const imageWidth = carouselImages[0].offsetWidth + 16; // largura + gap
  currentIndex++;

  if (currentIndex >= carouselImages.length) {
    currentIndex = 0;
  }

  carousel.scrollTo({
    left: imageWidth * currentIndex,
    behavior: "smooth"
  });
}

let carouselInterval = setInterval(autoScrollCarousel, intervalTime);

// pausa autoplay quando o usuário interagir
carousel.addEventListener("mouseenter", () => {
  clearInterval(carouselInterval);
});

carousel.addEventListener("mouseleave", () => {
  carouselInterval = setInterval(autoScrollCarousel, intervalTime);
});


// sql //
app.post('/agendar', async (req, res) => {
  const { nome, servico, data, horario } = req.body;

  const existe = await db.get(
    'SELECT id FROM agendamentos WHERE data = ? AND horario = ?',
    [data, horario]
  );

  if (existe) {
    return res.json({
      ok: false,
      message: 'Esse horário já está ocupado 😕'
    });
  }

  await db.run(
    'INSERT INTO agendamentos (nome, servico, data, horario) VALUES (?, ?, ?, ?)',
    [nome, servico, data, horario]
  );

  res.json({
    ok: true,
    message: 'Agendamento confirmado 🎉'
  });
});

