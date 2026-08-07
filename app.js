// GANTI dengan URL Web App dari Google Apps Script setelah deploy
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycby_gsUnHIKW1DzJ7PHYtkw9X9JyiRHQTNKDMUHvPU7QYbAy-uahVbwhbEsAeXEYJ8NC1Q/exec";

const SHEET_ID = "1K_BsOd1Za3LvLQwcZvfKYXMq54pP0UAMLPJGojz7zjw";
const API_AKUN = `https://opensheet.elk.sh/${SHEET_ID}/akun`;

function applyTheme(){
  const theme = localStorage.getItem("themeColor") || "theme-blue";
  document.body.classList.remove("theme-blue", "theme-purple", "theme-green", "theme-orange");
  document.body.classList.add(theme);
}

function setTheme(theme){
  localStorage.setItem("themeColor", theme);
  applyTheme();
}

document.addEventListener("DOMContentLoaded", applyTheme);

async function login(){
  const nik = document.getElementById("nik").value.trim();
  const pass = document.getElementById("password").value.trim();
  const remember = document.getElementById("remember").checked;

  const btn = document.getElementById("loginBtn");
  const loading = document.getElementById("loading");

  btn.disabled = true;
  loading.style.display = "block";

  try{
    const res = await fetch(API_AKUN);
    const data = await res.json();

    const user = data.find(m => String(m.NIK) === nik && String(m.PASSWORD) === pass);

    if(user){
      localStorage.setItem("user", JSON.stringify(user));

      if(remember){
        localStorage.setItem("rememberNik", nik);
      }else{
        localStorage.removeItem("rememberNik");
      }

      location.href = "home.html";
    }else{
      alert("Login gagal");
    }
  }catch(e){
    console.error(e);
    alert("Server error, cek koneksi / spreadsheet akun");
  }

  btn.disabled = false;
  loading.style.display = "none";
}

function logout(){
  localStorage.removeItem("user");
  location.href = "index.html";
}

function go(page){
  location.href = page + ".html";
}

function getUser(){
  return JSON.parse(localStorage.getItem("user"));
}

function getLaporan(){
  return JSON.parse(localStorage.getItem("laporan") || "[]");
}

function saveLaporanLocal(data){
  const laporan = getLaporan();
  laporan.push(data);
  localStorage.setItem("laporan", JSON.stringify(laporan));
}

async function saveLaporanSheet(data){
  if(!APPS_SCRIPT_URL || APPS_SCRIPT_URL.includes("PASTE_URL")){
    throw new Error("URL Google Apps Script belum diisi di app.js");
  }

  const res = await fetch(APPS_SCRIPT_URL, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(data)
  });

  const result = await res.json();

  if(!result.success){
    throw new Error(result.message || "Gagal simpan ke spreadsheet");
  }

  return result;
}

async function saveLaporan(data){
  saveLaporanLocal(data);
  return await saveLaporanSheet(data);
}
