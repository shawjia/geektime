const test = require('ava');
const Geektime = require('.');

const { GEEKTIME_PHONE, GEEKTIME_PASS } = process.env;
const client = new Geektime(GEEKTIME_PHONE, GEEKTIME_PASS);

const cid = 48; // 左耳听风
const articleId = 14271; // "article_title": "高效学习：端正学习态度",

test('Geektime()', (t) => {
  t.throws(() => new Geektime(), TypeError);
});

test('Geektime() init', (t) => {
  const CODE = 86;
  const phone0 = '176';
  const pass0 = 'pass0';
  const c0 = new Geektime(phone0, pass0);

  t.deepEqual(c0.country, CODE);
  t.deepEqual(c0.cellphone, phone0);
  t.deepEqual(c0.password, pass0);

  const code1 = 1;
  const phone1 = '135';
  const pass1 = 'pass1';
  const c1 = new Geektime(code1, phone1, pass1);

  t.deepEqual(c1.country, code1);
  t.deepEqual(c1.cellphone, phone1);
  t.deepEqual(c1.password, pass1);
});

test('client.products()', async (t) => {
  const res = await client.products();

  t.true(res.length > 0);
});

test('client.intro(48)', async (t) => {
  const res = await client.intro(cid);

  t.is(res.column_title, '左耳听风');
});

test('client.articles(48)', async (t) => {
  const res = await client.articles(cid);

  t.true(res.list.length > 0);
});

test('client.article(14271)', async (t) => {
  const res = await client.article(articleId);

  t.true(res.article_title.startsWith('95 | 高效学习'));
});

test('client.comments(14271)', async (t) => {
  const res = await client.comments(articleId, 1);

  t.true(res.list.length > 0);
});

test('client.audios(48)', async (t) => {
  const res = await client.audios(cid);

  t.true(res.list.length > 0);
});
