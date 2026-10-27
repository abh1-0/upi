/**
 * UPI Studio Pro v3.0 — Full Feature-Packed Engine
 * Capabilities:
 *  1. Dynamic Standee & Matrix QR (SVG & PNG retina download)
 *  2. Full NPCI Deep Link compiler & 1-click App testers
 *  3. Copyable HTML/CSS Embed Buttons + Modal Script
 *  4. GST Tax Invoice & Bill Maker with Scannable QR & jsPDF export
 *  5. Web Speech API Virtual Soundbox (Multilingual Indian Voice Broadcasts)
 *  6. Bulk / Batch CSV UPI QR Generator with Multi-Card Printing
 *  7. Deep Link Parser & NPCI Compliance Verifier
 *  8. URL Hash State Sharer
 */

// Application State
const state = {
  // Primary Cockpit
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

  // Standee Customization
  standeeTheme: 'minimal-clean',
  qrDark: '#0f172a',
  qrLight: '#ffffff',
  qrCenterLogo: 'upi',
  qrEccLevel: 'M',
  qrSize: 260,
  qrQuietZone: 'standard',

  // Button Customization
  btnTheme: 'modern-gradient',
  btnLabel: 'Pay with UPI',
  btnShowAmount: true,
  btnShowIcon: true,

  // Invoice Items
  invoiceItems: [
    { desc: 'Web Application Development', qty: 1, rate: 25000, gst: 18 },
    { desc: 'Cloud Server Infrastructure Setup', qty: 1, rate: 5000, gst: 18 }
  ]
};

// Global QR Instances
let mainQrInstance = null;
let invoiceQrInstance = null;

// Cache DOM Nodes
const dom = {
  // Tab Elements
  mainTabList: document.getElementById('mainTabList'),
  viewPrimary: document.getElementById('view-primary'),
  viewInvoice: document.getElementById('view-invoice'),
  viewSoundbox: document.getElementById('view-soundbox'),
  viewScanner: document.getElementById('view-scanner'),
  viewBatch: document.getElementById('view-batch'),
  viewParser: document.getElementById('view-parser'),

  // Cockpit Inputs
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

  // QR Customization
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

  // Standee Actions
  btnDownloadPNG: document.getElementById('btnDownloadPNG'),
  btnDownloadSVG: document.getElementById('btnDownloadSVG'),
  btnDownloadQROnly: document.getElementById('btnDownloadQROnly'),
  btnPrintQR: document.getElementById('btnPrintQR'),

  // Intent Tab
  intentUriCode: document.getElementById('intentUriCode'),
  btnCopyUri: document.getElementById('btnCopyUri'),
  btnTriggerUniversal: document.getElementById('btnTriggerUniversal'),
  btnTriggerGPay: document.getElementById('btnTriggerGPay'),
  btnTriggerPhonePe: document.getElementById('btnTriggerPhonePe'),
  btnTriggerPaytm: document.getElementById('btnTriggerPaytm'),
  btnShareWhatsApp: document.getElementById('btnShareWhatsApp'),
  btnShareSMS: document.getElementById('btnShareSMS'),
  btnCopyShortLink: document.getElementById('btnCopyShortLink'),
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

  // Invoice Inputs
  invNumber: document.getElementById('invNumber'),
  invDate: document.getElementById('invDate'),
  invDueDate: document.getElementById('invDueDate'),
  invSellerName: document.getElementById('invSellerName'),
  invSellerGST: document.getElementById('invSellerGST'),
  invClientName: document.getElementById('invClientName'),
  invClientGST: document.getElementById('invClientGST'),
  invNotes: document.getElementById('invNotes'),
  lineItemsBody: document.getElementById('lineItemsBody'),
  btnAddLineItem: document.getElementById('btnAddLineItem'),
  btnResetInvoice: document.getElementById('btnResetInvoice'),
  btnDownloadInvoicePDF: document.getElementById('btnDownloadInvoicePDF'),
  btnPrintInvoice: document.getElementById('btnPrintInvoice'),
  invoiceSheet: document.getElementById('invoiceSheet'),
  invoiceQrcode: document.getElementById('invoiceQrcode'),
  invBarcodeSvg: document.getElementById('invBarcodeSvg'),

  // Invoice Preview
  prevSellerName: document.getElementById('prevSellerName'),
  prevSellerGST: document.getElementById('prevSellerGST'),
  prevInvNumber: document.getElementById('prevInvNumber'),
  prevInvDate: document.getElementById('prevInvDate'),
  prevInvDueDate: document.getElementById('prevInvDueDate'),
  prevClientName: document.getElementById('prevClientName'),
  prevClientGST: document.getElementById('prevClientGST'),
  prevItemsBody: document.getElementById('prevItemsBody'),
  prevInvVpa: document.getElementById('prevInvVpa'),
  prevInvRef: document.getElementById('prevInvRef'),
  prevSubtotal: document.getElementById('prevSubtotal'),
  prevTotalGST: document.getElementById('prevTotalGST'),
  prevGrandTotal: document.getElementById('prevGrandTotal'),
  prevNotes: document.getElementById('prevNotes'),

  // Soundbox
  soundboxVoiceLang: document.getElementById('soundboxVoiceLang'),
  soundboxAmountInput: document.getElementById('soundboxAmountInput'),
  soundboxCustomerInput: document.getElementById('soundboxCustomerInput'),
  soundboxPlayChime: document.getElementById('soundboxPlayChime'),
  btnTestSoundboxVoice: document.getElementById('btnTestSoundboxVoice'),
  soundboxLastAmount: document.getElementById('soundboxLastAmount'),
  soundboxStatusText: document.getElementById('soundboxStatusText'),
  soundboxLogList: document.getElementById('soundboxLogList'),
  btnClearSoundboxLog: document.getElementById('btnClearSoundboxLog'),

  // Batch
  batchInputArea: document.getElementById('batchInputArea'),
  btnProcessBatch: document.getElementById('btnProcessBatch'),
  btnLoadBatchSample: document.getElementById('btnLoadBatchSample'),
  btnBatchPrintAll: document.getElementById('btnBatchPrintAll'),
  batchCardsContainer: document.getElementById('batchCardsContainer'),
  batchCountBadge: document.getElementById('batchCountBadge'),

  // Parser
  parserInputText: document.getElementById('parserInputText'),
  btnExecuteParse: document.getElementById('btnExecuteParse'),
  parserVerdictBadge: document.getElementById('parserVerdictBadge'),
  parserReportTable: document.getElementById('parserReportTable'),

  // Camera Scanner
  btnToggleCamera: document.getElementById('btnToggleCamera'),
  btnToggleCameraText: document.getElementById('btnToggleCameraText'),
  qrFileInput: document.getElementById('qrFileInput'),
  scannerResultBadge: document.getElementById('scannerResultBadge'),
  scannerDecodedText: document.getElementById('scannerDecodedText'),
  scannerActionsZone: document.getElementById('scannerActionsZone'),
  btnPayDecodedUri: document.getElementById('btnPayDecodedUri'),
  btnLoadIntoWorkbench: document.getElementById('btnLoadIntoWorkbench'),

  // Mobile Sticky Bar
  mobileBarAmount: document.getElementById('mobileBarAmount'),
  mobileDirectPayBtn: document.getElementById('mobileDirectPayBtn'),
  mobileQuickShareBtn: document.getElementById('mobileQuickShareBtn'),

  // Global Controls
  btnQuickShare: document.getElementById('btnQuickShare'),
  themeToggle: document.getElementById('themeToggle'),
  toast: document.getElementById('toast')
};

