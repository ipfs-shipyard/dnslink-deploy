# dnslink-deploy

[![](https://img.shields.io/badge/made%20by-Protocol%20Labs-blue.svg?style=flat-square)](http://ipn.io)
[![](https://img.shields.io/badge/project-IPFS-blue.svg?style=flat-square)](http://ipfs.io/)
[![](https://img.shields.io/badge/freejs-%23ipfs-blue.svg?style=flat-square)](http://webchat.freenode.net/?channels=%23ipfs)

![](https://cdn.rawgit.com/jbenet/contribute-ipfs-gif/master/img/contribute.gif)

> Automatically set DNS records on Digital Ocean

## Install

Set your DigitalOcean api key in your `.bash_profile` or your secure key file:

`export DIGITAL_OCEAN='dsjflajflasjdflsjlflsjldfs'`

Then:

```sh
npm i -g dnslink-deploy
```

## Contribute

Help out! Dive in and [create an issue](/issues/new).

## Usage

* `dnslink-deploy -t` Test this repo with your authentication key
* `dnslink-deploy -d ipfs.io -r test -p /ipfs/QmeQT76CZLBhSxsLfSMyQjKn74UZski4iQSq9bW7YZy6x8` Set the path as the data for a TXT record.
    * `-d, --domain`: The domain to set.
    * `-r, --record`: The domain record name.
    * `-p, --path`: The path you want to set as the data.