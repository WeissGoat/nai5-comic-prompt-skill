# NAI5 Comic Patterns

What worked on real V5 pages. `E1`–`E8` are the annotated examples in
[examples.md](examples.md); `D` and `T` labels are discussion sources listed at
the end. A pattern seen once is a lead, not a rule; say so when you rely on one.

## Choosing a structure

| Structure | Use when | Seen in |
| --- | --- | --- |
| **A. Base only**: layout and every panel in the base prompt, no boxes | 2–4 panels, one recurring subject or simple cast, no lettering or one line per panel | E3, D2, D4 |
| **B. Base layout + one box per character per panel**, positioned inside its panel | Named characters, dialogue, 3–6 panels. The most used structure for lettered pages | E1, E2, E5, D6, D8 |
| **C. One box per character spanning all panels** ("first panel …, second panel …") | Silent strips with two recurring characters | E7 |

Default to B for anything with dialogue. Try A first for a quick layout test,
because it is the cheapest to iterate.

## Base prompt order

1. Style: artist tags, `year 2025`, medium (`monochrome, greyscale, manga` or
   `western comics (style)`), `high complexity`.
2. Format: `manga page`, `comic`, panel count (`3 panel comic`, `4koma`,
   `5 panel comic layout`), border language (`clean white gutters, clearly
   separated panels, no overlapping panels`).
3. Reading order: `Read left to right, then top to bottom.` or
   `right-to-left Japanese manga reading order`.
4. Layout sentence: `The page is divided into four panels: one wide panel on
   top, two square panels in the middle, one wide panel at the bottom.`
5. Setting shared by all panels, and consistency lines:
   `The same minister appears consistently in panels 1, 3 and 4.`,
   `consistent character design across all panels`, `same location in each panel` (D7),
   `Details remain consistent across all panels` with extra weight (D13).
6. Per panel: `Panel 1 (top, wide, low angle): …` — shot, who, action, mood.
7. Constraints: `Cyril appears only in panel 3.`, `There are no speech bubbles in panel 2.`

Panel count vocabulary: `2koma/3koma/4koma/5koma`, `N panel comic`,
`multiple panels layout`, `grid-layout`, `2x2 grid`, `vertical four-panel comic
strip`. `three-paneled comic` beats awkward phrasing that adds a panel (D28).

## Character boxes

- Start with the panel pointer and the shot:
  `In the wide top panel, medium shot: …` or `This character belongs only to panel 1.`
- Then identity tags, then pose and action, then the bubble description, then
  `Text:` last.
- Repeat the full identity in every box of the same character; boxes do not
  share memory (D15). An original character needs the same outfit tags each time.
- Use the box negative against bleed: put the *other* character's hair and eye
  colours in this box's negative (E4, E5).
- Two people in one panel need two boxes (D11).
- Position each box inside its panel. Page coordinates, y down:
  - 2×2 grid, left-to-right reading: (0.25, 0.25), (0.75, 0.25), (0.25, 0.75), (0.75, 0.75).
  - Japanese reading order puts panel 1 at the top right.
  - Three stacked rows: y ≈ 0.17, 0.5, 0.83.
  - Two people in one panel: offset x by about ±0.12 around the panel centre.
- An empty panel still tends to get a person (E8). Describe it as a scene in
  its box (`object focus, a pair of scissors lying on the counter`) rather than
  only `no humans`.

## Lettering

- Describe the bubble and quote the line in the speaker's box, then repeat the
  line after `Text:` at the end of the same box:
  `A small smooth vertical speech bubble beside Eleanor on the left. The speech
  bubble says: "……ございません" Text: ……ございません` (E2).
- Or leave out `Text:` everywhere and only quote; the UI collects the quotes
  into one `teXt:` block (see syntax.md). Simpler, but you cannot steer which
  line goes where except through the bubble descriptions.
- Say where the bubble is: `speech bubble above her head`, `to the top left`
  (D19). Without a position, bubbles can point at the wrong speaker (D25, D30).