/**
 * Builds Full UPI Virtual Payment Address (VPA)
 */
function getFullVpa() {
  const user = (dom.username.value || '').trim();
  let handle = (dom.handle.value || '').trim().replace(/^@+/, '');
  if (!user && !handle) return '';
  if (!handle) return user;
  return `${user}@${handle}`;
}

/**
 * Builds Standard NPCI URI
 */
function buildUpiUri(customScheme = 'upi', customAmt = null, customRef = null, customNote = null) {
  const vpa = getFullVpa();
  const name = (dom.payeeName.value || '').trim();
  const amt = customAmt !== null ? customAmt : (dom.amount.value || '').trim();
  const ref = customRef !== null ? customRef : (dom.txRef.value || '').trim();
  const note = customNote !== null ? customNote : (dom.txNote.value || '').trim();
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
 * Resolves Error Correction Constant
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
 * Updates Standee Theme Class
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
  } else if (emblemType === 'gpay') {
    dom.emblemContent.textContent = 'G';
    dom.emblemContent.style.background = '#4285F4';
    dom.emblemContent.style.color = '#FFFFFF';
  }
}

/**
 * Renders Primary QR Code
 */
function renderPrimaryQr(uri) {
  if (!dom.qrcodeContainer) return;
  dom.qrcodeContainer.innerHTML = '';

  const size = parseInt(dom.qrSize.value, 10) || 260;
  const dark = dom.qrDark.value || '#0f172a';
  const light = dom.qrLight.value || '#ffffff';
  const ecc = resolveEccLevel(dom.qrEccLevel.value);

  // Apply Quiet Zone
  const quiet = dom.qrQuietZone.value;
  dom.standeeQrFrame.className = 'standee-qr-frame';
  dom.standeeQrFrame.classList.add(`quiet-${quiet}`);

  mainQrInstance = new QRCode(dom.qrcodeContainer, {
    text: uri,
    width: size,
    height: size,
    colorDark: dark,
    colorLight: light,
    correctLevel: ecc
  });

  updateCenterEmblem(dom.qrCenterLogo.value);
}

