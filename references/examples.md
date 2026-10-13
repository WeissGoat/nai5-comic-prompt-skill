# Annotated V5 Comic Prompts

Prompts read from the metadata of community images (collected 2026-10-05). They
come from private Discord servers: keep this file local, do not publish it or
quote it at length to others. Long prompts are condensed; `…` marks cuts. Links
open only for members of the server.

To read any of them in full: `node <skill-dir>/scripts/read-prompt.mjs <png>`;
the PNGs are in `discord_research/media/nai5-comic-images/files/`.

## E1 · 3koma, English dialogue, quotes only (Anlatan)

https://discord.com/channels/836774308772446268/1345528434163585186/1540164633703219370 —
posted as "an example of a comic prompt". 1024×1536, scale 8, rescale 0.2,
k_euler_ancestral, AI's Choice, Quality Tags on.

```
[Base] ultra complexity, detailed, amazing quality, ink (medium), millipen (medium), jaggy lines,
english, hand drawn dividing lines, <artist tags…>, high complexity,
1girl, multiple panels layout, 3koma, split view, thin handwritten text,
Yvonne(Arknights Endfield), motion:lines, dynamic angle, dutch angle,
two smaller panels on top and one larger bottom panel, speech bubbles, -1::white borders around outside::
[Char 1] panel on top right, girl, Yvonne(Arknights Endfield). Top right: Yvonne sitting at her desk
looking up pleasantly surprised smiling. Office background. Horns,
speech bubble above Yvonne's head, "Oh Endmin you're here?".
speech bubble above Yvonne's on left of her head, "Here let me show you something".
[Char 2] panel on top left, girl, Yvonne(...), standing Yvonne holding up pink robot in hands above head
showing it off. Office background. speech bubble above Yvonne's head, "Tada~".
[Char 3] panel on bottom, girl, Yvonne(...), close up on Yvonne hands on cheeks blushing and with star
shaped pupils, joyful expression. speech bubble to the left of Yvonne's head, "Omg isn't it the cutest!".
```

No `Text:` anywhere: the UI appended `teXt:` with the four quoted lines, in box
order, to the base. Bubble position words (`above … head`, `to the left of`) on
every line.

## E2 · 5-panel monochrome manga, Japanese vertical text, positioned boxes (Anlatan)

https://discord.com/channels/836774308772446268/1081004832468500633/1540153403064455198 —
"漫画導入部生成テスト (インペイントしてます)": the posted page was touched up
with inpainting. 832×1216, k_dpmpp_sde, positions on, 6 boxes.

```
[Base] 1girl, 2boys, crowd, monochrome Japanese fantasy manga, professional commercial manga page,
clean black ink lineart, varied line weight, detailed screentone, solid black shadows, high contrast,
serious political drama, … right-to-left Japanese manga reading order,
exactly five panels, clean white gutters, clearly separated panels, no overlapping panels,
vertical Japanese text, speech bubbles do not cover faces,
The scene takes place inside a medieval European fantasy royal courtroom. …
The same minister appears consistently in panels 1, 3 and 4. … Cyril appears only in panel 3.
Page layout: Panel 1 is a wide full-width panel at the top. Panel 2 is a narrow full-width crowd panel
below panel 1. Panel 3 is a large wide confrontation panel in the middle. The bottom row contains two
panels: panel 4 is a narrow panel on the right, and panel 5 is a much larger final panel on the left.
Panel 1: A wide establishing shot … Panel 2: … Two small handwritten Japanese manga onomatopoeia,
"ざわ…" and "ざわ…", are drawn directly over the crowd background. They are free-floating sound-effect
lettering. They are not inside speech bubbles, not inside narration boxes … Panel 3: … Panel 5: …
[Char 1 @ (0.79, 0.18)] man, middle-aged adult man, broad build, swept-back graying black hair, …
This character belongs only to panel 1. The minister stands behind a tribunal desk … Two ordinary
smooth vertical Japanese speech bubbles appear near the minister.
The first speech bubble says: "エレノア・フォン・ローゼンベルク"
The second speech bubble says: "禁術に手を出した罪により三年の追放刑に処す"
Text: エレノア・フォン・ローゼンベルク

禁術に手を出した罪により三年の追放刑に処す
[Char 3, panel 3] … Both speech bubbles have jagged, sharp, explosive and spiky outlines. They are
shouting bubbles, not ordinary smooth oval speech bubbles. … Text: 師匠！　お待ちください！ …
[UC] (preset) …, color, full color, photorealistic, 3d, painterly, chibi, comedy, … smiling, crying, …
```

The most complete pattern: layout and shot per panel in the base, one box per
character per panel with `This character belongs only to panel N.`, bubble
shape contrasts ("not spiky"), SFX described as free-floating, `Text:` last in
each box with a blank line between bubbles.

## E3 · 4-panel grid, base only, no boxes (Anlatan)

