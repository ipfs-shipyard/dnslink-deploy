# dnslink-deploy
Automatically set DNS records on Digital Ocean

## Install

Set your DigitalOcean api key in your `.bash_profile` or your secure key file:

`export DIGITAL_OCEAN='dsjflajflasjdflsjlflsjldfs'`

Then:

```sh
npm i -g ndslink-deploy
```

## Usage

* `node bin/index.js -t` Test this repo with your authentication key
* `node bin/index.js -h sdfjlsajlfjsljf` Set a hash as the data for a TXT record