/**
 * Updates Parameter Breakdown Table
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
    .map((r) => `
      <tr>
        <td><code>${r.key}</code></td>
        <td>${r.name} ${r.req ? '<span class="required-star">*</span>' : ''}</td>
        <td><strong>${escapeHtml(r.val)}</strong></td>
      </tr>
    `).join('');
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
    case 'luxury-black':
      return {
        bg: '#000000',
        color: '#FFFFFF',
        border: '1px solid #222222',
        shadow: '0 6px 20px rgba(0, 0, 0, 0.7)',
        badgeBg: '#222222',
        badgeColor: '#00D26A',
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
 * Builds HTML Embed Snippet
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

  return `<!-- UPI Zero-Fee Instant Button Start -->
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
<!-- UPI Zero-Fee Instant Button End -->`;
}

/**
 * Builds Universal Modal Script Snippet
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
    if (dom.mobileBarAmount) dom.mobileBarAmount.textContent = `₹${parseFloat(amt).toFixed(2)}`;
  } else {
    dom.displayAmountTag.style.display = 'none';
    if (dom.mobileBarAmount) dom.mobileBarAmount.textContent = 'Custom Amount';
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

  // Render Primary QR
  renderPrimaryQr(upiUri);

  // Update Parameters Table
  updateParamsTable();

  // Button Snippets
  const htmlSnippet = buildHtmlSnippet(upiUri);
  dom.htmlSnippetCode.textContent = htmlSnippet;
  dom.buttonLiveRenderContainer.innerHTML = htmlSnippet;
  dom.jsUniversalSnippetCode.textContent = buildUniversalScriptSnippet(upiUri);

  // Update Invoice Live QR as well
  updateInvoicePreview();
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

  // Top Accent Bar
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
  } else if (theme === 'warm-amber') {
    ctx.fillStyle = '#F59E0B';
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

  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.roundRect(qrX - 12 * scale, qrY - 12 * scale, qrSize + 24 * scale, qrSize + 24 * scale, 14 * scale);
  ctx.fill();
  ctx.drawImage(qrCanvas, qrX, qrY, qrSize, qrSize);

  // Center Emblem
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

  // Footer Tag
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
  ctx.fillText('Works with Google Pay, PhonePe, Paytm, Cred & BHIM', width / 2, 468 * scale);

  // Trigger Download
  const link = document.createElement('a');
  link.download = `UPI-Standee-${vpa.replace(/[@.]/g, '_')}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
  showToast('Downloaded Merchant Standee PNG!');
}

/**
 * Downloads Vector SVG for Infinite Print Scaling
 */
