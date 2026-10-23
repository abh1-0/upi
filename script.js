/**
 * UPI Studio — Engine for NPCI-Compliant UPI Deep Link, QR & Button Generation
 * Features: Multi-preset standee theming, quiet-zone geometry, center emblem switching, error correction levels.
 */

// Global State
const upiState = {
  username: 'merchant',
  handle: 'okaxis',
  payeeName: 'Acme Store',
  amount: '299.00',
  currency: 'INR',
  txRef: 'ORD-7819',
  txNote: 'Digital Services',
  mcc: '',
  minAmount: '',
  mode: '00',
  url: '',
  sign: '',
  
  // Customization
  standeeTheme: 'minimal-clean',
  qrDark: '#0f172a',
  qrLight: '#ffffff',
  qrCenterLogo: 'upi',
  qrEccLevel: 'M',
  qrSize: 260,
  qrQuietZone: 'standard',

  // Button
  btnTheme: 'modern-gradient',
  btnLabel: 'Pay with UPI',
  btnShowAmount: true,
  btnShowIcon: true,
};

let qrcodeInstance = null;

// DOM Cache
const dom = {
  // Inputs
  username: document.getElementById('upiUsername'),
  handle: document.getElementById('upiHandleCustom'),
  payeeName: document.getElementById('payeeName'),
  amount: document.getElementById('amount'),
  currency: document.getElementById('currency'),
  txRef: document.getElementById('txRef'),
  txNote: document.getElementById('txNote'),
  mcc: document.getElementById('mccCode'),
  minAmount: document.getElementById('minAmount'),
  mode: document.getElementById('initMode'),
  url: document.getElementById('callbackUrl'),
  sign: document.getElementById('digitalSign'),
  btnGenRef: document.getElementById('btnGenRef'),

  // Customization Inputs
  standeeTheme: document.getElementById('standeeThemeSelect'),
  qrDark: document.getElementById('qrDarkColor'),
  qrLight: document.getElementById('qrLightColor'),
  qrCenterLogo: document.getElementById('qrCenterLogo'),
  qrEccLevel: document.getElementById('qrEccLevel'),
  qrSize: document.getElementById('qrSizeSelect'),
  qrQuietZone: document.getElementById('qrQuietZone'),

  // Standee Container
  qrStand: document.getElementById('qrStand'),
  standeeQrFrame: document.getElementById('standeeQrFrame'),
  displayPayeeName: document.getElementById('displayPayeeName'),
  displayVpa: document.getElementById('displayVpa'),
  displayAmount: document.getElementById('displayAmount'),
  displayAmountTag: document.getElementById('displayAmountTag'),
  qrcodeContainer: document.getElementById('qrcode'),
  qrCenterEmblem: document.getElementById('qrCenterEmblem'),
  emblemContent: document.getElementById('emblemContent'),

  // Standee Action Buttons
  btnDownloadPNG: document.getElementById('btnDownloadPNG'),
  btnDownloadQROnly: document.getElementById('btnDownloadQROnly'),
  btnPrintQR: document.getElementById('btnPrintQR'),

  // Intent Tab
  intentUriCode: document.getElementById('intentUriCode'),
  btnCopyUri: document.getElementById('btnCopyUri'),
  btnTriggerUniversal: document.getElementById('btnTriggerUniversal'),
  btnTriggerGPay: document.getElementById('btnTriggerGPay'),
  btnTriggerPhonePe: document.getElementById('btnTriggerPhonePe'),
  btnTriggerPaytm: document.getElementById('btnTriggerPaytm'),
  paramsTableBody: document.getElementById('paramsTableBody'),

  // Button Tab
  btnThemePreset: document.getElementById('btnThemePreset'),
  btnTextCustom: document.getElementById('btnTextCustom'),
  btnShowAmount: document.getElementById('btnShowAmount'),
  btnShowIcons: document.getElementById('btnShowIcons'),
  buttonLiveRenderContainer: document.getElementById('buttonLiveRenderContainer'),
  htmlSnippetCode: document.getElementById('htmlSnippetCode'),
  btnCopyHtml: document.getElementById('btnCopyHtml'),
  jsUniversalSnippetCode: document.getElementById('jsUniversalSnippetCode'),
  btnCopyUniversalScript: document.getElementById('btnCopyUniversalScript'),

  // General Controls
  themeToggle: document.getElementById('themeToggle'),
  toast: document.getElementById('toast'),
};