https://discord.com/channels/836774308772446268/1026431143052050472/1541369568302211173 —
1024×1024, scale 7, k_euler_ancestral, Quality Tags on.

```
duo, pokemon, official style, year 2026
4 panel comic in grid-layout showing an Espeon fighting a Dragonite.
Panel 1 (top left): Dragonite charges at Espeon. Espeon stays still with the back towards the viewer.
Panel 2 (top right): Psychic energy surrounding Dragonite and lifts it into the air, rendering it immobile. Dragonite is shocked.
Panel 3 (bottom left): Dragonite slams heads-first into the ground with a huge impact.
Panel 4 (bottom right): Dragonite lies unconscious in the crater, doing the yamcha pose. Espeon is looking down on the Dragonite.
```

The same author's 4-angle Charmander page used the same `Panel N: …` lines and
reported four distinct views "without any of them bleeding into others".

## E4 · 3-panel page described in Chinese (类脑)

https://discord.com/channels/1134557553011998840/1444276404152827904/1544005126635921428 —
832×1216, k_euler, AI's Choice, 3 boxes.

```
[Base] <style and artist tags…>, manga_page, comic, comic_panel, 3_panels, asymmetric_panel_layout,
white_gutter_between_panels, black_panel_borders.
3格漫画页。页面上方是一格横向长格, 页面右下是一格较大的方格, 页面左下是一格较小的浮动格。
阅读顺序：上方长格→右下大格→左下小格。
第1格, 页面上方横向长格。晴朗午后的旧城区商业街, … 没有人物。
第2格, 页面右下大格。商业街人行道, 两名成年女性并排向前走, 全身。白发女性位于格内右侧, … 橙发女性位于格内左侧, …
第3格, 页面左下小浮动格。橙发女性单人脸部极近特写, … 背景出现集中线和少量闪光。
[Char 1] 第2格右侧，全身。她沿人行道向前走，右手拿着智能手机，… girl, 23岁, … 白色头发, …
[Char 1 UC] …, background characters, fused bodies, orange hair, green eyes, bad anatomy
[Char 2] 第2格左侧，全身。… girl, 25岁, … 绿色眼睛, 橙色头发, 波波头, …
[Char 2 UC] …, white hair, yellow eyes, …
[Char 3] 第3格，单人，脸部极近特写。… (same identity as Char 2)
```

Chinese layout text works as prompt text. Each box's negative names the other
woman's hair and eye colours to stop bleed.

## E5 · Sound effects and coloured bubbles, Chinese lettering (类脑)

https://discord.com/channels/1134557553011998840/1444276404152827904/1555633379536408629 —
832×1216, k_dpmpp_2m_sde, positions on. The poster rated the panelling "so-so".

```
[Base] <style…>, 2girls, manga. Read left to right, then top to bottom. The page is divided into three
panels: a horizontal panel across the top, a narrow action panel in the middle, and a large dynamic
panel across the bottom. comic, manga, manga page, border, colored speech bubble, chinese text, text,
speech bubble, sound_effects best quality, very aesthetic, absurdres, high complexityText: 呼！咚！！手腕都要震麻了！
[Char 1 @ (0.30, 0.22)] In the top panel, cowboy shot: dutch angle, girl, 红色头发, short hair, … 双手紧握木刀刀柄
自上而下全力劈击, … Small sound-effect lettering beside Erin.Text: 呼！
[Char 2 @ (0.50, 0.50)] In the middle narrow panel, extreme close-up: 两柄厚重的深褐色木剑剑刃激烈交叉咬合在一起, …
Small sound-effect lettering beside swords.Text: 咚！！
[Char 3 @ (0.70, 0.80)] In the bottom large panel, upper body: … There's a round pink-bordered speech bubble
with a white fill and black text next to Lip.Text: 手腕都要震麻了！
```

Good box pattern (`In the … panel, <shot>:` first, lettering last). Bad base
habit: `high complexityText:` is glued to the word before it, and the UI's
quality tags were appended after it, inside the lettering. Keep a space or
comma before `Text:`.

## E6 · Tall 3-panel strip with an object panel and SFX (Anlatan)

https://discord.com/channels/836774308772446268/1026431143052050472/1540831314738151605 —
896×2304, positions on, 6 boxes. The author extended an earlier page "by adding
a few more panels using the character prompt boxes and manual positioning".

```
[Base] …, monochrome, greyscale, manga, location, bathroom, three-quarter view, medium complexity, 3 panel comic, mirror
[Char 1 @ (0.70, 0.23)] male, … yawn, walking, front view, full-length portrait, first panel is on the right, full length
[Char 2 @ (0.24, 0.16)] … looking in mirror, … second panel is on the top left and thinner
[Char 4 @ (0.48, 0.58)] object focus, zero pictures, a pair of scissors lying on the counter
[Char 5 @ (0.49, 0.72)] … lower body, feet only, … hair clippings on floor, short panel, full width, sound effects, text says "SNIP SNIP"
[Char 6 @ (0.50, 0.90)] … smile, … third panel is on bottom, full width, half-length portrait, front view, face focus
```