function downloadStandeeSvg() {
  const qrCanvas = dom.qrcodeContainer.querySelector('canvas');
  if (!qrCanvas) return;
  const qrDataUrl = qrCanvas.toDataURL('image/png');
  const vpa = getFullVpa() || 'merchant@upi';
  const name = dom.payeeName.value.trim() || 'Merchant';
  const amt = dom.amount.value.trim();
  const amtDisplay = amt && !isNaN(amt) && parseFloat(amt) > 0 ? `₹${parseFloat(amt).toFixed(2)}` : 'Any Amount';

  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 500" width="360" height="500">
  <rect width="360" height="500" rx="28" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="2"/>
  <rect width="360" height="12" rx="6" fill="#00D26A"/>
  <text x="180" y="70" text-anchor="middle" font-family="'Plus Jakarta Sans', sans-serif" font-weight="800" font-size="20" fill="#0F172A">${escapeHtml(name)}</text>
  <text x="180" y="92" text-anchor="middle" font-family="'JetBrains Mono', monospace" font-weight="500" font-size="12" fill="#64748B">${escapeHtml(vpa)}</text>
  <rect x="68" y="108" width="224" height="224" rx="14" fill="#FFFFFF" stroke="#E2E8F0"/>
  <image href="${qrDataUrl}" x="80" y="120" width="200" height="200"/>
  <rect x="36" y="390" width="288" height="48" rx="12" fill="#F8FAFC" stroke="#E2E8F0"/>
  <text x="52" y="420" font-family="sans-serif" font-weight="600" font-size="12" fill="#64748B">Scan to Pay</text>
  <text x="308" y="420" text-anchor="end" font-family="sans-serif" font-weight="800" font-size="16" fill="#0F172A">${amtDisplay}</text>
  <text x="180" y="468" text-anchor="middle" font-family="sans-serif" font-weight="600" font-size="10" fill="#94A3B8">Works with Google Pay, PhonePe, Paytm, Cred &amp; BHIM</text>
</svg>`;

  const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.download = `UPI-Standee-${vpa.replace(/[@.]/g, '_')}.svg`;
  link.href = url;
  link.click();
  URL.revokeObjectURL(url);
  showToast('Exported Vector SVG!');
}

/**
 * Downloads Raw QR Code PNG
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
 * Auto-generate Order ID
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
 * Toast Helper
 */
function showToast(msg) {
  dom.toast.textContent = msg;
  dom.toast.classList.add('show');
  setTimeout(() => dom.toast.classList.remove('show'), 2200);
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

/* ==========================================================================
   MODULE: GST INVOICE BUILDER
   ========================================================================== */

function initInvoiceDates() {
  const today = new Date();
  const nextWeek = new Date();
  nextWeek.setDate(today.getDate() + 7);

  dom.invDate.value = today.toISOString().split('T')[0];
  dom.invDueDate.value = nextWeek.toISOString().split('T')[0];
}

function renderInvoiceItemsInput() {
  dom.lineItemsBody.innerHTML = state.invoiceItems.map((item, idx) => {
    const total = (item.qty * item.rate * (1 + item.gst / 100)).toFixed(2);
    return `
      <tr>
        <td><input type="text" class="item-desc" data-idx="${idx}" value="${escapeHtml(item.desc)}"></td>
        <td><input type="number" class="item-qty" data-idx="${idx}" value="${item.qty}" min="1" step="1"></td>
        <td><input type="number" class="item-rate" data-idx="${idx}" value="${item.rate}" min="0" step="0.01"></td>
        <td>
          <select class="item-gst" data-idx="${idx}">
            <option value="0" ${item.gst === 0 ? 'selected' : ''}>0%</option>
            <option value="5" ${item.gst === 5 ? 'selected' : ''}>5%</option>
            <option value="12" ${item.gst === 12 ? 'selected' : ''}>12%</option>
            <option value="18" ${item.gst === 18 ? 'selected' : ''}>18%</option>
            <option value="28" ${item.gst === 28 ? 'selected' : ''}>28%</option>
          </select>
        </td>
        <td><strong>₹${total}</strong></td>
        <td><button type="button" class="btn-delete-row" data-idx="${idx}">&times;</button></td>
      </tr>
    `;
  }).join('');
}

function updateInvoicePreview() {
  dom.prevSellerName.textContent = dom.invSellerName.value || 'Seller Name';
  dom.prevSellerGST.textContent = `GSTIN: ${dom.invSellerGST.value || 'N/A'}`;
  dom.prevInvNumber.textContent = dom.invNumber.value || 'INV-001';
  dom.prevInvDate.textContent = dom.invDate.value || 'Today';
  dom.prevInvDueDate.textContent = dom.invDueDate.value || 'Net 7';
  dom.prevClientName.textContent = dom.invClientName.value || 'Client Name';
  dom.prevClientGST.textContent = dom.invClientGST.value || 'Address';
  dom.prevNotes.textContent = dom.invNotes.value || 'None';

  const vpa = getFullVpa();
  dom.prevInvVpa.textContent = vpa || 'merchant@okaxis';
  dom.prevInvRef.textContent = dom.invNumber.value || 'INV-001';

  let subtotal = 0;
  let totalGST = 0;

  dom.prevItemsBody.innerHTML = state.invoiceItems.map((item, idx) => {
    const itemSub = item.qty * item.rate;
    const itemTax = itemSub * (item.gst / 100);
    const itemTotal = itemSub + itemTax;

    subtotal += itemSub;
    totalGST += itemTax;

    return `
      <tr>
        <td>${idx + 1}</td>
        <td><strong>${escapeHtml(item.desc)}</strong></td>
        <td>${item.qty}</td>
        <td>₹${item.rate.toFixed(2)}</td>
        <td>${item.gst}%</td>
        <td>₹${itemTotal.toFixed(2)}</td>
      </tr>
    `;
  }).join('');

  const grandTotal = subtotal + totalGST;
  dom.prevSubtotal.textContent = `₹${subtotal.toFixed(2)}`;
  dom.prevTotalGST.textContent = `₹${totalGST.toFixed(2)}`;
  dom.prevGrandTotal.textContent = `₹${grandTotal.toFixed(2)}`;

  // Generate Barcode on Invoice
  if (window.JsBarcode) {
    try {
      JsBarcode("#invBarcodeSvg", dom.invNumber.value || 'INV-001', {
        format: "CODE128",
        width: 1.5,
        height: 36,
        displayValue: true,
        fontSize: 10
      });
    } catch (e) {}
  }

  // Generate UPI QR inside Invoice
  if (dom.invoiceQrcode) {
    dom.invoiceQrcode.innerHTML = '';
    const invUpiUri = buildUpiUri('upi', grandTotal.toFixed(2), dom.invNumber.value, `Payment for ${dom.invNumber.value}`);
    invoiceQrInstance = new QRCode(dom.invoiceQrcode, {
      text: invUpiUri,
      width: 90,
      height: 90,
      colorDark: '#0f172a',
      colorLight: '#ffffff',
      correctLevel: QRCode.CorrectLevel.M
    });
  }
}

function downloadInvoicePdf() {
  if (!window.html2pdf) {
    window.print();
    return;
  }
  showToast('Generating Invoice PDF...');
  const opt = {
    margin: 10,
    filename: `${dom.invNumber.value || 'Invoice'}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };
  html2pdf().set(opt).from(dom.invoiceSheet).save();
}

/* ==========================================================================
   MODULE: MULTILINGUAL SOFTWARE SOUNDBOX
   ========================================================================== */

function playCashChime(callback) {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
    osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.1); // A5
    osc.frequency.setValueAtTime(1174.66, audioCtx.currentTime + 0.2); // D6

    gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.5);
    setTimeout(callback, 500);
  } catch (e) {
    callback();
  }
}

