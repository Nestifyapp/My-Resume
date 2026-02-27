// ====== Mobile menu ======
const drawer = document.getElementById("drawer");
const backdrop = document.getElementById("backdrop");
const openMenu = document.getElementById("openMenu");
const closeMenu = document.getElementById("closeMenu");
const drawerLinks = document.querySelectorAll(".drawer-link");

function openDrawer(){
  drawer.classList.add("open");
  backdrop.classList.add("open");
}
function closeDrawer(){
  drawer.classList.remove("open");
  backdrop.classList.remove("open");
}
openMenu?.addEventListener("click", openDrawer);
closeMenu?.addEventListener("click", closeDrawer);
backdrop?.addEventListener("click", closeDrawer);
drawerLinks.forEach(a => a.addEventListener("click", closeDrawer));

// ====== EMAILJS CONFIG ======
const EMAILJS_PUBLIC_KEY = "YOUR_PUBLIC_KEY";
const EMAILJS_SERVICE_ID = "YOUR_SERVICE_ID";
const EMAILJS_TEMPLATE_ID = "YOUR_TEMPLATE_ID";

(function initEmailJS(){
  if (!window.emailjs) return;
  emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
})();

document.getElementById("year").textContent = new Date().getFullYear();

// ===== Project filter =====
const filterButtons = document.querySelectorAll(".tag[data-filter]");
const projectCards = document.querySelectorAll(".proj[data-type]");

filterButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    filterButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    const f = btn.getAttribute("data-filter");
    projectCards.forEach(card => {
      const type = card.getAttribute("data-type");
      card.style.display = (f === "all" || type === f) ? "" : "none";
    });
  });
});

// ===== Project Details Modal (✅ FIXED: not inside form submit) =====
const projModal = document.getElementById("projModal");
const projBackdrop = document.getElementById("projBackdrop");
const mTitle = document.getElementById("mTitle");
const mTech = document.getElementById("mTech");
const mBody = document.getElementById("mBody");
const mLink = document.getElementById("mLink");
const mClose = document.getElementById("mClose");
const mClose2 = document.getElementById("mClose2");

function escapeHtml(str){
  return String(str)
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}

function openProjectModal(card){
  const title = card.getAttribute("data-title") || "Project";
  const tech  = card.getAttribute("data-tech") || "";
  const link  = card.getAttribute("data-link") || "#";

  const d1 = card.getAttribute("data-desc");
  const d2 = card.getAttribute("data-desc2");
  const d3 = card.getAttribute("data-desc3");

  mTitle.textContent = title;
  mTech.textContent = tech;

  const parts = [d1, d2, d3].filter(Boolean);
  mBody.innerHTML = parts.map(t => `<p>${escapeHtml(t)}</p>`).join("");

  if (!link || link === "#"){
    mLink.style.display = "none";
  } else {
    mLink.style.display = "inline-flex";
    mLink.href = link;
    mLink.textContent = link.includes("play.google.com") ? "Open Play Store" : "Open Link";
  }

  projModal.classList.add("open");
  projBackdrop.classList.add("open");
}

function closeProjectModal(){
  projModal.classList.remove("open");
  projBackdrop.classList.remove("open");
}

// Bind “Details” buttons (works even if cards are filtered)
document.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-open-project]");
  if (!btn) return;
  const card = btn.closest(".proj");
  if (card) openProjectModal(card);
});

mClose?.addEventListener("click", closeProjectModal);
mClose2?.addEventListener("click", closeProjectModal);
projBackdrop?.addEventListener("click", closeProjectModal);
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeProjectModal();
});

// ===== Contact form send =====
const form = document.getElementById("contactForm");
const sendBtn = document.getElementById("sendBtn");
const ok = document.getElementById("statusOk");
const err = document.getElementById("statusErr");

function show(el){ el.style.display = "block"; }
function hide(el){ el.style.display = "none"; }

form?.addEventListener("submit", async (e) => {
  e.preventDefault();
  hide(ok); hide(err);

  if (EMAILJS_PUBLIC_KEY.includes("YOUR_") || EMAILJS_SERVICE_ID.includes("YOUR_") || EMAILJS_TEMPLATE_ID.includes("YOUR_")) {
    show(err);
    err.textContent = "⚠️ Email sending is not configured yet. Add your EmailJS keys in app.js.";
    return;
  }

  sendBtn.disabled = true;
  const prev = sendBtn.textContent;
  sendBtn.textContent = "Sending…";

  try{
    await emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, form);
    show(ok);
    form.reset();
  }catch(e2){
    console.error(e2);
    show(err);
  }finally{
    sendBtn.disabled = false;
    sendBtn.textContent = prev;
  }
});
