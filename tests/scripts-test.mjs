import test from 'node:test';
import assert from 'node:assert/strict';

import { checkSpec, declaredPanels, mentionedPanels, quotes, textSection } from '../scripts/check-prompt.mjs';
import { describe, typedSpec } from '../scripts/read-prompt.mjs';

const levels = (result, where) => result.problems.filter((problem) => !where || problem.where === where).map((problem) => problem.level);

function chunk(type, data) {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length);
  return Buffer.concat([length, Buffer.from(type, 'latin1'), data, Buffer.alloc(4)]);
}

function novelAiPng(comment, source = 'NovelAI Diffusion V5 0ADF9AB7') {
  const header = Buffer.alloc(13);
  header.writeUInt32BE(832, 0);
  header.writeUInt32BE(1216, 4);
  const text = (key, value) => chunk('tEXt', Buffer.from(`${key}\0${value}`, 'utf8'));
  return Buffer.concat([Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]), chunk('IHDR', header),
    text('Software', 'NovelAI'), text('Source', source), text('Comment', JSON.stringify(comment)), chunk('IEND', Buffer.alloc(0))]);
}

test('text helpers find Text: sections, quoted lines and panel counts', () => {
  assert.equal(textSection('girl, speech bubble says "Hi". Text: Hi'), 'Hi');
  assert.equal(textSection('girl, no lettering'), null);
  assert.deepEqual(quotes('bubble says "Hi!" then “ざわ…” and 「はい」'), ['Hi!', 'ざわ…', 'はい']);
  assert.equal(declaredPanels('manga page, 5 panel comic layout'), 5);
  assert.equal(declaredPanels('comic, 4koma'), 4);
  assert.equal(declaredPanels('3格漫画页'), 3);
  assert.equal(mentionedPanels('Panel 1: ... Panel 4 (bottom right): ...'), 4);
  assert.equal(mentionedPanels('第2格, 页面左侧'), 2);
});

test('a well-formed comic spec passes without errors', () => {
  const result = checkSpec({
    model: 'V5 Full',
    size: [832, 1216],
    base: 'manga, 3 panel comic. Panel 1 (top, wide): a street. Panel 2: two girls. Panel 3: close-up.',
    characters: [
      { prompt: 'girl, red hair. In panel 2, speech bubble above her head says "Look!". Text: Look!', position: [0.3, 0.5] },
      { prompt: 'girl, blue hair, panel 3 close-up, surprised', position: [0.5, 0.85] },
    ],
    negative: 'lowres, worst quality',
    settings: { aiChoosesPositions: false },
  });
  assert.deepEqual(levels(result).filter((level) => level !== 'info'), []);
  assert.equal(result.panels, 3);
  assert.equal(result.renderedText, 5);
});

test('tags after Text:, missing repeats, limits and blocked lettering are reported', () => {
  const tagsAfterText = checkSpec({ base: '1girl, speech bubble says "Hi". Text: Hi, masterpiece, very aesthetic', characters: [], negative: '' });
  assert.ok(levels(tagsAfterText, 'base').includes('error'));

  const glued = checkSpec({ base: 'comic, speech bubble, high complexityText: Hi', characters: [], negative: '' });
  assert.ok(glued.problems.some((problem) => problem.level === 'error' && /before "Text:"/.test(problem.message)));
  const separated = checkSpec({ base: 'comic, speech bubble, high complexity,Text: Hi', characters: [], negative: '' });
  assert.ok(!separated.problems.some((problem) => /before "Text:"/.test(problem.message)));

  const notRepeated =checkSpec({ base: 'comic', characters: [{ prompt: 'girl, bubble says "Hello". Text: Bye' }], negative: '' });
  assert.ok(levels(notRepeated, 'character 1').includes('warn'));

  const tooLong = checkSpec({ model: 'V5 Curated', base: `girl, speech bubble. Text: ${'a'.repeat(400)}`, characters: [], negative: '' });
  assert.ok(levels(tooLong, 'text').includes('error'));
  assert.equal(tooLong.textLimit, 374);

  const blocked = checkSpec({ base: 'girl, speech bubble says "Hi"', characters: [], negative: 'lowres, text, watermark' });
  assert.ok(levels(blocked, 'negative').includes('warn'));
  assert.ok(levels(blocked, 'text').includes('info'), 'quotes without Text: are collected by the UI');
});

test('panel mismatches, positions and box counts are checked', () => {
  const mismatch = checkSpec({ base: '4koma. Panel 1: a. Panel 5: b.', characters: [], negative: '' });
  assert.ok(levels(mismatch, 'panels').includes('warn'));

  const badPosition = checkSpec({ base: '2 panel comic', characters: [{ prompt: 'girl in panel 1', position: [1.2, 0.5] }, { prompt: 'boy in panel 2' }], negative: '', settings: { aiChoosesPositions: false } });
  assert.ok(levels(badPosition, 'character 1').includes('error'));
  assert.ok(levels(badPosition, 'character 2').includes('warn'));

  const crowded = checkSpec({ base: 'comic', characters: Array.from({ length: 23 }, () => ({ prompt: 'girl' })), negative: '' });
  assert.ok(levels(crowded, 'characters').includes('error'));
});

test('read-prompt reads V5 boxes and strips what the UI added', () => {
  const comment = {
    width: 832, height: 1216, steps: 28, scale: 5, cfg_rescale: 0, sampler: 'k_euler_ancestral', noise_schedule: 'karras', seed: 1, tag_hint_qt: 1,
    v4_prompt: {
      caption: { base_caption: '3 panel comic, speech bubbles, very aesthetic, masterpiece, no text, teXt: Hi\n\nBye', char_captions: [{ char_caption: 'girl, panel 1, bubble says "Hi"', centers: [{ x: 0.3, y: 0.2 }] }] },
      use_coords: true,
    },
    v4_negative_prompt: { caption: { base_caption: 'lowres', char_captions: [{ char_caption: 'hat', centers: [] }] } },
  };
  const record = describe('page.png', novelAiPng(comment));
  assert.equal(record.model, 'NovelAI Diffusion V5 0ADF9AB7');
  assert.deepEqual(record.characters, [{ prompt: 'girl, panel 1, bubble says "Hi"', negative: 'hat', position: [0.3, 0.2] }]);
  assert.equal(record.settings.aiChoosesPositions, false);

  const spec = typedSpec(record);
  assert.equal(spec.base, '3 panel comic, speech bubbles');
  assert.equal(spec.settings.qualityTags, true);
  assert.equal(spec.settings.quotesCollectedByUi, true);
  assert.equal(describe('x.png', Buffer.from('not a png')).error, 'not a PNG');
});

test('the Text: marker ignores words that end in "text:"', () => {
  assert.equal(textSection('girl, context: school, subtext: none'), null);
  assert.equal(textSection('girl, high complexityText: Hi'), 'Hi');
  assert.equal(textSection('girl.\ntext: Hi'), 'Hi');
});

test('bubble lines joined by commas after Text: are reported', () => {
  const joined = checkSpec({ base: 'comic, bubble says "Stop!" and later "Careful." teXt: Stop!, Careful.', characters: [], negative: '' });
  assert.ok(joined.problems.some((problem) => /own line/.test(problem.message)));
  const split = checkSpec({ base: 'comic, bubble says "Stop!" and later "Careful." Text: Stop!\n\nCareful.', characters: [], negative: '' });
  assert.ok(!split.problems.some((problem) => /own line/.test(problem.message)));
});