/**
 * Builds Full UPI VPA
 */
function getFullVpa() {
  const user = (dom.username.value || '').trim();
  let handle = (dom.handle.value || '').trim().replace(/^@+/, '');
  if (!user && !handle) return '';
  if (!handle) return user;
  return `${user}@${handle}`;
}

/**
 * Builds NPCI UPI URI
 */
function buildUpiUri(customScheme = 'upi') {
  const vpa = getFullVpa();
  const name = (dom.payeeName.value || '').trim();
  const amt = (dom.amount.value || '').trim();
  const ref = (dom.txRef.value || '').trim();
  const note = (dom.txNote.value || '').trim();
  const mcc = (dom.mcc.value || '').trim();
  const mam = (dom.minAmount.value || '').trim();
  const mode = (dom.mode.value || '').trim();
  const url = (dom.url.value || '').trim();
  const sign = (dom.sign.value || '').trim();

  const params = [];
  if (vpa) params.push(`pa=${encodeURIComponent(vpa)}`);
  if (name) params.push(`pn=${encodeURIComponent(name)}`);

  if (amt && !isNaN(amt) && parseFloat(amt) > 0) {
    params.push(`am=${encodeURIComponent(parseFloat(amt).toFixed(2))}`);
    params.push(`cu=INR`);
  }

  if (ref) params.push(`tr=${encodeURIComponent(ref)}`);
  if (note) params.push(`tn=${encodeURIComponent(note.substring(0, 50))}`);
  if (mcc) params.push(`mc=${encodeURIComponent(mcc)}`);
  if (mam && !isNaN(mam) && parseFloat(mam) > 0) {
    params.push(`mam=${encodeURIComponent(parseFloat(mam).toFixed(2))}`);
  }
  if (mode && mode !== '00') {
    params.push(`mode=${encodeURIComponent(mode)}`);
  }
  if (url) params.push(`url=${encodeURIComponent(url)}`);
  if (sign) params.push(`sign=${encodeURIComponent(sign)}`);

  const queryString = params.join('&');
  if (customScheme === 'upi') return `upi://pay?${queryString}`;
  if (customScheme === 'gpay') return `gpay://upi/pay?${queryString}`;
  if (customScheme === 'phonepe') return `phonepe://pay?${queryString}`;
  if (customScheme === 'paytm') return `paytmmp://pay?${queryString}`;
  return `upi://pay?${queryString}`;
}

/**
 * Resolves QRCode.js CorrectLevel constant
 */
function resolveEccLevel(levelKey) {
  switch (levelKey) {
    case 'L': return QRCode.CorrectLevel.L;
    case 'Q': return QRCode.CorrectLevel.Q;
    case 'H': return QRCode.CorrectLevel.H;
    case 'M':
    default: return QRCode.CorrectLevel.M;
  }
}

/**
 * Updates Standee Visual Theme
 */
function applyStandeeTheme(themeName) {
  dom.qrStand.className = 'standee-wrapper';
  dom.qrStand.classList.add(`standee-theme-${themeName}`);
}

/**
 * Updates Center Emblem Badge
 */
function updateCenterEmblem(emblemType) {
  if (emblemType === 'none') {
    dom.qrCenterEmblem.classList.add('emblem-hidden');
    return;
  }
  dom.qrCenterEmblem.classList.remove('emblem-hidden');

  if (emblemType === 'upi') {
    dom.emblemContent.textContent = 'UPI';
    dom.emblemContent.style.background = '#0F172A';
    dom.emblemContent.style.color = '#00D26A';
  } else if (emblemType === 'lightning') {
    dom.emblemContent.innerHTML = '⚡';
    dom.emblemContent.style.background = '#0084FF';
    dom.emblemContent.style.color = '#FFFFFF';
  } else if (emblemType === 'rupee') {
    dom.emblemContent.textContent = '₹';
    dom.emblemContent.style.background = '#0F172A';
    dom.emblemContent.style.color = '#FF9933';
  }
}