function triggerSoundboxVoice() {
  const amt = parseFloat(dom.soundboxAmountInput.value) || 299;
  const payer = dom.soundboxCustomerInput.value.trim();
  const lang = dom.soundboxVoiceLang.value;

  dom.soundboxLastAmount.textContent = `₹ ${amt.toFixed(2)}`;
  dom.soundboxStatusText.textContent = `● Payment Voiced in ${lang}`;

  let phrase = `Received ${amt} rupees on UPI.`;
  if (lang === 'hi-IN') {
    phrase = `यूपीआई पर ${amt} रुपये प्राप्त हुए।`;
  } else if (lang === 'ta-IN') {
    phrase = `UPI-ல் ${amt} ரூபாய் பெறப்பட்டது.`;
  } else if (lang === 'te-IN') {
    phrase = `UPI లో ${amt} రూపాయలు స్వీకరించబడ్డాయి.`;
  } else if (lang === 'kn-IN') {
    phrase = `UPI ನಲ್ಲಿ ${amt} ರೂಪಾಯಿ ಸ್ವೀಕರಿಸಲಾಗಿದೆ.`;
  } else if (lang === 'bn-IN') {
    phrase = `UPI-তে ${amt} টাকা পাওয়া গেছে.`;
  } else if (lang === 'mr-IN') {
    phrase = `UPI वर ${amt} रुपये प्राप्त झाले.`;
  } else if (lang === 'gu-IN') {
    phrase = `UPI પર ${amt} રૂપિયા મળ્યા.`;
  }

  if (payer) phrase = `${phrase} Thank you ${payer}.`;

  const speakAction = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(phrase);
      utter.lang = lang;
      utter.rate = 0.95;
      utter.pitch = 1.0;
      window.speechSynthesis.speak(utter);
    } else {
      showToast('Web Speech API not supported on this browser.');
    }

    // Append to Broadcast Log
    const now = new Date().toLocaleTimeString();
    const logItem = document.createElement('div');
    logItem.className = 'log-item';
    logItem.innerHTML = `<span><strong>₹${amt.toFixed(2)}</strong> &bull; ${payer || 'Customer'}</span><span>${now}</span>`;
    if (dom.soundboxLogList.querySelector('.log-empty')) {
      dom.soundboxLogList.innerHTML = '';
    }
    dom.soundboxLogList.prepend(logItem);
    showToast(`Voiced: "₹${amt.toFixed(2)}"`);
  };

  if (dom.soundboxPlayChime.checked) {
    playCashChime(speakAction);
  } else {
    speakAction();
  }
}

/* ==========================================================================
   MODULE: BULK / BATCH GENERATION
   ========================================================================== */

function processBatchInput() {
  const text = dom.batchInputArea.value.trim();
  if (!text) {
    showToast('Please enter rows in CSV format.');
    return;
  }

  const lines = text.split('\n');
  dom.batchCardsContainer.innerHTML = '';
  let count = 0;

  lines.forEach((line, idx) => {
    const parts = line.split(',').map((p) => p.trim());
    if (parts.length < 2) return;

    const vpa = parts[0];
    const name = parts[1];
    const amt = parts[2] || '';
    const ref = parts[3] || `REF-${idx + 1}`;
    const note = parts[4] || '';

    count++;

    // Generate UPI URI
    const params = [`pa=${encodeURIComponent(vpa)}`, `pn=${encodeURIComponent(name)}`];
    if (amt && !isNaN(amt)) {
      params.push(`am=${encodeURIComponent(parseFloat(amt).toFixed(2))}`);
      params.push('cu=INR');
    }
    if (ref) params.push(`tr=${encodeURIComponent(ref)}`);
    if (note) params.push(`tn=${encodeURIComponent(note)}`);
    const uri = `upi://pay?${params.join('&')}`;

    // Create Mini Standee Card
    const card = document.createElement('div');
    card.className = 'batch-mini-card';
    const qrId = `batch-qr-${idx}`;
    card.innerHTML = `
      <h5>${escapeHtml(name)}</h5>
      <p>${escapeHtml(vpa)}</p>
      <div id="${qrId}" class="mini-qr-box"></div>
      <strong>${amt ? `₹${parseFloat(amt).toFixed(2)}` : 'Scan to Pay'}</strong>
    `;
    dom.batchCardsContainer.appendChild(card);

    // Render QR
    setTimeout(() => {
      new QRCode(document.getElementById(qrId), {
        text: uri,
        width: 140,
        height: 140,
        colorDark: '#0f172a',
        colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.M
      });
    }, 10);
  });

  dom.batchCountBadge.textContent = count;
  showToast(`Generated ${count} Batch UPI QR Codes!`);
}

function loadBatchSample() {
  dom.batchInputArea.value = `merchant@okaxis, Main Counter, 250.00, TBL-01, Table 1
store@okhdfcbank, Downtown Stall, 150.00, TBL-02, Table 2
rider1@ybl, Express Delivery, 499.00, ORD-881, Food Delivery
store@paytm, Cashier Desk 3, 99.00, TBL-03, Snack Bar`;
  processBatchInput();
}

/* ==========================================================================
   MODULE: DEEP LINK PARSER & VERIFIER
   ========================================================================== */

