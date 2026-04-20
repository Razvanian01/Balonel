import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

/* ══════════════════════════════════════════════════════
   DIFFICULTY
══════════════════════════════════════════════════════ */
const DIFFICULTY = {
  easy:   { label:"2-3 ani", speed:[12,20], spawnMs:2000, life:999999, itemSize:[92,118], count:[2,3], streakNeeded:2, emoji:"🌸" },
  medium: { label:"4-5 ani", speed:[24,38], spawnMs:1300, life:999999, itemSize:[76,102], count:[3,5], streakNeeded:3, emoji:"⭐" },
  hard:   { label:"6+ ani",  speed:[40,62], spawnMs:850,  life:7000,   itemSize:[60,88],  count:[4,6], streakNeeded:4, emoji:"🔥" },
};

/* ══════════════════════════════════════════════════════
   COLORS
══════════════════════════════════════════════════════ */
const COLOR_MAP = {
  red:    { name:"Roșu",       hex:"#ff4d6d", glow:"#ff4d6d55", grad:"radial-gradient(circle at 30% 25%,#ffb3c1,#ff4d6d 55%,#c9184a)" },
  blue:   { name:"Albastru",   hex:"#4895ef", glow:"#4895ef55", grad:"radial-gradient(circle at 30% 25%,#90e0ef,#4895ef 55%,#3f37c9)" },
  green:  { name:"Verde",      hex:"#52b788", glow:"#52b78855", grad:"radial-gradient(circle at 30% 25%,#b7e4c7,#52b788 55%,#1b4332)" },
  yellow: { name:"Galben",     hex:"#ffd166", glow:"#ffd16655", grad:"radial-gradient(circle at 30% 25%,#fff3b0,#ffd166 55%,#ef8c14)" },
  purple: { name:"Mov",        hex:"#c77dff", glow:"#c77dff55", grad:"radial-gradient(circle at 30% 25%,#e0c3fc,#c77dff 55%,#7b2d8b)" },
  orange: { name:"Portocaliu", hex:"#f77f00", glow:"#f77f0055", grad:"radial-gradient(circle at 30% 25%,#ffc300,#f77f00 55%,#d62828)" },
  pink:   { name:"Roz",        hex:"#ff6eb4", glow:"#ff6eb455", grad:"radial-gradient(circle at 30% 25%,#ffd6e8,#ff6eb4 55%,#c9006b)" },
  cyan:   { name:"Turcoaz",    hex:"#00c9d4", glow:"#00c9d455", grad:"radial-gradient(circle at 30% 25%,#b2f5f8,#00c9d4 55%,#006b73)" },
};

/* ══════════════════════════════════════════════════════
   VISUAL THEMES — 4 Seasons
══════════════════════════════════════════════════════ */
const THEMES = {
  spring: {
    id:"spring", label:"Primăvară", emoji:"🌸",
    appBg:"linear-gradient(160deg,#fff0f8,#f8f0ff 40%,#f0fff4)",
    sky:"linear-gradient(180deg,#a8d8f0 0%,#c8eaff 25%,#e0f4ff 50%,#d4f7c9 75%,#a8e090 100%)",
    sidebar:"rgba(255,245,255,0.88)",
    msgBar:"rgba(255,245,255,0.90)",
    ground:"🌸🌷🌺🦋🌸🌼🌷🌸🦋🌺",
    sun:true, clouds:true,
    textPrimary:"#2d1040", textSecondary:"#9966aa",
    accent:"#ff6eb4",
  },
  summer: {
    id:"summer", label:"Vară", emoji:"☀️",
    appBg:"linear-gradient(160deg,#fff8e0,#fff0c0 40%,#e8fff0)",
    sky:"linear-gradient(180deg,#1a8fd1 0%,#4eb8f0 20%,#87ceeb 45%,#c8f0a0 75%,#90d060 100%)",
    sidebar:"rgba(255,252,220,0.90)",
    msgBar:"rgba(255,252,220,0.92)",
    ground:"🌻🌊🦎🌴🌻🌺🏖️🌴🦜🌻",
    sun:true, clouds:true,
    textPrimary:"#1a2e00", textSecondary:"#557722",
    accent:"#ffcc00",
  },
  autumn: {
    id:"autumn", label:"Toamnă", emoji:"🍂",
    appBg:"linear-gradient(160deg,#fff4e8,#ffe8d0 40%,#fff0e0)",
    sky:"linear-gradient(180deg,#c07840 0%,#e09050 20%,#f0b060 45%,#d4a870 70%,#a07840 100%)",
    sidebar:"rgba(255,240,220,0.90)",
    msgBar:"rgba(255,240,220,0.92)",
    ground:"🍂🍁🍄🌰🍂🍁🦔🌾🍂🍁",
    sun:true, clouds:false,
    textPrimary:"#3d1a00", textSecondary:"#885522",
    accent:"#f77f00",
  },
  winter: {
    id:"winter", label:"Iarnă", emoji:"❄️",
    appBg:"linear-gradient(160deg,#e8f4ff,#f0f8ff 40%,#e0eeff)",
    sky:"linear-gradient(180deg,#b0c8e8 0%,#c8ddf0 25%,#deeeff 55%,#eef6ff 80%,#f5faff 100%)",
    sidebar:"rgba(230,240,255,0.90)",
    msgBar:"rgba(230,240,255,0.92)",
    ground:"❄️⛄🌨️🦌❄️⛄🌨️❄️⛄🦌",
    sun:false, clouds:true,
    textPrimary:"#0a1a3e", textSecondary:"#4466aa",
    accent:"#4895ef",
  },
};
const COLORS = Object.keys(COLOR_MAP);
const SHAPES = ["circle","square","triangle","star","heart","diamond"];

/* ══════════════════════════════════════════════════════
   STORY WORLDS — exact characters as chosen
══════════════════════════════════════════════════════ */
const WORLDS = {
  bambi: {
    id:"bambi", title:"Lumea lui Bambi", emoji:"🦌", color:"#f5c842",
    sky:"linear-gradient(180deg,#87ceeb 0%,#b0e0ff 22%,#c8f0e0 50%,#d4f7c9 72%,#8bc34a 100%)",
    ground:"🌿🍃🌸🌼🍄🌿🌸🍃🌼🌺",
    celebrate:"leaf", showStars:false,
    // HEROES = targets to find
    heroes:[
      { emoji:"🦌", name:"Bambi",      bg:"radial-gradient(circle at 30% 25%,#ffe8b0,#f5c842 55%,#b8860b)", border:"#f5c842", glow:"rgba(245,200,66,.5)",  sound:"bambi", msg:"🦌 Bambi sare fericit!", sparkle:"🍃" },
      { emoji:"🦡", name:"Flower",     bg:"radial-gradient(circle at 30% 25%,#d4f7c9,#52b788 55%,#1b4332)", border:"#52b788", glow:"rgba(82,183,136,.5)", sound:"hmm",   msg:"🦡 Flower e timid!", sparkle:"🌸" },
    ],
    // DISTRACTORS = background items (cannot be selected as correct)
    distractors:[
      {emoji:"🐰",name:"Iepuraș"},{emoji:"🦔",name:"Arici"},{emoji:"🦌",name:"Cerb mare"},
      {emoji:"🐝",name:"Albinuță"},{emoji:"🌲",name:"Copac"},{emoji:"🌺",name:"Floare"},
      {emoji:"🐦",name:"Pasăre"},
    ],
  },

  elsa: {
    id:"elsa", title:"Magia Elsei", emoji:"❄️", color:"#6ec6f0",
    sky:"linear-gradient(180deg,#0d1b4b 0%,#1a3a6b 25%,#2e6da4 50%,#5ea8d8 75%,#cde8f8 100%)",
    ground:"❄️⛄🌨️💎❄️⛄🌨️❄️💎⛄",
    celebrate:"snow", showStars:false,
    heroes:[
      { emoji:"🧙‍♀️", name:"Elsa",    bg:"radial-gradient(circle at 30% 25%,#dff4ff,#6ec6f0 55%,#1565c0)", border:"#6ec6f0", glow:"rgba(110,198,240,.6)", sound:"elsa", msg:"🧙‍♀️ Elsa îți trimite magie!", sparkle:"❄️" },
      { emoji:"👩‍🦰", name:"Anna",    bg:"radial-gradient(circle at 30% 25%,#ffd6e8,#ff6eb4 55%,#c9006b)", border:"#ff6eb4", glow:"rgba(255,110,180,.5)", sound:"star", msg:"👩‍🦰 Anna e veselă!", sparkle:"💕" },
      { emoji:"🦙",   name:"Sven",    bg:"radial-gradient(circle at 30% 25%,#ffe8b0,#f5c842 55%,#b8860b)", border:"#f5c842", glow:"rgba(245,200,66,.5)", sound:"bambi",msg:"🦙 Sven galopează!", sparkle:"🍃" },
      { emoji:"⛄",   name:"Olaf",    bg:"radial-gradient(circle at 30% 25%,#f0f8ff,#c8e6f0 55%,#5ea8d8)", border:"#c8e6f0", glow:"rgba(200,230,240,.6)", sound:"pop", msg:"⛄ Olaf iubește vara!", sparkle:"☃️" },
      { emoji:"🏔️",  name:"Kristoff",bg:"radial-gradient(circle at 30% 25%,#d4c5a0,#a0856a 55%,#5d4037)", border:"#a0856a", glow:"rgba(160,133,106,.5)", sound:"grr", msg:"🏔️ Kristoff e curajos!", sparkle:"⛏️" },
      { emoji:"🤴",   name:"Hans",    bg:"radial-gradient(circle at 30% 25%,#d0e8ff,#4895ef 55%,#1565c0)", border:"#4895ef", glow:"rgba(72,149,239,.5)",  sound:"good", msg:"🤴 Hans apare!", sparkle:"⚔️" },
      { emoji:"👴",   name:"Ducele",  bg:"radial-gradient(circle at 30% 25%,#ffe4b0,#f77f00 55%,#d62828)", border:"#f77f00", glow:"rgba(247,127,0,.5)",   sound:"bad",  msg:"👴 Ducele de Weselton!", sparkle:"🎩" },
      { emoji:"🧌",   name:"Pabbie",  bg:"radial-gradient(circle at 30% 25%,#c8e6c9,#52b788 55%,#1b4332)", border:"#52b788", glow:"rgba(82,183,136,.5)", sound:"magic",msg:"🧌 Marele Pabbie!", sparkle:"🪨" },
      { emoji:"👸",   name:"Regina",  bg:"radial-gradient(circle at 30% 25%,#e8d5ff,#c77dff 55%,#7b2d8b)", border:"#c77dff", glow:"rgba(199,125,255,.5)", sound:"star", msg:"👸 Regina din Arendelle!", sparkle:"👑" },
    ],
    distractors:[
      {emoji:"❄️",name:"Fulg de nea"},{emoji:"🌨️",name:"Ninsoare"},{emoji:"💎",name:"Cristal"},
      {emoji:"🧊",name:"Gheață"},
    ],
  },

  dalmatians: {
    id:"dalmatians", title:"101 Dalmațieni", emoji:"🐕", color:"#555",
    sky:"linear-gradient(180deg,#87ceeb 0%,#b8d4f0 30%,#dceeff 55%,#e8f5d0 80%,#90c060 100%)",
    ground:"🌳🏡🌿🌳🏠🌿🌳🏡🌿🌳",
    celebrate:"paws", showStars:false,
    heroes:[
      { emoji:"🐕", name:"Pongo",         bg:"radial-gradient(circle at 30% 25%,#f0f0f0,#c8c8c8 55%,#555)", border:"#888", glow:"rgba(100,100,100,.4)", sound:"ham",  msg:"🐕 Pongo latră fericit!", sparkle:"🐾" },
      { emoji:"🐩", name:"Perdita",        bg:"radial-gradient(circle at 30% 25%,#fff,#e0e0e0 55%,#666)",   border:"#aaa", glow:"rgba(150,150,150,.4)", sound:"ham",  msg:"🐩 Perdita e mândră!", sparkle:"🐾" },
      { emoji:"🐶", name:"Cățeluș cu pete",bg:"radial-gradient(circle at 30% 25%,#fff,#f5f5f5 55%,#333)",  border:"#555", glow:"rgba(80,80,80,.4)",   sound:"ham",  msg:"🐶 Cățeluș drăgălaș!", sparkle:"🐾" },
      { emoji:"🦴", name:"Os magic",       bg:"radial-gradient(circle at 30% 25%,#fff9e6,#ffd166 55%,#b8860b)", border:"#ffd166", glow:"rgba(255,209,102,.5)", sound:"pop", msg:"🦴 Os magic găsit!", sparkle:"✨" },
    ],
    distractors:[
      {emoji:"🐈",name:"Pisică"},{emoji:"🏠",name:"Căsuță"},{emoji:"🐾",name:"Urmă lăbuță"},
    ],
  },

  redhood: {
    id:"redhood", title:"Scufița Roșie", emoji:"🔴", color:"#e53935",
    sky:"linear-gradient(180deg,#2d5a1b 0%,#3d7a25 20%,#52b788 45%,#8bc34a 70%,#6a9e30 100%)",
    ground:"🌲🌳🍄🌲🌳🌿🌲🌳🍄🌿",
    celebrate:"flowers", showStars:false,
    heroes:[
      { emoji:"🧝‍♀️", name:"Scufița Roșie",bg:"radial-gradient(circle at 30% 25%,#ffb3b3,#e53935 55%,#7f0000)", border:"#e53935", glow:"rgba(229,57,53,.5)",  sound:"star", msg:"🧝‍♀️ Scufița merge la bunica!", sparkle:"🌸" },
      { emoji:"👵",    name:"Bunica",        bg:"radial-gradient(circle at 30% 25%,#fff3e0,#ffcc80 55%,#e65100)", border:"#ffcc80", glow:"rgba(255,204,128,.5)",sound:"hmm",  msg:"👵 Bunica te iubește!", sparkle:"💕" },
      { emoji:"🪓",    name:"Vânătorul",     bg:"radial-gradient(circle at 30% 25%,#d0e8c0,#52b788 55%,#1b4332)", border:"#52b788", glow:"rgba(82,183,136,.5)",sound:"grr",  msg:"🪓 Vânătorul e curajos!", sparkle:"⭐" },
      { emoji:"🐺",    name:"Lupul rău",     bg:"radial-gradient(circle at 30% 25%,#d0d0d0,#888 55%,#333)",       border:"#888",    glow:"rgba(80,80,80,.4)",  sound:"wolf", msg:"🐺 Lupul rău apare!", sparkle:"💨" },
    ],
    distractors:[
      {emoji:"🍄",name:"Ciupercă"},{emoji:"🌸",name:"Floare"},{emoji:"🔴",name:"Pelerină roșie"},
      {emoji:"🏡",name:"Căsuța bunicii"},{emoji:"🌲",name:"Copac"},{emoji:"🦋",name:"Fluture"},
    ],
  },

  pigs: {
    id:"pigs", title:"Cei 3 Purceluși", emoji:"🐷", color:"#f48fb1",
    sky:"linear-gradient(180deg,#87ceeb 0%,#b0d4f0 28%,#c8e8ff 50%,#d4f7c9 72%,#8bc34a 100%)",
    ground:"🌾🏠🌾🏡🌾🧱🌾🏠🌾🌾",
    celebrate:"bricks", showStars:false,
    heroes:[
      { emoji:"🐷", name:"Nif-Naf", bg:"radial-gradient(circle at 30% 25%,#ffd6e8,#ff6eb4 55%,#c9006b)", border:"#ff6eb4", glow:"rgba(255,110,180,.5)", sound:"oink", msg:"🐷 Nif-Naf din paie!", sparkle:"🌾" },
      { emoji:"🐖", name:"Nuf-Nuf", bg:"radial-gradient(circle at 30% 25%,#ffe4b0,#f77f00 55%,#d62828)", border:"#f77f00", glow:"rgba(247,127,0,.5)",   sound:"oink", msg:"🐖 Nuf-Nuf din lemne!", sparkle:"🪵" },
      { emoji:"🐗", name:"Naf-Naf", bg:"radial-gradient(circle at 30% 25%,#d0d0d0,#888 55%,#333)",      border:"#888",    glow:"rgba(100,100,100,.4)", sound:"oink", msg:"🐗 Naf-Naf din cărămidă!", sparkle:"🧱" },
      { emoji:"🏠", name:"Casa solidă",bg:"radial-gradient(circle at 30% 25%,#fff3e0,#ffd166 55%,#b8860b)",border:"#ffd166",glow:"rgba(255,209,102,.5)",sound:"pop",  msg:"🏠 Casa e solidă!", sparkle:"✨" },
      { emoji:"🐺", name:"Lupul rău", bg:"radial-gradient(circle at 30% 25%,#d0d0d0,#666 55%,#222)",    border:"#666",    glow:"rgba(60,60,60,.4)",    sound:"wolf", msg:"🐺 Suflă lupul!", sparkle:"💨" },
    ],
    distractors:[
      {emoji:"💨",name:"Vânt"},{emoji:"🌾",name:"Paie"},{emoji:"🪵",name:"Lemne"},{emoji:"🧱",name:"Cărămizi"},
    ],
  },

  snowwhite: {
    id:"snowwhite", title:"Alba ca Zăpada", emoji:"🍎", color:"#c62828",
    sky:"linear-gradient(180deg,#1a1a2e 0%,#16213e 25%,#0f3460 50%,#533483 75%,#e94560 100%)",
    ground:"🌹🌸🌺🌹🌷🌸🌺🌹🌷🌸",
    celebrate:"magic", showStars:false,
    heroes:[
      { emoji:"👸", name:"Alba",        bg:"radial-gradient(circle at 30% 25%,#fff,#ffeef0 55%,#ffb3c1)",    border:"#ffb3c1", glow:"rgba(255,179,193,.5)", sound:"star",  msg:"👸 Alba ca Zăpada!", sparkle:"⭐" },
      { emoji:"🌹", name:"Trandafir",   bg:"radial-gradient(circle at 30% 25%,#ffb3b3,#e53935 55%,#7f0000)", border:"#e53935", glow:"rgba(229,57,53,.5)",  sound:"pop",   msg:"🌹 Un trandafir magic!", sparkle:"🌸" },
      { emoji:"🍎", name:"Mărul fermecat",bg:"radial-gradient(circle at 30% 25%,#ffb3b3,#e53935 55%,#7f0000)",border:"#c62828",glow:"rgba(198,40,40,.5)",  sound:"bad",   msg:"🍎 Mărul fermecat!", sparkle:"💫" },
      { emoji:"👑", name:"Coroana",     bg:"radial-gradient(circle at 30% 25%,#fff9c4,#ffd166 55%,#ef8c14)", border:"#ffd166", glow:"rgba(255,209,102,.5)", sound:"star",  msg:"👑 Coroana regală!", sparkle:"✨" },
      { emoji:"🪞", name:"Oglinda",     bg:"radial-gradient(circle at 30% 25%,#e3f2fd,#90caf9 55%,#1565c0)", border:"#90caf9", glow:"rgba(144,202,249,.5)", sound:"magic", msg:"🪞 Oglindă, oglinjoară!", sparkle:"💎" },
      { emoji:"🔮", name:"Globul magic",bg:"radial-gradient(circle at 30% 25%,#e0c3fc,#c77dff 55%,#7b2d8b)", border:"#c77dff", glow:"rgba(199,125,255,.5)", sound:"magic", msg:"🔮 Globul magic vorbește!", sparkle:"🌟" },
      { emoji:"🧟", name:"Vrăjitoarea", bg:"radial-gradient(circle at 30% 25%,#c8e6c9,#388e3c 55%,#1b5e20)", border:"#388e3c", glow:"rgba(56,142,60,.5)",   sound:"bad",   msg:"🧟 Vrăjitoarea apare!", sparkle:"🍄" },
      { emoji:"🏰", name:"Castelul",    bg:"radial-gradient(circle at 30% 25%,#d0d0d0,#888 55%,#333)",       border:"#888",    glow:"rgba(100,100,100,.4)", sound:"good",  msg:"🏰 Castelul magic!", sparkle:"🌟" },
      { emoji:"😴", name:"Pitic Somnoros",bg:"radial-gradient(circle at 30% 25%,#ffe8b0,#f5c842 55%,#b8860b)",border:"#f5c842",glow:"rgba(245,200,66,.5)",  sound:"hmm",   msg:"😴 Somnoros doarme!", sparkle:"💤" },
      { emoji:"🤧", name:"Pitic Strănuță",bg:"radial-gradient(circle at 30% 25%,#fff,#e0e0e0 55%,#666)",     border:"#bbb",    glow:"rgba(180,180,180,.5)", sound:"pop",   msg:"🤧 Hapciu!", sparkle:"🌟" },
      { emoji:"😠", name:"Pitic Morocănos",bg:"radial-gradient(circle at 30% 25%,#ffb3b3,#e53935 55%,#7f0000)",border:"#e53935",glow:"rgba(229,57,53,.4)",  sound:"grr",   msg:"😠 Morocănos e supărat!", sparkle:"💢" },
      { emoji:"😊", name:"Pitic Vesel",  bg:"radial-gradient(circle at 30% 25%,#d4f7c9,#52b788 55%,#1b4332)", border:"#52b788", glow:"rgba(82,183,136,.5)", sound:"good",  msg:"😊 Piticul Vesel!", sparkle:"🌟" },
    ],
    distractors:[], // all characters are heroes in Snow White
  },
};

