# Changelog

All notable changes to this project will be documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

How to create a new tag with [Semantic Versioning](https://semver.org/spec/v2.0.0.html):

1. MAJOR version when you make incompatible API changes,
2. MINOR version when you add functionality in a backwards compatible manner, and
3. PATCH version when you make backwards compatible bug fixes.

Accepted categories:

- Added
- Changed
- Deprecated
- Removed
- Fixed
- Security

How to write a new entry:

- Jira Code[Here] Jira url(Here), then the description starting with Added, Changed, Deprecated, Removed, Fixed, Security, etc., and then the small description of the change.

How to use unreleased title:

- Unreleased: on this section you write the new entry. When the tag is created you must replace the unreleased title with the new tag and published date.

## [Unreleased]
### Added
- [TEST-12](https://skyagile.atlassian.net/browse/TEST-12) :white_check_mark: test(components): add App async JokesPage loading spec and created some unit test on molecules components
- [TEST-11](https://skyagile.atlassian.net/browse/TEST-11) :white_check_mark: test(components): add comprehensive unit tests for atomic atoms components
- [TEST-10](https://skyagile.atlassian.net/browse/TEST-10) :sparkles: feat(cache, types, Skeleton, Btn): implement localStorage caching system, Btn disabled upgraded and Skeleton component
- [TEST-9](https://skyagile.atlassian.net/browse/TEST-9) :sparkles: feat(input, add joke logic): add AppTextField component with v-model support, New Form Mode component, new add Joke logic feature, new footer component
- [TEST-8](https://skyagile.atlassian.net/browse/TEST-8) :sparkles: feat(rating, remove jokes): enhance AppRating component with selectable functionality and Remove Joke feature
- [TEST-7](https://skyagile.atlassian.net/browse/TEST-7) :sparkles: feat(store): add sorting logic, split JokeTypeSelect to AppDropdown
- [TEST-6](https://skyagile.atlassian.net/browse/TEST-6) :sparkles: feat(pagination): add AppPagination component and enhance jokes filtering
- [TEST-5](https://skyagile.atlassian.net/browse/TEST-5) feat(components): add JokeCard, AppRating and  AppJokeList components
- [TEST-4](https://skyagile.atlassian.net/browse/TEST-4) feat(components): enhance AppButton with color variants, new JokeTypeSelect and AppToolBar components
- [TEST-3](https://skyagile.atlassian.net/browse/TEST-3) feat(jokes): add jokes module, API service integration, pinia jokesType and card/header components
- [TEST-2](https://skyagile.atlassian.net/browse/TEST-2) feat(jokes): add jokes module, API service integration, pinia jokesType and card/header components
- [TEST-1](https://skyagile.atlassian.net/browse/TEST-1) chore(init): initialize project structure with Vue 3 + Vite + TypeScript
