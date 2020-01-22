# Braids 

> A node module and cli to get data about a site's performance and network requests

## Installation
```sh
npm install braids
```

## Data

Each call to `run` will return the following data:

```typescript
interface SiteData {
  url: string;
  title: string; // document.title
  performance: {
    entries: PerformanceEntryList; // array of performance entries.  return value of window.performance.getEntries()
    timing: PerformanceResourceTiming; // performance timing object.  return value of window.perormance.timing
  };
  coverage: {
    [url: string]: { // each resource loaded by the page will be included
      usedBytes: number;
      totalBytes: number;
    };
  };
  requests: {
    url: string;
    method: HttpMethod; // https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/puppeteer/v1/index.d.ts#L928
    headers: Headers; // https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/puppeteer/v1/index.d.ts#L927
    resourceType: ResourceType; // https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/puppeteer/v1/index.d.ts#L936
    response?: {
      status: number;
      headers: Headers; // https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/puppeteer/v1/index.d.ts#L92
    };
  }[]

}
```


## Module Usage example

```javascript
import { startBrowser, run, stopBrowser } from 'braids';

async function getMySiteData() {
  await startBrowser();

  const mySiteData = await run('http://www.mysite.com');
  const mySiteData2 = await run('http://www.mysite2.com');

  stopBrowser();
}
```

## CLI Usage Example
```bash
braids run http://www.mysite.com > mysite.json
```

## Development setup

```sh
npm install
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