/**
 * Renders the QR Canvas
 */
function renderQr(uri) {
  if (!dom.qrcodeContainer) return;
  dom.qrcodeContainer.innerHTML = '';

  const size = parseInt(dom.qrSize.value, 10) || 260;
  const dark = dom.qrDark.value || '#0f172a';
  const light = dom.qrLight.value || '#ffffff';
  const ecc = resolveEccLevel(dom.qrEccLevel.value);

  // Apply Quiet Zone padding class
  const quiet = dom.qrQuietZone.value;
  dom.standeeQrFrame.className = 'standee-qr-frame';
  dom.standeeQrFrame.classList.add(`quiet-${quiet}`);

  // Create QR Code
  qrcodeInstance = new QRCode(dom.qrcodeContainer, {
    text: uri,
    width: size,
    height: size,
    colorDark: dark,
    colorLight: light,
    correctLevel: ecc,
  });

  updateCenterEmblem(dom.qrCenterLogo.value);
}

/**
 * Updates Breakdown Table
 */
function updateParamsTable() {
  const vpa = getFullVpa();
  const name = dom.payeeName.value.trim();
  const amt = dom.amount.value.trim();
  const ref = dom.txRef.value.trim();
  const note = dom.txNote.value.trim();
  const mcc = dom.mcc.value.trim();
  const mam = dom.minAmount.value.trim();
  const mode = dom.mode.value;
  const url = dom.url.value.trim();
  const sign = dom.sign.value.trim();

  const rows = [
    { key: 'pa', name: 'Payee Address (VPA)', val: vpa, req: true },
    { key: 'pn', name: 'Payee / Merchant Name', val: name, req: true },
    { key: 'am', name: 'Amount (INR)', val: amt ? `₹ ${parseFloat(amt).toFixed(2)}` : 'Manual Entry', req: false },
    { key: 'cu', name: 'Currency Code', val: amt ? 'INR' : '—', req: false },
    { key: 'tr', name: 'Transaction Ref ID', val: ref || '—', req: false },
    { key: 'tn', name: 'Transaction Note', val: note || '—', req: false },
    { key: 'mc', name: 'Merchant Category Code', val: mcc || '—', req: false },
    { key: 'mam', name: 'Minimum Amount', val: mam ? `₹ ${parseFloat(mam).toFixed(2)}` : '—', req: false },
    { key: 'mode', name: 'Initiation Mode', val: mode, req: false },
    { key: 'url', name: 'Success / Callback URL', val: url || '—', req: false },
    { key: 'sign', name: 'PKI Digital Signature', val: sign ? (sign.substring(0, 16) + '...') : '—', req: false },
  ];

  dom.paramsTableBody.innerHTML = rows
    .map(
      (r) => `
    <tr>
      <td><code>${r.key}</code></td>
      <td>${r.name} ${r.req ? '<span class="required-star">*</span>' : ''}</td>
      <td><strong>${escapeHtml(r.val)}</strong></td>
    </tr>
  `
    )
    .join('');
}

/**
 * Button Style Resolver
 */
function getButtonStyleConfig(theme) {
  switch (theme) {
    case 'modern-gradient':
      return {
        bg: 'linear-gradient(135deg, #00D26A 0%, #0084FF 100%)',
        color: '#FFFFFF',
        border: 'none',
        shadow: '0 4px 15px rgba(0, 132, 255, 0.35)',
        badgeBg: 'rgba(255, 255, 255, 0.22)',
        badgeColor: '#FFFFFF',
      };
    case 'gpay-white':
      return {
        bg: '#FFFFFF',
        color: '#1F2937',
        border: '1px solid #E5E7EB',
        shadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
        badgeBg: '#F3F4F6',
        badgeColor: '#111827',
      };
    case 'sleek-dark':
      return {
        bg: '#0F172A',
        color: '#F8FAFC',
        border: '1px solid #334155',
        shadow: '0 4px 16px rgba(15, 23, 42, 0.4)',
        badgeBg: 'rgba(255, 255, 255, 0.12)',
        badgeColor: '#60A5FA',
      };
    case 'phonepe-purple':
      return {
        bg: 'linear-gradient(135deg, #6739B7 0%, #512DA8 100%)',
        color: '#FFFFFF',
        border: 'none',
        shadow: '0 4px 14px rgba(103, 58, 183, 0.35)',
        badgeBg: 'rgba(255, 255, 255, 0.2)',
        badgeColor: '#FFFFFF',
      };
    case 'emerald-green':
      return {
        bg: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
        color: '#FFFFFF',
        border: 'none',
        shadow: '0 4px 14px rgba(16, 185, 129, 0.35)',
        badgeBg: 'rgba(255, 255, 255, 0.2)',
        badgeColor: '#FFFFFF',
      };
    default:
      return {
        bg: '#0084FF',
        color: '#FFFFFF',
        border: 'none',
        shadow: '0 4px 14px rgba(0, 132, 255, 0.3)',
        badgeBg: 'rgba(255, 255, 255, 0.2)',
        badgeColor: '#FFFFFF',
      };
  }
}

