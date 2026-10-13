# NAI5 Prompt Mechanics

Two kinds of facts, kept apart:

- **Official**: NovelAI's docs and the V5 launch post (links at the end).
- **Metadata**: read from the generation parameters embedded in community
  images (85 V5 PNGs collected 2026-10-05 from Discord and Telegram, 63 of
  them comics). These show what the UI actually sent, not what it means.

## Fields

| Field | What it is |
| --- | --- |
| Base Prompt | The whole page: style, format, layout, per-panel scene text. |
| Character Prompt (box) | One subject. V5 allows up to 22 boxes (official). Each box has its own Undesired Content. |
| Position | Per box, when AI's Choice is off. V5 positions are free floats (metadata: 0.788, 0.177), not the old 5×5 grid. `x` runs left→right and `y` top→bottom, 0 to 1. |
| Undesired Content | The page negative. The UC preset adds its own tags (see below). |

Metadata stores the boxes as `v4_prompt.caption.char_captions[]` with
`centers: [{x, y}]` and `use_coords` (false = AI's Choice).

## Lettering

Official:
- V5 renders English, Japanese and Chinese text. V4.5 rendered English only.
- Text in quotes is converted to a `Text:` section automatically by the UI.
- A manual `Text:` section must be the last thing in its prompt; everything
  after it is drawn as lettering.
- Length limit per generation: Curated 374 characters, Full 750 characters.
- If short text does not appear, turn off Add Quality Tags (it adds `no text`).

Metadata:
- **Automatic conversion**: when no box has a manual `Text:`, the UI appends one
  block to the end of the base prompt, spelled `teXt:`, holding every quoted line
  from every box in box order, separated by blank lines. Example: four quoted
  lines in three boxes became `teXt: Oh Endmin you're here?\n\nHere let me show
  you something\n\nTada~\n\nOmg isn't it the cutest!` at the end of the base.
- **Manual per box**: most lettered pages (15 of the 85 V5 images had a manual
  `Text:`) put a `Text:` line at the end of the box that speaks it (often after a bubble description that repeats the line in
  quotes). The UI did not add a `teXt:` block then.
- **Quality Tags**: with the toggle on, the UI appends `, very aesthetic,
  masterpiece, no text` (or `, very aesthetic, amazing quality, no text`) to the
  base, *before* any `Text:` section. Many lettered pages were made with it on, so
  it does not block lettering in general; it matters for short text (official note).
- **Separate `Text:` from the word before it.** Where the base read
  `…, no text Text: …` or `…,Text: …`, the quality tags landed before `Text:`
  (9 images). Where it read `high complexityText: …`, they landed *after* it,
  inside the lettering (3 images), or were missing (2 images). Always put a
  space, comma or line break before `Text:`.
- Multi-line lettering in one `Text:` uses line breaks; one line per bubble.
  A user whose plugin turned those breaks into commas (`teXt: 不准跟这么近！, 小心脚下。`)
  got both lines merged into one bubble; with line breaks, another front end
  split them correctly.
- Emoji inside quotes partly render (a user test showed some missing).
- **Random choice and quotes**: a box with
  `||speech bubble reading "Test1"|speech bubble reading "Test2"|speech bubble reading "Test3"||`
  had all three quotes collected into `teXt: Test1\nTest2\nTest3`, although only
  one alternative is used per image. For random dialogue, put a manual `Text:`
  inside each alternative instead (D24 in the research report:
  `||"hey there". Text: hey there|"what's up?". Text: what's up?||`).

## Weighting and syntax seen in V5 prompts

- `1.3::tag::` weights, `-1::tag::` negative weight inside the positive prompt,
  `{tag}` / `[tag]` emphasis, `artist:name` tags. Unchanged from V4.5.
- Complexity tags: `low/medium/high/ultra complexity` (official, new in V5).
- Natural-language sentences mixed with tags work in both base and boxes; most
  comic pages use full sentences for layout and action.
- Japanese and Chinese layout text works as prompt text (e.g. `3格漫画页。页面上方是一格横向长格…`).

## Settings seen on V5 comic pages

| Setting | Seen |
| --- | --- |
| Size | 832×1216 (most), 1024×1536, 1024×1024 (2×2 grids), 1216×832 (landscape), 896×2304 and 1088×1920 (tall strips) |
| Steps | 23 or 28 (a few 18–19) |
| Guidance (scale) | 5–7.5 |
| CFG rescale | 0–0.4 |
| Sampler | k_euler_ancestral (most), k_dpmpp_2m_sde, k_dpmpp_2m, k_euler; noise karras |

Images from the official UI store `NovelAI Diffusion V5` plus a hash; the hash
differs between images (0ADF9AB7, 657484A5, DB276663) and which one is Full or
Curated is not recorded, so do not infer it. Some third-party clients write the
variant itself (`NAI-Diffusion-v5-Full`).

## UC presets

The common preset text in V5 metadata begins `nsfw, lowres, artistic error, film
grain, scan artifacts, worst quality, bad quality, jpeg artifacts, very
displeasing, chromatic aberration, dithering, halftone, screentone, multiple
views, logo, too many watermarks, negative space, blank page`. It contains
`multiple views`, `screentone` and `halftone`; comic pages were still produced
with it. For screentone manga the evidence is mixed: one monochrome page asked
for `detailed screentone` and kept the preset, another dropped the preset for a
custom negative. Removing `halftone, screentone` is a reasonable first change
when tones come out flat, not a verified fix.

## Sources

- Official launch post: https://journal.novelai.net/image-generation-novelai-diffusion-v5-is-here-c2df7c6b8d2d/
- Text rendering: https://docs.novelai.net/en/image/textrendering
- Multi-character prompting: https://docs.novelai.net/en/image/multiplecharacters
- Models (Curated vs Full): https://docs.novelai.net/en/image/models
- Community metadata: see [examples.md](examples.md) for the images and links.
