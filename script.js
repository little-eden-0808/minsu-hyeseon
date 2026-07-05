/**
 * Simple & Clean Wedding Invitation
 * Korean Mobile 청첩장 - Script
 */

(function () {
  "use strict";

  /* ═══════════════════════════════════════════
     Utility Helpers
     ═══════════════════════════════════════════ */

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  function formatDate(dateStr, timeStr) {
    const d = new Date(`${dateStr}T${timeStr}:00`);
    const days = ["일", "월", "화", "수", "목", "금", "토"];
    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    const date = d.getDate();
    const day = days[d.getDay()];
    const hours = d.getHours();
    const minutes = d.getMinutes();
    const period = hours < 12 ? "오전" : "오후";
    const h12 = hours % 12 || 12;
    const minuteStr = minutes > 0 ? ` ${minutes}분` : "";
    return `${year}년 ${month}월 ${date}일 ${day}요일 ${period} ${h12}시${minuteStr}`;
  }

  function getWeddingDateTime() {
    return new Date(`${CONFIG.wedding.date}T${CONFIG.wedding.time}:00`);
  }

  /* ═══════════════════════════════════════════
     Toast
     ═══════════════════════════════════════════ */

  let toastTimer = null;
  function showToast(message) {
    const el = $("#toast");
    el.textContent = message;
    el.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("is-visible"), 2500);
  }

  /* ═══════════════════════════════════════════
     Clipboard
     ═══════════════════════════════════════════ */

  async function copyToClipboard(text, successMsg) {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.style.cssText = "position:fixed;opacity:0;left:-9999px";
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        document.execCommand("copy");
        ta.remove();
      }
      showToast(successMsg || "복사되었습니다");
    } catch {
      showToast("복사에 실패했습니다");
    }
  }

  /* ═══════════════════════════════════════════
     OG Meta Tags
     ═══════════════════════════════════════════ */

  function setMetaTags() {
    const m = CONFIG.meta;
    document.title = m.title;
    const setMeta = (attr, val, content) => {
      const el = document.querySelector(`meta[${attr}="${val}"]`);
      if (el) el.setAttribute("content", content);
    };
    setMeta("property", "og:title", m.title);
    setMeta("property", "og:description", m.description);
    setMeta("property", "og:image", "images/og/1.jpg");
    setMeta("name", "description", m.description);
  }

  /* ═══════════════════════════════════════════
     Curtain (Simple Overlay)
     ═══════════════════════════════════════════ */

  function initCurtain() {
    const curtain = $("#curtain");
    const btn = $("#curtainBtn");
    const namesEl = $("#curtainNames");

    if (CONFIG.useCurtain === false) {
      curtain.style.display = "none";
      return;
    }

    namesEl.innerHTML = `${CONFIG.groom.name} <span class="amp">&amp;</span> ${CONFIG.bride.name}`;
    document.body.classList.add("no-scroll");

    btn.addEventListener("click", () => {
      curtain.classList.add("is-open");
      document.body.classList.remove("no-scroll");
      setTimeout(() => {
        curtain.classList.add("is-hidden");
      }, 500);
    });
  }

  /* ═══════════════════════════════════════════
     Hero Section
     ═══════════════════════════════════════════ */

  function initHero() {
    $("#heroPhoto").src = "images/hero/2.jpg";
    $("#heroNames").innerHTML =
      `${CONFIG.groom.name}<span class="amp">&amp;</span>${CONFIG.bride.name}`;
    $("#heroDate").textContent = formatDate(
      CONFIG.wedding.date,
      CONFIG.wedding.time,
    );
    $("#heroVenue").textContent = CONFIG.wedding.venue;
  }

  /* ═══════════════════════════════════════════
     Countdown
     ═══════════════════════════════════════════ */

  function initCountdown() {
    const countdownEl = $("#countdown");

    if (CONFIG.useCountdown === false) {
      if (countdownEl) countdownEl.style.display = "none";
      return;
    }

    const target = getWeddingDateTime();

    function update() {
      const now = new Date();
      const diff = target - now;
      const labelEl = $("#countdownLabel");

      if (diff <= 0) {
        $("#countDays").textContent = "0";
        $("#countHours").textContent = "00";
        $("#countMinutes").textContent = "00";
        $("#countSeconds").textContent = "00";
        labelEl.textContent = "결혼식이 시작되었습니다";
        return;
      }

      const totalDays = Math.ceil(diff / (1000 * 60 * 60 * 24));
      labelEl.textContent = `결혼식까지 D-${totalDays}`;

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      $("#countDays").textContent = days;
      $("#countHours").textContent = String(hours).padStart(2, "0");
      $("#countMinutes").textContent = String(minutes).padStart(2, "0");
      $("#countSeconds").textContent = String(seconds).padStart(2, "0");
    }

    update();
    setInterval(update, 1000);
  }

  /* ═══════════════════════════════════════════
     Greeting Section
     ═══════════════════════════════════════════ */

  function initGreeting() {
    $("#greetingTitle").textContent = CONFIG.greeting.title;
    $("#greetingContent").textContent = CONFIG.greeting.content;

    const g = CONFIG.groom;
    const b = CONFIG.bride;

    function parentLine(father, mother, fatherDeceased, motherDeceased) {
      const fd = fatherDeceased ? " deceased" : "";
      const md = motherDeceased ? " deceased" : "";
      return `<span class="${fd}">${father}</span> · <span class="${md}">${mother}</span>`;
    }

    const parentsHTML = `
      <div class="parent-row">
        ${parentLine(g.father, g.mother, g.fatherDeceased, g.motherDeceased)}
        
        의 장남 <span class="child-name">${g.name}</span>
      </div>
      <div class="parent-row">
        ${parentLine(b.father, b.mother, b.fatherDeceased, b.motherDeceased)}
        
        의 장녀 <span class="child-name">${b.name}</span>
      </div>
    `;

    $("#greetingParents").innerHTML = parentsHTML;
  }

  /* ═══════════════════════════════════════════
     Family Section
     ═══════════════════════════════════════════ */

  function initFamily() {
    const g = CONFIG.groom;
    const b = CONFIG.bride;
    const groomLabel = $("#familyGroomLabel");
    const brideLabel = $("#familyBrideLabel");
    if (groomLabel) {
      groomLabel.innerHTML = `${g.father} & ${g.mother}의<br><span class="family__overlay-child">아들 ${g.name}</span>`;
    }
    if (brideLabel) {
      brideLabel.innerHTML = `${b.father} & ${b.mother}의<br><span class="family__overlay-child">딸 ${b.name}</span>`;
    }
  }

  /* ═══════════════════════════════════════════
     Calendar Section
     ═══════════════════════════════════════════ */

  function initCalendar() {
    const dt = getWeddingDateTime();

    // Google Calendar link
    const startDate = dt.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
    const endDt = new Date(dt.getTime() + 2 * 60 * 60 * 1000);
    const endDate =
      endDt.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
    const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(CONFIG.groom.name + " & " + CONFIG.bride.name + " 결혼식")}&dates=${startDate}/${endDate}&location=${encodeURIComponent(CONFIG.wedding.venue + " " + CONFIG.wedding.address)}&details=${encodeURIComponent(" ")}`;
    $("#googleCalBtn").href = gcalUrl;

    // ICS download (Apple Calendar)
    $("#icsDownloadBtn").addEventListener("click", () => {
      const icsContent = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//Wedding//Invitation//KO",
        "BEGIN:VEVENT",
        `DTSTART:${startDate}`,
        `DTEND:${endDate}`,
        `SUMMARY:${CONFIG.groom.name} & ${CONFIG.bride.name} 결혼식`,
        `LOCATION:${CONFIG.wedding.venue} ${CONFIG.wedding.address}`,
        "DESCRIPTION: ",
        "END:VEVENT",
        "END:VCALENDAR",
      ].join("\r\n");

      const blob = new Blob([icsContent], {
        type: "text/calendar;charset=utf-8",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "wedding.ics";
      a.click();
      URL.revokeObjectURL(url);
      showToast("캘린더 파일이 다운로드됩니다");
    });
  }

  /* ═══════════════════════════════════════════
     Gallery Section
     ═══════════════════════════════════════════ */

  function initGallery(thumbs, originals) {
    const grid = $("#galleryGrid");
    const placeholder = grid.querySelector(".loading-placeholder");
    if (placeholder) placeholder.remove();

    if (thumbs.length === 0) {
      const gallerySection = $("#gallery");
      if (gallerySection) gallerySection.style.display = "none";
      return;
    }

    thumbs.forEach((thumbSrc, i) => {
      const div = document.createElement("div");
      div.className = "gallery__item animate-item";
      div.setAttribute("data-animate", "fade-up");
      div.innerHTML = `<img src="${thumbSrc}" alt="" loading="lazy" decoding="async">`;
      div.addEventListener("click", () => openPhotoModal(originals, i));
      grid.appendChild(div);
    });
  }

  /* ═══════════════════════════════════════════
     Photo Modal (with swipe)
     ═══════════════════════════════════════════ */

  let modalImages = [];
  let modalIndex = 0;
  let touchStartX = 0;
  let touchEndX = 0;
  let touchStartY = 0;
  let touchEndY = 0;

  function openPhotoModal(images, index) {
    modalImages = images;
    modalIndex = index;
    showModalImage();
    $("#photoModal").classList.add("is-open");
    document.body.classList.add("no-scroll");
  }

  function closePhotoModal() {
    $("#photoModal").classList.remove("is-open");
    document.body.classList.remove("no-scroll");
  }

  function showModalImage() {
    const img = $("#modalImg");
    img.src = modalImages[modalIndex];
    $("#modalCounter").textContent =
      `${modalIndex + 1} / ${modalImages.length}`;
    $("#modalPrev").style.display = modalIndex > 0 ? "" : "none";
    $("#modalNext").style.display =
      modalIndex < modalImages.length - 1 ? "" : "none";
  }

  function modalNavigate(dir) {
    const newIndex = modalIndex + dir;
    if (newIndex >= 0 && newIndex < modalImages.length) {
      modalIndex = newIndex;
      showModalImage();
    }
  }

  function initPhotoModal() {
    $("#modalClose").addEventListener("click", closePhotoModal);
    $("#modalPrev").addEventListener("click", () => modalNavigate(-1));
    $("#modalNext").addEventListener("click", () => modalNavigate(1));

    const modal = $("#photoModal");
    modal.addEventListener("click", (e) => {
      if (e.target === modal || e.target.id === "modalContainer") {
        closePhotoModal();
      }
    });

    // Keyboard navigation
    document.addEventListener("keydown", (e) => {
      if (!modal.classList.contains("is-open")) return;
      if (e.key === "Escape") closePhotoModal();
      if (e.key === "ArrowLeft") modalNavigate(-1);
      if (e.key === "ArrowRight") modalNavigate(1);
    });

    // Swipe support
    const container = $("#modalContainer");

    container.addEventListener(
      "touchstart",
      (e) => {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
      },
      { passive: true },
    );

    container.addEventListener(
      "touchend",
      (e) => {
        touchEndX = e.changedTouches[0].screenX;
        touchEndY = e.changedTouches[0].screenY;
        handleSwipe();
      },
      { passive: true },
    );
  }

  function handleSwipe() {
    const diffX = touchStartX - touchEndX;
    const diffY = touchStartY - touchEndY;
    const minSwipe = 50;

    if (Math.abs(diffX) < minSwipe || Math.abs(diffX) < Math.abs(diffY)) return;

    if (diffX > 0) {
      modalNavigate(1);
    } else {
      modalNavigate(-1);
    }
  }

  /* ═══════════════════════════════════════════
     Location Section
     ═══════════════════════════════════════════ */

  function initLocation() {
    const w = CONFIG.wedding;
    const setText = (sel, value) => {
      const el = $(sel);
      if (el) el.textContent = value;
    };
    setText("#locationAddress", w.address);
    setText("#locationVenue", `${w.venue} ${w.hall}`);
    setText("#locationHall", w.hall);
    setText("#locationTel", w.tel ? `Tel. ${w.tel}` : "");
    setText("#addressBoxAddr", w.address);
    setText("#addressBoxVenue", w.venue);

    const kakaoBtn = $("#kakaoMapBtn");
    if (kakaoBtn) kakaoBtn.href = w.mapLinks.kakao || "#";
    const naverBtn = $("#naverMapBtn");
    if (naverBtn) naverBtn.href = w.mapLinks.naver || "#";

    const copyBtn = $("#copyAddressBtn");
    if (copyBtn) {
      copyBtn.addEventListener("click", () => {
        copyToClipboard(w.address, "주소가 복사되었습니다");
      });
    }

    const addressEl = $("#locationAddress");
    if (addressEl) {
      addressEl.addEventListener("click", () => {
        copyToClipboard(w.address, "주소가 복사되었습니다");
      });
    }

    initNaverMap();
    initTransport();
  }

  function initTransport() {
    const list = CONFIG.transport;
    const container = document.getElementById("transportList");
    if (!list || !Array.isArray(list) || !container) return;

    list.forEach((t) => {
      const item = document.createElement("div");
      item.className = "transport__item";
      item.innerHTML = `
        <p class="transport__title">${t.icon || ""} ${t.title || ""}</p>
        <p class="transport__desc">${t.desc || ""}</p>
      `;
      container.appendChild(item);
    });
  }

  function initNaverMap() {
    const m = CONFIG.naverMap;
    const mapEl = document.getElementById("naverMap");
    if (!m || !m.clientId || !mapEl) return;

    const script = document.createElement("script");
    script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${encodeURIComponent(m.clientId)}`;
    script.async = true;
    script.onload = () => {
      if (typeof naver === "undefined" || !naver.maps) return;
      const position = new naver.maps.LatLng(m.lat, m.lng);
      const map = new naver.maps.Map(mapEl, {
        center: position,
        zoom: m.zoom || 17,
        zoomControl: true,
        zoomControlOptions: { position: naver.maps.Position.TOP_RIGHT },
      });
      new naver.maps.Marker({
        position,
        map,
        title: CONFIG.wedding.venue,
      });
    };
    document.head.appendChild(script);
  }

  /* ═══════════════════════════════════════════
     Account Section (축의금)
     ═══════════════════════════════════════════ */

  function renderAccounts(accounts, containerId) {
    const container = $(`#${containerId}`);
    accounts.forEach((acc) => {
      const li = document.createElement("li");
      li.className = "account-row";
      const accountText = `${acc.bank} ${acc.number}`;
      li.innerHTML = `
        <div class="account-row__info">
          <p class="account-row__bank">${acc.bank} ${acc.number}</p>
          <p class="account-row__name">${acc.role} ${acc.name || ""}</p>
        </div>
        <button class="account-row__copy" data-account="${accountText}">복사하기</button>
      `;
      container.appendChild(li);
    });
  }

  function initAccounts() {
    renderAccounts(CONFIG.accounts.groom, "groomAccountList");
    renderAccounts(CONFIG.accounts.bride, "brideAccountList");

    // Copy account delegates
    document.addEventListener("click", (e) => {
      const btn = e.target.closest(".account-row__copy");
      if (!btn) return;
      const text = btn.dataset.account;
      copyToClipboard(text, "계좌번호가 복사되었습니다");
    });
  }

  /* ═══════════════════════════════════════════
     Footer
     ═══════════════════════════════════════════ */

  function initFooter() {
    const dt = getWeddingDateTime();
    const year = dt.getFullYear();
    const month = String(dt.getMonth() + 1).padStart(2, "0");
    const day = String(dt.getDate()).padStart(2, "0");
    $("#footerText").textContent = "신부 혜선이가 뚝딱뚝딱 코드 작성해서 개발한 청첩장입니다👩🏻‍💻🤍\nPsalm 23:1";
    // $('#footerText').textContent = `${CONFIG.groom.name} & ${CONFIG.bride.name} — ${year}.${month}.${day}`;
  }

  /* ═══════════════════════════════════════════
     Share Button
     ═══════════════════════════════════════════ */

  /* ═══════════════════════════════════════════
     RSVP (참석 의사 전달)
     ═══════════════════════════════════════════ */

  const RSVP_LS_KEY = "rsvp_dismissed_v1";

  function openRsvpModal() {
    const modal = $("#rsvpModal");
    if (!modal) return;
    modal.classList.add("is-open");
    document.body.classList.add("no-scroll");
  }

  function closeRsvpModal() {
    const modal = $("#rsvpModal");
    if (!modal) return;
    modal.classList.remove("is-open");
    document.body.classList.remove("no-scroll");
    try {
      localStorage.setItem(RSVP_LS_KEY, "1");
    } catch {
      // localStorage 비활성화된 경우 무시
    }
  }

  function initRsvp() {
    const modal = $("#rsvpModal");
    if (!modal) return;

    const backdrop = $("#rsvpBackdrop");
    const closeBtn = $("#rsvpClose");
    const openBtn = $("#rsvpOpenBtn");
    const form = $("#rsvpForm");
    const submitBtn = $("#rsvpSubmit");

    // 닫기 핸들러
    if (closeBtn) closeBtn.addEventListener("click", closeRsvpModal);
    if (backdrop) backdrop.addEventListener("click", closeRsvpModal);

    // 버튼으로 열기
    if (openBtn) openBtn.addEventListener("click", openRsvpModal);

    // 폼 제출
    if (form && submitBtn) {
      form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const data = {
          name: formData.get("name")?.toString().trim() || "",
          phone:
            formData
              .get("phone")
              ?.toString()
              .trim()
              .replace(/[^0-9]/g, "") || "",
          side: formData.get("side")?.toString() || "",
          attendance: formData.get("attendance")?.toString() || "",
        };

        if (!data.name || !data.phone || !data.side || !data.attendance) {
          showToast("모든 항목을 입력해 주세요");
          return;
        }

        if (!CONFIG.rsvp || !CONFIG.rsvp.scriptUrl) {
          showToast("응답 URL이 설정되지 않았습니다");
          return;
        }

        submitBtn.disabled = true;
        submitBtn.textContent = "전송 중...";

        try {
          await fetch(CONFIG.rsvp.scriptUrl, {
            method: "POST",
            body: JSON.stringify(data),
          });
          showToast("소중한 마음 감사합니다 🤍");
          form.reset();
          closeRsvpModal();
        } catch {
          showToast("전송 실패. 다시 시도해 주세요");
        } finally {
          submitBtn.disabled = false;
          submitBtn.textContent = "전달하기";
        }
      });
    }

    // 첫 방문이면 자동 팝업 (살짝 지연으로 페이지 로드 후 자연스럽게)
    let dismissed = false;
    try {
      dismissed = localStorage.getItem(RSVP_LS_KEY) === "1";
    } catch {
      // localStorage 비활성화 — 매번 띄움
    }

    if (!dismissed) {
      setTimeout(openRsvpModal, 1500);
    }
  }

  /* ═══════════════════════════════════════════
     Background Music
     ═══════════════════════════════════════════ */

  const BGM_LS_KEY = "bgm_state_v1";

  function initBgm() {
    const btn = $("#bgmToggle");
    const audio = $("#bgmAudio");
    if (!btn || !audio) return;

    if (!CONFIG.bgm || CONFIG.bgm.enabled === false || !CONFIG.bgm.file) {
      btn.style.display = "none";
      return;
    }

    audio.src = CONFIG.bgm.file;
    audio.volume =
      typeof CONFIG.bgm.volume === "number" ? CONFIG.bgm.volume : 0.5;

    function setPlayingUI(isPlaying) {
      btn.classList.toggle("is-playing", isPlaying);
    }

    function saveState(playing) {
      try {
        localStorage.setItem(BGM_LS_KEY, playing ? "playing" : "paused");
      } catch {
        /* 무시 */
      }
    }

    function readState() {
      try {
        return localStorage.getItem(BGM_LS_KEY);
      } catch {
        return null;
      }
    }

    async function tryPlay() {
      try {
        await audio.play();
        setPlayingUI(true);
        saveState(true);
        return true;
      } catch {
        setPlayingUI(false);
        return false;
      }
    }

    function pause() {
      audio.pause();
      setPlayingUI(false);
      saveState(false);
    }

    btn.addEventListener("click", () => {
      if (audio.paused) {
        tryPlay();
      } else {
        pause();
      }
    });

    setPlayingUI(false);

    // 이전에 재생 중이었으면 자동재생 시도 (브라우저가 막을 수도 있음)
    const previousState = readState();
    if (previousState !== "paused") {
      tryPlay().then((ok) => {
        if (!ok) {
          // 자동재생 실패 — 첫 사용자 클릭 시 한 번만 시도
          const onceListener = () => {
            tryPlay();
            window.removeEventListener("pointerdown", onceListener);
          };
          window.addEventListener("pointerdown", onceListener, { once: true });
        }
      });
    }
  }

  function initShare() {
    const btn = $("#shareBtn");
    if (!btn) return;

    btn.addEventListener("click", async () => {
      const url = window.location.href;
      const title = CONFIG.meta.title;
      const text = CONFIG.meta.description;

      if (navigator.share) {
        try {
          await navigator.share({ title, text, url });
        } catch {
          // 사용자가 공유 취소했거나 실패 — 무시
        }
      } else {
        copyToClipboard(url, "링크가 복사되었습니다");
      }
    });
  }

  /* ═══════════════════════════════════════════
     Loading Placeholders
     ═══════════════════════════════════════════ */

  function showLoadingPlaceholders() {
    const galleryGrid = $("#galleryGrid");

    const placeholderHTML =
      '<div class="loading-placeholder"><span class="loading-dot"></span><span class="loading-dot"></span><span class="loading-dot"></span></div>';

    if (galleryGrid) galleryGrid.innerHTML = placeholderHTML;
  }

  /* ═══════════════════════════════════════════
     Scroll Animations (IntersectionObserver)
     ═══════════════════════════════════════════ */

  function initScrollAnimations() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -40px 0px",
      },
    );

    $$(".animate-item").forEach((el) => observer.observe(el));

    // Re-observe dynamically added items
    const mutObs = new MutationObserver((mutations) => {
      mutations.forEach((m) => {
        m.addedNodes.forEach((node) => {
          if (node.nodeType !== 1) return;
          if (node.classList && node.classList.contains("animate-item")) {
            observer.observe(node);
          }
          if (node.querySelectorAll) {
            node
              .querySelectorAll(".animate-item")
              .forEach((el) => observer.observe(el));
          }
        });
      });
    });

    mutObs.observe(document.body, { childList: true, subtree: true });
  }

  /* ═══════════════════════════════════════════
     Init
     ═══════════════════════════════════════════ */

  function init() {
    setMetaTags();
    initCurtain();
    initHero();
    initCountdown();
    initGreeting();
    initFamily();
    initCalendar();

    showLoadingPlaceholders();

    initPhotoModal();
    initLocation();
    initAccounts();
    initFooter();
    initShare();
    initRsvp();
    initBgm();
    initScrollAnimations();

    // Gallery: 카운트 기반 즉시 빌드 (자동 감지 없음 → 초기 로딩 빠름)
    const galleryThumbs = Array.from(
      { length: CONFIG.gallery.count },
      (_, i) => `images/gallery/thumb/${i + 1}.jpg`,
    );
    const galleryOriginals = galleryThumbs.map((p) =>
      p.replace("/gallery/thumb/", "/gallery/"),
    );
    initGallery(galleryThumbs, galleryOriginals);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
