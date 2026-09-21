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
    const response = await fetch(`https://api.github.com/users/${username}`);

    if (response.status === 404) {
      resultDiv.innerHTML = '<p class="error">User not found.</p>';
      return;
    }

    if (!response.ok) {
      resultDiv.innerHTML = '<p class="error">Something went wrong. Try again.</p>';
      return;
    }

    const user = await response.json();
    showUser(user);

  } catch (error) {
    resultDiv.innerHTML = '<p class="error">Network error. Check your connection.</p>';
  }
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