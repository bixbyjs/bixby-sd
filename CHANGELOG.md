# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
### Changed
- `LocalhostResolver` now works solely off of configuration, no longer
depends on a component implementing the `http://i.bixbyjs.org/ns/ServicesList`
interface or associated `@service` and `@port` annotations.

### Removed
- `services` component which implemented `http://i.bixbyjs.org/ns/ServicesList`.
Equivalent functionality has moved to `bixby-ns`, but uses configuration files
rather than `@service` and `@port` annotations.

## [0.0.5] - 2024-08-26
### Changed
- `Switch` always resolves within `localhost` domain.  A future version will
introduce support for search domains.

## [0.0.4] - 2024-08-26
### Added
- `EnvironResolver` supports "generic" environment variables (such as `DATABASE_URL`)
when resolving URIs.

## [0.0.3] - 2024-08-26
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

[Unreleased]: https://github.com/bixbyjs/bixby-sd/compare/v0.0.4...HEAD
[0.0.4]: https://github.com/bixbyjs/bixby-sd/compare/v0.0.3...v0.0.4
[0.0.3]: https://github.com/bixbyjs/bixby-sd/compare/v0.0.2...v0.0.3
[0.0.2]: https://github.com/bixbyjs/bixby-sd/compare/v0.0.1...v0.0.2
[0.0.1]: https://github.com/bixbyjs/bixby-sd/releases/tag/v0.0.1
