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
    'scanning': 'AI Scanning',
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

  // AI Scanning Logic
  const scanDropzone = document.getElementById('scan-dropzone');
  const scanFileInput = document.getElementById('scan-file-input');
  const scanDocumentPreview = document.getElementById('scan-document-preview');
  const scanProcessing = document.getElementById('scan-processing');
  const scanProgressBar = document.getElementById('scan-progress-bar');
  const scanProgressText = document.getElementById('scan-progress-text');
  const scanWorkspace = document.getElementById('scan-workspace');
  const scanFooter = document.getElementById('scan-footer');
  const scanTopPanel = document.getElementById('scan-top-panel');
  const scanDiscardBtn = document.getElementById('scan-discard-btn');
  const scanFormType = document.getElementById('scan-form-type');
  
  if (scanDropzone && scanFileInput) {
    // Click to open file dialog
    scanDropzone.addEventListener('click', (e) => {
      // Prevent triggering if clicked on the input itself somehow
      if (e.target !== scanFileInput) {
        scanFileInput.click();
      }
    });

    scanFileInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files.length > 0) {
        handleFileUpload(e.target.files[0]);
      }
    });

    scanDropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
      scanDropzone.classList.add('bg-slate-100', 'border-primary-500');
    });
    scanDropzone.addEventListener('dragleave', () => {
      scanDropzone.classList.remove('bg-slate-100', 'border-primary-500');
    });
    scanDropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      scanDropzone.classList.remove('bg-slate-100', 'border-primary-500');
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        handleFileUpload(e.dataTransfer.files[0]);
      }
    });
  }

  function handleFileUpload(file) {
    if (file && file.type.startsWith('image/')) {
      const objectUrl = URL.createObjectURL(file);
      scanDocumentPreview.src = objectUrl;
      // In a real app, you might want to revoke the object URL later to prevent memory leaks
      
      simulateScanUpload();
    } else {
      alert('Please upload a valid image file (JPEG or PNG).');
    }
  }

  function simulateScanUpload() {
    scanDropzone.classList.add('hidden');
    scanFormType.parentElement.classList.add('hidden'); // Hide form type selector
    scanProcessing.classList.remove('hidden');
    scanProgressBar.style.width = '0%';
    scanProgressText.textContent = 'AI Core is analyzing document layout grid...';
    
    // Simulate progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress >= 100) progress = 100;
      
      scanProgressBar.style.width = `${progress}%`;
      
      if (progress > 30 && progress < 70) {
        scanProgressText.textContent = 'Parsing handwritten fields (OCR)...';
      } else if (progress >= 70 && progress < 100) {
        scanProgressText.textContent = 'Verifying clinical context...';
      }

      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          scanTopPanel.classList.add('hidden');
          scanWorkspace.classList.remove('hidden');
          scanFooter.classList.remove('hidden');
        }, 500);
      }
    }, 400);
  }

  if (scanDiscardBtn) {
    scanDiscardBtn.addEventListener('click', () => {
      scanWorkspace.classList.add('hidden');
      scanFooter.classList.add('hidden');
      scanTopPanel.classList.remove('hidden');
      scanProcessing.classList.add('hidden');
      scanDropzone.classList.remove('hidden');
      scanFormType.parentElement.classList.remove('hidden');
      scanProgressBar.style.width = '0%';
      scanProgressText.textContent = 'AI Core is analyzing document layout grid...';
      
      // Reset input value to allow re-uploading the same file
      if (scanFileInput) scanFileInput.value = '';

      // Reset Image View
      currentZoom = 1;
      currentRotation = 0;
      applyImageTransform();
    });
  }

  // Image Viewer Toolbar Logic
  const scanZoomIn = document.getElementById('scan-zoom-in');
  const scanZoomOut = document.getElementById('scan-zoom-out');
  const scanRotate = document.getElementById('scan-rotate');
  const scanResetView = document.getElementById('scan-reset-view');
  const scanImageContainer = document.getElementById('scan-image-container');

  let currentZoom = 1;
  let currentRotation = 0;

  function applyImageTransform() {
    if (scanImageContainer) {
      scanImageContainer.style.transform = `scale(${currentZoom}) rotate(${currentRotation}deg)`;
    }
  }

  if (scanZoomIn) {
    scanZoomIn.addEventListener('click', () => {
      currentZoom = Math.min(currentZoom + 0.25, 3);
      applyImageTransform();
    });
  }

  if (scanZoomOut) {
    scanZoomOut.addEventListener('click', () => {
      currentZoom = Math.max(currentZoom - 0.25, 0.5);
      applyImageTransform();
    });
  }

  if (scanRotate) {
    scanRotate.addEventListener('click', () => {
      currentRotation = (currentRotation + 90) % 360;
      applyImageTransform();
    });
  }

  if (scanResetView) {
    scanResetView.addEventListener('click', () => {
      currentZoom = 1;
      currentRotation = 0;
      applyImageTransform();
    });
  }

})
