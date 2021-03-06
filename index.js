const got = require('got');

const host = 'https://time.geekbang.org/serv/v1';
const links = {
  login: 'https://account.geekbang.org/account/ticket/login',
  products: `${host}/my/products/all`,
  productList: `${host}/my/products/list`,
  intro: `${host}/column/intro`,
  articles: `${host}/column/articles`,
  article: `${host}/article`,
  comments: `${host}/comments`,
  audios: `${host}/column/audios`,
};
const CN_CODE = '86';

async function request(link, body = {}, cookie = '') {
  const headers = {
    Referer: 'https://servicewechat.com/wxc4f8a61ef62e6e35/20/page-frame.html',
    Cookie: cookie,
  };

  try {
    const isLoginLink = link === links.login;
    const res = await got(link, {
      json: true, headers, body, method: 'post',
    });
    const loginCookie = isLoginLink
      ? res.headers['set-cookie'].map(v => v.split(';')[0]).join('; ')
      : '';

    if (res.body.code === 0) {
      return isLoginLink
        ? { ...res.body.data, cookie: loginCookie }
        : res.body.data;
    }

    throw new Error(`Wrong Code: ${res.body.code}`);
  } catch (err) {
    throw err;
  }
}

class Geektime {
  constructor(country, cellphone, password) {
    let countryCode = country;
    let phone = cellphone;
    let pass = password;

    if (password === undefined) {
      [countryCode, phone, pass] = [CN_CODE, country, cellphone];
    }

    if (typeof phone !== 'string' || typeof pass !== 'string') {
      throw new TypeError('cellphone/password should be string');
    }

    if (phone === '' || pass === '') {
      throw new Error('cellphone/password should not be empty');
    }

    this.country = +countryCode;
    this.cellphone = phone;
    this.password = pass;
    this.cookie = null;
  }

  // 产品列表，返回 专栏/视频课/微课/其他
  async products() {
    const cookie = await this.getCookie();

    const res = await request(links.products, null, cookie);

    // only return 10, we need more!
    const parts = res.filter(v => v.page.more);
    const fulls = await Promise.all(
      parts.map(v => request(
        links.productList, { nav_id: v.id, prev: 0, size: 1000 }, cookie,
      )),
    );
    fulls.forEach((v, index) => {
      res.find(m => parts[index].id === m.id).list = v.list;
    });

    return res;
  }

  // 专栏介绍
  async intro(cid) {
    const cookie = await this.getCookie();

    return request(links.intro, { cid }, cookie);
  }

  // 专栏文章列表
  async articles(cid, size = 1000) {
    const cookie = await this.getCookie();

    return request(links.articles, { cid, size }, cookie);
  }

  // 单篇文章详情
  async article(id) {
    const cookie = await this.getCookie();

    return request(links.article, { id }, cookie);
  }

  // 文章评论
  async comments(aid, size = 200, prev = 0) {
    const cookie = await this.getCookie();

    return request(links.comments, { aid, size, prev }, cookie);
  }

  // 音频列表
  async audios(cid, size = 1000) {
    const cookie = await this.getCookie();

    return request(links.audios, { cid, size }, cookie);
  }

  async getCookie() {
    if (this.cookie) {
      return this.cookie;
    }

    const { cellphone, password, country } = this;
    const body = {
      cellphone,
      password,
      country,
      remember: 1,
      captcha: '',
      platform: 4,
      appid: 1,
    };

    const { cookie } = await request(links.login, body);
    this.cookie = cookie;

    return this.cookie;
  }
}

module.exports = Geektime;
