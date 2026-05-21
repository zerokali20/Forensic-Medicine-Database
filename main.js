import './style.css'

// Initialize feather icons
if (typeof feather !== 'undefined') {
  feather.replace()
}

document.addEventListener('DOMContentLoaded', () => {
  // Login Logic
  const loginForm = document.getElementById('loginForm')
  const loginOverlay = document.getElementById('loginOverlay')
  const appContainer = document.getElementById('appContainer')
  const logoutBtn = document.getElementById('logoutBtn')

  loginForm.addEventListener('submit', (e) => {
    e.preventDefault()
    // Simulate login
    loginOverlay.classList.add('opacity-0', 'pointer-events-none')
    setTimeout(() => {
      loginOverlay.classList.add('hidden')
      appContainer.classList.remove('opacity-0', 'pointer-events-none')
    }, 300)
  })

  logoutBtn.addEventListener('click', () => {
    appContainer.classList.add('opacity-0', 'pointer-events-none')
    loginOverlay.classList.remove('hidden')
    setTimeout(() => {
      loginOverlay.classList.remove('opacity-0', 'pointer-events-none')
    }, 50)
  })

  // Navigation Logic
  const navLinks = document.querySelectorAll('.nav-link')
  const viewSections = document.querySelectorAll('.view-section')
  const pageTitle = document.getElementById('pageTitle')

  const titleMap = {
    'dashboard': 'Dashboard',
    'search': 'Case Search',
    'entry': 'Data Entry (MLEF)',
    'court': 'Court Tracking',
    'dispatched': 'Dispatched Reports'
  }

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault()
      
      // Update active nav link
      navLinks.forEach(l => l.classList.remove('active', 'bg-navy-800', 'text-white', 'border-l-4', 'border-primary-500'))
      link.classList.add('active', 'bg-navy-800', 'text-white', 'border-l-4', 'border-primary-500')

      // Show corresponding view
      const targetViewId = link.getAttribute('data-view')
      viewSections.forEach(section => {
        section.classList.remove('active')
        if (section.id === `view-${targetViewId}`) {
          section.classList.add('active')
        }
      })

      // Update Header Title
      if (titleMap[targetViewId]) {
        pageTitle.textContent = titleMap[targetViewId]
      }
    })
  })

  // Tabs Logic for MLEF Form
  const tabBtns = document.querySelectorAll('.tab-btn')
  const tabPanes = document.querySelectorAll('.tab-pane')

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-target')

      tabBtns.forEach(b => {
        b.classList.remove('active', 'border-primary-500', 'text-primary-600')
        b.classList.add('border-transparent', 'text-slate-500')
      })
      btn.classList.add('active', 'border-primary-500', 'text-primary-600')
      btn.classList.remove('border-transparent', 'text-slate-500')

      tabPanes.forEach(pane => {
        pane.classList.remove('active')
        if (pane.id === target) {
          pane.classList.add('active')
        }
      })
    })
  })

  // PDF Generation Logic
  const generatePdfBtns = document.querySelectorAll('.generatePdfBtn');
  generatePdfBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Simulate generating PDF
      const originalText = btn.innerHTML;
      btn.innerHTML = '<i data-feather="loader" class="mr-2 h-4 w-4 animate-spin"></i> Generating...';
      btn.disabled = true;
      if (typeof feather !== 'undefined') feather.replace();

      setTimeout(() => {
        btn.innerHTML = '<i data-feather="check" class="mr-2 h-4 w-4"></i> Report Generated';
        btn.classList.remove('bg-blue-600', 'hover:bg-blue-700');
        btn.classList.add('bg-green-600', 'hover:bg-green-700');
        if (typeof feather !== 'undefined') feather.replace();
        
        setTimeout(() => {
          btn.innerHTML = originalText;
          btn.classList.remove('bg-green-600', 'hover:bg-green-700');
          btn.classList.add('bg-blue-600', 'hover:bg-blue-700');
          btn.disabled = false;
          if (typeof feather !== 'undefined') feather.replace();
          alert('Official PDF Report has been generated and saved to the case file.');
        }, 2000);
      }, 1500);
    });
  });

  // Canvas Drawing Logic helper
  function setupCanvas(canvasId, clearBtnId, strokeColor, lineWidth) {
    const canvas = document.getElementById(canvasId);
    const clearBtn = document.getElementById(clearBtnId);
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let isDrawing = false;

    // Set internal canvas dimensions to match display dimensions
    const rect = canvas.parentElement.getBoundingClientRect();
    if (rect.width && rect.height) {
      canvas.width = rect.width;
      canvas.height = rect.height;
    }

    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    function getCoordinates(e) {
      const rect = canvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      return {
        x: clientX - rect.left,
        y: clientY - rect.top
      };
    }

    function startDrawing(e) {
      isDrawing = true;
      const coords = getCoordinates(e);
      ctx.beginPath();
      ctx.moveTo(coords.x, coords.y);
      // Draw a dot just in case it's a single click
      ctx.lineTo(coords.x, coords.y);
      ctx.stroke();
    }

    function draw(e) {
      if (!isDrawing) return;
      const coords = getCoordinates(e);
      ctx.lineTo(coords.x, coords.y);
      ctx.stroke();
      if(e.cancelable) e.preventDefault();
    }

    function stopDrawing() {
      isDrawing = false;
    }

    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);

    canvas.addEventListener('touchstart', startDrawing, { passive: true });
    canvas.addEventListener('touchmove', draw, { passive: false });
    canvas.addEventListener('touchend', stopDrawing);

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      });
    }
  }

  // Initialize Canvases
  // Wait a small delay to ensure rendering happens before dimension measurement
  setTimeout(() => {
    setupCanvas('bodyCanvas', 'clearBodyCanvasBtn', '#ef4444', 3); // Red markings
    setupCanvas('signatureCanvas', 'clearSignatureBtn', '#0f172a', 2); // Dark ink signature
  }, 100);

})
