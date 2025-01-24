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
   

}

document.body.insertAdjacentHTML(
    'afterbegin',
    `
        <label class="color-scheme">
            Theme:
            <select>
                <option value="auto">Automatic</option> <!-- Assuming you have an 'auto' setting -->
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

