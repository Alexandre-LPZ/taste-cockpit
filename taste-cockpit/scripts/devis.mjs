#!/usr/bin/env node
// devis.mjs — porte de dépense du skill taste-cockpit (fork de tasteskill, MIT, Leonxlnx).
// Usage : node <skill>/scripts/devis.mjs [--estimate] node <skill>/scripts/<script>.mjs [args...]
//
// Règle : aucun script lourd (navigateur Chrome, réseau, écriture d'images) ne tourne sans un
// GO humain. Le GO est matérialisé par un fichier jeton que SEUL l'humain (ou le hook du plugin
// ultracode-cockpit, à partir du message de l'humain) peut créer. Claude ne le crée jamais.
//   - jeton : .cockpit_go (plugin ultracode-cockpit, TTL géré par le plugin)
//   - repli sans plugin : variable d'environnement TASTE_GO=1 posée par l'humain dans SON terminal
// Les scripts légers (pas de navigateur, pas de réseau) passent sans jeton mais sont journalisés.
// Journal : .taste-skill/journal.md (append-only), une ligne par exécution.

import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, appendFileSync, statSync } from 'node:fs';
import { basename, resolve } from 'node:path';

const HEAVY = {
  'gate.mjs':        { why: 'Chrome headless x3 (1440, 390, 320) + copy-lint', min: '3-6 min CPU', net: false, writes: '.taste-skill/, shots/' },
  'shoot.mjs':       { why: 'Chrome headless, capture d\'écran', min: '~1 min', net: false, writes: 'shots/*.png, share.jpg' },
  'consistency.mjs': { why: 'Chrome headless par largeur demandée', min: '1-4 min', net: false, writes: '.taste-skill/' },
  'check.mjs':       { why: 'Chrome headless par taille + stress', min: '2-5 min', net: false, writes: 'shots/layout/' },
  'perf.mjs':        { why: 'Chrome headless, mesure de performance', min: '~1 min', net: false, writes: '.taste-skill/' },
  'photos.mjs':      { why: 'RÉSEAU : recherche/téléchargement d\'images (Openverse, Wikimedia, Met, AIC)', min: '1-3 min', net: true, writes: 'assets/img/*.webp, .taste-skill/found.json' },
  'pick.mjs':        { why: 'léger', min: '<10 s', net: false, writes: '-', light: true },
  'deal.mjs':        { why: 'léger', min: '<10 s', net: false, writes: '-', light: true },
  'start.mjs':       { why: 'léger', min: '<10 s', net: false, writes: 'CSS :root', light: true },
  'copy-lint.mjs':   { why: 'léger, aucun navigateur', min: '<5 s', net: false, writes: '-', light: true },
  'icons.mjs':       { why: 'léger', min: '<10 s', net: false, writes: '-', light: true },
  'moments.mjs':     { why: 'léger', min: '<10 s', net: false, writes: '-', light: true },
  'effects.mjs':     { why: 'léger', min: '<10 s', net: false, writes: '-', light: true },
};
// Sous-commandes de photos.mjs sans réseau ni écriture d'image
const PHOTOS_LIGHT = new Set(['credits', 'list', 'help']);

const argv = process.argv.slice(2);
const estimateOnly = argv[0] === '--estimate';
const cmd = estimateOnly ? argv.slice(1) : argv;
if (cmd.length < 2 || cmd[0] !== 'node') {
  console.error('devis.mjs: usage  node devis.mjs [--estimate] node <script.mjs> [args]');
  process.exit(64);
}
const script = basename(cmd[1]);
const sub = cmd[2] && !cmd[2].startsWith('-') ? cmd[2] : '';
let info = HEAVY[script] ?? { why: 'script inconnu : traité comme LOURD', min: '?', net: '?', writes: '?' };
if (script === 'photos.mjs' && PHOTOS_LIGHT.has(sub)) info = { ...info, light: true, why: 'léger (lecture de la page)', net: false };
const heavy = !info.light;

const lines = [
  'DEVIS taste-cockpit',
  `  commande : ${cmd.slice(1).join(' ')}`,
  `  nature   : ${heavy ? 'LOURD' : 'léger'} — ${info.why}`,
  `  durée    : ${info.min}`,
  `  réseau   : ${info.net === true ? 'OUI' : info.net === false ? 'non' : '?'}`,
  `  écrit    : ${info.writes}`,
];
console.log(lines.join('\n'));
if (estimateOnly) process.exit(0);

function goPresent() {
  if (process.env.TASTE_GO === '1') return 'TASTE_GO=1 (terminal humain)';
  const f = resolve(process.cwd(), '.cockpit_go');
  if (existsSync(f)) {
    const age = (Date.now() - statSync(f).mtimeMs) / 60000;
    if (age <= 60) return `.cockpit_go (${age.toFixed(0)} min)`;
    return null;
  }
  return null;
}

let go = 'non requis';
if (heavy) {
  go = goPresent();
  if (!go) {
    console.log('  GO       : ABSENT\n');
    console.log('STOP — script lourd sans GO humain. Montre ce devis à l\'humain et attends son GO.');
    console.log('Le GO arrive par le plugin ultracode-cockpit (jeton .cockpit_go) ou, sans plugin,');
    console.log('par TASTE_GO=1 posé par l\'humain dans son propre terminal. Claude ne pose ni l\'un ni l\'autre.');
    process.exit(3);
  }
  console.log(`  GO       : ${go}`);
}

mkdirSync('.taste-skill', { recursive: true });
const stamp = new Date().toISOString();
appendFileSync('.taste-skill/journal.md', `- ${stamp} | ${heavy ? 'LOURD' : 'léger'} | GO=${go} | ${cmd.slice(1).join(' ')}\n`);

const r = spawnSync(cmd[0], cmd.slice(1), { stdio: 'inherit', shell: process.platform === 'win32' });
appendFileSync('.taste-skill/journal.md', `  → fin ${new Date().toISOString()} code=${r.status}\n`);
process.exit(r.status ?? 1);
