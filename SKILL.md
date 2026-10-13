---
name: nai5-comic-prompt
description: Write, fix, or explain NovelAI Diffusion V5 (NAI5) prompts for comics and manga pages — panel layouts, character boxes and positions, speech bubbles, sound effects, and in-image lettering (Text:). Use when the user wants a NovelAI V5 comic, manga page, 4koma, multi-panel page, dialogue or lettering, asks why a NAI5 comic came out wrong, or wants the prompt read out of a NovelAI comic image. Not for other image models.
---

# NAI5 comic prompts

NovelAI Diffusion V5 can draw a whole multi-panel page with legible lettering in
one generation. A page prompt has a base prompt, up to 22 character boxes (each
with an optional position and its own negative), and Undesired Content. This
skill turns a story into those fields and checks them before the user spends
Anlas.

Read before writing:
- [references/syntax.md](references/syntax.md): how the fields and `Text:` work,
  official limits, settings seen on real pages. Required.
- [references/patterns.md](references/patterns.md): layout, box, lettering and
  troubleshooting patterns. Required.
- [references/examples.md](references/examples.md): ten real prompts, annotated.
  Read the one closest to the request.

`<skill-dir>` below is the directory containing this file.

## Workflow

1. **Brief.** Get the story beats, panel count, characters (name, fixed look),
   dialogue lines and their language, style (artist tags, colour or
   monochrome), reading order, and model (Full or Curated; Curated allows less
   lettering). Ask only for what you cannot reasonably choose (usually the
   beats and the lines); pick the rest and say what you picked. Defaults: 3–4
   panels, 832×1216, Full, English or Japanese lettering, left-to-right unless
   it is Japanese manga.
2. **Plan the page** as a table: panel, place on the page, shot, who, action,
   lettering and bubble type. Keep first attempts to 5 panels or fewer, one or
   two short lines per panel.
3. **Pick a structure** (patterns.md): A base only, B base layout plus one box
   per character per panel, or C one box per character across panels.
   Lettering or named characters means B.
4. **Write the base** in the order from patterns.md: style → format and panel
   count → reading order → layout sentence → shared setting and consistency
   lines → `Panel N (place, shot): …` → constraints.
5. **Write the boxes**: panel pointer and shot first, full identity tags every
   time, action, bubble description with the quoted line and its position,
   then `Text:` with the same line, last, after a space or line break. Put the
   other characters' distinguishing traits in each box's negative. Give each
   box a position inside its panel.
6. **Undesired Content**: start from the usual preset; remove `text` and any
   tag that blocks what the page needs.
7. **Check.** Write the prompt as a spec file (format below) and run
   `node <skill-dir>/scripts/check-prompt.mjs <spec.json>`. Fix every error and
   warning, or tell the user why a warning does not apply. Keep spec files in
   the user's project (for example `comic_prompts/`) or a scratch folder, not
   inside this skill.
8. **Deliver** in the user's language:
   - the page plan table;
   - the paste blocks the script prints (Base, each Character with its
     position, Undesired Content);
   - settings: size, steps, guidance, rescale, sampler, AI's Choice off,
     whether to keep Quality Tags on;
   - two or three first fixes to try if it comes out wrong, from the
     troubleshooting table.

Prompt text itself stays mostly English tags and sentences (the model reads them
best); layout sentences may be Chinese or Japanese, as in examples E4 and E5.

## Spec format

```json
{
  "model": "V5 Full",
  "size": [832, 1216],
  "base": "…",
  "characters": [
    { "prompt": "In the top panel, medium shot: … Text: Hello!", "negative": "blue hair", "position": [0.3, 0.2] }
  ],
  "negative": "…",
  "settings": { "aiChoosesPositions": false, "steps": 28, "scale": 5, "cfgRescale": 0, "sampler": "k_euler_ancestral" }
}
```

Positions are page fractions, x left to right and y top to bottom.

## Reading an existing image

`node <skill-dir>/scripts/read-prompt.mjs <png|dir>` prints the base, every box
with its position, the negatives and the settings stored in a NovelAI PNG.
`--spec` prints a spec for check-prompt.mjs with the UI's additions removed
(the Quality Tags suffix and the auto `teXt:` block, recorded in `settings`).
Use it to explain why a page failed or to start from a page the user likes.
Images that were re-encoded (Telegram photos, screenshots, most social media)
have no metadata left; say so instead of guessing.

## Honesty about evidence

- syntax.md separates official facts from what image metadata shows. Keep that
  distinction when you explain a rule; a pattern seen once is a lead.
- NovelAI does not say which model hash is Full or Curated; do not guess.
- Success rates for multi-panel pages and Chinese lettering vary a lot. Tell the
  user to expect rerolls rather than promising a page will come out as planned.
- examples.md quotes private Discord servers. Do not publish this skill, its
  references, or long excerpts from them.

## Updating this skill

The references were built from collected images (2026-10-05) using the
discord-community-research and telegram-community-research skills
(`media.mjs --with-parameters`, `download-media.mjs --with-parameters`). To
refresh them, collect newer V5 comic images the same way, read them with
read-prompt.mjs, and update syntax.md, patterns.md and examples.md, keeping the
source links. Run `node --test <skill-dir>/tests/` after changing the scripts.
