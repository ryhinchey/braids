# Braids 

> A tool to get data about a site's performance and network requests

## Installation
```sh
npm install braids
```


## Usage example

```javascript
import { startBrowser, run, stopBrowser } from 'braids';

async function getMySiteData() {
  await startBrowser();

  const mySiteData = await run('http://www.mysite.com');
  const mySiteData2 = await run('http://www.mysite2.com');

  stopBrowser();
}
```

## Development setup

```sh
npm install
npm test
npm build
```


## Meta

Ryan Hinchey – [@ryhinchey](https://twitter.com/ryhinchey) 

Distributed under the MIT license. See ``LICENSE.txt`` for more information.

[https://github.com/ryhinchey/braids](https://github.com/ryinchey/braids)


## Contributing

1. Fork it (<https://github.com/rhinchey/braids/fork>)
2. Create your feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -am 'Add a new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Create a new Pull Request