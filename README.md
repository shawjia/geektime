# geektime

> API client for time.geekbang.org

## INSTALL
```bash
npm install geektime
# or
yarn add geektime
```

## EXAMPLE
```js
const Geektime = require('geektime');
const client = new Geektime('phone', 'pass');

(async () => {

  try {
    const products = await client.products();
    console.log(products);
  } catch (error) {
    console.error(error);
  }

})();
```

## API

### products()

产品列表，返回 专栏/视频课/微课/其他

### intro(cid)

返回专栏信息

###  articles(cid, size = 1000)

返回专栏文章列表

### article(id)

返回单篇文章详情

### audios(cid, size = 1000)

返回音频列表

### NOTE
- *cid:* 专栏 id 
- *id:* 文章 id

## License

MIT © [shawjia](https://github.com/shawjia)
