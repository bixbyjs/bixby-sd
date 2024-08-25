# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
### Removed
- `HostsResolver`, which utilized components that implement the defunct `http://i.bixbyjs.org/IService`
interface.  The corresponding registry which implements `http://i.bixbyjs.org/services`
is slated to be removed from `bixby-common`.

## [0.0.1] - 2024-05-02

- Initial release.

[0.0.1]: https://github.com/bixbyjs/bixby-sd/releases/tag/v0.0.1