/**
 * Builds HTML Snippet
 */
function buildHtmlSnippet(uri) {
  const theme = dom.btnThemePreset.value;
  const label = dom.btnTextCustom.value || 'Pay with UPI';
  const showAmount = dom.btnShowAmount.checked;
  const showIcon = dom.btnShowIcons.checked;
  const amt = dom.amount.value.trim();
  const styles = getButtonStyleConfig(theme);

  const iconSvg = showIcon
    ? `<svg style="width:19px;height:19px;flex-shrink:0;" viewBox="0 0 24 24" fill="currentColor"><path d="M13 2L3 14H12L11 22L21 10H12L13 2Z"/></svg>`
    : '';

  const amountBadge =
    showAmount && amt && !isNaN(amt) && parseFloat(amt) > 0
      ? `<span style="background:${styles.badgeBg};color:${styles.badgeColor};padding:3px 9px;border-radius:999px;font-size:12px;font-weight:700;">₹${parseFloat(amt).toFixed(2)}</span>`
      : '';

  return `<!-- UPI Instant Button Start -->
<a href="${uri}" 
   class="upi-pay-button" 
   style="display:inline-flex;align-items:center;justify-content:center;gap:10px;background:${styles.bg};color:${styles.color};border:${styles.border};padding:12px 24px;border-radius:12px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;font-size:15px;font-weight:700;text-decoration:none;box-shadow:${styles.shadow};transition:transform 0.15s cubic-bezier(0.16,1,0.3,1);cursor:pointer;"
   onmouseover="this.style.transform='translateY(-2px)'"
   onmouseout="this.style.transform='translateY(0)'"
   onmousedown="this.style.transform='scale(0.97)'">
  ${iconSvg}
  <span>${escapeHtml(label)}</span>
  ${amountBadge}
</a>
<!-- UPI Instant Button End -->`;
}

/**
 * Builds Universal Script Snippet
 */
function buildUniversalScriptSnippet(uri) {
  const vpa = getFullVpa();
  const name = dom.payeeName.value.trim();
  const amt = dom.amount.value.trim();
  const formattedAmt = amt && !isNaN(amt) ? `₹${parseFloat(amt).toFixed(2)}` : '';

  return `<!-- Universal Desktop QR Modal + Mobile Intent Script -->
<button id="smartUpiPayBtn" style="padding:12px 24px;border-radius:12px;background:#00D26A;color:#0F172A;border:none;font-weight:800;font-size:15px;cursor:pointer;display:inline-flex;align-items:center;gap:8px;box-shadow:0 4px 15px rgba(0,210,106,0.35);">
  ⚡ Pay ${formattedAmt} with UPI
</button>

<script>
document.getElementById('smartUpiPayBtn').addEventListener('click', function() {
  var upiUri = "${uri}";
  var isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  if (isMobile) {
    window.location.href = upiUri;
  } else {
    var qrApiUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=' + encodeURIComponent(upiUri);
    var modal = window.open('', '_blank', 'width=420,height=520');
    if (modal) {
      modal.document.write(
        '<div style="text-align:center;font-family:-apple-system,sans-serif;padding:36px 24px;background:#FAFAFC;min-height:100vh;">' +
        '<h2 style="margin:0 0 4px 0;font-size:20px;color:#0F172A;">${escapeHtml(name)}</h2>' +
        '<p style="margin:0 0 20px 0;font-size:13px;color:#64748B;font-family:monospace;">${escapeHtml(vpa)}</p>' +
        '<div style="background:#FFF;padding:16px;border-radius:16px;display:inline-block;box-shadow:0 8px 30px rgba(0,0,0,0.08);">' +
        '<img src="' + qrApiUrl + '" alt="UPI QR" style="width:240px;height:240px;display:block;" />' +
        '</div>' +
        '<div style="margin-top:20px;font-size:22px;font-weight:800;color:#0F172A;">${formattedAmt}</div>' +
        '<p style="font-size:12px;color:#94A3B8;margin-top:6px;">Scan with Google Pay, PhonePe, Paytm, or BHIM</p>' +
        '</div>'
      );
    } else {
      window.location.href = upiUri;
    }
  }
});
</` + `script>`;
}