- Bubble styles that rendered: `ordinary smooth oval`, `jagged spiky shouting
  bubble`, `thought bubble`, `rectangular narration box`, `round pink-bordered
  speech bubble with a white fill and black text`, coloured text per speaker,
  `parchment-textured speech bubble, inked font` (D22, D26). Contrast them
  explicitly: "not spiky", "not inside a bubble".
- Sound effects: `free-floating handwritten onomatopoeia drawn directly over
  the art, not inside speech bubbles` plus the text (`ざわ…`, `SNIP SNIP`).
- Japanese vertical text: `vertical Japanese text` in the base or
  `Layout: 縦書き` in the box.
- English is the most reliable, Japanese next; Chinese renders but often warps
  (T3). Keep lines short; split long speech across two bubbles.
- Quoted natural language (`speech bubble, text that says "..."`) was reported
  to reproduce text exactly (D16); a manual `text:` also shifts how the encoder
  reads what follows (D21), another reason to keep it last.

## Layout control

- Large canvas plus many panels adds panels and scrambles order: a 5-panel
  strip worked at 448×2240 and broke at 640×3200 (D14). Start at the normal
  sizes in syntax.md.
- The last panel's action can leak into earlier panels (D9b); state each
  panel's action in its own sentence and box.
- Extra outer border: put `border, outside border, comic border` in the
  negative, sparingly; too much can merge panels (D12). `-1::white borders
  around outside::` in the base was also used (E1).
- For a page with no lettering, say `silent comic, no text, no speech bubble`
  in the base (E7).

## Troubleshooting

| Symptom | First change |
| --- | --- |
| Wrong panel count | State the count in the base and in the layout sentence; lower the resolution; check that box texts do not mention extra panels. |
| Characters blend or swap | One box per character per panel; repeat identity; add the other character's traits to the box negative; position boxes. |
| Bubble points at the wrong person | Put the bubble in the speaker's box with a position phrase. |
| Lettering missing | Quotes plus `Text:` last; turn off Quality Tags for very short text; remove `text` from Undesired Content. |
| Tags appear as lettering | Something follows `Text:`; move it before. |
| Lettering garbled | Shorter lines, English or Japanese, fewer bubbles per panel, reroll. |
| Same character in every panel | Add `This character belongs only to panel N.` and position the box. |

## Discussion sources

Anlatan (NovelAI's official server), opened only by members:
- D2 https://discord.com/channels/836774308772446268/1026431143052050472/1540174877963845722
- D4 https://discord.com/channels/836774308772446268/1026431143052050472/1540278250826375219
- D6 https://discord.com/channels/836774308772446268/1026431143052050472/1540322447377829958
- D7 https://discord.com/channels/836774308772446268/1026431143052050472/1540412154618974208
- D8 https://discord.com/channels/836774308772446268/1026431143052050472/1540499756646670396
- D9b https://discord.com/channels/836774308772446268/1026431143052050472/1540548402993959085
- D11 https://discord.com/channels/836774308772446268/1345528434163585186/1540819613963657307
- D12 https://discord.com/channels/836774308772446268/1345528434163585186/1541230383654244374
- D13 https://discord.com/channels/836774308772446268/1345528434163585186/1541558430609834086
- D14 https://discord.com/channels/836774308772446268/1345528434163585186/1541887174033805482
- D15 https://discord.com/channels/836774308772446268/1345528434163585186/1541787638531367042
- D16 https://discord.com/channels/836774308772446268/1345528434163585186/1542570035892060170
- D19 https://discord.com/channels/836774308772446268/1345528434163585186/1544927648378261655
- D21 https://discord.com/channels/836774308772446268/1345528434163585186/1545475973535895702
- D22 https://discord.com/channels/836774308772446268/1037852458128507031/1545213415730192436
- D25 https://discord.com/channels/836774308772446268/1345528434163585186/1545504840673787975
- D26 https://discord.com/channels/836774308772446268/1026431143052050472/1546009029304918079
- D28 https://discord.com/channels/836774308772446268/1345528434163585186/1544117484502651020
- D30 https://discord.com/channels/836774308772446268/1345528434163585186/1545492038034923752

Telegram (人均AV卡的AI调教群): T3 https://t.me/c/1893538021/2114202