A box can hold an object instead of a person. The quote in box 5 became the
base's `teXt: SNIP SNIP`.

## E7 · Silent 4koma, one box per character across panels (Anlatan)

https://discord.com/channels/836774308772446268/1037852458128507031/1541090957309513758 —
1216×832, AI's Choice, 2 boxes.

```
[Base] year 2025, year 2026, high contrast, high complexity, <artist tags…>,
4koma, vertical four-panel comic strip, equal panel sizes, clear panel borders, thick borders, sequential comic,
1girl, 1boy, indoors, soft lighting, silent comic, no text, no speech bubble,
in the first panel M14 runs up to the faceless commander with both arms stretched out for a hug, …
the second panel shows …, the third panel shows …, the fourth panel shows …, smooth eye flow
[Char 1] girl, m14 (girls frontline), …, first panel M14 running toward the commander, arms outstretched,
hopeful expression, second panel …, third panel …, fourth panel …
[Char 2] boy, faceless, commander, …, first panel …, second panel …, third panel …, fourth panel …
```

Structure C: each box lists the character's state panel by panel.

## E8 · Empty panel that still got a person (Anlatan)

https://discord.com/channels/836774308772446268/1026431143052050472/1540223758671941673 —
1024×1024, positions on, 6 boxes, `comic, 5koma`. One box was
`Closed door. No person, Empty cut`; the author asked how to stop a character
appearing there. Describe what the empty panel shows (door, room, object)
rather than only saying nobody is in it.

## E9 · Placement rules for two Chinese lines (绘画小屋)

https://discord.com/channels/1301609195702976532/1374512998647070791/1542824234102030346 —
832×1216, AI's Choice, 2 boxes.

```
[Base] …, portrait manga page, exactly 4-panel comic page, fully paneled comic page, left-to-right
top-to-bottom reading order, clear black panel borders, clean white gutters, white page margins,
one large dominant panel occupying the left two-thirds of the upper page, one narrow vertical panel at
the upper right, one narrow vertical panel at the middle right, one wide horizontal panel across the
full bottom, no extra panels, no blank panels, no duplicated panels, speech bubbles, exactly two
separate speech bubbles, …, Chinese text,
Panel 1: …, one large speech bubble above Character 1's head entirely inside Panel 1, speech bubble
tail points to Character 1, contains the exact Chinese text"不准跟这么近！", Panel 2: … no speech bubble, …
Panel 4: …, one speech bubble above Character 2's head entirely inside Panel 4, …"小心脚下。",
text placement rule: the first text block belongs only to Panel 1, the second text block belongs only
to Panel 4, do not merge, repeat, move or swap the dialogue, teXt: 不准跟这么近！, 小心脚下。
[Char 1] {{young girl}}, Kanbara Sakura, … appears in Panel 1, Panel 2 and Panel 4, …
angry expression in Panel 1, surprised expression in Panel 2, blushing flustered expression in Panel 4
[Char 2] {{adult man}}, Lin Tian, … appears in Panel 1, Panel 3 and Panel 4, …
[Char 2 UC] pink hair, cherry-pink hair
```

The poster reported both lines landing in one bubble and traced it to their
plugin replacing the line break in `teXt:` with a comma; another front end
that kept the break split them. Put one bubble per line.

## E10 · Three stacked panels, Chinese dialogue, quotes only (类脑)

https://discord.com/channels/1134557553011998840/1521695442897993850/1541113523348709466 —
"分镜赛多角色写的" (a storyboard-contest entry using character boxes). 832×1216,
AI's Choice, Quality Tags on.

```
[Base] masterpiece, best quality, very aesthetic, full color comic page, vertical manga layout,
3 horizontal panels, highly detailed, genshin impact style.
[Char 1] girl, Nahida \(genshin impact\), a wide shot of Nahida walking happily through the lush green
Sumeru rainforest, … A speech bubble displaying Chinese text "今天的天气真好，出来散散步吧。".
[Char 2] girl, Nahida \(genshin impact\), 1hilichurl, Nahida hiding behind a giant tree trunk on the left
side, peeking out cautiously. A single hilichurl sitting peacefully on the grass on the right side.
A speech bubble displaying Chinese text "咦？前面有一个落单的丘丘人。".
[Char 3] girl, Nahida \(genshin impact\), a close-up shot of Nahida's face looking curious and thoughtful, …
A thought bubble displaying Chinese text "不知道它在做什么呢？".
```

Stored base ends with `…, very aesthetic, masterpiece, no text, teXt: 今天的天气真好，出来散散步吧。`
followed by the other two lines, one per line: the UI's collection in action.
Each box is one panel; the shot word (`wide shot`, `close-up`) carries the
panel order, since the boxes do not name panels.
