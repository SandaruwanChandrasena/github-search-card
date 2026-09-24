# GitHub Search Card

A simple web page that shows a dashboard for any GitHub user. Type a username, click search, and see their profile, top repos, recent projects, and most-used languages.

## Live Demo
**https://sandaruwanchandrasena.github.io/github-search-card/**

## Features

- **Profile card** — photo, name, bio, and follower count.
- **Best Work** — top 5 original repos, sorted by stars.
- **Recent Projects** — top 5 repos, sorted by most recently updated.
- **Languages** — percentage breakdown of languages used across repos.
- **Error handling** — shows a friendly message if the user isn't found or the API rate limit is hit.

## Built With

- HTML, CSS, JavaScript (no frameworks)
- [GitHub REST API](https://docs.github.com/en/rest)

## How It Works

1. You type a GitHub username and click **Search**.
2. The app calls two GitHub API endpoints at the same time using `Promise.all`:
   - `/users/{username}` for profile data
   - `/users/{username}/repos` for their repositories
3. The repo list is cleaned up in the browser:
   - Forked repos are removed with `filter()`.
   - Repos are sorted by stars or by last update with `sort()`.
   - Language counts are tallied with `reduce()` and turned into percentages.
4. If GitHub returns a rate limit error (403), the app reads the reset time from the response headers and shows the user when to try again.

## Running Locally

1. Clone or download this folder.
2. Open `index.html` in your browser. No build step or server needed.

## Notes

- GitHub allows 60 unauthenticated API requests per hour. If you hit that limit, wait for the time shown on screen.
- The language breakdown is based on each repo's primary language, not exact lines of code.

## What I Learned

This project was built step by step to practice:

- Fetching data from a real API with `fetch()` and `async/await`
- Running requests in parallel with `Promise.all`
- Cleaning and transforming data with `filter`, `sort`, and `reduce`
- Handling errors and API rate limits gracefully
