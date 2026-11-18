# taste-cockpit — tasteskill 2.5 sous garde-fous

*Français ci-dessous · [English version](#taste-cockpit--tasteskill-25-under-guardrails)*

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

---

# taste-cockpit — tasteskill 2.5 under guardrails

A fork of [tasteskill](https://github.com/Leonxlnx/taste-skill) (Leon Lin & blueemi, MIT license —
copy in `LICENSE-tasteskill`), adapted to the working rules of the Trinity OASIS team:
**human validation is the keystone, no spend without an estimate.**

## What is kept (the core, untouched)
The nine house rules, the plan per business type, the section library, the licensed photographs with
credits, the CSS system, the real icons, the checker and the control gate in a real browser, the list
of "nevers".

## What changes
| Original | taste-cockpit |
|---|---|
| `Stop` hook: the gate relaunches itself every time Claude stops (600 s timeout) | **Removed.** No hook. |
| "Until PASS" loop, three rounds | **One round per human GO, two at most**, then `--done` + report |
| Scripts launched directly | All go through `scripts/devis.mjs`: ESTIMATE (nature, duration, network, files written), journal, **STOP without GO** for heavy scripts (Chrome, network) |
| Implicit GO | GO materialised by the `.cockpit_go` token of the [ultracode-cockpit](https://github.com/Alexandre-LPZ/garde-fous) plugin, or by `TASTE_GO=1` set by the human — never by Claude |
| 41 MB, shaders/scenes/3D shipped | **30 MB**; `scenes`, `objects`, `effects` in a cold tier (`cold/`), copied only for a tech/game/AI brief |
| Web photos without a cap | 8 images per page at most, sources and licences announced in the estimate |
| — | `.taste-skill/journal.md`: every run timestamped, final report backed by the journal |

## Install (Claude Code, per project)
```
# in the site's folder
git clone https://github.com/<your-account>/taste-cockpit .taste-cockpit-src
cp -r .taste-cockpit-src/taste-cockpit .claude/skills/taste-cockpit
```
Requirements: Node 22+, Chrome/Edge/Chromium. The ultracode-cockpit plugin is recommended (GO
token); without it, the human sets `TASTE_GO=1` in their terminal for each round.

## Why not on the Claude account (Cowork / chat)
This skill runs Node and Chrome on the machine; the account sandbox has neither. The *knowledge* part
(rules, plan, checklist, nevers) exists separately: `taste-brief/SKILL.md`, a single file to import
via Customize → Skills, for reviews and briefs in Cowork.
