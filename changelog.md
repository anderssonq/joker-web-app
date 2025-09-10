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
- [TASK-17](https://dummycompany.atlassian.net/browse/TASK-17) :memo:test(README.md, changelog.md): adding readme.md
- [TASK-16](https://dummycompany.atlassian.net/browse/TASK-16) :white_check_mark: test(e2e, trash code): adding e2e basic tests and removing trash code
- [TASK-15](https://dummycompany.atlassian.net/browse/TASK-15) :recycle: refactor(typing): improve code and typing stuff
- [TASK-14](https://dummycompany.atlassian.net/browse/TASK-14) :sparkles: refactor(pagination, store, style): migrate pagination logic to usePagination, add sortedAndFilteredJokes computed, comparators map, by-user handling, reactive total pages and some styling improved at Buttons.
- [TASK-13](https://dummycompany.atlassian.net/browse/TASK-13) :sparkles: feat(jokes): add edit joke feature and update tests
- [TASK-12](https://dummycompany.atlassian.net/browse/TASK-12) :white_check_mark: test(components): add App async JokesPage loading spec and created some unit test on molecules components
- [TASK-11](https://dummycompany.atlassian.net/browse/TASK-11) :white_check_mark: test(components): add comprehensive unit tests for atomic atoms components
- [TASK-10](https://dummycompany.atlassian.net/browse/TASK-10) :sparkles: feat(cache, types, Skeleton, Btn): implement localStorage caching system, Btn disabled upgraded and Skeleton component
- [TASK-9](https://dummycompany.atlassian.net/browse/TASK-9) :sparkles: feat(input, add joke logic): add AppTextField component with v-model support, New Form Mode component, new add Joke logic feature, new footer component
- [TASK-8](https://dummycompany.atlassian.net/browse/TASK-8) :sparkles: feat(rating, remove jokes): enhance AppRating component with selectable functionality and Remove Joke feature
- [TASK-7](https://dummycompany.atlassian.net/browse/TASK-7) :sparkles: feat(store): add sorting logic, split JokeTypeSelect to AppDropdown
- [TASK-6](https://dummycompany.atlassian.net/browse/TASK-6) :sparkles: feat(pagination): add AppPagination component and enhance jokes filtering
- [TASK-5](https://dummycompany.atlassian.net/browse/TASK-5) feat(components): add JokeCard, AppRating and  AppJokeList components
- [TASK-4](https://dummycompany.atlassian.net/browse/TASK-4) feat(components): enhance AppButton with color variants, new JokeTypeSelect and AppToolBar components
- [TASK-3](https://dummycompany.atlassian.net/browse/TASK-3) feat(jokes): add jokes module, API service integration, pinia jokesType and card/header components
- [TASK-2](https://dummycompany.atlassian.net/browse/TASK-2) feat(jokes): add jokes module, API service integration, pinia jokesType and card/header components
- [TASK-1](https://dummycompany.atlassian.net/browse/TASK-1) chore(init): initialize project structure with Vue 3 + Vite + TypeScript