const STORY_GAMES = Object.keys(WORLDS);

const ANIMALS = [
  {emoji:"🐶",name:"Cățel",sound:"ham"},{emoji:"🐱",name:"Pisică",sound:"miau"},
  {emoji:"🐰",name:"Iepuraș",sound:"țup"},{emoji:"🐻",name:"Ursuleț",sound:"grr"},
  {emoji:"🦊",name:"Vulpiță",sound:"yip"},{emoji:"🐼",name:"Panda",sound:"hmm"},
  {emoji:"🐨",name:"Koala",sound:"hmm"},{emoji:"🦁",name:"Leuț",sound:"rrr"},
  {emoji:"🐯",name:"Tigru",sound:"grr"},{emoji:"🐸",name:"Broscuță",sound:"oac"},
  {emoji:"🐹",name:"Hamstor",sound:"pip"},{emoji:"🦄",name:"Unicorn",sound:"yip"},
  {emoji:"🐮",name:"Vișelul",sound:"muu"},{emoji:"🐷",name:"Purceluș",sound:"oink"},
];
const BIRDS = [
  {emoji:"🐥",name:"Puișor",sound:"cip"},{emoji:"🦆",name:"Rățușcă",sound:"mac"},
  {emoji:"🦉",name:"Bufniță",sound:"hu-hu"},{emoji:"🦚",name:"Păun",sound:"cirip"},
  {emoji:"🦜",name:"Papagal",sound:"cirip"},{emoji:"🐧",name:"Pinguin",sound:"cip"},
];
const ALL_CREATURES = [...ANIMALS.map(a=>({...a,kind:"animal"})),...BIRDS.map(b=>({...b,kind:"bird"}))];

const CLASSIC_GAMES = [
  {id:"free",      title:"Joacă liberă",       emoji:"🎉", subtitle:"Apare și zboară",              color:"#ff6b9d"},
  {id:"fireworks", title:"Artificii!",          emoji:"🎆", subtitle:"Space sau atinge ecranul",     color:"#ff6b9d"},
  {id:"colors",    title:"Culoarea potrivită", emoji:"🎈", subtitle:"Sparge culoarea cerută",        color:"#4895ef"},
  {id:"animals",   title:"Găsește animalul",   emoji:"🐱", subtitle:"Atinge animalul corect",        color:"#52b788"},
  {id:"count",     title:"Numără",             emoji:"🔢", subtitle:"Sparge exact câte trebuie",     color:"#ffd166"},
  {id:"speed",     title:"Rapid!",             emoji:"⚡", subtitle:"Prinde tot ce zboară repede",  color:"#f77f00"},
  {id:"shapes",    title:"Forme",              emoji:"⭐", subtitle:"Găsește forma corectă",         color:"#ff4d6d"},
  {id:"piano",     title:"Piano Magic",        emoji:"🎹", subtitle:"Cântă melodii colorate!",         color:"#7c4dff"},
];

const rand = (a,b) => Math.random()*(b-a)+a;
const pick = arr => arr[Math.floor(Math.random()*arr.length)];
const uid  = () => `${Date.now()}-${Math.random().toString(36).slice(2)}`;

/* ══════════════════════════════════════════════════════
   AUDIO
══════════════════════════════════════════════════════ */
function makeAudio(){
  let ctx=null;
  const gc=()=>{ if(!ctx) ctx=new(window.AudioContext||window.webkitAudioContext)(); if(ctx.state==="suspended") ctx.resume(); return ctx; };
  const beep=(f=440,d=0.12,t="sine",g=0.03)=>{ try{ const a=gc(),o=a.createOscillator(),gn=a.createGain(); o.type=t; o.frequency.value=f; gn.gain.setValueAtTime(g,a.currentTime); gn.gain.exponentialRampToValueAtTime(0.0001,a.currentTime+d); o.connect(gn); gn.connect(a.destination); o.start(); o.stop(a.currentTime+d); }catch(e){} };
  return {
    pop:   ()=>{ beep(520,0.06,"triangle",0.04); setTimeout(()=>beep(760,0.08,"sine",0.025),20); },
    spawn: ()=>beep(440,0.04,"sine",0.01),
    good:  ()=>{ [523,659,784,1047].forEach((f,i)=>setTimeout(()=>beep(f,0.1,"triangle",0.03),i*65)); },
    bad:   ()=>{ beep(180,0.12,"sawtooth",0.025); setTimeout(()=>beep(140,0.1,"sawtooth",0.02),80); },
    whoosh:()=>beep(300,0.22,"sine",0.025),
    star:  ()=>{ [880,1100,1320,1568].forEach((f,i)=>setTimeout(()=>beep(f,0.09,"triangle",0.035),i*60)); },
    bambi: ()=>{ [640,820,760,900,1020].forEach((f,i)=>setTimeout(()=>beep(f,0.1,"triangle",0.028),i*75)); },
    elsa:  ()=>{ [1047,987,880,784,1047,1175].forEach((f,i)=>setTimeout(()=>beep(f,0.12,"sine",0.025),i*85)); },
    wolf:  ()=>{ [180,160,140,120].forEach((f,i)=>setTimeout(()=>beep(f,0.15,"sawtooth",0.03),i*70)); },
    magic: ()=>{ for(let i=0;i<7;i++) setTimeout(()=>beep(rand(600,1400),0.07,"sine",0.02),i*50); },
    grr:   ()=>{ beep(140,0.18,"sawtooth",0.03); setTimeout(()=>beep(120,0.12,"sawtooth",0.025),80); },
    oink:  ()=>{ beep(300,0.08,"sine",0.035); setTimeout(()=>beep(240,0.1,"sine",0.03),80); },
    ham:   ()=>{ beep(320,0.06,"triangle",0.03); setTimeout(()=>beep(280,0.08,"triangle",0.025),60); },
    hmm:   ()=>beep(240,0.1,"sine",0.025),
    getCtx:()=>gc(),
    animal:(n)=>{
      const m={bambi:[640,820],ham:[320,280],miau:[520,660],"țup":[740,520],grr:[180,140],yip:[700,840],
               hmm:[240,220],cip:[980,1150],mac:[420,350],cirip:[900,1050],"hu-hu":[260,220],
               rrr:[200,160],oac:[350,280],pip:[900,1000],muu:[250,200],oink:[300,240]};
      const t=m[n]||[500,700];
      beep(t[0],0.07,"triangle",0.03); setTimeout(()=>beep(t[1],0.1,"triangle",0.03),80);
    },
  };
}

/* ══════════════════════════════════════════════════════
   ITEM FACTORY
══════════════════════════════════════════════════════ */
function makeItem(x,y,game,diff){
  const D=DIFFICULTY[diff];
  const color=pick(COLORS);
  const base={ id:uid(),x,y,vx:rand(-7,7),
    speed:game==="speed"?rand(65,90):rand(D.speed[0],D.speed[1]),
    size:rand(D.itemSize[0],D.itemSize[1]),color,bornAt:Date.now(),
    life:game==="speed"?rand(3200,4800):D.life,drift:rand(0,1000),state:"floating" };

  if(STORY_GAMES.includes(game)){
    const W=WORLDS[game];
    const allItems=[...W.heroes,...W.distractors];
    // 50% chance hero, 50% distractor (if distractors exist)
    const useHero = W.distractors.length===0 || Math.random()<0.45;
    if(useHero){
      const h=pick(W.heroes);
      return{...base,render:"hero",hero:h,label:h.name,sound:h.sound,kind:game,size:rand(D.itemSize[0]+4,D.itemSize[1]+14)};
    }
    const d=pick(W.distractors);
    return{...base,render:"emoji",emoji:d.emoji,label:d.name,sound:null,kind:"distractor"};
  }

  if(game==="free"){
    const i=pick([...ALL_CREATURES,{emoji:"🎈",kind:"balloon",name:"Balon",sound:null},{emoji:"⭐",kind:"star",name:"Stea",sound:null}]);
    return{...base,render:"emoji",emoji:i.emoji,label:i.name,kind:i.kind||"animal",sound:i.sound};
  }
  if(["colors","count"].includes(game)) return{...base,render:"balloon",label:`Balon ${COLOR_MAP[color].name}`,kind:"balloon"};
  if(game==="animals"){ const i=pick(ALL_CREATURES); return{...base,render:"emoji",emoji:i.emoji,label:i.name,sound:i.sound,kind:i.kind}; }
  if(game==="speed"){ const i=pick(ALL_CREATURES); return{...base,render:"emoji",emoji:i.emoji,label:i.name,sound:i.sound,kind:"target"}; }
  if(game==="shapes"){ const s=pick(SHAPES); return{...base,render:"shape",shape:s,label:s,kind:"shape"}; }
  return{...base,render:"balloon",label:`Balon ${COLOR_MAP[color].name}`,kind:"balloon"};
}