/**
 * Master Refresh Pipeline
 */
function refreshAll() {
  const vpa = getFullVpa();
  const name = dom.payeeName.value.trim() || 'Merchant';
  const amt = dom.amount.value.trim();

  // Standee Texts
  dom.displayPayeeName.textContent = name;
  dom.displayVpa.textContent = vpa || 'username@handle';

  if (amt && !isNaN(amt) && parseFloat(amt) > 0) {
    dom.displayAmount.textContent = `₹${parseFloat(amt).toFixed(2)}`;
    dom.displayAmountTag.style.display = 'flex';
  } else {
    dom.displayAmountTag.style.display = 'none';
  }

  // Standee Theme
  applyStandeeTheme(dom.standeeTheme.value);

  // Compile URIs
  const upiUri = buildUpiUri('upi');
  dom.intentUriCode.textContent = upiUri;
  dom.btnTriggerUniversal.href = upiUri;
  dom.btnTriggerGPay.href = buildUpiUri('gpay');
  dom.btnTriggerPhonePe.href = buildUpiUri('phonepe');
  dom.btnTriggerPaytm.href = buildUpiUri('paytm');

  // Render QR
  renderQr(upiUri);

  // Update Parameters Table
  updateParamsTable();

  // Button Snippets
  const htmlSnippet = buildHtmlSnippet(upiUri);
  dom.htmlSnippetCode.textContent = htmlSnippet;
  dom.buttonLiveRenderContainer.innerHTML = htmlSnippet;
  dom.jsUniversalSnippetCode.textContent = buildUniversalScriptSnippet(upiUri);
}

/**
 * Downloads Complete Standee PNG
 */
