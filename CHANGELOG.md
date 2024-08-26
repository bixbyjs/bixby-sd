# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
### Fixed
- Remove unused `@require` of `'http://i.bixbyjs.org/services'` from `resolver`.

## [0.0.2] - 2024-08-26
### Changed
- `EnvironResolver` now works solely off of environment variables, no longer
depends on a component implementing the `http://i.bixbyjs.org/ns/ServicesList`
interface or associated `@service` and `@env` annotations.

### Removed
- `HostsResolver`, which utilized components that implement the defunct `http://i.bixbyjs.org/IService`
interface.  The corresponding registry which implements `http://i.bixbyjs.org/services`
is slated to be removed from `bixby-common` after version 0.2.1.

## [0.0.1] - 2024-05-02

- Initial release.

[Unreleased]: https://github.com/bixbyjs/bixby-sd/compare/v0.0.2...HEAD
[0.0.2]: https://github.com/bixbyjs/bixby-sd/compare/v0.0.1...v0.0.2
[0.0.1]: https://github.com/bixbyjs/bixby-sd/releases/tag/v0.0.1
