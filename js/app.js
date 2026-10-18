/* CyberLearn — логика входа/регистрации (учебная, всё хранится в браузере) */
(function () {
  "use strict";

  var USERS_KEY = "cl_users";
  var SESSION_KEY = "cl_session";
  var PENDING_KEY = "cl_pending";

  // Демо-аккаунт, чтобы можно было сразу войти
  var DEMO = { student_01: { email: "student@mail.ru", password: "cyber123" } };

  function read(store, key, fallback) {
    try {
      var v = store.getItem(key);
      return v ? JSON.parse(v) : fallback;
    } catch (e) { return fallback; }
  }
  function write(store, key, value) {
    try { store.setItem(key, JSON.stringify(value)); } catch (e) { /* storage недоступен */ }
  }
  function remove(store, key) {
    try { store.removeItem(key); } catch (e) { /* ignore */ }
  }

  var ls = window.localStorage;
  var ss = window.sessionStorage;

  function getUsers() {
    var users = read(ls, USERS_KEY, {});
    for (var k in DEMO) if (!users[k]) users[k] = DEMO[k];
    return users;
  }

  function go(url) { window.location.href = url; }

  var page = document.body.getAttribute("data-page");

  /* ---------- 01 Вход / 03 Доступ запрещён ---------- */
  if (page === "login") {
    var form = document.getElementById("login-form");
    var login = document.getElementById("login");
    var pass = document.getElementById("password");
    var status = document.getElementById("login-status");

    var params = new URLSearchParams(window.location.search);
    if (params.get("error")) {
      var last = read(ss, PENDING_KEY, null);
      if (last && last.login) login.value = last.login;
      login.classList.add("is-error");
      pass.classList.add("is-error");
      status.hidden = false;
      remove(ss, PENDING_KEY);
    }

    [login, pass].forEach(function (el) {
      el.addEventListener("input", function () {
        login.classList.remove("is-error");
        pass.classList.remove("is-error");
        status.hidden = true;
      });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = login.value.trim();
      var users = getUsers();
      var ok = !!(name && users[name] && users[name].password === pass.value);
      write(ss, PENDING_KEY, { login: name, ok: ok });
      go("check.html");
    });
  }

  /* ---------- 02 Регистрация ---------- */
  if (page === "register") {
    var rForm = document.getElementById("register-form");
    var rError = document.getElementById("register-error");

    rForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = rForm.login.value.trim();
      var email = rForm.email.value.trim();
      var p1 = rForm.password.value;
      var p2 = rForm.password2.value;
      var users = getUsers();
      var msg = "";
      var bad = [];

      if (!/^[A-Za-z0-9_]{3,20}$/.test(name)) { msg = "Логин: 3–20 символов, латиница, цифры и _"; bad.push("login"); }
      else if (users[name]) { msg = "Такой логин уже занят"; bad.push("login"); }
      else if (!/^\S+@\S+\.\S+$/.test(email)) { msg = "Проверьте e-mail"; bad.push("email"); }
      else if (p1.length < 6) { msg = "Пароль должен быть не короче 6 символов"; bad.push("password"); }
      else if (p1 !== p2) { msg = "Пароли не совпадают"; bad.push("password", "password2"); }

      Array.prototype.forEach.call(rForm.querySelectorAll(".field__input"), function (el) {
        el.classList.toggle("is-error", bad.indexOf(el.name) !== -1);
      });

      if (msg) {
        rError.querySelector(".status__text").textContent = msg;
        rError.hidden = false;
        return;
      }

      var stored = read(ls, USERS_KEY, {});
      stored[name] = { email: email, password: p1 };
      write(ls, USERS_KEY, stored);
      write(ss, PENDING_KEY, { login: name, ok: true });
      go("check.html");
    });
  }

  /* ---------- 04 Проверка доступа / 05 Доступ разрешён ---------- */
  if (page === "check") {
    var pending = read(ss, PENDING_KEY, null);
    if (!pending) { go("index.html"); return; }

    var card = document.getElementById("check-card");
    var bar = document.getElementById("progress-bar");
    var value = document.getElementById("progress-value");
    var text = document.getElementById("check-text");
    var success = document.getElementById("check-success");

    var target = pending.ok ? 100 : 64; // при ошибке проверка обрывается
    var duration = pending.ok ? 2200 : 1500;
    var start = null;

    function frame(ts) {
      if (start === null) start = ts;
      var t = Math.min(1, (ts - start) / duration);
      var pct = Math.round(target * (1 - Math.pow(1 - t, 2)));
      bar.style.width = pct + "%";
      value.textContent = pct + "%";
      if (t < 1) { requestAnimationFrame(frame); return; }

      if (pending.ok) {
        card.classList.add("is-done");
        text.textContent = "Данные подтверждены";
        success.hidden = false;
        write(ss, SESSION_KEY, { login: pending.login });
        write(ls, SESSION_KEY, { login: pending.login });
        remove(ss, PENDING_KEY);
        setTimeout(function () { go("home.html"); }, 1600);
      } else {
        setTimeout(function () { go("index.html?error=1"); }, 400);
      }
    }
    requestAnimationFrame(frame);
  }

  /* ---------- 06 Главная ---------- */
  if (page === "home") {
    var session = read(ls, SESSION_KEY, null) || read(ss, SESSION_KEY, null);
    if (!session) { go("index.html"); return; }

    document.getElementById("profile-name").textContent = session.login;
    document.getElementById("profile").addEventListener("click", function () {
      remove(ls, SESSION_KEY);
      remove(ss, SESSION_KEY);
      go("index.html");
    });
  }
})();
