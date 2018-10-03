const test = require('ava');
const Api = require('.');

const { GEEKTIME_PHONE, GEEKTIME_PASS } = process.env;
const client = new Api(GEEKTIME_PHONE, GEEKTIME_PASS);

const cid = 48; // 左耳听风
const articleId = 14271; // "article_title": "高效学习：端正学习态度",

test('Api()', (t) => {
  t.throws(() => new Api(), TypeError);
});

test('api.products()', async (t) => {
  const res = await client.products();

  t.true(res.length > 0);
});

test('api.intro(48)', async (t) => {
  const res = await client.intro(cid);

  t.is(res.column_title, '左耳听风');
});

test('api.articles(48)', async (t) => {
  const res = await client.articles(cid);

  t.true(res.list.length > 0);
});

test('api.article(14271)', async (t) => {
  const res = await client.article(articleId);

  t.true(res.article_title.startsWith('95 | 高效学习'));
});

test('api.audios(48)', async (t) => {
  const res = await client.audios(cid);

  t.true(res.list.length > 0);
});
