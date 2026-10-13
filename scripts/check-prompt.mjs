#!/usr/bin/env node
// Lints a NovelAI V5 comic prompt spec and prints it as paste-ready blocks.
// The spec format matches read-prompt.mjs --spec, so a real image's prompt can
// be checked, edited and re-checked.
import fs from 'node:fs';
import { parseArgs } from 'node:util';

const USAGE = `Usage: node scripts/check-prompt.mjs <spec.json> [--json]

Spec: { "model": "V5 Full" | "V5 Curated", "size": [832, 1216],
        "base": "...", "characters": [{ "prompt": "...", "negative": "...", "position": [x, y] | null }],
        "negative": "...", "settings": { "aiChoosesPositions": false, ... } }
Prints problems (error / warn / info), then the prompt as blocks to paste into
NovelAI. Exit code 1 when there are errors.`;

// Official limits (docs.novelai.net/en/image/textrendering): characters of text
// the model renders, per generation.
const TEXT_LIMITS = { curated: 374, full: 750 };
const MAX_CHARACTERS = 22;
const QUOTE = /["“”「」『』]([^"“”「」『』]+)["“”「」『』]/g;
// "text:" in any case after a non-letter, or "Text:" glued to a word
// (a mistake check-prompt reports), but not words such as "context:".
const TEXT_MARKER = /(?<![\p{L}\p{N}])[Tt][Ee][Xx][Tt]:|Text:/u;

export function textStart(field) {
  return field.search(TEXT_MARKER);
}

export function textSection(field) {
  const index = textStart(field);
  return index === -1 ? null : field.slice(index).replace(/^text:\s*/i, '');
}

export function quotes(field) {
  return [...field.matchAll(QUOTE)].map((match) => match[1].trim()).filter(Boolean);
}

export function declaredPanels(base) {
  const match = /(\d+)\s*-?\s*(?:panels?\b|paneled|koma\b|コマ|格)/i.exec(base) ?? /\b(\d)koma\b/i.exec(base);
  return match ? Number(match[1]) : null;
}

export function mentionedPanels(text) {
  const numbers = [...text.matchAll(/\b(?:panel|koma)\s*(\d+)|第\s*(\d+)\s*[格コ]/gi)].map((match) => Number(match[1] ?? match[2]));
  return numbers.length ? Math.max(...numbers) : null;
}

export function checkSpec(spec) {
  const problems = [];
  const add = (level, where, message) => problems.push({ level, where, message });
  const characters = spec.characters ?? [];
  const base = spec.base ?? '';
  const negative = spec.negative ?? '';
  const fields = [['base', base], ...characters.map((character, index) => [`character ${index + 1}`, character.prompt ?? ''])];
  const curated = /curated/i.test(spec.model ?? '');
  const limit = curated ? TEXT_LIMITS.curated : TEXT_LIMITS.full;

  if (!base.trim()) add('error', 'base', 'The base prompt is empty.');
  if (characters.length > MAX_CHARACTERS) add('error', 'characters', `${characters.length} character boxes; V5 allows ${MAX_CHARACTERS}.`);

  const manualText = fields.filter(([, field]) => textSection(field) != null);
  const allSections = manualText.map(([, field]) => textSection(field)).join('\n');
  let renderedText = 0;
  for (const [where, field] of fields) {
    const section = textSection(field);
    const quoted = quotes(section == null ? field : field.slice(0, textStart(field)));
    if (section != null) {
      renderedText += section.replace(/\s+/g, '').length;
      if (/[\p{L}\p{N}]Text:/u.test(field)) add('error', where, 'Put a space, comma or line break before "Text:". Glued to a word, the UI appended its quality tags after it, so they were drawn as lettering.');
      if (/\b(panel|speech bubble|1girl|1boy|masterpiece|very aesthetic)\b|::/i.test(section) || (section.match(/,/g) ?? []).length >= 4) {
        add('error', where, 'Text after "Text:" looks like prompt tags. Everything after Text: is drawn as lettering, so Text: must come last.');
      }
      const linesInSection = quoted.filter((line) => section.includes(line));
      if (linesInSection.length > 1 && section.trim().split(/\n+/).length < linesInSection.length) {
        add('warn', where, 'Put each bubble\'s line on its own line after Text:. Lines joined by commas were merged into one bubble.');
      }
      for (const line of quoted) {
        // A quote missing from every Text: block is usually dialogue that will not render.
        if (!allSections.includes(line)) add('warn', where, `Quoted line "${line}" is not repeated after Text:. Repeat each line after Text:, or drop Text: everywhere and let NovelAI collect the quotes.`);
      }
    } else if (quoted.length && !manualText.length) {
      renderedText += quoted.join('').replace(/\s+/g, '').length;
    }
  }
  if (!manualText.length && fields.some(([, field]) => quotes(field).length)) {
    add('info', 'text', 'No Text: section: NovelAI copies every quoted line, in box order, into one "teXt:" block at the end of the base prompt.');
  }
  if (renderedText > limit) add('error', 'text', `About ${renderedText} characters of lettering; ${curated ? 'Curated' : 'Full'} renders at most ${limit}.`);
  else if (renderedText > limit * 0.8) add('warn', 'text', `About ${renderedText} of ${limit} lettering characters used; long text needs more retries.`);
  const hasDialogue = renderedText > 0;
  if (hasDialogue && /(^|,)\s*no text\s*(,|$)/i.test(base)) add('warn', 'base', 'The base prompt says "no text" while the page has lettering. The Quality Tags toggle already adds it; do not add it yourself.');
  if (hasDialogue && /(^|,)\s*(text|speech bubbles?|english text|japanese text|chinese text)\s*(,|$)/im.test(negative)) add('warn', 'negative', 'Undesired Content blocks text or bubbles that the page needs.');
  if (/[一-鿿]/.test(manualText.map(([, field]) => textSection(field)).join('') + fields.map(([, field]) => quotes(field).join('')).join('')) && !/[぀-ヿ]/.test(base + characters.map((c) => c.prompt).join(''))) {
    add('info', 'text', 'Chinese lettering is supported but less reliable than English or Japanese; expect retries or keep lines short.');
  }

  const declared = declaredPanels(base);
  const mentioned = mentionedPanels([base, ...characters.map((character) => character.prompt ?? '')].join('\n'));
  if (declared && mentioned && mentioned !== declared) add('warn', 'panels', `The base declares ${declared} panels but the prompt describes panel ${mentioned}.`);
  const panels = declared ?? mentioned;
  if (panels && panels > 1) {
    characters.forEach((character, index) => {
      if (!/panel|koma|格|コマ|page|all panels/i.test(character.prompt ?? '')) add('info', `character ${index + 1}`, 'Say which panel this box belongs to (for example "In the top left panel, close-up: ..."), or the character may appear in every panel.');
    });
  }

  const manual = spec.settings?.aiChoosesPositions === false;
  characters.forEach((character, index) => {
    const position = character.position;
    if (position && (position.length !== 2 || position.some((n) => typeof n !== 'number' || n < 0 || n > 1))) add('error', `character ${index + 1}`, 'position must be [x, y] between 0 and 1 (0,0 is the top left).');
    if (manual && !position) add('warn', `character ${index + 1}`, 'Manual positioning is on but this box has no position.');
  });
  if (characters.length > 1 && !manual && panels > 1) add('info', 'positions', "With AI's Choice the boxes are placed by the model; for multi-panel pages, placing each box inside its panel is the more reliable setup.");

  const [width, height] = spec.size ?? [];
  if (width && height) {
    if (width % 64 || height % 64) add('warn', 'size', 'Width and height should be multiples of 64.');
    if (panels >= 5 && width * height > 1.6e6) add('warn', 'size', 'Many panels at a large size tends to add extra panels or scramble the order; try a smaller canvas first.');
    if (panels >= 4 && /vertical|strip|縦/i.test(base) && height < width * 1.4) add('info', 'size', 'A vertical strip reads better on a tall canvas such as 832x1216 or 896x2304.');
  }
  return { problems, renderedText, textLimit: limit, panels: panels ?? null };
}

function blocks(spec) {
  const lines = [`[Base Prompt]\n${spec.base}`];
  (spec.characters ?? []).forEach((character, index) => {
    const at = character.position ? `  (position x=${character.position[0]}, y=${character.position[1]})` : '';
    lines.push(`[Character ${index + 1}]${at}\n${character.prompt}`);
    if (character.negative) lines.push(`[Character ${index + 1} Undesired]\n${character.negative}`);
  });
  lines.push(`[Undesired Content]\n${spec.negative ?? ''}`);
  return lines.join('\n\n');
}

if (process.argv[1]?.endsWith('check-prompt.mjs')) {
  const { values, positionals } = parseArgs({ options: { json: { type: 'boolean', default: false }, help: { type: 'boolean', short: 'h', default: false } }, allowPositionals: true });
  if (values.help || positionals.length !== 1) {
    console.log(USAGE);
    process.exit(values.help ? 0 : 2);
  }
  const spec =JSON.parse(fs.readFileSync(positionals[0], 'utf8'));
  const result = checkSpec(spec);
  if (values.json) {
    console.log(JSON.stringify(result, null, 2));
  } else {
    for (const problem of result.problems) console.log(`${problem.level.toUpperCase().padEnd(5)} ${problem.where}: ${problem.message}`);
    console.log(`\npanels: ${result.panels ?? '?'} | lettering: ~${result.renderedText}/${result.textLimit} chars | ${spec.size?.join('x') ?? 'size ?'}\n`);
    console.log(blocks(spec));
  }
  process.exitCode = result.problems.some((problem) => problem.level === 'error') ? 1 : 0;
}