/* ══════════════════════════════════════════════════════
   HERO BUBBLE
══════════════════════════════════════════════════════ */
function HeroBubble({hero,size,held,showName=false}){
  return(
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",position:"relative"}}>
      <div style={{position:"absolute",top:-10,left:-10,right:-10,bottom:-10,borderRadius:"50%",
        background:`radial-gradient(circle,${hero.glow},transparent 70%)`,
        filter:"blur(12px)",opacity:held?1:0.65,transition:"opacity .3s",
        animation:held?"none":"hero-pulse 2.2s ease-in-out infinite"}}/>
      <div style={{width:size,height:size,borderRadius:"50%",overflow:"hidden",flexShrink:0,
        background:hero.bg,border:`4px solid ${hero.border}`,
        boxShadow:`0 0 0 3px rgba(255,255,255,0.7),0 8px 32px ${hero.glow},inset 0 2px 8px rgba(255,255,255,0.4)`,
        display:"flex",alignItems:"center",justifyContent:"center",position:"relative",transition:"box-shadow .3s"}}>
        <div style={{position:"absolute",top:"12%",left:"14%",width:"34%",height:"24%",borderRadius:"50%",
          background:"radial-gradient(circle,rgba(255,255,255,0.85),transparent)",transform:"rotate(-25deg)"}}/>
        <div style={{fontSize:size*0.5,position:"relative",zIndex:1}}>{hero.emoji}</div>
      </div>
      {showName&&<div style={{marginTop:5,padding:"3px 12px",borderRadius:14,background:hero.border,color:"#fff",
        fontSize:Math.max(10,size*0.13),fontWeight:900,fontFamily:"'Fredoka One',cursive",
        boxShadow:`0 3px 10px ${hero.glow}`,zIndex:1,letterSpacing:0.4,
        textShadow:"0 1px 3px rgba(0,0,0,0.3)"}}>{hero.name}</div>}
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   BALLOON
══════════════════════════════════════════════════════ */
function Balloon({color,size,held}){
  const cm=COLOR_MAP[color];
  return(
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",width:size,position:"relative"}}>
      <div style={{position:"absolute",top:size*0.08,left:"50%",transform:"translateX(-50%)",width:size*0.8,height:size*0.8,borderRadius:"50%",background:cm.glow,filter:"blur(14px)",opacity:held?0.95:0.55,transition:"opacity .3s",pointerEvents:"none"}}/>
      <div style={{width:size,height:size,borderRadius:"50% 50% 50% 50% / 55% 55% 45% 45%",background:cm.grad,
        boxShadow:`inset -5px -10px 18px rgba(0,0,0,0.18),inset 4px 5px 12px rgba(255,255,255,0.4),0 6px 28px ${cm.glow}`,
        position:"relative",overflow:"hidden",flexShrink:0}}>
        <div style={{position:"absolute",top:"13%",left:"17%",width:"37%",height:"26%",borderRadius:"50%",background:"radial-gradient(circle,rgba(255,255,255,0.9),transparent)",transform:"rotate(-28deg)"}}/>
        <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:size*0.36}}>😊</div>
      </div>
      <div style={{width:9,height:9,borderRadius:"50%",background:cm.hex,boxShadow:`0 2px 6px ${cm.glow}`,marginTop:-1}}/>
      <svg width={18} height={20}><path d="M9 0 Q5 10 9 20" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" fill="none"/></svg>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   SHAPE
══════════════════════════════════════════════════════ */
function Shape({shape,color,size}){
  const cm=COLOR_MAP[color];
  const base={position:"relative",zIndex:1,boxShadow:`0 4px 24px ${cm.glow},inset 0 2px 6px rgba(255,255,255,0.3)`};
  let s;
  if(shape==="circle")        s={...base,width:size,height:size,borderRadius:"50%",background:cm.hex};
  else if(shape==="square")   s={...base,width:size,height:size,borderRadius:18,background:cm.hex};
  else if(shape==="triangle") s={...base,width:0,height:0,borderLeft:`${size/2}px solid transparent`,borderRight:`${size/2}px solid transparent`,borderBottom:`${size*0.87}px solid ${cm.hex}`,background:"transparent",borderRadius:0};
  else if(shape==="heart")    s={...base,width:size,height:size,background:cm.hex,clipPath:"polygon(50% 80%,15% 45%,15% 30%,30% 15%,50% 30%,70% 15%,85% 30%,85% 45%)"};
  else if(shape==="diamond")  s={...base,width:size,height:size,background:cm.hex,clipPath:"polygon(50% 0%,100% 50%,50% 100%,0% 50%)"};
  else s={...base,width:size,height:size,background:cm.hex,clipPath:"polygon(50% 0%,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%)"};
  return(
    <div style={{width:size+20,height:size+20,display:"flex",alignItems:"center",justifyContent:"center",position:"relative"}}>
      <div style={{position:"absolute",width:size*0.85,height:size*0.85,borderRadius:"50%",background:cm.glow,filter:"blur(12px)"}}/>
      <div style={s}/>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   PARTICLES
══════════════════════════════════════════════════════ */
function Burst({x,y,emoji}){
  const parts=useMemo(()=>Array.from({length:10},(_,i)=>({dx:rand(-85,85),dy:rand(-100,-18),delay:i*28})),[]);
  return<>{parts.map((p,i)=>(
    <div key={i} style={{position:"absolute",left:x,top:y,fontSize:22,pointerEvents:"none",zIndex:60,
      animation:`burst-fly .78s ease-out ${p.delay}ms both`,"--dx":`${p.dx}px`,"--dy":`${p.dy}px`}}>
      {pick(["✨","⭐","💫","🌟",emoji])}
    </div>
  ))}</>;
}

function Flash({x,y,text}){
  return<div style={{position:"absolute",left:x,top:y,fontFamily:"'Fredoka One',cursive",
    fontSize:24,fontWeight:900,color:"#fff",textShadow:"0 2px 8px rgba(0,0,0,0.55)",
    pointerEvents:"none",zIndex:70,transform:"translateX(-50%)",
    animation:"flash-up .9s ease-out both"}}>{text}</div>;
}

function CelebrateRain({type}){
  const sets={
    snow:    ["❄️","🌨️","💎","⛄"],
    leaf:    ["🍃","🌿","🍀","🌸","🦋"],
    paws:    ["🐾","🦴","💛","🐕"],
    flowers: ["🌸","🌺","🌹","🌷","🌼"],
    bricks:  ["🧱","🏠","⭐","💛"],
    magic:   ["⭐","✨","💫","🌟","💎","🪄"],
  };
  const emojis=sets[type]||sets.magic;
  const items=useMemo(()=>Array.from({length:18},(_,i)=>({id:i,left:`${rand(2,98)}%`,delay:rand(0,1.5),dur:rand(1.4,2.6),size:rand(16,32),emoji:pick(emojis)})),[type]);
  return<>{items.map(f=>(
    <div key={f.id} style={{position:"absolute",left:f.left,top:"-4%",fontSize:f.size,pointerEvents:"none",zIndex:55,
      animation:`celebrate-fall ${f.dur}s ease-in ${f.delay}s both`}}>{f.emoji}</div>
  ))}</>;
}

/* ══════════════════════════════════════════════════════
   MAIN APP
══════════════════════════════════════════════════════ */

/* ══════════════════════════════════════════════════════
   FIREWORK SYSTEM — Ultra realistic
══════════════════════════════════════════════════════ */

const FW_PALETTES = [
  { name:"red",     core:"#ffffff", mid:"#ffaa44", outer:"#ff2200", glow:"#ff440088" },
  { name:"green",   core:"#ffffff", mid:"#aaffaa", outer:"#00cc44", glow:"#00ff4488" },
  { name:"blue",    core:"#ffffff", mid:"#aaddff", outer:"#2266ff", glow:"#4488ff88" },
  { name:"gold",    core:"#ffffff", mid:"#ffee88", outer:"#ffaa00", glow:"#ffcc0088" },
  { name:"purple",  core:"#ffffff", mid:"#ddaaff", outer:"#aa00ff", glow:"#cc44ff88" },
  { name:"silver",  core:"#ffffff", mid:"#eeeeff", outer:"#aabbcc", glow:"#ccddff88" },
  { name:"orange",  core:"#ffffff", mid:"#ffcc88", outer:"#ff6600", glow:"#ff880088" },
  { name:"cyan",    core:"#ffffff", mid:"#aaffff", outer:"#00ccff", glow:"#00eeff88" },
  { name:"pink",    core:"#ffffff", mid:"#ffaadd", outer:"#ff44aa", glow:"#ff88cc88" },
  { name:"rainbow", core:"#ffffff", mid:"#ffff88", outer:"#ff2200", glow:"#ff880088", rainbow:true },
];

const RAINBOW_COLS = ["#ff2200","#ff8800","#ffee00","#44ff44","#0088ff","#8844ff","#ff44aa"];

const EXPLOSION_TYPES = ["peony","chrysanthemum","willow","ring","heart","crossette","palm","spider"];

/* ── useAnimationLoop hook ── */
function useAnimLoop(cb, active=true){
  const rafRef = React.useRef(null);
  const cbRef  = React.useRef(cb);
  cbRef.current = cb;
  React.useEffect(()=>{
    if(!active) return;
    let t0 = null;
    const loop = (ts) => {
      if(!t0) t0=ts;
      cbRef.current(ts-t0, ts);
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  },[active]);
}

/* ── Canvas-based firework (much more performant & realistic) ── */
function FireworkCanvas({fireworksList, canvasRef, speed=50}){
  const cvRef       = React.useRef(null);
  const particlesRef= React.useRef([]);
  const rocketsRef  = React.useRef([]);
  const prevFwRef   = React.useRef([]);
  const speedRef    = React.useRef(speed); // always current — no stale closure
  const lastTsRef   = React.useRef(null);
  const rafRef      = React.useRef(null);

  // Keep speedRef in sync with prop
  React.useEffect(()=>{ speedRef.current = speed; },[speed]);

  // Resize canvas
  React.useEffect(()=>{
    const resize=()=>{
      if(!cvRef.current) return;
      cvRef.current.width  = window.innerWidth;
      cvRef.current.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize",resize);
    return()=>window.removeEventListener("resize",resize);
  },[]);

  // Sync new fireworks → rockets
  React.useEffect(()=>{
    const prevIds = prevFwRef.current.map(f=>f.id);
    fireworksList.forEach(fw=>{
      if(!prevIds.includes(fw.id)){
        const rect = canvasRef?.current?.getBoundingClientRect();
        const startX = fw.x + rand(-30,30);
        const startY = rect ? rect.bottom : window.innerHeight;
        rocketsRef.current.push({
          id:fw.id, x:startX, y:startY,
          targetX:fw.x, targetY:fw.y,
          palette:fw.palette,
          type:pick(EXPLOSION_TYPES),
          scale:rand(0.5,1.8),
          exploded:false,
          trail:[],
        });
      }
    });
    prevFwRef.current = fireworksList;
  },[fireworksList]);

  // Main animation loop
  React.useEffect(()=>{
    const MAX_PARTICLES = 600; // hard cap to prevent lag

    const loop=(ts)=>{
      rafRef.current = requestAnimationFrame(loop);
      const cv=cvRef.current; if(!cv) return;
      const ctx=cv.getContext("2d");
      const W=cv.width, H=cv.height;

      // dt capped at 50ms to avoid jumps
      if(!lastTsRef.current) lastTsRef.current=ts;
      const dt=Math.min((ts-lastTsRef.current)/1000, 0.05);
      lastTsRef.current=ts;

      const spd = speedRef.current; // always fresh
      const speedScale = spd/50;
      const GRAVITY = 160 * speedScale;
      const DRAG    = Math.max(0.94, 1 - 0.015*speedScale);

      // Motion blur fade
      ctx.fillStyle="rgba(0,0,0,0.2)";
      ctx.fillRect(0,0,W,H);

      // ── ROCKETS ──
      rocketsRef.current = rocketsRef.current.filter(r=>{
        if(r.exploded) return false;
        const dx=r.targetX-r.x, dy=r.targetY-r.y;
        const dist=Math.sqrt(dx*dx+dy*dy);
        if(dist<10){
          // Explode — but only if under particle cap
          if(particlesRef.current.length < MAX_PARTICLES){
            explodeRocket(r, particlesRef.current, spd);
          }
          return false;
        }
        const rspd=Math.min(dist*4*speedScale, 900*speedScale);
        if(!r.vx) r.vx=0;
        if(!r.vy) r.vy=0;
        r.vx += (dx/dist*rspd - r.vx)*8*dt;
        r.vy += (dy/dist*rspd - r.vy)*8*dt;
        r.x += r.vx*dt;
        r.y += r.vy*dt;

        // Trail
        r.trail.push({x:r.x,y:r.y});
        if(r.trail.length>10) r.trail.shift();

        for(let i=0;i<r.trail.length;i++){
          const a=(i/r.trail.length)*0.85;
          ctx.save();
          ctx.globalAlpha=a;
          ctx.fillStyle="#fff8cc";
          ctx.shadowColor="#fffaaa";
          ctx.shadowBlur=8;
          ctx.beginPath();
          ctx.arc(r.trail[i].x,r.trail[i].y,(i/r.trail.length)*2.5,0,Math.PI*2);
          ctx.fill();
          ctx.restore();
        }
        // Head
        ctx.save();
        ctx.globalAlpha=1;
        ctx.fillStyle="#ffffff";
        ctx.shadowColor="#ffffaa";
        ctx.shadowBlur=12;
        ctx.beginPath();
        ctx.arc(r.x,r.y,3,0,Math.PI*2);
        ctx.fill();
        ctx.restore();
        return true;
      });

      // ── PARTICLES ──
      // Limit total particles to MAX_PARTICLES
      if(particlesRef.current.length > MAX_PARTICLES){
        particlesRef.current = particlesRef.current.slice(-MAX_PARTICLES);
      }

      particlesRef.current = particlesRef.current.filter(p=>{
        p.life -= dt;
        if(p.life<=0) return false;

        p.vx += 8*dt*0.1; // slight wind
        p.vy += GRAVITY*dt;
        p.vx *= DRAG;
        p.vy *= DRAG;
        p.x  += p.vx*dt;
        p.y  += p.vy*dt;

        const lr = p.life/p.maxLife;
        // heat color
        const heat=Math.max(0,lr-0.7)/0.3;
        const r_=Math.round(p.r+(255-p.r)*heat);
        const g_=Math.round(p.g+(255-p.g)*heat);
        const b_=Math.round(p.b+(255-p.b)*heat);

        let alpha;
        if(p.type==="glitter") alpha=lr*(0.5+Math.random()*0.5);
        else if(p.type==="flash") alpha=lr;
        else alpha=Math.pow(lr,0.5);

        if(alpha<=0) return true;

        // Trail (only for main sparks, skip if too many particles)
        if(p.trail && particlesRef.current.length < 400){
          p.trail.push({x:p.x,y:p.y});
          if(p.trail.length>5) p.trail.shift();
          p.trail.forEach((pt,i)=>{
            const ta=(i/p.trail.length)*alpha*0.45;
            ctx.save();
            ctx.globalAlpha=ta;
            ctx.fillStyle=`rgb(${r_},${g_},${b_})`;
            ctx.shadowColor=`rgba(${r_},${g_},${b_},.5)`;
            ctx.shadowBlur=p.size*1.5;
            ctx.beginPath();
            ctx.arc(pt.x,pt.y,p.size*0.45,0,Math.PI*2);
            ctx.fill();
            ctx.restore();
          });
        }

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle   = `rgb(${r_},${g_},${b_})`;
        ctx.shadowColor = `rgba(${r_},${g_},${b_},.85)`;
        ctx.shadowBlur  = p.size*3.5;
        if(p.type==="star"){
          drawStar(ctx,p.x,p.y,p.size*1.4,p.size*0.55,5);
        } else {
          ctx.beginPath();
          ctx.arc(p.x,p.y,p.size,0,Math.PI*2);
          ctx.fill();
        }
        ctx.restore();
        return true;
      });

      // Clear canvas if nothing active
      if(rocketsRef.current.length===0 && particlesRef.current.length===0){
        ctx.clearRect(0,0,W,H);
      }
    };

    rafRef.current = requestAnimationFrame(loop);
    return()=>cancelAnimationFrame(rafRef.current);
  },[]); // run once — reads speed via ref

  return(
    <canvas ref={cvRef} style={{
      position:"fixed",top:0,left:0,
      width:"100%",height:"100%",
      pointerEvents:"none",zIndex:195,
    }}/>
  );
}


/* ── Explode a rocket into particles ── */
function explodeRocket(rocket, particles, speed=50){
  const {x,y,palette,type,scale} = rocket;
  const speedMult = speed/50;
  const count     = Math.round(rand(32,55)*scale);
  const baseSpeed = rand(90,210)*scale*speedMult;
  const maxLife   = rand(1.1,2.2)/speedMult;

  for(let i=0;i<count;i++){
    let vx,vy;
    if(type==="peony"||type==="chrysanthemum"){
      const a=(i/count)*Math.PI*2+rand(-0.1,0.1);
      const s=baseSpeed*rand(0.75,1.25);
      vx=Math.cos(a)*s; vy=Math.sin(a)*s;
    } else if(type==="willow"){
      const a=(i/count)*Math.PI*2+rand(-0.12,0.12);
      const s=baseSpeed*rand(0.5,1.0);
      vx=Math.cos(a)*s*0.8; vy=Math.sin(a)*s*0.45+rand(20,55);
    } else if(type==="ring"){
      const a=(i/count)*Math.PI*2;
      vx=Math.cos(a)*baseSpeed*0.9; vy=Math.sin(a)*baseSpeed*0.9;
    } else if(type==="heart"){
      const t=(i/count)*Math.PI*2;
      const hx=16*Math.pow(Math.sin(t),3);
      const hy=-(13*Math.cos(t)-5*Math.cos(2*t)-2*Math.cos(3*t)-Math.cos(4*t));
      const m=Math.sqrt(hx*hx+hy*hy)||1;
      vx=(hx/m)*baseSpeed*0.78; vy=(hy/m)*baseSpeed*0.78;
    } else if(type==="crossette"){
      const a=(i/count)*Math.PI*2+rand(-0.2,0.2);
      vx=Math.cos(a)*baseSpeed*rand(0.4,1.5);
      vy=Math.sin(a)*baseSpeed*rand(0.4,1.5);
    } else if(type==="palm"){
      const a=(i/count)*Math.PI*2;
      vx=Math.cos(a)*baseSpeed*rand(0.3,1.0);
      vy=Math.sin(a)*baseSpeed*rand(0.3,1.0)+rand(25,70);
    } else if(type==="spider"){
      const cluster=Math.floor(i/(count/8))*(Math.PI*2/8);
      const a=cluster+rand(-0.3,0.3);
      vx=Math.cos(a)*baseSpeed*rand(0.5,1.4);
      vy=Math.sin(a)*baseSpeed*rand(0.5,1.4);
    } else {
      const a=rand(0,Math.PI*2);
      vx=Math.cos(a)*baseSpeed*rand(0.2,1.2);
      vy=Math.sin(a)*baseSpeed*rand(0.2,1.2);
    }

    const col      = hexToRgb(i%6===0?palette.core:i%3===0?palette.mid:palette.outer);
    const isRainbow= !!palette.rainbow;
    const pType    = isRainbow?"glitter":(i%4===0?"star":"spark");

    particles.push({
      x,y,vx,vy,
      life:maxLife*rand(0.6,1.4), maxLife,
      r:col.r,g:col.g,b:col.b,
      size:rand(1.8,4.8)*Math.sqrt(scale),
      type:pType, rainbow:isRainbow,
      rainbowIdx:i/count, trail:[],
    });
  }

  // Glitter sparks for chrysanthemum / peony
  if(type==="chrysanthemum"||type==="peony"){
    for(let i=0;i<Math.round(16*scale);i++){
      const a=rand(0,Math.PI*2);
      const s=rand(20,70)*scale*speedMult;
      const col=hexToRgb(palette.mid);
      particles.push({
        x:x+rand(-14,14), y:y+rand(-14,14),
        vx:Math.cos(a)*s, vy:Math.sin(a)*s,
        life:rand(0.4,1.0)/speedMult, maxLife:0.8/speedMult,
        r:col.r,g:col.g,b:col.b,
        size:rand(1,2.5)*Math.sqrt(scale),
        type:"glitter", rainbow:false, trail:[],
      });
    }
  }

  // Central flash
  particles.push({
    x,y,vx:0,vy:0,
    life:0.18,maxLife:0.18,
    r:255,g:255,b:255,
    size:30*scale,
    type:"flash",rainbow:false,trail:[],
  });
}


/* ── helpers ── */
function hexToRgb(hex){
  hex = hex.replace("#","");
  if(hex.length===3) hex=hex.split("").map(c=>c+c).join("");
  const n=parseInt(hex,16);
  return{r:(n>>16)&255,g:(n>>8)&255,b:n&255};
}

function drawStar(ctx,cx,cy,outerR,innerR,points){
  ctx.beginPath();
  for(let i=0;i<points*2;i++){
    const r = i%2===0?outerR:innerR;
    const a = (i/(points*2))*Math.PI*2 - Math.PI/2;
    i===0 ? ctx.moveTo(cx+r*Math.cos(a),cy+r*Math.sin(a))
           : ctx.lineTo(cx+r*Math.cos(a),cy+r*Math.sin(a));
  }
  ctx.closePath();
  ctx.fill();
}

// Wrapper that manages fireworks list passed from App
function FireworkBurst({x,y,id,canvasRef}){ return null; } // stub — canvas handles render

/* ══════════════════════════════════════════════════════
   SPLASH SCREEN
══════════════════════════════════════════════════════ */
function SplashScreen({onDone}){
  const [phase,setPhase]=React.useState(0); // 0=show, 1=fadeout
  React.useEffect(()=>{
    const t1=setTimeout(()=>setPhase(1),2200);
    const t2=setTimeout(()=>onDone(),2800);
    return()=>{ clearTimeout(t1); clearTimeout(t2); };
  },[]);
  return(
    <div style={{
      position:"fixed",inset:0,zIndex:99999,
      display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
      background:"linear-gradient(135deg,#1a1a4e,#0d1b3e,#000020)",
      opacity:phase===1?0:1, transition:"opacity .7s ease",
      pointerEvents:phase===1?"none":"all",
    }}>

      {/* Logo */}
      <div style={{
        fontSize:90,marginBottom:8,
        animation:"splash-bounce .6s ease-out",
        filter:"drop-shadow(0 0 30px rgba(255,107,157,.8))",
      }}>🎈</div>
      <div style={{
        fontFamily:"'Fredoka One',cursive",fontSize:52,fontWeight:900,
        background:"linear-gradient(135deg,#ff6b9d,#ff8e53,#ffd166)",
        WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",
        animation:"splash-title .5s .2s ease-out both",
        letterSpacing:2,
      }}>Balonel</div>
      <div style={{
        color:"rgba(255,255,255,0.7)",fontSize:16,fontWeight:700,
        marginTop:8,letterSpacing:3,textTransform:"uppercase",
        animation:"splash-title .5s .4s ease-out both",
      }}>Jocul magic ✨</div>
      <div style={{
        marginTop:32,display:"flex",gap:8,
        animation:"splash-title .5s .6s ease-out both",
      }}>
        {["🦌","❄️","🐕","🔴","🐷","🍎"].map((e,i)=>(
          <div key={i} style={{
            fontSize:28,
            animation:`splash-float ${1+i*0.15}s ease-in-out infinite alternate`,
          }}>{e}</div>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   STAR CELEBRATION — special 10-star fireworks
══════════════════════════════════════════════════════ */
function StarCelebration(){
  return(
    <div style={{
      position:"fixed",inset:0,zIndex:9000,
      display:"flex",alignItems:"center",justifyContent:"center",
      pointerEvents:"none",
      animation:"star-celeb-fade 5s ease-out forwards",
    }}>
      {/* Confetti rain */}
      {Array.from({length:40}).map((_,i)=>(
        <div key={i} style={{
          position:"absolute",
          left:`${rand(0,100)}%`,top:"-5%",
          fontSize:rand(20,36),
          animation:`confetti-fall ${rand(1.5,3.5)}s ease-in ${rand(0,1.5)}s both`,
        }}>{pick(["⭐","🌟","💫","✨","🏆","🎉","🎊","🥳","👑","💎","🌈","🎆"])}</div>
      ))}
      {/* Center message */}
      <div style={{
        background:"linear-gradient(135deg,rgba(255,215,0,.95),rgba(255,165,0,.95))",
        borderRadius:32,padding:"28px 48px",textAlign:"center",
        boxShadow:"0 8px 48px rgba(255,200,0,.5),0 0 80px rgba(255,200,0,.3)",
        border:"3px solid rgba(255,255,255,.6)",
        animation:"star-pop .5s cubic-bezier(.34,1.56,.64,1)",
      }}>
        <div style={{fontSize:56,marginBottom:4}}>🏆</div>
        <div style={{fontFamily:"'Fredoka One',cursive",fontSize:32,color:"#fff",
          textShadow:"0 2px 8px rgba(0,0,0,.3)"}}>10 Stele!</div>
        <div style={{fontSize:16,color:"rgba(255,255,255,.9)",marginTop:4,fontWeight:700}}>
          Ești un campion! 🌟
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   PIANO MAGIC — Realistic sound engine + Animal mode
══════════════════════════════════════════════════════ */

/* ── Realistic Piano Sound Engine ──
   Uses multiple oscillators + filters for warm piano tone:
   - Triangle wave base (soft fundamental)
   - Sine harmonic (2x freq, octave)
   - Sine harmonic (3x freq, fifth)
   - BiquadFilter lowpass for warmth
   - ADSR envelope: fast attack, medium decay, sustain, slow release
*/
function playRealisticNote(audioCtx, freq, velocity=0.8, duration=1.8){
  if(!audioCtx) return;
  const now = audioCtx.currentTime;

  // Master gain with ADSR
  const master = audioCtx.createGain();
  master.connect(audioCtx.destination);

  // Lowpass filter for warmth
  const filter = audioCtx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.setValueAtTime(4000, now);
  filter.frequency.exponentialRampToValueAtTime(1200, now + duration);
  filter.Q.value = 0.8;
  filter.connect(master);

  // Reverb-like effect using delay
  const delay = audioCtx.createDelay(0.5);
  const delayGain = audioCtx.createGain();
  delay.delayTime.value = 0.08;
  delayGain.gain.value = 0.18;
  delay.connect(delayGain);
  delayGain.connect(master);

  const addOsc = (type, freqMult, gainVal, decayMult=1) => {
    const osc  = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.value = freq * freqMult;
    // Add slight detune for richness
    osc.detune.value = (Math.random()-0.5)*4;

    // ADSR envelope
    const attack  = 0.008;
    const decay   = 0.12 * decayMult;
    const sustain = gainVal * 0.6;
    const release = duration * 0.7;

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(gainVal * velocity, now + attack);
    gain.gain.exponentialRampToValueAtTime(sustain, now + attack + decay);
    gain.gain.setValueAtTime(sustain, now + duration - release * 0.3);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(gain);
    gain.connect(filter);
    gain.connect(delay); // send to reverb
    osc.start(now);
    osc.stop(now + duration + 0.1);
  };

  // Fundamental — triangle for soft attack
  addOsc("triangle", 1,    0.38, 1.0);
  // 2nd harmonic — sine, octave up, quieter
  addOsc("sine",     2,    0.14, 0.6);
  // 3rd harmonic — fifth
  addOsc("sine",     3,    0.07, 0.4);
  // 4th harmonic — very subtle brightness
  addOsc("sine",     4,    0.04, 0.3);
  // Sub — slight bass body
  addOsc("sine",     0.5,  0.06, 1.2);

  // Master ADSR
  master.gain.setValueAtTime(0.55, now);
  master.gain.setValueAtTime(0.55, now + duration * 0.7);
  master.gain.exponentialRampToValueAtTime(0.0001, now + duration + 0.15);
}

/* ── Animal sounds for each key ── */
const ANIMAL_KEYS = [
  { label:"Do",  animal:"🐶", name:"Cățel",    sound:"dog",      color:"#ff4d6d" },
  { label:"Re",  animal:"🐱", name:"Pisică",   sound:"cat",      color:"#ff8e53" },
  { label:"Mi",  animal:"🐮", name:"Vacă",     sound:"cow",      color:"#ffd166" },
  { label:"Fa",  animal:"🐷", name:"Purceluș", sound:"pig",      color:"#52b788" },
  { label:"Sol", animal:"🐸", name:"Broască",  sound:"frog",     color:"#4895ef" },
  { label:"La",  animal:"🦆", name:"Rățușcă",  sound:"duck",     color:"#c77dff" },
  { label:"Si",  animal:"🦉", name:"Bufniță",  sound:"owl",      color:"#ff6eb4" },
  { label:"Do²", animal:"🦁", name:"Leuț",     sound:"lion",     color:"#00c9d4" },
];

const PIANO_KEYS = [
  {note:"C4", freq:261.6, color:"#ff4d6d", label:"Do",  key:"A"},
  {note:"D4", freq:293.7, color:"#ff8e53", label:"Re",  key:"S"},
  {note:"E4", freq:329.6, color:"#ffd166", label:"Mi",  key:"D"},
  {note:"F4", freq:349.2, color:"#52b788", label:"Fa",  key:"F"},
  {note:"G4", freq:392.0, color:"#4895ef", label:"Sol", key:"G"},
  {note:"A4", freq:440.0, color:"#c77dff", label:"La",  key:"H"},
  {note:"B4", freq:493.9, color:"#ff6eb4", label:"Si",  key:"J"},
  {note:"C5", freq:523.3, color:"#00c9d4", label:"Do²", key:"K"},
];

const MELODIES = [
  { name:"⭐ Twinkle Twinkle",      notes:[0,0,4,4,5,5,4,3,3,2,2,1,1,0,4,4,3,3,2,2,1,4,4,3,3,2,2,1,0,0,4,4,5,5,4,3,3,2,2,1,1,0], tempo:520 },
  { name:"🐑 Baa Baa Black Sheep",  notes:[0,0,4,4,5,4,3,3,2,2,1,1,0], tempo:480 },
  { name:"🎂 La Mulți Ani",          notes:[0,0,1,0,3,2,0,0,1,0,4,3,0,0,7,5,3,2,1,6,6,5,3,4,3], tempo:450 },
  { name:"🎵 Mary Had a Little Lamb",notes:[2,1,0,1,2,2,2,1,1,1,2,4,4,2,1,0,1,2,2,2,1,1,2,1,0], tempo:480 },
  { name:"🎠 London Bridge",         notes:[4,5,4,3,2,3,4,1,2,3,2,3,4,4,5,4,3,2,3,4,1,4,2,0], tempo:440 },
  { name:"🌊 Ode to Joy",            notes:[2,2,3,4,4,3,2,1,0,0,1,2,2,1,1,2,2,3,4,4,3,2,1,0,0,1,2,1,0,0], tempo:400 },
  { name:"🎪 Frère Jacques",         notes:[0,1,2,0,0,1,2,0,2,3,4,2,3,4,4,5,4,3,2,0,4,5,4,3,2,0,0,3,0,0,3,0], tempo:460 },
  { name:"🎶 Für Elise",             notes:[7,6,7,6,7,4,6,5,3,0,1,3,4,5,7,6,7,6,7,4,6,5,3,0,1,3,4,2,0], tempo:360 },
  { name:"🌟 Jingle Bells",          notes:[2,2,2,2,2,2,2,4,0,1,2,3,3,3,3,3,2,2,2,2,1,1,2,1,4], tempo:420 },
  { name:"🎸 Happy Birthday",        notes:[0,0,1,0,3,2,0,0,1,0,4,3,0,0,7,5,3,2,1,6,6,5,3,4,3], tempo:380 },
  { name:"🦢 Swan Lake (temă)",      notes:[4,3,4,5,4,3,2,0,2,4,3,2,1,3,2,1,0], tempo:340 },
  { name:"🎭 Can Can",               notes:[4,4,4,3,4,5,4,3,2,0,2,4,3,2,1,0,1,2,3,4,5,4,3,4], tempo:300 },
];

const CELEBRATIONS = [
  { emoji:"🎉", colors:["#ff6b9d","#ff8e53"], label:"Bravo!" },
  { emoji:"⭐", colors:["#ffd166","#ffaa00"], label:"Super!" },
  { emoji:"🏆", colors:["#f77f00","#ff4400"], label:"Campion!" },
  { emoji:"🌟", colors:["#4895ef","#0055ff"], label:"Minunat!" },
  { emoji:"🎊", colors:["#52b788","#00aa44"], label:"Felicitări!" },
  { emoji:"🥳", colors:["#c77dff","#8800ff"], label:"Extraordinar!" },
  { emoji:"💫", colors:["#ff8e53","#ff4400"], label:"Perfect!" },
];

function PianoGame({audioRef, soundOn}){
  const [activeKey,setActiveKey]       = React.useState(null);
  const [currentMelody,setCurrentMelody]=React.useState(0);
  const [melodyProgress,setMelodyProgress]=React.useState(0);
  const [mode,setMode]                 = React.useState("learn"); // "free"|"learn"|"animals"
  const [celebration,setCelebration]   = React.useState(null);
  const [noteParticles,setNoteParticles]=React.useState([]);
  const [streak,setStreak]             = React.useState(0);
  const [wrongKey,setWrongKey]         = React.useState(null);
  const [autoPlay,setAutoPlay]         = React.useState(false);
  const [lastAnimal,setLastAnimal]     = React.useState(null);
  const autoPlayRef                    = React.useRef(null);
  const audioLoadRef                   = React.useRef({});

  const mel      = MELODIES[currentMelody];
  const nextNote = mode==="learn" ? mel.notes[melodyProgress] : null;

  // Get AudioContext
  const getCtx = React.useCallback(()=>{
    if(!audioRef.current) return null;
    return audioRef.current.getCtx?.();
  },[audioRef]);

  // Play realistic piano note
  const playPianoNote = React.useCallback((freq, velocity=0.85)=>{
    if(!soundOn) return;
    const ctx = getCtx();
    if(ctx) playRealisticNote(ctx, freq, velocity, 1.8);
  },[soundOn, getCtx]);

  // Play animal sound via Audio element
  const playAnimalSound = React.useCallback((soundKey)=>{
    if(!soundOn) return;
    const urls = {
      dog:  "https://freeanimalsounds.org/wp-content/uploads/2017/07/Bluthund_jault.mp3",
      cat:  "https://freeanimalsounds.org/wp-content/uploads/2017/07/katze_miau.mp3",
      cow:  "https://freeanimalsounds.org/wp-content/uploads/2017/07/Rinder_muh.mp3",
      pig:  "https://freeanimalsounds.org/wp-content/uploads/2017/07/schwein.mp3",
      frog: "https://freeanimalsounds.org/wp-content/uploads/2017/08/frogs.mp3",
      duck: "https://freeanimalsounds.org/wp-content/uploads/2017/07/Ente_quackt.mp3",
      owl:  "https://freeanimalsounds.org/wp-content/uploads/2017/07/owl.mp3",
      lion: "https://freeanimalsounds.org/wp-content/uploads/2017/07/Löwe.mp3",
    };
    try{
      // Use cached Audio element
      if(!audioLoadRef.current[soundKey]){
        audioLoadRef.current[soundKey] = new Audio(urls[soundKey]);
        audioLoadRef.current[soundKey].volume = 0.7;
      }
      const a = audioLoadRef.current[soundKey];
      a.currentTime = 0;
      a.play().catch(()=>{});
    }catch(e){}
  },[soundOn]);

  // Auto-play melody preview
  const previewMelody = React.useCallback(()=>{
    if(autoPlay) return;
    setAutoPlay(true);
    let i=0;
    const playNext=()=>{
      if(i>=mel.notes.length){ setAutoPlay(false); return; }
      const keyIdx = mel.notes[i];
      setActiveKey(keyIdx);
      playPianoNote(PIANO_KEYS[keyIdx%PIANO_KEYS.length].freq, 0.75);
      setTimeout(()=>setActiveKey(null), mel.tempo*0.35);
      i++;
      autoPlayRef.current = setTimeout(playNext, mel.tempo);
    };
    playNext();
  },[mel, autoPlay, playPianoNote]);

  React.useEffect(()=>{
    return()=>{ if(autoPlayRef.current) clearTimeout(autoPlayRef.current); };
  },[]);

  // Add floating note particle
  const addParticle = (keyIdx, isAnimal=false)=>{
    const key = PIANO_KEYS[keyIdx%PIANO_KEYS.length];
    const aKey= ANIMAL_KEYS[keyIdx%ANIMAL_KEYS.length];
    const id  = `${Date.now()}-${Math.random()}`;
    setNoteParticles(p=>[...p.slice(-12),{
      id,
      color: key.color,
      symbol: isAnimal ? aKey.animal : pick(["♪","♫","♩","♬","🎵","🎶"]),
      x: 12 + (keyIdx/PIANO_KEYS.length)*76,
    }]);
    setTimeout(()=>setNoteParticles(p=>p.filter(n=>n.id!==id)), 1100);
  };

  const playKey = React.useCallback((keyIdx)=>{
    if(autoPlay) return;
    const key  = PIANO_KEYS[keyIdx%PIANO_KEYS.length];
    const aKey = ANIMAL_KEYS[keyIdx%ANIMAL_KEYS.length];

    setActiveKey(keyIdx);
    setTimeout(()=>setActiveKey(k=>k===keyIdx?null:k), 220);
    try{ navigator.vibrate?.(20); }catch(e){}

    if(mode==="animals"){
      playAnimalSound(aKey.sound);
      setLastAnimal(aKey);
      addParticle(keyIdx, true);
      setTimeout(()=>setLastAnimal(null), 1800);
      return;
    }

    // Piano mode
    playPianoNote(key.freq);
    addParticle(keyIdx, false);

    if(mode==="learn"){
      if(keyIdx===nextNote){
        const next = melodyProgress+1;
        setStreak(s=>s+1);
        if(next >= mel.notes.length){
          const celeb = pick(CELEBRATIONS);
          setCelebration(celeb);
          setMelodyProgress(0);
          setStreak(0);
          // Play victory arpeggio
          [0,2,4,7].forEach((n,i)=>setTimeout(()=>{
            playPianoNote(PIANO_KEYS[n].freq*1.5, 0.5);
            addParticle(n);
          }, i*120));
          setTimeout(()=>setCelebration(null), 3800);
        } else {
          setMelodyProgress(next);
        }
      } else {
        setWrongKey(keyIdx);
        setTimeout(()=>setWrongKey(null), 350);
        // Play short error tone
        const ctx=getCtx();
        if(ctx && soundOn){
          const o=ctx.createOscillator();
          const g=ctx.createGain();
          o.type="sawtooth"; o.frequency.value=120;
          g.gain.setValueAtTime(0.1,ctx.currentTime);
          g.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+0.18);
          o.connect(g); g.connect(ctx.destination);
          o.start(); o.stop(ctx.currentTime+0.18);
        }
      }
    }
  },[mode,nextNote,melodyProgress,mel,autoPlay,playPianoNote,playAnimalSound,getCtx,soundOn]);

  // Keyboard support
  React.useEffect(()=>{
    const onKey=(e)=>{
      if(e.repeat) return;
      const idx=PIANO_KEYS.findIndex(k=>k.key===e.key.toUpperCase());
      if(idx!==-1) playKey(idx);
    };
    window.addEventListener("keydown",onKey);
    return()=>window.removeEventListener("keydown",onKey);
  },[playKey]);

  const progress = mode==="learn" ? (melodyProgress/mel.notes.length)*100 : 0;

  return(
    <div style={{
      flex:1,display:"flex",flexDirection:"column",
      background:"linear-gradient(180deg,#08001a 0%,#0d0030 50%,#050018 100%)",
      borderRadius:28,overflow:"hidden",position:"relative",
      border:"1.5px solid rgba(255,255,255,0.1)",
      boxShadow:"0 12px 56px rgba(100,50,255,0.2)",
    }}>

      {/* Celebration overlay */}
      {celebration&&(
        <div style={{position:"absolute",inset:0,zIndex:50,
          display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
          background:"rgba(0,0,0,0.65)",backdropFilter:"blur(8px)",
          animation:"star-celeb-fade 3.8s ease-out forwards",pointerEvents:"none"}}>
          {Array.from({length:22}).map((_,i)=>(
            <div key={i} style={{position:"absolute",left:`${rand(5,95)}%`,top:"-5%",
              fontSize:rand(18,34),
              animation:`confetti-fall ${rand(1.2,3)}s ease-in ${rand(0,1.2)}s both`}}>
              {pick(["🎵","🎶","🎹","🎊","🎉","⭐","💫","✨","♪","♫"])}
            </div>
          ))}
          <div style={{
            background:`linear-gradient(135deg,${celebration.colors[0]},${celebration.colors[1]})`,
            borderRadius:28,padding:"28px 48px",textAlign:"center",
            boxShadow:`0 8px 48px ${celebration.colors[0]}88`,
            border:"2px solid rgba(255,255,255,.3)",
            animation:"star-pop .45s cubic-bezier(.34,1.56,.64,1)",
          }}>
            <div style={{fontSize:68,marginBottom:6}}>{celebration.emoji}</div>
            <div style={{fontFamily:"'Fredoka One',cursive",fontSize:36,color:"#fff",
              textShadow:"0 2px 12px rgba(0,0,0,.4)"}}>{celebration.label}</div>
            <div style={{fontSize:15,color:"rgba(255,255,255,.85)",marginTop:6,fontWeight:700}}>
              Ai cântat complet {mel.name}! 🎹
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{padding:"12px 14px 8px",borderBottom:"1px solid rgba(255,255,255,.07)",position:"relative",zIndex:2}}>
        <div style={{display:"flex",gap:6,alignItems:"center",flexWrap:"wrap",marginBottom:8}}>
          <button onClick={()=>{setMode("free");setMelodyProgress(0);}} style={{
            borderRadius:12,border:"none",cursor:"pointer",padding:"8px 14px",
            fontWeight:900,fontSize:12,fontFamily:"'Fredoka One',cursive",
            background:mode==="free"?"linear-gradient(135deg,#ff6b9d,#ff8e53)":"rgba(255,255,255,0.08)",
            color:"#fff"}}>🎵 Liber</button>
          <button onClick={()=>{setMode("learn");setMelodyProgress(0);setStreak(0);}} style={{
            borderRadius:12,border:"none",cursor:"pointer",padding:"8px 14px",
            fontWeight:900,fontSize:12,fontFamily:"'Fredoka One',cursive",
            background:mode==="learn"?"linear-gradient(135deg,#4895ef,#c77dff)":"rgba(255,255,255,0.08)",
            color:"#fff"}}>🎓 Învață</button>
          <button onClick={()=>{setMode("animals");}} style={{
            borderRadius:12,border:"none",cursor:"pointer",padding:"8px 14px",
            fontWeight:900,fontSize:12,fontFamily:"'Fredoka One',cursive",
            background:mode==="animals"?"linear-gradient(135deg,#52b788,#00c9d4)":"rgba(255,255,255,0.08)",
            color:"#fff"}}>🐾 Animale</button>
          {mode==="learn"&&(
            <button onClick={previewMelody} disabled={autoPlay} style={{
              borderRadius:12,border:"none",cursor:autoPlay?"default":"pointer",padding:"8px 14px",
              fontWeight:900,fontSize:12,fontFamily:"'Fredoka One',cursive",
              background:autoPlay?"rgba(255,255,255,.04)":"linear-gradient(135deg,#52b788,#4895ef)",
              color:autoPlay?"#444":"#fff",opacity:autoPlay?.5:1}}>
              {autoPlay?"▶ Redare...":"▶ Ascultă"}
            </button>
          )}
        </div>
        {mode==="learn"&&(
          <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
            <select value={currentMelody}
              onChange={e=>{setCurrentMelody(Number(e.target.value));setMelodyProgress(0);setStreak(0);}}
              style={{borderRadius:10,border:"none",padding:"7px 12px",flex:1,maxWidth:240,
                background:"rgba(255,255,255,.1)",color:"#fff",fontSize:12,fontWeight:700,cursor:"pointer"}}>
              {MELODIES.map((m,i)=>(
                <option key={i} value={i} style={{background:"#0d0030"}}>{m.name}</option>
              ))}
            </select>
            <div style={{flex:1,minWidth:80}}>
              <div style={{fontSize:10,color:"rgba(255,255,255,.4)",marginBottom:3,fontWeight:700}}>
                {melodyProgress}/{mel.notes.length} · 🔥{streak}
              </div>
              <div style={{height:5,background:"rgba(255,255,255,.08)",borderRadius:4,overflow:"hidden"}}>
                <div style={{height:"100%",width:`${progress}%`,
                  background:"linear-gradient(90deg,#4895ef,#c77dff)",
                  borderRadius:4,transition:"width .15s"}}/>
              </div>
            </div>
          </div>
        )}
        {mode==="animals"&&(
          <div style={{color:"rgba(255,255,255,.5)",fontSize:12,fontWeight:700}}>
            Atinge orice tastă și ascultă animalul! 🐾
          </div>
        )}
      </div>

      {/* Display area */}
      <div style={{flex:1,position:"relative",overflow:"hidden",minHeight:100,
        display:"flex",alignItems:"center",justifyContent:"center"}}>
        {/* Floating particles */}
        {noteParticles.map(p=>(
          <div key={p.id} style={{
            position:"absolute",left:`${p.x}%`,bottom:"15%",
            fontSize:rand(18,28),color:p.color,pointerEvents:"none",
            animation:"piano-note-float 1.1s ease-out both",
            textShadow:`0 0 14px ${p.color}`,
          }}>{p.symbol}</div>
        ))}

        {/* Next note */}
        {mode==="learn"&&nextNote!==null&&!celebration&&(
          <div style={{textAlign:"center",zIndex:2,pointerEvents:"none"}}>
            <div style={{fontSize:10,color:"rgba(255,255,255,.35)",fontWeight:700,
              textTransform:"uppercase",letterSpacing:2,marginBottom:4}}>Apasă nota</div>
            <div style={{fontFamily:"'Fredoka One',cursive",fontSize:56,fontWeight:900,
              color:PIANO_KEYS[nextNote%PIANO_KEYS.length].color,
              animation:"bounce 0.65s ease-in-out infinite alternate",
              textShadow:`0 0 30px ${PIANO_KEYS[nextNote%PIANO_KEYS.length].color}`,
            }}>{PIANO_KEYS[nextNote%PIANO_KEYS.length].label}</div>
            <div style={{fontSize:26,color:PIANO_KEYS[nextNote%PIANO_KEYS.length].color,
              animation:"bounce 0.65s ease-in-out infinite alternate",marginTop:2}}>↓</div>
          </div>
        )}

        {/* Animal display */}
        {mode==="animals"&&lastAnimal&&(
          <div style={{textAlign:"center",animation:"star-pop .3s cubic-bezier(.34,1.56,.64,1)"}}>
            <div style={{fontSize:64}}>{lastAnimal.animal}</div>
            <div style={{fontFamily:"'Fredoka One',cursive",fontSize:22,color:lastAnimal.color,
              marginTop:4,textShadow:`0 0 20px ${lastAnimal.color}`}}>{lastAnimal.name}</div>
          </div>
        )}
        {mode==="animals"&&!lastAnimal&&(
          <div style={{color:"rgba(255,255,255,.15)",fontFamily:"'Fredoka One',cursive",fontSize:20,textAlign:"center"}}>
            🐾 Apasă o tastă!
          </div>
        )}
        {mode==="free"&&noteParticles.length===0&&(
          <div style={{color:"rgba(255,255,255,.12)",fontFamily:"'Fredoka One',cursive",fontSize:18,textAlign:"center"}}>
            🎹 Cântă liber!
          </div>
        )}
      </div>

      {/* Piano keys — AT THE BOTTOM */}
      <div style={{padding:"0 8px 14px",
        background:"linear-gradient(0deg,rgba(0,0,0,.5),transparent)",
        position:"relative",zIndex:2}}>

        {/* Next key indicator strip */}
        {mode==="learn"&&nextNote!==null&&(
          <div style={{height:3,borderRadius:4,marginBottom:5,background:"rgba(255,255,255,.05)",overflow:"hidden"}}>
            <div style={{
              height:"100%",
              marginLeft:`${(nextNote/PIANO_KEYS.length)*100}%`,
              width:`${(1/PIANO_KEYS.length)*100}%`,
              background:PIANO_KEYS[nextNote%PIANO_KEYS.length].color,
              borderRadius:4,
              boxShadow:`0 0 8px ${PIANO_KEYS[nextNote%PIANO_KEYS.length].color}`,
              transition:"all .12s",
            }}/>
          </div>
        )}

        <div style={{display:"flex",gap:4}}>
          {(mode==="animals"?ANIMAL_KEYS:PIANO_KEYS).map((key,i)=>{
            const pianoKey  = PIANO_KEYS[i];
            const isActive  = activeKey===i;
            const isNext    = mode==="learn"&&nextNote===i;
            const isWrong   = wrongKey===i;
            const keyColor  = key.color;

            return(
              <button key={i}
                onMouseDown={()=>playKey(i)}
                onTouchStart={e=>{e.preventDefault();playKey(i);}}
                style={{
                  flex:1,
                  height: isNext ? 145 : 118,
                  borderRadius:"6px 6px 14px 14px",
                  border:"none",cursor:"pointer",
                  background: isActive
                    ? `linear-gradient(180deg,#ffffff 0%,${keyColor} 50%,${keyColor}cc 100%)`
                    : isWrong
                    ? "linear-gradient(180deg,#ff3333,#990000)"
                    : isNext
                    ? `linear-gradient(180deg,${keyColor}ff,${keyColor}88,${keyColor}44)`
                    : `linear-gradient(180deg,rgba(255,255,255,.1),${keyColor}44,${keyColor}22)`,
                  boxShadow: isActive
                    ? `0 0 20px ${keyColor},0 0 40px ${keyColor}55,inset 0 2px 4px rgba(255,255,255,.6),0 4px 0 rgba(0,0,0,.5)`
                    : isNext
                    ? `0 0 14px ${keyColor}aa,0 0 28px ${keyColor}33,inset 0 1px 0 rgba(255,255,255,.15),0 5px 0 rgba(0,0,0,.5)`
                    : `inset 0 1px 0 rgba(255,255,255,.06),0 5px 0 rgba(0,0,0,.6),0 2px 6px rgba(0,0,0,.5)`,
                  border:`1.5px solid ${isActive?keyColor:isNext?keyColor:"rgba(255,255,255,.06)"}`,
                  transform: isActive ? "translateY(4px) scale(0.98)" : "translateY(0) scale(1)",
                  transition:"transform .07s, box-shadow .07s",
                  display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"flex-end",
                  paddingBottom:8,gap:2,position:"relative",overflow:"hidden",
                  animation:isNext&&!isActive?"key-pulse 1s ease-in-out infinite":"none",
                }}>
                {isActive&&(
                  <div style={{position:"absolute",inset:0,borderRadius:"inherit",
                    background:"radial-gradient(circle at 50% 20%,rgba(255,255,255,.7),transparent 65%)",
                    pointerEvents:"none"}}/>
                )}
                {/* Animal emoji OR note name */}
                {mode==="animals"
                  ? <span style={{fontSize:22,position:"relative",zIndex:1}}>{key.animal}</span>
                  : null
                }
                <span style={{fontSize:12,fontWeight:900,
                  color:isActive?"#1a1a2e":"#fff",
                  fontFamily:"'Fredoka One',cursive",
                  textShadow:isActive?"none":`0 0 8px ${keyColor}`,
                  position:"relative",zIndex:1}}>
                  {mode==="animals"?key.name:key.label}
                </span>
                <span style={{fontSize:8,color:"rgba(255,255,255,.25)",
                  position:"relative",zIndex:1}}>[{pianoKey.key}]</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}


export default function App(){
  const [game,setGame]             = useState("free");
  const [diff,setDiff]             = useState("medium");
  const [items,setItems]           = useState([]);
  const [bursts,setBursts]         = useState([]);
  const [flashes,setFlashes]       = useState([]);
  const [score,setScore]           = useState(0);
  const [streak,setStreak]         = useState(0);
  const [stars,setStars]           = useState(0);
  const [soundOn,setSoundOn]       = useState(true);
  const [holdingId,setHoldingId]   = useState(null);
  const [pressedScale,setPressedScale] = useState(1);
  const [targetColor,setTargetColor]   = useState("red");
  const [targetAnimal,setTargetAnimal] = useState(ANIMALS[1]);
  const [targetCount,setTargetCount]   = useState(3);
  const [poppedCount,setPoppedCount]   = useState(0);
  const [targetShape,setTargetShape]   = useState("circle");
  const [targetHero,setTargetHero]     = useState(null);
  const [message,setMessage]       = useState("Alege un joc și pornește distracția! 🎉");
  const [speedTime,setSpeedTime]   = useState(25);
  const [sideOpen,setSideOpen]     = useState(true);
  const [pulse,setPulse]           = useState(false);
  const [celebrateType,setCelebrate] = useState(null);
  const [heroScore,setHeroScore]   = useState(0);
  const [showNames,setShowNames]   = useState(false);
  const [isFullscreen,setIsFullscreen] = useState(false);
  const [fireworks,setFireworks]   = useState([]);
  const [showFwHint,setShowFwHint]   = useState(true);
  const [theme,setTheme]             = useState("spring");
  const [showSplash,setShowSplash]   = useState(true);
  const [starCelebration,setStarCelebration] = useState(false);
  const [pianoKeys,setPianoKeys]     = useState([]); // active piano key flashes
  const [gameTransition,setGameTransition]   = useState(false);
  const [fwSpeed,setFwSpeed]       = useState(50); // 1=slow ... 100=fast

  const areaRef  = useRef(null);
  const frameRef = useRef(null);
  const holdRef  = useRef(null);
  const lastTRef = useRef(0);
  const spawnRef = useRef(null);
  const audioRef = useRef(null);

  const D = DIFFICULTY[diff];
  const W = WORLDS[game] || null;
  const isStory = STORY_GAMES.includes(game);
  const selClassic = CLASSIC_GAMES.find(g=>g.id===game);
  const isNight = game==="snowwhite" || game==="elsa" || game==="fireworks" || theme==="winter";

  // ── FULLSCREEN LOGIC ──
  // ── Fullscreen helpers ──
  const enterFullscreen = useCallback(()=>{
    const el = document.documentElement;
    try{
      if(el.requestFullscreen)            el.requestFullscreen();
      else if(el.webkitRequestFullscreen) el.webkitRequestFullscreen();
      else if(el.mozRequestFullScreen)    el.mozRequestFullScreen();
      else if(el.msRequestFullscreen)     el.msRequestFullscreen();
    }catch(e){}
  },[]);

  const exitFullscreen = useCallback(()=>{
    try{
      if(document.exitFullscreen)            document.exitFullscreen();
      else if(document.webkitExitFullscreen) document.webkitExitFullscreen();
      else if(document.mozCancelFullScreen)  document.mozCancelFullScreen();
      else if(document.msExitFullscreen)     document.msExitFullscreen();
    }catch(e){}
  },[]);

  const toggleFullscreen = useCallback(()=>{
    isFullscreen ? exitFullscreen() : enterFullscreen();
  },[isFullscreen, enterFullscreen, exitFullscreen]);

  // Sync state with actual fullscreen status
  useEffect(()=>{
    const handler=()=>{
      const isFs=!!(
        document.fullscreenElement||
        document.webkitFullscreenElement||
        document.mozFullScreenElement
      );
      setIsFullscreen(isFs);
    };
    document.addEventListener("fullscreenchange",handler);
    document.addEventListener("webkitfullscreenchange",handler);
    document.addEventListener("mozfullscreenchange",handler);
    return()=>{
      document.removeEventListener("fullscreenchange",handler);
      document.removeEventListener("webkitfullscreenchange",handler);
      document.removeEventListener("mozfullscreenchange",handler);
    };
  },[]);

  // ── AUTO-ENTER FULLSCREEN on first load ──
  useEffect(()=>{
    // Small delay to allow browser to be ready
    const t = setTimeout(()=>{
      const alreadyFs=!!(
        document.fullscreenElement||
        document.webkitFullscreenElement||
        document.mozFullScreenElement
      );
      if(!alreadyFs) enterFullscreen();
    }, 800);
    return()=>clearTimeout(t);
  },[enterFullscreen]);

  // ── FIREWORKS LOGIC ──
  const spawnFirework = useCallback((clientX, clientY)=>{
    setShowFwHint(false);
    if(soundOn&&audioRef.current) audioRef.current.star?.();

    const addFw=(x,y)=>{
      const id=uid();
      setFireworks(p=>[...p,{id,x,y,palette:pick(FW_PALETTES)}]);
      setTimeout(()=>setFireworks(p=>p.filter(f=>f.id!==id)),3500);
    };

    addFw(clientX,clientY);

    // 0-2 extra rockets
    const extraCount=Math.floor(rand(0,2)); // max 1 extra rocket
    Array.from({length:extraCount}).forEach((_,i)=>{
      setTimeout(()=>{
        addFw(clientX+rand(-130,130), clientY+rand(-90,90));
      }, 280+i*220+rand(0,120));
    });
  },[soundOn]);



  // Inject mobile viewport meta for tablet/phone
  useEffect(()=>{
    let meta = document.querySelector('meta[name="viewport"]');
    if(!meta){ meta=document.createElement('meta'); meta.name='viewport'; document.head.appendChild(meta); }
    meta.content='width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no,viewport-fit=cover';
    document.body.style.overflow='hidden';
    document.body.style.position='fixed';
    document.body.style.width='100%';
    document.body.style.height='100%';
    return()=>{ document.body.style.overflow=''; document.body.style.position=''; };
  },[]);

  useEffect(()=>{ audioRef.current=makeAudio(); },[]);
  const play=useCallback((n,a)=>{ if(!soundOn||!audioRef.current?.[n]) return; audioRef.current[n](a); },[soundOn]);

  const addBurst=useCallback((x,y,emoji="✨")=>{
    const id=uid(); setBursts(p=>[...p,{id,x,y,emoji}]);
    setTimeout(()=>setBursts(p=>p.filter(b=>b.id!==id)),1000);
  },[]);
  const addFlash=useCallback((x,y,text)=>{
    const id=uid(); setFlashes(p=>[...p,{id,x,y,text}]);
    setTimeout(()=>setFlashes(p=>p.filter(f=>f.id!==id)),1100);
  },[]);

  const doCelebrate=useCallback((txt,type="magic")=>{
    setStars(s=>{
      const next=s+1;
      if(next>0 && next%10===0){
        setStarCelebration(true);
        setTimeout(()=>setStarCelebration(false),5000);
      }
      return next;
    });
    setMessage(txt); play("star");
    setPulse(true); setTimeout(()=>setPulse(false),700);
    setCelebrate(type); setTimeout(()=>setCelebrate(null),3000);
  },[play]);

  const shapeName=s=>({circle:"Cerc",square:"Pătrat",triangle:"Triunghi",heart:"Inimă",diamond:"Diamant",star:"Stea"}[s]||s);

  const pickNextHero=useCallback((WW)=>{
    const h=pick(WW.heroes); setTargetHero(h); return h;
  },[]);

  const reset=useCallback((g,d)=>{
    const cur=g||game; const curD=DIFFICULTY[d||diff];
    setItems([]); setBursts([]); setFlashes([]);
    setScore(0); setStreak(0); setPoppedCount(0); setHeroScore(0);
    setHoldingId(null); holdRef.current=null; setPressedScale(1);
    if(STORY_GAMES.includes(cur)){
      const WW=WORLDS[cur]; const h=pick(WW.heroes); setTargetHero(h);
      setMessage(`Găsește-l pe ${h.name}! ${h.emoji}`);
    } else if(cur==="colors"){ const c=pick(COLORS); setTargetColor(c); setMessage(`Sparge baloanele ${COLOR_MAP[c].name.toLowerCase()}!`); }
    else if(cur==="animals"){ const a=pick(ALL_CREATURES); setTargetAnimal(a); setMessage(`Găsește ${a.name.toLowerCase()}!`); }
    else if(cur==="count"){ const n=Math.floor(rand(curD.count[0],curD.count[1])); setTargetCount(n); setMessage(`Sparge exact ${n} baloane!`); }
    else if(cur==="speed"){ setSpeedTime(25); setMessage("Prinde cât mai multe înainte să dispară!"); }
    else if(cur==="shapes"){ const s=pick(SHAPES); setTargetShape(s); setMessage(`Atinge ${shapeName(s)}!`); }
    else if(cur==="fireworks"){ setMessage("Apasă ecranul sau Space pentru artificii! 🎆"); setShowFwHint(true); setTimeout(()=>setShowFwHint(false),2500); }
    else if(cur==="piano") setMessage("🎹 Alege o melodie și învață să cânți!");
    else setMessage("Apasă sau ține apăsat ca să umpli cerul! 🎈");
  },[game,diff]);

  useEffect(()=>{ reset(game,diff); },[game,diff]);

  const spawnAt=useCallback((cx,cy)=>{
    const rect=areaRef.current?.getBoundingClientRect(); if(!rect) return null;
    const item=makeItem(cx-rect.left,cy-rect.top,game,diff);
    setItems(p=>[...p,item]); play("spawn"); return item.id;
  },[game,diff,play]);

  const spawnRandom=useCallback((n=1)=>{
    const rect=areaRef.current?.getBoundingClientRect(); if(!rect) return;
    if(game==="fireworks"||game==="piano") return;
    const newItems=Array.from({length:n},()=>makeItem(rand(85,rect.width-85),rand(rect.height*0.5,rect.height-105),game,diff)).filter(Boolean);
    setItems(p=>[...p,...newItems]);
  },[game,diff]);

  // ── SPACE KEY: spawn in free game OR fireworks game ──
  useEffect(()=>{
    const onKey=(e)=>{
      if(e.code!=="Space") return;
      e.preventDefault();
      if(game==="fireworks"){
        // Target upper 2/3 of screen so rocket has room to rise
        spawnFirework(rand(80,window.innerWidth-80), rand(80,window.innerHeight*0.65));
      } else if(game==="free"){
        const rect=areaRef.current?.getBoundingClientRect();
        if(!rect) return;
        spawnAt(rect.left+rand(80,rect.width-80), rect.top+rand(rect.height*0.2,rect.height-100));
      }
    };
    window.addEventListener("keydown",onKey);
    return()=>window.removeEventListener("keydown",onKey);
  },[game,spawnFirework,spawnAt]);

  useEffect(()=>{ spawnRandom(game==="speed"?6:4); },[game,diff]);

  useEffect(()=>{
    clearInterval(spawnRef.current);
    const ms=game==="speed"?850:D.spawnMs;
    const n=game==="speed"?2:1;
    if(game!=="free") spawnRef.current=setInterval(()=>spawnRandom(n),ms);
    return()=>clearInterval(spawnRef.current);
  },[game,diff,spawnRandom,D.spawnMs]);

  useEffect(()=>{
    if(game!=="speed") return;
    const t=setInterval(()=>setSpeedTime(p=>Math.max(0,p-1)),1000);
    return()=>clearInterval(t);
  },[game]);

  useEffect(()=>{
    if(game==="speed"&&speedTime===0){ setMessage(`Timp expirat! Ai prins ${score}! 🏆`); doCelebrate("Super rapid!","magic"); clearInterval(spawnRef.current); }
  },[speedTime,game]);

  useEffect(()=>{
    const loop=(t)=>{
      if(!lastTRef.current) lastTRef.current=t;
      const dt=Math.min((t-lastTRef.current)/1000,0.04); lastTRef.current=t;
      setItems(prev=>prev.map(item=>{
        const held=holdRef.current?.id===item.id;
        const hSec=held?Math.min((t-holdRef.current.startedAt)/1000,3):0;
        const sz=held?Math.min(item.size+hSec*55,230):item.size;
        const fly=item.state==="flying"||held||true;
        return{...item,size:sz,y:fly?item.y-item.speed*dt:item.y,x:item.x+Math.sin(t/700+item.drift)*item.vx*dt};
      }).filter(item=>item.y+item.size>-170&&Date.now()-item.bornAt<item.life));
      if(holdRef.current) setPressedScale(1+Math.min((t-holdRef.current.startedAt)/1000,3)*0.6);
      frameRef.current=requestAnimationFrame(loop);
    };
    frameRef.current=requestAnimationFrame(loop);
    return()=>cancelAnimationFrame(frameRef.current);
  },[game]);

  const beginHold=(cx,cy)=>{ if(game!=="free") return; const id=spawnAt(cx,cy); if(!id) return; holdRef.current={id,startedAt:performance.now()}; setHoldingId(id); setPressedScale(1); };
  const endHold=()=>{ if(game!=="free") return; if(holdRef.current) play("whoosh"); holdRef.current=null; setHoldingId(null); setPressedScale(1); };
  const tapArea=(e)=>{ e.preventDefault?.(); if(game==="free") return; const pt=e.touches?.[0]||e; spawnAt(pt.clientX,pt.clientY); };
  const wrongAction=useCallback(()=>{ setStreak(0); setMessage("Mai încearcă! Tu poți! 💛"); play("bad"); },[play]);
  const removeItem=id=>setItems(p=>p.filter(i=>i.id!==id));

  const nextStoryRound=useCallback(()=>{
    if(!W) return;
    const h=pick(W.heroes); setTargetHero(h);
    setMessage(`Acum găsește-l pe ${h.name}! ${h.emoji}`);
  },[W]);

  const nextRound=useCallback(()=>{
    if(game==="colors"){ const c=pick(COLORS); setTargetColor(c); setMessage(`Acum caută ${COLOR_MAP[c].name.toLowerCase()}!`); }
    else if(game==="animals"){ const a=pick(ALL_CREATURES); setTargetAnimal(a); setMessage(`Găsește ${a.name.toLowerCase()}!`); }
    else if(game==="count"){ const n=Math.floor(rand(D.count[0],D.count[1])); setTargetCount(n); setPoppedCount(0); setMessage(`Sparge exact ${n} baloane!`); }
    else if(game==="shapes"){ const s=pick(SHAPES); setTargetShape(s); setMessage(`Atinge ${shapeName(s)}!`); }
  },[game,D]);

  // Vibration helper
  const vibrate=(ms=40)=>{ try{ navigator.vibrate?.(ms); }catch(e){} };

  const handleItem=useCallback((item)=>{
    vibrate(30);
    if(game==="free"){
      addBurst(item.x,item.y,"✨"); addFlash(item.x,item.y,item.label||"🎉");
      if(item.sound) play("animal",item.sound);
      setScore(s=>s+1); return;
    }
    const cx=item.x,cy=item.y;
    if(isStory){
      if(item.render==="hero" && item.hero.name===targetHero?.name){
        removeItem(item.id); addBurst(cx,cy,item.hero.sparkle); addFlash(cx,cy,"❤️ +1");
        setHeroScore(s=>s+1); setScore(s=>s+1); setStreak(s=>s+1);
        const snd=item.hero.sound;
        if(snd==="bambi") play("bambi");
        else if(snd==="elsa") play("elsa");
        else if(snd==="wolf") play("wolf");
        else if(snd==="magic") play("magic");
        else if(snd==="grr") play("grr");
        else if(snd==="oink") play("oink");
        else if(snd==="hmm") play("hmm");
        else if(snd==="ham") play("ham");
        else if(snd==="bad") play("bad");
        else if(snd==="good") play("good");
        else if(snd==="pop") play("pop");
        else if(snd==="star") play("star");
        setMessage(item.hero.msg);
        if(streak+1>=D.streakNeeded) doCelebrate(`🏆 Bravo! Ai găsit ${streak+1} la rând!`,W?.celebrate||"magic");
        else setTimeout(()=>nextStoryRound(),1400);
      } else if(item.render==="hero"){ wrongAction(); }
      return;
    }
    if(game==="colors"){
      if(item.color===targetColor){ removeItem(item.id); addBurst(cx,cy,"🎈"); addFlash(cx,cy,"+1"); setScore(s=>s+1); setStreak(s=>s+1); play("pop");
        if(streak+1>=D.streakNeeded){ doCelebrate("Bravo! Culori perfecte!"); nextRound(); }
        else setMessage(`Perfect! Mai caută ${COLOR_MAP[targetColor].name.toLowerCase()}!`);
      } else wrongAction(); return;
    }
    if(game==="animals"){
      if(item.label===targetAnimal.name){ removeItem(item.id); addBurst(cx,cy,item.emoji||"✨"); addFlash(cx,cy,"+1"); setScore(s=>s+1); setStreak(s=>s+1); play("animal",item.sound||"cip");
        if(streak+1>=D.streakNeeded){ doCelebrate(`Bravo! Ai găsit ${targetAnimal.name}!`); nextRound(); }
        else setMessage(`Da! ${targetAnimal.name}! 🐾`);
      } else wrongAction(); return;
    }
    if(game==="count"){
      removeItem(item.id); addBurst(cx,cy,"💥"); addFlash(cx,cy,"POP!"); play("pop");
      setPoppedCount(c=>{ const next=c+1;
        if(next===targetCount){ setScore(s=>s+1); doCelebrate(`Exact ${targetCount}! Minunat!`); setTimeout(()=>nextRound(),600); }
        else if(next>targetCount){ wrongAction(); setTimeout(()=>nextRound(),600); }
        else setMessage(`Ai spart ${next}. Mai ai ${targetCount-next}!`);
        return next;
      }); return;
    }
    if(game==="speed"){ removeItem(item.id); addBurst(cx,cy,"⚡"); addFlash(cx,cy,"+1"); setScore(s=>{ if((s+1)%10===0) doCelebrate("Ești fulger! ✨"); return s+1; }); play("pop"); return; }
    if(game==="shapes"){
      if(item.shape===targetShape){ removeItem(item.id); addBurst(cx,cy,"⭐"); addFlash(cx,cy,"+1"); setScore(s=>s+1); setStreak(s=>s+1); play("good");
        if(streak+1>=D.streakNeeded){ doCelebrate("Bravo! Maestrul formelor!"); nextRound(); }
        else setMessage("Corect! Mai caută aceeași formă!");
      } else wrongAction(); return;
    }
  },[game,isStory,targetColor,targetAnimal,targetCount,targetShape,targetHero,streak,nextRound,nextStoryRound,wrongAction,addBurst,addFlash,play,doCelebrate,D,W]);

  const T = THEMES[theme] || THEMES.day;
  const skyBg = game==="fireworks"
    ? "linear-gradient(180deg,#000000 0%,#020208 30%,#050510 60%,#080818 100%)"
    : W ? W.sky
    : T.sky;

  const badge=useMemo(()=>{
    const bs={display:"flex",alignItems:"center",gap:10,background:"rgba(255,255,255,0.92)",backdropFilter:"blur(12px)",borderRadius:20,padding:"9px 16px",boxShadow:"0 4px 20px rgba(0,0,0,0.1)",border:"1.5px solid rgba(255,255,255,0.6)"};
    const lbl={fontSize:9,fontWeight:700,letterSpacing:2,color:"#999",textTransform:"uppercase"};
    const val={fontSize:16,fontWeight:900,color:"#1a1a2e",fontFamily:"'Fredoka One',cursive"};
    if(isStory&&targetHero) return(
      <div style={bs}>
        <div style={{width:38,height:38,borderRadius:"50%",background:targetHero.bg,border:`3px solid ${targetHero.border}`,
          display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>{targetHero.emoji}</div>
        <div><div style={lbl}>Găsește</div><div style={{...val,color:targetHero.border}}>{targetHero.name}</div></div>
        <div style={{borderLeft:"1px solid #eee",paddingLeft:10,marginLeft:2}}>
          <div style={lbl}>Prins</div><div style={val}>{heroScore}</div>
        </div>
      </div>);
    if(game==="colors") return(<div style={bs}><div style={{width:28,height:28,borderRadius:"50%",background:COLOR_MAP[targetColor].grad,boxShadow:`0 0 12px ${COLOR_MAP[targetColor].glow}`,flexShrink:0}}/><div><div style={lbl}>Culoarea</div><div style={val}>{COLOR_MAP[targetColor].name}</div></div></div>);
    if(game==="animals") return(<div style={bs}><span style={{fontSize:26}}>{targetAnimal.emoji}</span><div><div style={lbl}>Găsește</div><div style={val}>{targetAnimal.name}</div></div></div>);
    if(game==="count")   return(<div style={bs}><span style={{fontSize:24}}>🎯</span><div><div style={lbl}>Progres</div><div style={val}>{poppedCount} / {targetCount}</div></div></div>);
    if(game==="shapes")  return(<div style={bs}><span style={{fontSize:24}}>{targetShape==="circle"?"⭕":targetShape==="square"?"🟦":targetShape==="triangle"?"🔺":targetShape==="heart"?"❤️":targetShape==="diamond"?"💎":"⭐"}</span><div><div style={lbl}>Forma</div><div style={val}>{shapeName(targetShape)}</div></div></div>);
    if(game==="speed")   return(<div style={bs}><span style={{fontSize:22}}>⏱️</span><div><div style={lbl}>Timp</div><div style={{...val,color:speedTime<=5?"#ff4d6d":"#1a1a2e",transition:"color .3s"}}>{speedTime}s</div></div></div>);
    return null;
  },[game,isStory,targetHero,targetColor,targetAnimal,targetCount,poppedCount,targetShape,speedTime,heroScore]);

  const gameColor = W?.color || selClassic?.color || "#ff6b9d";
  const gameTitle = W?.title || selClassic?.title || "Joacă";
  const gameEmoji = W?.emoji || selClassic?.emoji || "🎉";

  return(
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@700;900&display=swap');
        *{box-sizing:border-box;-webkit-tap-highlight-color:transparent;}
        body{margin:0;font-family:'Nunito',sans-serif;}
        @keyframes sway{0%,100%{transform:rotate(-3deg)}50%{transform:rotate(3deg)}}
        @keyframes float-c{0%,100%{transform:translateX(0)}50%{transform:translateX(20px)}}
        @keyframes float-c2{0%,100%{transform:translateX(0)}50%{transform:translateX(-18px)}}
        @keyframes sun-p{0%,100%{box-shadow:0 0 0 8px rgba(255,220,0,.2),0 0 32px #ffcc0066}50%{box-shadow:0 0 0 16px rgba(255,220,0,.28),0 0 48px #ffcc00aa}}
        @keyframes burst-fly{0%{opacity:1;transform:translate(0,0) scale(.5)}100%{opacity:0;transform:translate(var(--dx),var(--dy)) scale(1.5)}}
        @keyframes flash-up{0%{opacity:1;transform:translateX(-50%) translateY(0) scale(.8)}70%{opacity:1;transform:translateX(-50%) translateY(-48px) scale(1.1)}100%{opacity:0;transform:translateX(-50%) translateY(-70px) scale(.9)}}
        @keyframes item-in{0%{opacity:0;transform:translate(-50%,-50%) scale(.3)}100%{opacity:1;transform:translate(-50%,-50%) scale(1)}}
        @keyframes msg-in{0%{opacity:0;transform:translateY(6px)}100%{opacity:1;transform:translateY(0)}}
        @keyframes hero-pulse{0%,100%{opacity:.6;transform:scale(1)}50%{opacity:.95;transform:scale(1.1)}}
        @keyframes celebrate-fall{0%{opacity:1;transform:translateY(0) rotate(0deg)}100%{opacity:0;transform:translateY(115vh) rotate(360deg)}}
        @keyframes moon-glow{0%,100%{box-shadow:0 0 20px #fff4,0 0 40px #aaf4}50%{box-shadow:0 0 30px #fff6,0 0 60px #aaf6}}
        .item-in{animation:item-in .38s cubic-bezier(.34,1.56,.64,1) both}
        .item-hero{animation:item-in .38s cubic-bezier(.34,1.56,.64,1) both,item-blink 4s 2s ease-in-out infinite}
        .msg-in{animation:msg-in .3s ease-out}

        /* Fireworks */

        /* Heart cursor trail — handled by JS physics now */


        /* Fullscreen button pulse */
        @keyframes fs-pulse{0%,100%{opacity:.85}50%{opacity:1;transform:scale(1.05)}}
        /* Fireworks hint fade */
        @keyframes hint-fade{0%{opacity:1}70%{opacity:1}100%{opacity:0}}
        /* Splash screen */
        @keyframes splash-bounce{0%{transform:scale(0) rotate(-20deg);opacity:0}70%{transform:scale(1.2) rotate(5deg)}100%{transform:scale(1) rotate(0deg);opacity:1}}
        @keyframes splash-title{0%{opacity:0;transform:translateY(20px)}100%{opacity:1;transform:translateY(0)}}
        @keyframes splash-float{from{transform:translateY(0)}to{transform:translateY(-12px)}}
        @keyframes twinkle-splash{0%,100%{opacity:.5}50%{opacity:.8}}
        /* Star celebration */
        @keyframes confetti-fall{0%{transform:translateY(0) rotate(0deg);opacity:1}100%{transform:translateY(110vh) rotate(720deg);opacity:0}}
        @keyframes star-celeb-fade{0%,80%{opacity:1}100%{opacity:0}}
        @keyframes star-pop{0%{transform:scale(0.3);opacity:0}70%{transform:scale(1.15)}100%{transform:scale(1);opacity:1}}
        /* Piano */
        @keyframes piano-particle{0%{opacity:1;transform:translate(0,0) scale(1)}100%{opacity:0;transform:translate(var(--pdx,20px),var(--pdy,-60px)) scale(0.5)}}
        @keyframes key-pulse{0%,100%{transform:translateY(0);box-shadow:0 0 10px currentColor}50%{transform:translateY(-3px);box-shadow:0 0 30px currentColor,0 0 60px currentColor}}
        @keyframes piano-note-float{0%{opacity:1;transform:translateY(0) scale(1)}100%{opacity:0;transform:translateY(-80px) scale(1.4)}}
        @keyframes bounce{from{transform:translateY(0)}to{transform:translateY(-8px)}}
        /* Game transition */
        @keyframes game-fade-in{0%{opacity:0;transform:scale(0.97)}100%{opacity:1;transform:scale(1)}}
        @keyframes game-fade-out{0%{opacity:1;transform:scale(1)}100%{opacity:0;transform:scale(0.97)}}
        .game-transitioning{animation:game-fade-out .25s ease-out forwards}
        .game-visible{animation:game-fade-in .3s ease-out both}
        /* Micro-animations for items */
        @keyframes item-wiggle{0%,100%{transform:translate(-50%,-50%) rotate(-3deg)}50%{transform:translate(-50%,-50%) rotate(3deg)}}
        @keyframes item-blink{0%,90%,100%{opacity:1}92%,98%{opacity:0.3}}

        html,body{touch-action:manipulation;-webkit-tap-highlight-color:transparent;-webkit-touch-callout:none;-webkit-user-select:none;user-select:none;overscroll-behavior:none;}
        button{-webkit-tap-highlight-color:transparent;touch-action:manipulation;}

        @media(max-width:768px)and(orientation:portrait){
          .app-layout{flex-direction:column!important;padding:6px!important;gap:6px!important;}
          .sidebar{width:100%!important;max-height:190px!important;overflow-y:auto!important;}
          .sidebar-inner{flex-direction:row!important;flex-wrap:wrap!important;overflow-x:auto!important;padding:6px!important;}
          .sidebar-game-btn{min-width:72px!important;flex:0 0 auto!important;}
          .canvas-area{min-height:55vh!important;}
        }
        @media(max-width:480px){
          .msg-bar{flex-direction:column!important;gap:6px!important;}
        }
        @media(pointer:coarse){
          button{min-height:48px;}
        }
      `}</style>

      {/* Fireworks overlay */}
      <FireworkCanvas fireworksList={fireworks} canvasRef={areaRef} speed={fwSpeed}/>

      {/* Fireworks Canvas — fixed overlay */}
      <FireworkCanvas fireworksList={fireworks} canvasRef={areaRef} speed={fwSpeed}/>

      {/* Fullscreen button */}
      {/* Fullscreen controls — always visible */}
      <div style={{
        position:"fixed", top:12, right:12, zIndex:10000,
        display:"flex", flexDirection:"column", gap:6,
      }}>
        {/* Maximize button — shown when NOT fullscreen */}
        {!isFullscreen&&(
          <button
            onClick={enterFullscreen}
            title="Maximizează jocul"
            style={{
              width:52,height:52,borderRadius:16,border:"none",cursor:"pointer",
              background:"linear-gradient(135deg,#4895ef,#3f37c9)",
              backdropFilter:"blur(12px)",
              boxShadow:"0 4px 20px rgba(72,149,239,0.5), 0 2px 8px rgba(0,0,0,0.3)",
              fontSize:24,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
              color:"#fff",gap:1,transition:"all .2s",
            }}>
            <span>⛶</span>
            <span style={{fontSize:8,fontWeight:900,letterSpacing:0.5,opacity:.9}}>MAX</span>
          </button>
        )}
        {/* Minimize button — shown when IN fullscreen */}
        {isFullscreen&&(
          <button
            onClick={exitFullscreen}
            title="Minimizează jocul"
            style={{
              width:52,height:52,borderRadius:16,border:"none",cursor:"pointer",
              background:"linear-gradient(135deg,#ff4d6d,#c9184a)",
              backdropFilter:"blur(12px)",
              boxShadow:"0 4px 20px rgba(255,77,109,0.5), 0 2px 8px rgba(0,0,0,0.3)",
              fontSize:24,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
              color:"#fff",gap:1,transition:"all .2s",
            }}>
            <span>🗗</span>
            <span style={{fontSize:8,fontWeight:900,letterSpacing:0.5,opacity:.9}}>MIN</span>
          </button>
        )}
      </div>

      <div style={{display:"flex",minHeight:"100vh",padding:isFullscreen?8:12,gap:isFullscreen?8:12,height:"100vh",overflow:"hidden",
        background:pulse?"radial-gradient(circle at 50% 50%,#fffde7,#ffefc0 50%,#f0f7ff)":T.appBg,
        transition:"background .5s",fontFamily:"'Nunito',sans-serif"}} className="app-layout">

        {/* ─── SIDEBAR ─── */}
        <div style={{flexShrink:0,width:sideOpen?304:68,transition:"width .35s cubic-bezier(.34,1.2,.64,1)",
          borderRadius:28,overflow:"hidden",background:T.sidebar,backdropFilter:"blur(20px)",
          boxShadow:"0 8px 48px rgba(0,0,0,0.09),inset 0 1px 0 rgba(255,255,255,0.9)",
          border:"1.5px solid rgba(255,255,255,0.75)",display:"flex",flexDirection:"column"}}>

          <div style={{padding:"16px 12px 8px",display:"flex",alignItems:"center",justifyContent:sideOpen?"space-between":"center",gap:8}}>
            {sideOpen&&<div>
              <div style={{fontSize:9,fontWeight:700,letterSpacing:3,color:"#ff6b9d",textTransform:"uppercase"}}>Kids Play</div>
              <div style={{fontSize:24,fontWeight:900,color:T.textPrimary,fontFamily:"'Fredoka One',cursive",lineHeight:1.1}}>Balonel ✨</div>
            </div>}
            <button onClick={()=>setSideOpen(v=>!v)} style={{width:40,height:40,borderRadius:12,border:"none",cursor:"pointer",flexShrink:0,
              background:"linear-gradient(135deg,#ff6b9d,#ff8e53)",color:"#fff",fontSize:14,
              boxShadow:"0 4px 14px #ff6b9d44",display:"flex",alignItems:"center",justifyContent:"center"}}>
              {sideOpen?"◀":"▶"}
            </button>
          </div>

          {sideOpen&&<div style={{padding:"0 12px 10px"}}>
            <div style={{fontSize:9,fontWeight:700,letterSpacing:2,color:"#888",textTransform:"uppercase",marginBottom:6}}>Vârstă</div>
            <div style={{display:"flex",gap:5}}>
              {Object.entries(DIFFICULTY).map(([k,v])=>(
                <button key={k} onClick={()=>setDiff(k)} style={{flex:1,borderRadius:12,border:"none",cursor:"pointer",padding:"8px 3px",
                  background:diff===k?"linear-gradient(135deg,#ff6b9d,#ff8e53)":"rgba(0,0,0,0.05)",
                  color:diff===k?"#fff":"#555",fontSize:11,fontWeight:900,
                  boxShadow:diff===k?"0 3px 12px #ff6b9d44":"none",transition:"all .2s",lineHeight:1.3}}>
                  {v.emoji}<br/>{k==="easy"?"2-3":k==="medium"?"4-5":"6+"}
                </button>
              ))}
            </div>
          </div>}

          {sideOpen&&<div style={{padding:"0 12px 8px"}}>
            <div style={{fontSize:9,fontWeight:700,letterSpacing:2,color:T.textSecondary,textTransform:"uppercase",marginBottom:6}}>Temă</div>
            <div style={{display:"flex",gap:5}}>
              {Object.values(THEMES).map(t=>(
                <button key={t.id} onClick={()=>setTheme(t.id)} style={{
                  flex:1,borderRadius:12,border:"none",cursor:"pointer",padding:"6px 2px",
                  background:theme===t.id?`linear-gradient(135deg,${t.accent||"#ff6b9d"},${t.accent||"#ff8e53"}aa)`:"rgba(128,128,128,0.12)",
                  color:theme===t.id?"#fff":T.textPrimary,
                  fontSize:15,fontWeight:900,transition:"all .2s",
                  boxShadow:theme===t.id?`0 3px 12px ${t.accent||"#ff6b9d"}44`:"none",
                  display:"flex",flexDirection:"column",alignItems:"center",gap:1,lineHeight:1.2,
                }}><span>{t.emoji}</span><span style={{fontSize:8,opacity:.8}}>{t.label.split(" ")[0]}</span></button>
              ))}
            </div>
          </div>}

          {sideOpen&&<div style={{padding:"0 12px 10px",display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
            {[{l:"Scor",v:score,ic:"🎯",bg:"linear-gradient(135deg,#e3f2fd,#bbdefb)",fg:"#1565c0"},
              {l:"Stele",v:stars,ic:"⭐",bg:"linear-gradient(135deg,#fff9c4,#fff176)",fg:"#f57f17"},
              {l:"Serie",v:streak,ic:"🔥",bg:"linear-gradient(135deg,#fce4ec,#f48fb1)",fg:"#c62828"}].map(s=>(
              <div key={s.l} style={{background:s.bg,borderRadius:16,padding:"10px 12px",boxShadow:"0 2px 8px rgba(0,0,0,0.07)"}}>
                <div style={{fontSize:9,fontWeight:700,color:s.fg,textTransform:"uppercase",letterSpacing:1}}>{s.ic} {s.l}</div>
                <div style={{fontSize:24,fontWeight:900,color:"#1a1a2e",fontFamily:"'Fredoka One',cursive"}}>{s.v}</div>
              </div>
            ))}
            <div style={{gridColumn:"1/-1",display:"flex",gap:7}}>
              <button onClick={()=>setSoundOn(v=>!v)} style={{flex:1,borderRadius:12,border:"none",cursor:"pointer",padding:"8px 4px",
                background:soundOn?"linear-gradient(135deg,#e8f5e9,#c8e6c9)":"linear-gradient(135deg,#fafafa,#eee)",
                fontSize:12,fontWeight:700,color:soundOn?"#2e7d32":"#757575"}}>
                {soundOn?"🔊 Sunet":"🔇 Mut"}
              </button>
              <button onClick={()=>reset(game,diff)} style={{flex:1,borderRadius:12,border:"none",cursor:"pointer",padding:"8px 4px",
                background:"linear-gradient(135deg,#e8eaf6,#c5cae9)",fontSize:12,fontWeight:700,color:"#3949ab"}}>
                ↺ Reset
              </button>
              <button onClick={()=>setShowNames(v=>!v)} style={{flex:1,borderRadius:12,border:"none",cursor:"pointer",padding:"8px 4px",
                background:showNames?"linear-gradient(135deg,#fff9c4,#ffe082)":"linear-gradient(135deg,#fafafa,#eee)",
                fontSize:12,fontWeight:700,color:showNames?"#b45309":"#aaa",
                boxShadow:showNames?"0 2px 8px #ffd16644":"none",transition:"all .2s"}}>
                {showNames?"🏷️ Nume":"🏷️ Fără"}
              </button>
            </div>
          </div>}

          <div style={{overflowY:"auto",flex:1,padding:"0 8px 14px"}}>
            {sideOpen&&<div style={{fontSize:9,fontWeight:700,letterSpacing:2,textTransform:"uppercase",margin:"4px 4px 7px",padding:"4px 0",
              background:"linear-gradient(135deg,#f5c842,#ff6b9d)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>✨ Povești</div>}
            {Object.values(WORLDS).map(w=>(
              <button key={w.id} onClick={()=>{
                setGameTransition(true);
                setTimeout(()=>{ setGame(w.id); setGameTransition(false); },300);
              }} style={{
                width:"100%",marginBottom:7,borderRadius:18,border:"none",cursor:"pointer",
                padding:sideOpen?"13px 13px":"13px 0",display:"flex",alignItems:"center",
                gap:sideOpen?10:0,justifyContent:sideOpen?"flex-start":"center",
                background:game===w.id?`linear-gradient(135deg,${w.color}dd,${w.color}99)`:"rgba(255,255,255,0.65)",
                boxShadow:game===w.id?`0 4px 20px ${w.color}55`:"0 2px 6px rgba(0,0,0,0.05)",transition:"all .2s"}}>
                <div style={{width:44,height:44,borderRadius:14,flexShrink:0,
                  background:game===w.id?"rgba(255,255,255,0.22)":"rgba(0,0,0,0.04)",
                  display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>{w.emoji}</div>
                {sideOpen&&<div style={{textAlign:"left"}}>
                  <div style={{fontSize:13,fontWeight:900,color:game===w.id?"#fff":"#1a1a2e",fontFamily:"'Fredoka One',cursive"}}>{w.title}</div>
                  <div style={{fontSize:10,color:game===w.id?"rgba(255,255,255,.85)":"#999"}}>{w.heroes.slice(0,5).map(h=>h.emoji).join(" ")}</div>
                </div>}
              </button>
            ))}

            {sideOpen&&<div style={{fontSize:9,fontWeight:700,letterSpacing:2,color:"#888",textTransform:"uppercase",margin:"8px 4px 7px"}}>🎮 Jocuri clasice</div>}
            {CLASSIC_GAMES.map(g=>(
              <button key={g.id} onClick={()=>{
                setGameTransition(true);
                setTimeout(()=>{ setGame(g.id); setGameTransition(false); },300);
              }} style={{
                width:"100%",marginBottom:7,borderRadius:18,border:"none",cursor:"pointer",
                padding:sideOpen?"12px 13px":"12px 0",display:"flex",alignItems:"center",
                gap:sideOpen?10:0,justifyContent:sideOpen?"flex-start":"center",
                background:game===g.id?`linear-gradient(135deg,${g.color}cc,${g.color}88)`:"rgba(255,255,255,0.65)",
                boxShadow:game===g.id?`0 4px 18px ${g.color}44`:"0 2px 6px rgba(0,0,0,0.05)",transition:"all .2s"}}>
                <div style={{width:40,height:40,borderRadius:12,flexShrink:0,
                  background:game===g.id?"rgba(255,255,255,0.22)":"rgba(0,0,0,0.04)",
                  display:"flex",alignItems:"center",justifyContent:"center",fontSize:19}}>{g.emoji}</div>
                {sideOpen&&<div style={{textAlign:"left"}}>
                  <div style={{fontSize:12,fontWeight:900,color:game===g.id?"#fff":"#1a1a2e",fontFamily:"'Fredoka One',cursive"}}>{g.title}</div>
                  <div style={{fontSize:10,color:game===g.id?"rgba(255,255,255,.85)":"#999"}}>{g.subtitle}</div>
                </div>}
              </button>
            ))}
          </div>
        </div>

        {/* ─── MAIN AREA ─── */}
        <div style={{flex:1,display:"flex",flexDirection:"column",gap:11,minWidth:0}}>
          <div style={{borderRadius:22,padding:"14px 20px",
            background:T.msgBar,backdropFilter:"blur(16px)",
            boxShadow:"0 4px 24px rgba(0,0,0,0.08),inset 0 1px 0 rgba(255,255,255,0.9)",
            border:"1.5px solid rgba(255,255,255,0.7)",
            display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:10}}>
            <div>
              <div style={{fontSize:9,fontWeight:700,letterSpacing:2,color:gameColor,textTransform:"uppercase",marginBottom:2}}>
                {gameEmoji} {gameTitle} · {D.emoji} {D.label}
              </div>
              <div key={message} className="msg-in" style={{fontSize:18,fontWeight:900,color:"#1a1a2e",fontFamily:"'Fredoka One',cursive"}}>{message}</div>
            </div>
            <div style={{display:"flex",gap:9,flexWrap:"wrap",alignItems:"center"}}>
              {badge}
              {/* Speed slider — only for fireworks */}
              {game==="fireworks"&&(
                <div style={{display:"flex",alignItems:"center",gap:8,
                  background:"rgba(255,255,255,0.92)",backdropFilter:"blur(12px)",
                  borderRadius:20,padding:"9px 16px",
                  boxShadow:"0 4px 20px rgba(0,0,0,0.1)",
                  border:"1.5px solid rgba(255,255,255,0.6)"}}>
                  <span style={{fontSize:18}}>🐢</span>
                  <div style={{display:"flex",flexDirection:"column",gap:3}}>
                    <div style={{fontSize:9,fontWeight:700,letterSpacing:2,color:"#999",textTransform:"uppercase"}}>Viteză rachetă</div>
                    <input
                      type="range" min={5} max={100} step={5}
                      value={fwSpeed}
                      onChange={e=>setFwSpeed(Number(e.target.value))}
                      style={{
                        width:110, accentColor:"#ff6b9d",
                        cursor:"pointer",height:6,
                      }}
                    />
                  </div>
                  <span style={{fontSize:18}}>🚀</span>
                </div>
              )}
              {stars>0&&<div style={{display:"flex",alignItems:"center",gap:6,background:"linear-gradient(135deg,#fff9c4,#ffe082)",borderRadius:15,padding:"8px 13px",boxShadow:"0 2px 12px #ffd16655"}}>
                <span style={{fontSize:17}}>🏆</span>
                <span style={{fontSize:17,fontWeight:900,color:"#b45309",fontFamily:"'Fredoka One',cursive"}}>{stars}</span>
              </div>}
            </div>
          </div>

          {/* CANVAS */}
          <div ref={areaRef} onClick={(e)=>{
              if(game==="fireworks"){
              // If user clicks lower half, aim higher for better visual
              const rect=areaRef.current?.getBoundingClientRect();
              const relY=rect?e.clientY-rect.top:e.clientY;
              const absY=relY>(rect?.height||window.innerHeight)*0.65
                ? e.clientY - rand(100,200)
                : e.clientY;
              spawnFirework(e.clientX, absY); return; }
              tapArea(e);
            }}
            onMouseDown={e=>beginHold(e.clientX,e.clientY)} onMouseUp={endHold} onMouseLeave={endHold}
            onTouchStart={e=>{
              e.preventDefault();
              const t=e.touches?.[0];
              if(!t) return;
              if(game==="fireworks"){
                const rect2=areaRef.current?.getBoundingClientRect();
                const relY2=rect2?t.clientY-rect2.top:t.clientY;
                const absY2=relY2>(rect2?.height||window.innerHeight)*0.65
                  ? t.clientY - rand(100,200) : t.clientY;
                spawnFirework(t.clientX, absY2); return; }
              beginHold(t.clientX,t.clientY);
            }}
            onTouchEnd={endHold} onTouchCancel={endHold}
            className={`canvas-area game-visible ${gameTransition?"game-transitioning":""}`} style={{flex:1,minHeight:"62vh",position:"relative",overflow:"hidden",
              borderRadius:28,touchAction:"none",userSelect:"none",cursor:"pointer",
              border:"1.5px solid rgba(255,255,255,0.6)",
              boxShadow:"0 12px 56px rgba(100,180,255,0.16),inset 0 1px 0 rgba(255,255,255,0.8)",
              background:skyBg,transition:"background 1.2s"}}>

            <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse at 50% 0%,rgba(255,255,255,0.45) 0%,transparent 60%)",pointerEvents:"none"}}/>

            {/* sun or moon — NO stars for elsa/snowwhite */}
            {/* Space theme planets */}
            {theme==="space"&&game!=="fireworks"&&(
              <>
                <div style={{position:"absolute",top:"8%",left:"15%",fontSize:44,pointerEvents:"none",opacity:.6,animation:"splash-float 5s ease-in-out infinite"}}>🪐</div>
                <div style={{position:"absolute",top:"5%",right:"30%",fontSize:28,pointerEvents:"none",opacity:.5,animation:"splash-float 7s ease-in-out infinite reverse"}}>🌍</div>
                <div style={{position:"absolute",top:"15%",left:"50%",fontSize:20,pointerEvents:"none",opacity:.7}}>🛸</div>
              </>
            )}


            {game==="fireworks"?(
              <>
                {/* Moon */}
                <div style={{position:"absolute",top:18,right:28,width:58,height:58,borderRadius:"50%",
                  background:"radial-gradient(circle at 35% 35%,#fffde7,#fff9c4,#ffe082 70%,#e6c84a)",
                  boxShadow:"0 0 28px rgba(255,240,150,.45),0 0 60px rgba(255,240,100,.2)",
                  pointerEvents:"none",zIndex:2}}/>
                {/* Moon craters */}
                <div style={{position:"absolute",top:28,right:52,width:12,height:12,borderRadius:"50%",
                  background:"rgba(180,160,60,.35)",pointerEvents:"none",zIndex:3}}/>
                <div style={{position:"absolute",top:42,right:38,width:8,height:8,borderRadius:"50%",
                  background:"rgba(180,160,60,.28)",pointerEvents:"none",zIndex:3}}/>
                {/* Clouds (dark silhouette) */}
                <div style={{position:"absolute",bottom:"18%",left:"5%",pointerEvents:"none",zIndex:2,opacity:.7}}>
                  <div style={{width:160,height:45,borderRadius:"50%",background:"#111118",
                    boxShadow:"30px -10px 0 20px #111118,60px -5px 0 15px #111118,90px 5px 0 10px #111118"}}/>
                </div>
                <div style={{position:"absolute",bottom:"12%",right:"8%",pointerEvents:"none",zIndex:2,opacity:.65}}>
                  <div style={{width:120,height:35,borderRadius:"50%",background:"#0d0d15",
                    boxShadow:"25px -8px 0 16px #0d0d15,50px -4px 0 12px #0d0d15"}}/>
                </div>
                <div style={{position:"absolute",bottom:"22%",left:"35%",pointerEvents:"none",zIndex:2,opacity:.55}}>
                  <div style={{width:90,height:28,borderRadius:"50%",background:"#10101a",
                    boxShadow:"20px -6px 0 12px #10101a,40px -3px 0 8px #10101a"}}/>
                </div>
                {/* City silhouette at bottom */}
                <div style={{position:"absolute",bottom:0,left:0,right:0,height:60,pointerEvents:"none",zIndex:2,
                  background:"#080810",clipPath:"polygon(0% 100%,0% 70%,3% 70%,3% 50%,5% 50%,5% 60%,7% 60%,7% 40%,9% 40%,9% 55%,11% 55%,11% 45%,13% 45%,13% 65%,15% 65%,15% 35%,17% 35%,17% 50%,19% 50%,19% 42%,21% 42%,21% 58%,25% 58%,25% 38%,27% 38%,27% 52%,30% 52%,30% 48%,33% 48%,33% 60%,36% 60%,36% 35%,38% 35%,38% 50%,41% 50%,41% 44%,43% 44%,43% 62%,47% 62%,47% 42%,49% 42%,49% 55%,52% 55%,52% 48%,55% 48%,55% 65%,58% 65%,58% 38%,60% 38%,60% 50%,63% 50%,63% 44%,65% 44%,65% 58%,68% 58%,68% 36%,70% 36%,70% 52%,73% 52%,73% 46%,76% 46%,76% 60%,79% 60%,79% 42%,81% 42%,81% 55%,84% 55%,84% 48%,87% 48%,87% 65%,90% 65%,90% 40%,92% 40%,92% 52%,95% 52%,95% 46%,97% 46%,97% 58%,100% 58%,100% 100%)"}}/>
              </>
            ):!isNight?(
              <div style={{position:"absolute",top:14,right:22,width:52,height:52,borderRadius:"50%",
                background:"radial-gradient(circle,#ffe680,#ffcc00,#ff9900)",
                animation:"sun-p 3s ease-in-out infinite",pointerEvents:"none"}}/>
            ):(
              <div style={{position:"absolute",top:14,right:22,width:48,height:48,borderRadius:"50%",
                background:"radial-gradient(circle,#fffde7,#fff9c4,#ffe082)",
                animation:"moon-glow 4s ease-in-out infinite",pointerEvents:"none",
                boxShadow:"0 0 20px rgba(255,240,180,.5)"}}/>
            )}


            {/* clouds (day only) */}
            {!isNight&&[{l:"6%",t:"8%",s:1.1,a:"float-c",d:9},{l:"38%",t:"4%",s:.78,a:"float-c2",d:12},{l:"66%",t:"11%",s:1,a:"float-c",d:10}].map((c,i)=>(
              <div key={i} style={{position:"absolute",left:c.l,top:c.t,fontSize:50*c.s,pointerEvents:"none",opacity:.8,
                animation:`${c.a} ${c.d}s ease-in-out infinite`,animationDelay:`${i*1.8}s`}}>☁️</div>
            ))}

            {/* ground */}
            <div style={{position:"absolute",bottom:0,left:0,right:0,height:48,pointerEvents:"none",
              background:isNight?"linear-gradient(0deg,rgba(30,30,80,.5),transparent)":"linear-gradient(0deg,rgba(100,180,40,.4),transparent)"}}/>
            {W&&<div style={{position:"absolute",bottom:3,left:0,right:0,display:"flex",justifyContent:"space-around",pointerEvents:"none",fontSize:18,opacity:.88}}>
              {W.ground.split("").map((f,i)=>(
                <span key={i} style={{display:"inline-block",animation:`sway ${2.2+i*0.2}s ease-in-out infinite`,animationDelay:`${i*0.15}s`}}>{f}</span>
              ))}
            </div>}
            {!W&&<div style={{position:"absolute",bottom:3,left:0,right:0,display:"flex",justifyContent:"space-around",pointerEvents:"none",fontSize:18,opacity:.88}}>
              {T.ground.split("").map((f,i)=>(
                <span key={i} style={{display:"inline-block",animation:`sway ${2.2+i*0.22}s ease-in-out infinite`,animationDelay:`${i*0.18}s`}}>{f}</span>
              ))}
            </div>}

            {celebrateType&&<CelebrateRain type={celebrateType}/>}

            {/* PIANO overlay inside canvas */}
            {game==="piano"&&(
              <div style={{position:"absolute",inset:0,zIndex:20}}>
                <PianoGame audioRef={audioRef} soundOn={soundOn}/>
              </div>
            )}

            {/* Fireworks game instruction — auto-hides */}
            {game==="fireworks"&&showFwHint&&(
              <div style={{
                position:"absolute",inset:0,display:"flex",flexDirection:"column",
                alignItems:"center",justifyContent:"center",pointerEvents:"none",
                animation:"hint-fade 2.5s ease-out forwards",
              }}>
                <div style={{background:"rgba(10,10,30,0.75)",backdropFilter:"blur(14px)",
                  borderRadius:28,padding:"24px 36px",textAlign:"center",
                  border:"1.5px solid rgba(255,255,255,0.15)",
                  boxShadow:"0 8px 40px rgba(0,0,0,0.5)"}}>
                  <div style={{fontSize:56,marginBottom:6}}>🎆</div>
                  <div style={{fontSize:22,fontWeight:900,color:"#fff",fontFamily:"'Fredoka One',cursive",
                    textShadow:"0 2px 16px rgba(255,200,0,.5)"}}>Apasă oriunde!</div>
                  <div style={{fontSize:14,color:"rgba(255,255,255,0.7)",marginTop:6,fontWeight:700}}>
                    sau <kbd style={{background:"rgba(255,255,255,0.15)",borderRadius:8,padding:"2px 10px",
                    fontFamily:"monospace",fontSize:13,border:"1px solid rgba(255,255,255,0.2)"}}>Space</kbd>
                  </div>
                </div>
              </div>
            )}

            {/* ITEMS */}
            {items.map(item=>{
              const held=holdingId===item.id;
              const sc=held?pressedScale:1;
              const cm=COLOR_MAP[item.color];
              return(
                <button key={item.id}
                  onClick={e=>{e.stopPropagation();handleItem(item);}}
                  onTouchStart={e=>{e.stopPropagation();e.preventDefault();handleItem(item);}}
                  className={`item-in ${item.render==="hero"?"item-hero":""}`}
                  style={{position:"absolute",left:item.x,top:item.y,
                    transform:`translate(-50%,-50%) scale(${sc})`,transformOrigin:"center center",
                    background:"none",border:"none",cursor:"pointer",padding:0,transition:"transform .08s",
                    filter:held?`drop-shadow(0 0 20px ${item.render==="hero"?item.hero?.glow||"rgba(255,255,180,.7)":cm?.glow||"rgba(255,255,180,.7)"})`:"none",
                    zIndex:10}}>
                  {item.render==="hero"&&<HeroBubble hero={item.hero} size={item.size} held={held} showName={showNames}/>}
                  {item.render==="emoji"&&(
                    <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
                      <div style={{width:item.size,height:item.size,borderRadius:"50%",
                        background:"radial-gradient(circle at 35% 30%,rgba(255,255,255,0.65),rgba(255,255,255,0.1))",
                        backdropFilter:"blur(3px)",border:"2px solid rgba(255,255,255,0.55)",
                        boxShadow:"0 6px 22px rgba(0,0,0,0.14)",
                        display:"flex",alignItems:"center",justifyContent:"center",fontSize:item.size*0.56}}>{item.emoji}</div>
                      {showNames&&item.label&&(
                        <div style={{padding:"2px 10px",borderRadius:12,
                          background:"rgba(255,255,255,0.92)",backdropFilter:"blur(8px)",
                          fontSize:Math.max(9,item.size*0.13),fontWeight:900,color:"#1a1a2e",
                          fontFamily:"'Fredoka One',cursive",letterSpacing:0.3,
                          boxShadow:"0 2px 8px rgba(0,0,0,0.12)",whiteSpace:"nowrap",
                          textShadow:"none",border:"1px solid rgba(255,255,255,0.7)"}}>{item.label}</div>
                      )}
                    </div>
                  )}
                  {item.render==="balloon"&&(
                    <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
                      <Balloon color={item.color} size={item.size} held={held}/>
                      {showNames&&item.label&&(
                        <div style={{padding:"2px 10px",borderRadius:12,
                          background:"rgba(255,255,255,0.92)",backdropFilter:"blur(8px)",
                          fontSize:Math.max(9,item.size*0.13),fontWeight:900,color:"#1a1a2e",
                          fontFamily:"'Fredoka One',cursive",letterSpacing:0.3,
                          boxShadow:"0 2px 8px rgba(0,0,0,0.12)",whiteSpace:"nowrap",
                          border:"1px solid rgba(255,255,255,0.7)"}}>{item.label}</div>
                      )}
                    </div>
                  )}
                  {item.render==="shape"&&(
                    <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
                      <Shape shape={item.shape} color={item.color} size={item.size-12}/>
                      {showNames&&item.label&&(
                        <div style={{padding:"2px 10px",borderRadius:12,
                          background:"rgba(255,255,255,0.92)",backdropFilter:"blur(8px)",
                          fontSize:Math.max(9,(item.size-12)*0.13),fontWeight:900,color:"#1a1a2e",
                          fontFamily:"'Fredoka One',cursive",letterSpacing:0.3,
                          boxShadow:"0 2px 8px rgba(0,0,0,0.12)",whiteSpace:"nowrap",
                          border:"1px solid rgba(255,255,255,0.7)"}}>{item.label}</div>
                      )}
                    </div>
                  )}
                </button>
              );
            })}

            {bursts.map(b=><Burst key={b.id} x={b.x} y={b.y} emoji={b.emoji}/>)}
            {flashes.map(f=><Flash key={f.id} x={f.x} y={f.y} text={f.text}/>)}

            <div style={{position:"absolute",bottom:12,left:12,display:"flex",
              alignItems:"center",gap:8,flexWrap:"wrap"}}>
              <div style={{
                background:"rgba(255,255,255,0.72)",backdropFilter:"blur(10px)",
                borderRadius:12,padding:"5px 12px",
                fontSize:10,fontWeight:700,color:"#777",
                border:"1px solid rgba(255,255,255,0.5)"}}>
                ❤️ Creat pentru degețele curioase și zâmbete mari
              </div>
              {isFullscreen&&(
                <div style={{
                  background:"rgba(0,0,0,0.35)",backdropFilter:"blur(10px)",
                  borderRadius:12,padding:"5px 12px",
                  fontSize:10,fontWeight:700,color:"rgba(255,255,255,0.6)",
                  border:"1px solid rgba(255,255,255,0.15)"}}>
                  ESC sau 🗗 pentru a ieși
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