function downloadStandeeCardPng() {
  const qrCanvas = dom.qrcodeContainer.querySelector('canvas');
  if (!qrCanvas) {
    showToast('Preparing QR canvas...');
    return;
  }

  const scale = 2;
  const width = 360 * scale;
  const height = 500 * scale;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  const theme = dom.standeeTheme.value;
  const isDark = theme === 'sleek-midnight';

  // Card Background
  ctx.fillStyle = isDark ? '#0B1120' : '#FFFFFF';
  ctx.beginPath();
  ctx.roundRect(0, 0, width, height, 28 * scale);
  ctx.fill();

  // Border
  ctx.lineWidth = 2 * scale;
  ctx.strokeStyle = isDark ? '#1E293B' : '#E2E8F0';
  ctx.stroke();

  // Theme top accent bar
  if (theme === 'upi-emerald') {
    ctx.fillStyle = '#00D26A';
    ctx.beginPath();
    ctx.roundRect(0, 0, width, 12 * scale, [28 * scale, 28 * scale, 0, 0]);
    ctx.fill();
  } else if (theme === 'gradient-aurora') {
    const barGrad = ctx.createLinearGradient(0, 0, width, 0);
    barGrad.addColorStop(0, '#00D26A');
    barGrad.addColorStop(0.5, '#0084FF');
    barGrad.addColorStop(1, '#8B5CF6');
    ctx.fillStyle = barGrad;
    ctx.beginPath();
    ctx.roundRect(0, 0, width, 12 * scale, [28 * scale, 28 * scale, 0, 0]);
    ctx.fill();
  }

  // Payee Name & VPA
  ctx.textAlign = 'center';
  ctx.font = `800 ${20 * scale}px "Plus Jakarta Sans", sans-serif`;
  ctx.fillStyle = isDark ? '#F8FAFC' : '#0F172A';
  const name = dom.payeeName.value.trim() || 'Merchant';
  ctx.fillText(name, width / 2, 70 * scale);

  ctx.font = `500 ${12 * scale}px "JetBrains Mono", monospace`;
  ctx.fillStyle = isDark ? '#94A3B8' : '#64748B';
  const vpa = getFullVpa() || 'merchant@upi';
  ctx.fillText(vpa, width / 2, 92 * scale);

  // Draw QR
  const qrSize = 220 * scale;
  const qrX = (width - qrSize) / 2;
  const qrY = 120 * scale;

  // Frame around QR
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.roundRect(qrX - 12 * scale, qrY - 12 * scale, qrSize + 24 * scale, qrSize + 24 * scale, 14 * scale);
  ctx.fill();
  ctx.drawImage(qrCanvas, qrX, qrY, qrSize, qrSize);

  // Center Emblem on exported image
  const emblemType = dom.qrCenterLogo.value;
  if (emblemType !== 'none') {
    const badgeW = 44 * scale;
    const badgeH = 22 * scale;
    const bX = (width - badgeW) / 2;
    const bY = qrY + (qrSize - badgeH) / 2;

    ctx.fillStyle = '#0F172A';
    ctx.beginPath();
    ctx.roundRect(bX, bY, badgeW, badgeH, 6 * scale);
    ctx.fill();
    ctx.lineWidth = 2 * scale;
    ctx.strokeStyle = '#FFFFFF';
    ctx.stroke();

    ctx.fillStyle = emblemType === 'rupee' ? '#FF9933' : '#00D26A';
    ctx.font = `900 ${11 * scale}px sans-serif`;
    ctx.textBaseline = 'middle';
    ctx.fillText(emblemType === 'rupee' ? '₹' : (emblemType === 'lightning' ? '⚡' : 'UPI'), width / 2, qrY + qrSize / 2);
  }

  // Footer Tag (Amount or Scan to Pay)
  const amt = dom.amount.value.trim();
  const footerY = 390 * scale;

  ctx.fillStyle = isDark ? '#162032' : '#F8FAFC';
  ctx.beginPath();
  ctx.roundRect(36 * scale, footerY, width - 72 * scale, 48 * scale, 12 * scale);
  ctx.fill();
  ctx.strokeStyle = isDark ? '#334155' : '#E2E8F0';
  ctx.stroke();

  ctx.fillStyle = isDark ? '#94A3B8' : '#64748B';
  ctx.font = `600 ${12 * scale}px sans-serif`;
  ctx.textAlign = 'left';
  ctx.fillText('Scan to Pay', 52 * scale, footerY + 24 * scale);

  ctx.fillStyle = isDark ? '#F8FAFC' : '#0F172A';
  ctx.textAlign = 'right';
  ctx.font = `800 ${16 * scale}px sans-serif`;
  const amtDisplay = amt && !isNaN(amt) && parseFloat(amt) > 0 ? `₹${parseFloat(amt).toFixed(2)}` : 'Any Amount';
  ctx.fillText(amtDisplay, width - 52 * scale, footerY + 24 * scale);

  // Bottom Notice
  ctx.textAlign = 'center';
  ctx.fillStyle = '#94A3B8';
  ctx.font = `600 ${10 * scale}px sans-serif`;
  ctx.fillText('Works with Google Pay, PhonePe, Paytm & BHIM', width / 2, 468 * scale);

  // Trigger Download
  const link = document.createElement('a');
  link.download = `UPI-Standee-${vpa.replace(/[@.]/g, '_')}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
  showToast('Downloaded Merchant Standee PNG!');
}

/**
 * Downloads Raw QR Code PNG Only
 */
function downloadRawQrOnly() {
  const qrCanvas = dom.qrcodeContainer.querySelector('canvas');
  if (!qrCanvas) return;
  const link = document.createElement('a');
  link.download = `UPI-QR-Raw-${getFullVpa().replace(/[@.]/g, '_')}.png`;
  link.href = qrCanvas.toDataURL('image/png');
  link.click();
  showToast('Exported Raw QR PNG!');
}

/**
 * Order ID Generator
 */
function generateOrderId() {
  const rand = Math.floor(1000 + Math.random() * 9000);
  const stamp = Date.now().toString().slice(-4);
  return `ORD-${rand}${stamp}`;
}

/**
 * Clipboard Utility
 */
function copyToClipboard(text, message = 'Copied to clipboard!') {
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(() => showToast(message));
  } else {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.left = '-999999px';
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    try {
      document.execCommand('copy');
      showToast(message);
    } catch (e) {
      alert('Unable to copy');
    }
    document.body.removeChild(ta);
  }
}

/**
 * Toast Feedback
 */
function showToast(msg) {
  dom.toast.textContent = msg;
  dom.toast.classList.add('show');
  setTimeout(() => {
    dom.toast.classList.remove('show');
  }, 2200);
}

/**
 * Escape HTML
 */
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Event Bindings
 */
function bindEvents() {
  const liveInputs = [
    dom.username,
    dom.handle,
    dom.payeeName,
    dom.amount,
    dom.txRef,
    dom.txNote,
    dom.mcc,
    dom.minAmount,
    dom.mode,
    dom.url,
    dom.sign,
    dom.standeeTheme,
    dom.qrDark,
    dom.qrLight,
    dom.qrCenterLogo,
    dom.qrEccLevel,
    dom.qrSize,
    dom.qrQuietZone,
    dom.btnThemePreset,
    dom.btnTextCustom,
    dom.btnShowAmount,
    dom.btnShowIcons,
  ];

  liveInputs.forEach((elem) => {
    if (!elem) return;
    elem.addEventListener('input', refreshAll);
    elem.addEventListener('change', refreshAll);
  });

  // Handle Quick Chips
  document.querySelectorAll('.handle-chip').forEach((chip) => {
    chip.addEventListener('click', (e) => {
      const handle = e.target.getAttribute('data-handle');
      if (handle) {
        dom.handle.value = handle;
        refreshAll();
      }
    });
  });

  // Auto Generate Ref
  dom.btnGenRef.addEventListener('click', () => {
    dom.txRef.value = generateOrderId();
    refreshAll();
    showToast('Generated fresh Order Ref!');
  });

  // Downloads & Print
  dom.btnDownloadPNG.addEventListener('click', downloadStandeeCardPng);
  dom.btnDownloadQROnly.addEventListener('click', downloadRawQrOnly);
  dom.btnPrintQR.addEventListener('click', () => window.print());

  // Segment Tab Navigation
  document.querySelectorAll('.segment-tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.segment-tab').forEach((t) => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      document.querySelectorAll('.tab-content').forEach((c) => c.classList.remove('active'));

      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      const targetId = tab.getAttribute('data-tab');
      const panel = document.getElementById(targetId);
      if (panel) panel.classList.add('active');
    });
  });

  // Copy Buttons
  dom.btnCopyUri.addEventListener('click', () => copyToClipboard(dom.intentUriCode.textContent, 'UPI URI copied!'));
  dom.btnCopyHtml.addEventListener('click', () => copyToClipboard(dom.htmlSnippetCode.textContent, 'Button HTML copied!'));
  dom.btnCopyUniversalScript.addEventListener('click', () => copyToClipboard(dom.jsUniversalSnippetCode.textContent, 'Universal Script copied!'));

  // Theme Toggle
  dom.themeToggle.addEventListener('click', () => {
    const isLight = document.body.getAttribute('data-theme') === 'light';
    if (isLight) {
      document.body.removeAttribute('data-theme');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
    }
  });

  // Restore Theme
  if (localStorage.getItem('theme') === 'light') {
    document.body.setAttribute('data-theme', 'light');
  }
}

// Initialization
document.addEventListener('DOMContentLoaded', () => {
  bindEvents();
  refreshAll();
});
