# taste-cockpit — tasteskill 2.5 sous garde-fous

Fork de [tasteskill](https://github.com/Leonxlnx/taste-skill) (Leon Lin & blueemi, licence MIT —
copie dans `LICENSE-tasteskill`), adapté aux règles de travail de l'équipe Trinity OASIS :
**validation humaine = clé de voûte, aucune dépense sans devis.**

## Ce qui est conservé (le cœur, intact)
Les neuf règles de maison, le plan par type de commerce, la bibliothèque de sections, les
photographies sous licence avec crédits, le système CSS, les icônes réelles, le vérificateur et la
porte de contrôle dans un vrai navigateur, la liste des « jamais ».

## Ce qui change
| Origine | taste-cockpit |
|---|---|
| Hook `Stop` : la porte se relance seule à chaque arrêt de Claude (timeout 600 s) | **Supprimé.** Aucun hook. |
| Boucle « jusqu'à PASS », trois tours | **Un tour par GO humain, deux au plus**, puis `--done` + rapport |
| Scripts lancés directement | Tous passent par `scripts/devis.mjs` : DEVIS (nature, durée, réseau, fichiers écrits), journal, **STOP sans GO** pour les scripts lourds (Chrome, réseau) |
| GO implicite | GO matérialisé par le jeton `.cockpit_go` du plugin [ultracode-cockpit](https://github.com/Alexandre-LPZ/garde-fous) ou par `TASTE_GO=1` posé par l'humain — jamais par Claude |
| 41 Mo, shaders/scènes/3D livrés | **30 Mo** ; `scenes`, `objects`, `effects` en étage froid (`cold/`), copiés sur brief tech/jeu/IA seulement |
| Photos web sans plafond | 8 images par page au plus, sources et licences annoncées dans le devis |
| — | `.taste-skill/journal.md` : chaque exécution horodatée, rapport final adossé au journal |

## Installation (Claude Code, par projet)
```
# dans le dossier du site
git clone https://github.com/<ton-compte>/taste-cockpit .taste-cockpit-src
cp -r .taste-cockpit-src/taste-cockpit .claude/skills/taste-cockpit
```
Prérequis : Node 22+, Chrome/Edge/Chromium. Le plugin ultracode-cockpit est recommandé (jeton GO) ;
sans lui, l'humain pose `TASTE_GO=1` dans son terminal pour chaque tour.

## Pourquoi pas sur le compte Claude (Cowork / chat)
Ce skill exécute Node et Chrome sur la machine ; le bac à sable du compte n'a ni l'un ni l'autre.
La partie *savoir* (règles, plan, checklist, jamais) existe à part : `taste-brief/SKILL.md`, un
fichier unique à importer dans Customize → Skills, pour les revues et les briefs en Cowork.

## Banc de test (16/11/2026, bac à sable Linux, Chrome 1 CPU)
- `devis.mjs` : 6 cas (léger sans GO → passe ; lourd sans GO → STOP code 3 ; `TASTE_GO=1` → passe ; `.cockpit_go` valide → passe ; jeton de 70 min → refusé ; `photos credits` léger / `photos fetch` lourd).
- Porte réelle sur `assets/starter.html` non modifié : `gate.mjs` lancé via `devis.mjs`, Chrome 1440/390/320, **70 s**, `GATE: FAIL 35 (round 1 of 2)` — 35 défauts attendus sur une page gabarit (liens `#[section id]`, `lang="[en]"`, image vide, pas de moment). Journal écrit.
- `gate.mjs` : limite par défaut passée de 3 à 2 tours (`--rounds`).
