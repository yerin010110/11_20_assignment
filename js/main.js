// 페이지 로드 후 초기화
document.addEventListener("DOMContentLoaded", () => {
  initHamburgerMenu();
  initSmoothScroll();
  initNavHighlight();
  initScrollReveal();
  initTopButton();
  initProjectModal();
  initGreeting();
  initThemeToggle();
});

// 0. 햄버거 메뉴
function initHamburgerMenu() {
  const btn = document.getElementById("navToggle");
  const nav = document.querySelector(".main-nav");
  if (!btn || !nav) return;

  btn.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    btn.classList.toggle("open", isOpen);
  });

  // 메뉴 항목 클릭 시 자동 닫기
  nav.addEventListener("click", (e) => {
    if (e.target.tagName === "A") {
      nav.classList.remove("open");
      btn.classList.remove("open");
    }
  });

  // 화면 다시 넓어지면 강제 닫기
  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) {
      nav.classList.remove("open");
      btn.classList.remove("open");
    }
  });
}

// 1. 상단 메뉴 부드러운 스크롤
function initSmoothScroll() {
  const header = document.querySelector(".site-header");
  const headerHeight = header ? header.offsetHeight : 0;

  const links = document.querySelectorAll('.main-nav a[href^="#"]');
  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const id = link.getAttribute("href");
      const target = document.querySelector(id);
      if (!target) return;

      const targetTop =
        target.getBoundingClientRect().top + window.scrollY - headerHeight + 1;

      window.scrollTo({
        top: targetTop,
        behavior: "smooth",
      });
    });
  });
}

// 2. 현재 섹션에 맞는 메뉴 하이라이트
function initNavHighlight() {
  const sections = Array.from(document.querySelectorAll("section[id]"));
  const navLinks = Array.from(
    document.querySelectorAll('.main-nav a[href^="#"]')
  );
  if (!sections.length || !navLinks.length) return;

  function updateActiveLink() {
    // 화면 중앙 기준으로 "가장 가까운 섹션"을 현재 섹션으로 판단
    const viewportCenter = window.innerHeight / 2;

    let currentId = sections[0].id;
    let minDiff = Infinity;

    sections.forEach((sec) => {
      const rect = sec.getBoundingClientRect();
      const secCenter = rect.top + rect.height / 2; // 섹션의 화면상 중앙 위치
      const diff = Math.abs(secCenter - viewportCenter);

      if (diff < minDiff) {
        minDiff = diff;
        currentId = sec.id;
      }
    });

    // 메뉴 active 토글
    navLinks.forEach((link) => {
      const hrefId = link.getAttribute("href").substring(1); // "#skills" → "skills"
      link.classList.toggle("active", hrefId === currentId);
    });
  }

  window.addEventListener("scroll", updateActiveLink);
  // 처음 들어왔을 때도 한 번 실행
  updateActiveLink();
}

// 3. 섹션 스크롤 인 애니메이션
function initScrollReveal() {
  const targets = document.querySelectorAll(".section.reveal");
  if (!targets.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
    }
  );

  targets.forEach((sec) => observer.observe(sec));
}

// 4. TOP 버튼
function initTopButton() {
  const btn = document.getElementById("toTopBtn");
  if (!btn) return;

  window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
      btn.classList.add("show");
    } else {
      btn.classList.remove("show");
    }
  });

  btn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}

// 5. 프로젝트 모달
function initProjectModal() {
  const cards = document.querySelectorAll(".project-card");
  const modal = document.getElementById("projectModal");
  if (!cards.length || !modal) return;

  const titleEl = modal.querySelector(".modal-title");
  const bodyEl = modal.querySelector(".modal-body");

  function openModal(title, body) {
    titleEl.textContent = title;
    bodyEl.textContent = body;
    modal.classList.add("open");
  }

  function closeModal() {
    modal.classList.remove("open");
  }

  cards.forEach((card) => {
    card.addEventListener("click", () => {
      const title = card.dataset.title || card.querySelector("h3").textContent;
      const desc = card.dataset.desc || "";
      openModal(title, desc);
    });
  });

  modal.addEventListener("click", (e) => {
    if (e.target.dataset.close === "true") {
      closeModal();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeModal();
    }
  });
}

// 6. 시간대별 인삿말
function initGreeting() {
  const span = document.getElementById("greetingText");
  if (!span) return;

  const now = new Date();
  const hour = now.getHours();
  let msg = "안녕하세요,";

  if (hour < 12) {
    msg = "좋은 아침입니다,";
  } else if (hour < 18) {
    msg = "좋은 오후입니다,";
  } else {
    msg = "좋은 저녁입니다,";
  }

  span.textContent = msg;
}

// 7. 다크 모드 토글
function initThemeToggle() {
  const btn = document.getElementById("themeToggle");
  if (!btn) return;

  // 저장된 모드 불러오기
  const saved = localStorage.getItem("theme");
  if (saved === "dark") {
    document.body.classList.add("dark");
    btn.textContent = "라이트 모드";
  } else {
    btn.textContent = "다크 모드";
  }

  btn.addEventListener("click", () => {
    const isDark = document.body.classList.toggle("dark");
    btn.textContent = isDark ? "라이트 모드" : "다크 모드";
    localStorage.setItem("theme", isDark ? "dark" : "light");
  });
}
