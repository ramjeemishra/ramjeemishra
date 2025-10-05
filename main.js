document.addEventListener('DOMContentLoaded', function() {
  // Initialize AOS animations
  AOS.init({
    duration: 800,
    easing: 'ease-in-out',
    once: true
  });

  // Mine Prediction Demo
  document.querySelectorAll('.run-demo').forEach(button => {
    button.addEventListener('click', function() {
      const container = this.closest('.project-container');
      if (!container) return;
      
      const resultDisplay = container.querySelector('.prediction-result span');
      if (!resultDisplay) return;

      const randomPrediction = Math.random() > 0.5 ? 'Mine' : 'Rock';
      const confidence = (Math.random() * 0.5 + 0.5).toFixed(2);
      
      resultDisplay.textContent = `${randomPrediction} (${confidence} confidence)`;
      resultDisplay.className = randomPrediction === 'Mine' ? 'text-red-400' : 'text-green-400';
      
      const originalText = this.innerHTML;
      this.innerHTML = '<i class="fas fa-cog fa-spin mr-1"></i> Processing...';
      this.disabled = true;
      
      setTimeout(() => {
        this.innerHTML = originalText;
        this.disabled = false;
      }, 1000);
    });
  });

  // Create AI Guide element
  const guide = document.createElement('div');
  guide.className = 'fixed bottom-6 right-6 z-50';
  guide.innerHTML = `
    <div class="relative">
      <div id="aiBot" onclick="toggleChatModal()" class="w-16 h-16 rounded-full bg-gradient-to-r from-teal-500 to-blue-600 shadow-lg flex items-center justify-center text-white text-2xl cursor-pointer">
        <i class="fas fa-robot"></i>
      </div>
      <div id="guide-tooltip" class="absolute bottom-full right-0 mb-4 w-72 bg-slate-800/90 backdrop-blur-md rounded-xl shadow-2xl p-4 border border-slate-700/50 transition-opacity duration-300 opacity-0 pointer-events-none">
        <p class="text-sm text-gray-300"></p>
      </div>
    </div>
  `;
  document.body.appendChild(guide);




  const tooltip = document.getElementById('guide-tooltip');
  const tooltipText = tooltip.querySelector('p');
  let currentSection = '';
  let messageTimeout;

  // Guide messages for each section
  const messages = {
    'default': "Welcome to my portfolio! Scroll to explore my AI/ML projects",
    '#about': "This section shows my learning journey in AI/ML",
    '#projects': "Here you can see my projects and their details",
    '#skills': "These are my technical skills and expertise areas",
    '#contact': "Feel free to get in touch with me here"
  };

  // Show/hide tooltip with smooth transitions
  function showTooltip(message) {
    if (tooltipText.textContent === message) return;
    
    clearTimeout(messageTimeout);
    tooltipText.textContent = message;
    tooltip.classList.remove('opacity-0', 'pointer-events-none');
    tooltip.classList.add('opacity-100');
    
    messageTimeout = setTimeout(() => {
      tooltip.classList.remove('opacity-100');
      tooltip.classList.add('opacity-0', 'pointer-events-none');
    }, 5000);
  }

  // Track scroll position and active section
  function checkActiveSection() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.scrollY + (window.innerHeight / 3);
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = '#' + section.id;
      
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        if (currentSection !== sectionId) {
          currentSection = sectionId;
          showTooltip(messages[sectionId]);
        }
        return;
      }
    });
  }

  // Set up scroll event listener with throttling
  let isScrolling;
  window.addEventListener('scroll', function() {
    window.clearTimeout(isScrolling);
    isScrolling = setTimeout(checkActiveSection, 100);
  });

  // Show welcome message on load
  setTimeout(() => showTooltip(messages['default']), 1000);

  // Click handler for manual message display
  guide.querySelector('div').addEventListener('click', function() {
    if (tooltip.classList.contains('opacity-0')) {
      checkActiveSection();
      if (!currentSection) {
        showTooltip(messages['default']);
      }
    }
  });
});














// chat bot
const apiKey = "AIzaSyBowNftE-G8V_grQ9hZXiCwfsDa6B47FLs"; // Replace with your key
const chatModal = document.getElementById("chatModal");
const aiBot = document.getElementById("aiBot");
const sendBtn = document.getElementById("sendBtn");
const chatBox = document.getElementById("chatBox");
const userInput = document.getElementById("userInput");

function toggleChatModal() {
  chatModal.classList.toggle("hidden");
}

aiBot?.addEventListener("click", toggleChatModal);

sendBtn?.addEventListener("click", async () => {
  const input = userInput.value.trim();
  if (!input) return;

  appendMessage("user", input);
  userInput.value = "Thinking...";
  userInput.disabled = true;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: input }] }]
      })
    });

    const data = await response.json();
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't understand that.";
    appendMessage("bot", reply);
  } catch (error) {
    appendMessage("bot", "Error connecting to AI. Try again later.");
  }

  userInput.value = "";
  userInput.disabled = false;
});

userInput?.addEventListener("keypress", function (e) {
  if (e.key === "Enter") sendBtn.click();
});

function appendMessage(sender, message) {
  const msg = document.createElement("div");
  msg.className = `p-2 rounded-lg ${sender === "user" ? "bg-teal-600 self-end text-right" : "bg-slate-600 self-start"}`;
  msg.textContent = message;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}
