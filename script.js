/* ============================================
   PORTFOLIO – SCRIPT.JS
   Scroll Reveal, Mobile Menu, Portfolio Filter
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ---- Scroll Reveal via IntersectionObserver ----
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));


  // ---- Navbar Scroll Effect ----
  const navbar = document.getElementById('navbar');

  const handleScroll = () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();


  // ---- Active Nav Link on Scroll ----
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const activateNavLink = () => {
    const scrollY = window.scrollY + 120;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + sectionId) {
            link.classList.add('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', activateNavLink, { passive: true });


  // ---- Mobile Menu ----
  const hamburger = document.getElementById('hamburger');
  const navLinksContainer = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinksContainer.classList.toggle('active');
    document.body.style.overflow = navLinksContainer.classList.contains('active') ? 'hidden' : '';
  });

  // Close mobile menu on link click
  navLinksContainer.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinksContainer.classList.remove('active');
      document.body.style.overflow = '';
    });
  });


  // ---- Smooth Scroll for Anchor Links ----
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });


  // ---- Portfolio Filter ----
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioCards = document.querySelectorAll('.portfolio-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active state
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      portfolioCards.forEach(card => {
        if (filter === 'all' || card.getAttribute('data-category') === filter) {
          card.classList.remove('hidden');
          // Re-trigger animation
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            });
          });
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });


  // ---- Contact Form (basic handler) ----
  const contactForm = document.getElementById('contactForm');

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const btn = contactForm.querySelector('button[type="submit"]');
    const originalHtml = btn.innerHTML;

    // Change button state to loading
    btn.innerHTML = '<i class="ph ph-spinner-gap animate-spin"></i> Enviando...';
    btn.disabled = true;

    // FormSubmit strictly prohibits submissions from the 'file://' protocol
    if (window.location.protocol === 'file:') {
      btn.innerHTML = originalHtml;
      btn.style.background = '';
      btn.disabled = false;

      alert(
        "Teste Local Detectado!\n\n" +
        "O FormSubmit não permite o envio de mensagens a partir de arquivos abertos diretamente no navegador (file://).\n\n" +
        "Para testar agora, você precisa abrir seu projeto através de um servidor local (ex: Extensão 'Live Server' do VS Code) ou publicar o site na internet (GitHub Pages, Vercel, etc).\n\n" +
        "O seu código já está 100% configurado e funcionará automaticamente assim que o site estiver online!"
      );
      return;
    }

    // Use FormData to get all form values including hidden inputs
    const formData = new FormData(contactForm);
    const object = Object.fromEntries(formData);
    const json = JSON.stringify(object);

    fetch(contactForm.action, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: json
    })
      .then(async (response) => {
        const data = await response.json();
        if (response.status === 200 && data.success !== "false") {
          // Success feedback
          btn.innerHTML = '<i class="ph ph-check-circle"></i> Mensagem Enviada!';
          btn.style.background = '#00cc6a';
          contactForm.reset();
        } else {
          // If success is false, it might be pending activation
          if (data.message && data.message.includes("Activation")) {
            btn.innerHTML = '<i class="ph ph-envelope-simple"></i> Ative seu e-mail!';
            btn.style.background = '#f39c12';
            alert("FormSubmit enviou um e-mail de ativação para salvianodsr@gmail.com. Por favor, confirme-o para começar a receber as mensagens.");
          } else {
            throw new Error(data.message || "Erro ao enviar");
          }
        }
      })
      .catch((error) => {
        console.error(error);
        btn.innerHTML = '<i class="ph ph-warning-circle"></i> Erro no envio';
        btn.style.background = '#ff4d4d';
      })
      .finally(() => {
        setTimeout(() => {
          btn.innerHTML = originalHtml;
          btn.style.background = '';
          btn.disabled = false;
        }, 4000);
      });

    // ---- Stat Counter Animation ----
    const statNumbers = document.querySelectorAll('.stat-number');

    const animateCounter = (el) => {
      const target = parseInt(el.textContent);
      const suffix = el.textContent.replace(/[0-9]/g, '');
      let current = 0;
      const increment = Math.ceil(target / 40);
      const duration = 1500;
      const stepTime = duration / (target / increment);

      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        el.textContent = current + suffix;
      }, stepTime);
    };

    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const statItems = entry.target.querySelectorAll('.stat-number');
          statItems.forEach(stat => animateCounter(stat));
          statsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    const statsContainer = document.querySelector('.hero-stats');
    if (statsContainer) {
      statsObserver.observe(statsContainer);
    }

  });
