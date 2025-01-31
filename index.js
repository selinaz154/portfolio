import { fetchJSON, renderProjects } from './global.js';
// import { fetchJSON, renderProjects, fetchGithubData } from '../global.js';

const projects = await fetchJSON('./lib/projects.json');
const latestProjects = projects.slice(0, 3);
console.log(latestProjects);
const projectsContainer = document.querySelector('.projects');

renderProjects(latestProjects, projectsContainer, 'h2');

//3.2

import { fetchGitHubData } from './global.js'; 
const githubData = await fetchGitHubData('selinaz154');
const profileStats = document.querySelector('#profile-stats');


//step 5 (modify this)
if (profileStats) {
    profileStats.innerHTML = `
      <h2>My GitHub Statistics: </h2>
          <dl>
            <dt>Followers:</dt><dd>${githubData.followers}</dd>
            <dt>Following:</dt><dd>${githubData.following}</dd>
            <dt>Public Repos:</dt><dd>${githubData.public_repos}</dd>
            <dt>Public Gists:</dt><dd>${githubData.public_gists}</dd>
          </dl>
      `;
  }