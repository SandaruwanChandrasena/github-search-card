const searchBtn = document.getElementById('searchBtn');
const usernameInput = document.getElementById('usernameInput');
const resultDiv = document.getElementById('result');

searchBtn.addEventListener('click', () => {
  const username = usernameInput.value.trim();

  if (username === '') {
    resultDiv.innerHTML = '<p class="error">Please type a username.</p>';
    return;
  }

  fetchUser(username);
});

async function fetchUser(username) {
  resultDiv.innerHTML = '<p>Loading...</p>';

  try {
    const [userResponse, reposResponse] = await Promise.all([
      fetch(`https://api.github.com/users/${username}`),
      fetch(`https://api.github.com/users/${username}/repos?per_page=100`)
    ]);

    if (userResponse.status === 404) {
      resultDiv.innerHTML = '<p class="error">User not found.</p>';
      return;
    }

    if (userResponse.status === 403 || reposResponse.status === 403) {
      showRateLimitError(userResponse.status === 403 ? userResponse : reposResponse);
      return;
    }

    if (!userResponse.ok || !reposResponse.ok) {
      resultDiv.innerHTML = '<p class="error">Something went wrong. Try again.</p>';
      return;
    }

    const user = await userResponse.json();
    const repos = await reposResponse.json();

    const topRepos = getTopRepos(repos);
    const languages = getLanguageStats(repos);

    showUser(user);
    showRepos(topRepos);
    showLanguages(languages);

  } catch (error) {
    resultDiv.innerHTML = '<p class="error">Network error. Check your connection.</p>';
  }
}

function showRateLimitError(response) {
  const resetTime = response.headers.get('X-RateLimit-Reset');

  if (!resetTime) {
    resultDiv.innerHTML = '<p class="error">Rate limit reached. Please try again later.</p>';
    return;
  }

  const resetDate = new Date(resetTime * 1000);
  const timeString = resetDate.toLocaleTimeString();

  resultDiv.innerHTML = `<p class="error">You reached the hourly limit! Please try again at ${timeString}.</p>`;
}

function getLanguageStats(repos) {
  const counts = repos.reduce((acc, repo) => {
    if (repo.language) {
      acc[repo.language] = (acc[repo.language] || 0) + 1;
    }
    return acc;
  }, {});

  const total = Object.values(counts).reduce((sum, count) => sum + count, 0);

  const percentages = Object.entries(counts).map(([language, count]) => ({
    language,
    percent: Math.round((count / total) * 100)
  }));

  return percentages.sort((a, b) => b.percent - a.percent);
}

function showLanguages(languages) {
  if (languages.length === 0) {
    resultDiv.innerHTML += '<p>No language data found.</p>';
    return;
  }

  const bars = languages.map(item => `
    <div class="lang-row">
      <span>${item.language} (${item.percent}%)</span>
      <div class="lang-bar" style="width: ${item.percent}%"></div>
    </div>
  `).join('');

  resultDiv.innerHTML += `
    <h3>Languages</h3>
    ${bars}
  `;
}

function getTopRepos(repos) {
  return repos
    .filter(repo => !repo.fork)
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, 5);
}

function showRepos(repos) {
  if (repos.length === 0) {
    resultDiv.innerHTML += '<p>No original repos found.</p>';
    return;
  }

  const repoCards = repos.map(repo => `
    <div class="repo-card">
      <a href="${repo.html_url}" target="_blank">${repo.name}</a>
      <span>⭐ ${repo.stargazers_count}</span>
      <p>${repo.description || 'No description.'}</p>
    </div>
  `).join('');

  resultDiv.innerHTML += `
    <h3>Best Work</h3>
    ${repoCards}
  `;
}

function showUser(user) {
  resultDiv.innerHTML = `
    <div class="profile-card">
      <img src="${user.avatar_url}" alt="${user.login}" />
      <h2>${user.name || user.login}</h2>
      <p>${user.bio || 'No bio available.'}</p>
      <p><strong>Followers:</strong> ${user.followers}</p>
    </div>
  `;
}