function executeParse() {
  const raw = dom.parserInputText.value.trim();
  if (!raw.startsWith('upi://pay?')) {
    dom.parserVerdictBadge.className = 'verdict-badge invalid';
    dom.parserVerdictBadge.textContent = '❌ Invalid Scheme: Must start with upi://pay?';
    dom.parserReportTable.innerHTML = '';
    return;
  }

  const queryStr = raw.replace('upi://pay?', '');
  const urlParams = new URLSearchParams(queryStr);

  const pa = urlParams.get('pa');
  const pn = urlParams.get('pn');
  const am = urlParams.get('am');
  const cu = urlParams.get('cu');
  const tr = urlParams.get('tr');
  const tn = urlParams.get('tn');
  const mc = urlParams.get('mc');
  const mam = urlParams.get('mam');
  const mode = urlParams.get('mode');
  const sign = urlParams.get('sign');

  const rows = [
    {
      k: 'pa',
      meaning: 'Payee VPA Address',
      val: pa,
      status: pa && pa.includes('@') ? '✔ Compliant VPA' : '❌ Required (@ handle missing)'
    },
    {
      k: 'pn',
      meaning: 'Payee Name',
      val: pn,
      status: pn ? '✔ Compliant' : '⚠ Missing (Highly Recommended)'
    },
    {
      k: 'am',
      meaning: 'Amount',
      val: am,
      status: am ? (!isNaN(am) && parseFloat(am) > 0 ? '✔ Valid Amount' : '❌ Non-numeric') : '— Manual entry'
    },
    {
      k: 'cu',
      meaning: 'Currency Code',
      val: cu,
      status: am ? (cu === 'INR' ? '✔ Compliant (INR)' : '❌ Must be INR when am is present') : '—'
    },
    {
      k: 'tr',
      meaning: 'Transaction Reference',
      val: tr,
      status: tr ? '✔ Present' : '— Optional for P2P'
    },
    {
      k: 'tn',
      meaning: 'Transaction Note',
      val: tn,
      status: tn ? (tn.length <= 50 ? '✔ Max 50 Chars OK' : '❌ Exceeds 50 chars') : '—'
    },
    {
      k: 'mc',
      meaning: 'Merchant Category Code',
      val: mc,
      status: mc ? (mc.length === 4 ? '✔ 4-digit MCC' : '❌ Must be 4 digits') : '—'
    },
    {
      k: 'mam',
      meaning: 'Minimum Amount (MAM)',
      val: mam,
      status: mam ? '✔ Partial Payment Allowed' : '— Strict lock'
    },
    {
      k: 'mode',
      meaning: 'Initiation Mode',
      val: mode,
      status: mode ? `✔ Mode ${mode}` : '— Default (00)'
    },
    {
      k: 'sign',
      meaning: 'PKI Digital Signature',
      val: sign ? `${sign.substring(0, 16)}...` : null,
      status: sign ? '✔ Signed payload' : '— Unsigned'
    }
  ];

  const hasPa = pa && pa.includes('@');
  const cuValid = !am || cu === 'INR';

  if (hasPa && cuValid) {
    dom.parserVerdictBadge.className = 'verdict-badge valid';
    dom.parserVerdictBadge.textContent = '✔ Fully Valid NPCI Protocol Link';
  } else {
    dom.parserVerdictBadge.className = 'verdict-badge invalid';
    dom.parserVerdictBadge.textContent = '❌ Non-Compliant NPCI Format';
  }

  dom.parserReportTable.innerHTML = rows.map((r) => `
    <tr>
      <td><code>${r.k}</code></td>
      <td>${r.meaning}</td>
      <td><strong>${r.val ? escapeHtml(r.val) : '—'}</strong></td>
      <td>${r.status}</td>
    </tr>
  `).join('');

  showToast('Verified NPCI Link Parameters');
}

/* ==========================================================================
   MODULE: LIVE CAMERA QR SCANNER
   ========================================================================== */

let html5QrScannerInstance = null;
let isCameraActive = false;

function handleDecodedQrText(decodedText) {
  dom.scannerResultBadge.style.display = 'inline-block';
  dom.scannerDecodedText.textContent = decodedText;
  dom.scannerActionsZone.style.display = 'flex';

  if (decodedText.startsWith('upi://pay')) {
    dom.btnPayDecodedUri.href = decodedText;
    dom.btnPayDecodedUri.style.display = 'inline-flex';
  } else {
    dom.btnPayDecodedUri.style.display = 'none';
  }

  showToast('QR Code Decoded Successfully!');
}

function toggleCameraScanner() {
  if (!window.Html5Qrcode) {
    showToast('Scanner library still initializing...');
    return;
  }

  if (isCameraActive) {
    if (html5QrScannerInstance) {
      html5QrScannerInstance.stop().then(() => {
        isCameraActive = false;
        dom.btnToggleCameraText.textContent = 'Start Camera Scanner';
        showToast('Camera stopped');
      }).catch((err) => console.error(err));
    }
  } else {
    html5QrScannerInstance = new Html5Qrcode('qrReaderContainer');
    html5QrScannerInstance.start(
      { facingMode: 'environment' },
      { fps: 15, qrbox: { width: 220, height: 220 } },
      (decodedText) => {
        handleDecodedQrText(decodedText);
        // Optionally stop after first hit
      },
      (err) => {}
    ).then(() => {
      isCameraActive = true;
      dom.btnToggleCameraText.textContent = 'Stop Camera Scanner';
      showToast('Camera active — Aim at any UPI QR');
    }).catch((err) => {
      console.error(err);
      showToast('Camera permission denied or camera unavailable');
    });
  }
}

function scanQrFromFile(e) {
  const file = e.target.files[0];
  if (!file) return;

  if (!window.Html5Qrcode) {
    showToast('Scanner engine initializing...');
    return;
  }

  const scanner = new Html5Qrcode('qrReaderContainer');
  scanner.scanFile(file, true)
    .then((decodedText) => {
      handleDecodedQrText(decodedText);
    })
    .catch((err) => {
      showToast('No scannable QR code found in image');
    });
}

