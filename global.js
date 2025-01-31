console.log('ITS ALIVE!');

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

let navLinks = $$("nav a")

let pages = [
    { url: '', title: 'Home' },
    { url: 'projects/', title: 'Projects' },
    { url: 'contact/', title: 'Contact' },
    { url: 'cv/', title: 'CV' },
    // add the rest of your pages here
    { url: 'https://github.com/selinaz154', title: 'Github'}
  ];

let currentLink = navLinks.find(
    (a) => a.host === location.host && a.pathname === location.pathname
);

if (currentLink) {
    // or if (currentLink !== undefined)
    currentLink?.classList.add('current');
}

let nav = document.createElement('nav');
document.body.prepend(nav);
const ARE_WE_HOME = document.documentElement.classList.contains('home');
    
for (let p of pages) {
    let url = p.url;
    let title = p.title;
  
    if (!ARE_WE_HOME && !url.startsWith('http')) {
        url = '../' + url;
    }
    
    let a = document.createElement('a');
    a.href = url;
    a.textContent = title;
    nav.append(a);


    a.classList.toggle(
        'current',
        a.host === location.host && a.pathname === location.pathname
    );

    if (new URL(a.href, location.href).host !== location.host) {
        a.target = '_blank'; // Open in a new tab if it is external
    }
   
    nav.append(a);
}

document.body.insertAdjacentHTML(
    'afterbegin',
    `
        <label class="color-scheme">
            Theme:
            <select>
                <option value="light dark">Automatic</option> 
                <option value="light">Light</option>
                <option value="dark">Dark</option>
            </select>
        </label>`
);

          //step 4.5 

let select = document.querySelector('select')

const savedColorScheme = localStorage.getItem('colorScheme');
    if (savedColorScheme) {
        document.documentElement.style.setProperty('color-scheme', savedColorScheme);
        select.value = savedColorScheme; // Set the select element to match the stored preference
    }

select.addEventListener('input', function (event) {
    console.log('color scheme changed to', event.target.value);
    document.documentElement.style.setProperty('color-scheme', event.target.value);
    localStorage.colorScheme = event.target.value
  });

  //lab 4
  export async function fetchJSON(url) {
    try {
        // Fetch the JSON file from the given URL
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch projects: ${response.statusText}`);
        }

        const data = await response.json();
        return data; 


    } catch (error) {
        console.error('Error fetching or parsing JSON data:', error);
    }

}

export function renderProjects(project, containerElement, headingLevel = 'h2') {
    if (!(containerElement instanceof HTMLElement)) {
        console.error('Invalid container element provided.');
        return;
    } 
    containerElement.innerHTML = ''; 
   
    
    project.forEach(project => {
        console.log('working?');
        
        const article = document.createElement('article');
       
        article.innerHTML = `
        <h3>${project.title}</h3>
        <img src="${project.image}" alt="${project.title}">
        <p>${project.description}</p>
        `;

        containerElement.appendChild(article);
    });
}


export function countProjects(project, titleElement) {
    if (Array.isArray(project)) {
        const projectCount = project.length;
        titleElement.textContent = `${projectCount} Projects`;
    } else {
        console.error('Invalid projects data');
    }
}

//step 3.2
export async function fetchGitHubData(username) {
    return fetchJSON(`https://api.github.com/users/${username}`);
  }