function loadDecodedIntoWorkbench() {
  const text = dom.scannerDecodedText.textContent;
  if (!text || !text.startsWith('upi://pay?')) {
    showToast('Not a standard upi://pay link');
    return;
  }

  const urlParams = new URLSearchParams(text.replace('upi://pay?', ''));
  const pa = urlParams.get('pa');
  const pn = urlParams.get('pn');
  const am = urlParams.get('am');
  const tr = urlParams.get('tr');
  const tn = urlParams.get('tn');

  if (pa && pa.includes('@')) {
    const [u, h] = pa.split('@');
    dom.username.value = u;
    dom.handle.value = h;
  }
  if (pn) dom.payeeName.value = pn;
  if (am) dom.amount.value = am;
  if (tr) dom.txRef.value = tr;
  if (tn) dom.txNote.value = tn;

  switchModule('tab-qr');
  refreshAll();
  showToast('Loaded into Studio Cockpit!');
}

/* ==========================================================================
   NAVIGATION TAB SWITCHING
   ========================================================================== */

function switchModule(targetTab) {
  // Update nav tabs
  document.querySelectorAll('.segment-tab').forEach((t) => {
    const isTarget = t.getAttribute('data-tab') === targetTab;
    t.classList.toggle('active', isTarget);
    t.setAttribute('aria-selected', isTarget ? 'true' : 'false');
  });

  // Dual cockpit tabs (QR, Intent, Button)
  const isCockpit = ['tab-qr', 'tab-intent', 'tab-button'].includes(targetTab);

  dom.viewPrimary.style.display = isCockpit ? 'grid' : 'none';
  dom.viewInvoice.style.display = targetTab === 'tab-invoice' ? 'block' : 'none';
  dom.viewSoundbox.style.display = targetTab === 'tab-soundbox' ? 'block' : 'none';
  dom.viewScanner.style.display = targetTab === 'tab-scanner' ? 'block' : 'none';
  dom.viewBatch.style.display = targetTab === 'tab-batch' ? 'block' : 'none';
  dom.viewParser.style.display = targetTab === 'tab-parser' ? 'block' : 'none';

  if (isCockpit) {
    document.querySelectorAll('.tab-content').forEach((c) => {
      c.classList.toggle('active', c.id === targetTab);
    });
  }

  if (targetTab === 'tab-invoice') updateInvoicePreview();
}

/* ==========================================================================
   SHARE URL STATE
   ========================================================================== */

function shareCurrentConfig() {
  const params = new URLSearchParams();
  params.set('user', dom.username.value);
  params.set('handle', dom.handle.value);
  params.set('name', dom.payeeName.value);
  params.set('am', dom.amount.value);
  params.set('tr', dom.txRef.value);
  params.set('tn', dom.txNote.value);

  const shareUrl = `${window.location.origin}${window.location.pathname}#${params.toString()}`;
  copyToClipboard(shareUrl, 'Sharable Studio Link copied!');
}

function restoreFromHash() {
  if (!window.location.hash) return;
  try {
    const params = new URLSearchParams(window.location.hash.substring(1));
    if (params.get('user')) dom.username.value = params.get('user');
    if (params.get('handle')) dom.handle.value = params.get('handle');
    if (params.get('name')) dom.payeeName.value = params.get('name');
    if (params.get('am')) dom.amount.value = params.get('am');
    if (params.get('tr')) dom.txRef.value = params.get('tr');
    if (params.get('tn')) dom.txNote.value = params.get('tn');
  } catch (e) {}
}

/* ==========================================================================
   EVENT ATTACHMENTS
   ========================================================================== */

function bindAllEvents() {
  // Live Cockpit Listeners
  const liveInputs = [
    dom.username, dom.handle, dom.payeeName, dom.amount, dom.txRef, dom.txNote,
    dom.mcc, dom.minAmount, dom.mode, dom.url, dom.sign, dom.standeeTheme,
    dom.qrDark, dom.qrLight, dom.qrCenterLogo, dom.qrEccLevel, dom.qrSize,
    dom.qrQuietZone, dom.btnThemePreset, dom.btnTextCustom, dom.btnShowAmount, dom.btnShowIcons
  ];

  liveInputs.forEach((el) => {
    if (!el) return;
    el.addEventListener('input', refreshAll);
    el.addEventListener('change', refreshAll);
  });

  // Handle Quick Chips
  document.querySelectorAll('.handle-chip').forEach((chip) => {
    chip.addEventListener('click', (e) => {
      dom.handle.value = e.target.getAttribute('data-handle');
      refreshAll();
    });
  });

  // Quick Amount Chips
  document.querySelectorAll('.amt-chip').forEach((chip) => {
    chip.addEventListener('click', (e) => {
      dom.amount.value = e.target.getAttribute('data-amt');
      refreshAll();
    });
  });

  // Generate Reference Button
  dom.btnGenRef.addEventListener('click', () => {
    dom.txRef.value = generateOrderId();
    refreshAll();
    showToast('Generated fresh Order Ref!');
  });

  // Standee Download Actions
  dom.btnDownloadPNG.addEventListener('click', downloadStandeeCardPng);
  dom.btnDownloadSVG.addEventListener('click', downloadStandeeSvg);
  dom.btnDownloadQROnly.addEventListener('click', downloadRawQrOnly);
  dom.btnPrintQR.addEventListener('click', () => window.print());

  // Copy Buttons
  dom.btnCopyUri.addEventListener('click', () => copyToClipboard(dom.intentUriCode.textContent, 'UPI URI copied!'));
  dom.btnCopyHtml.addEventListener('click', () => copyToClipboard(dom.htmlSnippetCode.textContent, 'Button HTML copied!'));
  dom.btnCopyUniversalScript.addEventListener('click', () => copyToClipboard(dom.jsUniversalSnippetCode.textContent, 'Universal Script copied!'));

  // Quick Share Actions (WhatsApp, SMS)
  dom.btnShareWhatsApp.addEventListener('click', () => {
    const uri = buildUpiUri('upi');
    const msg = encodeURIComponent(`Pay ${dom.payeeName.value} via UPI: ${uri}`);
    window.open(`https://api.whatsapp.com/send?text=${msg}`, '_blank');
  });

  dom.btnShareSMS.addEventListener('click', () => {
    const uri = buildUpiUri('upi');
    window.open(`sms:?body=${encodeURIComponent(`Pay ${dom.payeeName.value} via UPI: ${uri}`)}`, '_blank');
  });

  dom.btnCopyShortLink.addEventListener('click', shareCurrentConfig);
  dom.btnQuickShare.addEventListener('click', shareCurrentConfig);

  // Tab Navigation Switching
  document.querySelectorAll('.segment-tab').forEach((tab) => {
    tab.addEventListener('click', () => switchModule(tab.getAttribute('data-tab')));
  });

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

  // Invoice Events
  const invInputs = [
    dom.invNumber, dom.invDate, dom.invDueDate, dom.invSellerName,
    dom.invSellerGST, dom.invClientName, dom.invClientGST, dom.invNotes
  ];
  invInputs.forEach((el) => {
    if (!el) return;
    el.addEventListener('input', updateInvoicePreview);
  });

  dom.btnAddLineItem.addEventListener('click', () => {
    state.invoiceItems.push({ desc: 'Additional Consulting Services', qty: 1, rate: 1000, gst: 18 });
    renderInvoiceItemsInput();
    updateInvoicePreview();
  });

  dom.lineItemsBody.addEventListener('input', (e) => {
    const idx = parseInt(e.target.getAttribute('data-idx'), 10);
    if (isNaN(idx) || !state.invoiceItems[idx]) return;

    if (e.target.classList.contains('item-desc')) state.invoiceItems[idx].desc = e.target.value;
    if (e.target.classList.contains('item-qty')) state.invoiceItems[idx].qty = parseFloat(e.target.value) || 0;
    if (e.target.classList.contains('item-rate')) state.invoiceItems[idx].rate = parseFloat(e.target.value) || 0;
    if (e.target.classList.contains('item-gst')) state.invoiceItems[idx].gst = parseFloat(e.target.value) || 0;

    renderInvoiceItemsInput();
    updateInvoicePreview();
  });

  dom.lineItemsBody.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-delete-row')) {
      const idx = parseInt(e.target.getAttribute('data-idx'), 10);
      state.invoiceItems.splice(idx, 1);
      renderInvoiceItemsInput();
      updateInvoicePreview();
    }
  });

  dom.btnResetInvoice.addEventListener('click', () => {
    state.invoiceItems = [{ desc: 'General Services', qty: 1, rate: 500, gst: 18 }];
    renderInvoiceItemsInput();
    updateInvoicePreview();
  });

  dom.btnDownloadInvoicePDF.addEventListener('click', downloadInvoicePdf);
  dom.btnPrintInvoice.addEventListener('click', () => window.print());

  // Soundbox Events
  dom.btnTestSoundboxVoice.addEventListener('click', triggerSoundboxVoice);
  dom.btnClearSoundboxLog.addEventListener('click', () => {
    dom.soundboxLogList.innerHTML = '<div class="log-empty">History cleared.</div>';
  });

  // Batch Events
  dom.btnProcessBatch.addEventListener('click', processBatchInput);
  dom.btnLoadBatchSample.addEventListener('click', loadBatchSample);
  dom.btnBatchPrintAll.addEventListener('click', () => window.print());

  // Parser Events
  dom.btnExecuteParse.addEventListener('click', executeParse);

  // Scanner Events
  if (dom.btnToggleCamera) dom.btnToggleCamera.addEventListener('click', toggleCameraScanner);
  if (dom.qrFileInput) dom.qrFileInput.addEventListener('change', scanQrFromFile);
  if (dom.btnLoadIntoWorkbench) dom.btnLoadIntoWorkbench.addEventListener('click', loadDecodedIntoWorkbench);

  // Mobile Sticky Bar Actions
  if (dom.mobileDirectPayBtn) {
    dom.mobileDirectPayBtn.addEventListener('click', () => {
      window.location.href = buildUpiUri('upi');
    });
  }
  if (dom.mobileQuickShareBtn) {
    dom.mobileQuickShareBtn.addEventListener('click', shareCurrentConfig);
  }
}

// Initial Boot
document.addEventListener('DOMContentLoaded', () => {
  restoreFromHash();
  initInvoiceDates();
  renderInvoiceItemsInput();
  bindAllEvents();
  refreshAll();
  executeParse();
});
