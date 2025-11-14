// Variables to hold JSON data
let aboutMeData;
let projectsData;

/**
 * @description Reads data from a JSON file.
 * @param path
 * @returns {Promise<void>} Data or throws an error.
 */
async function readData(path) {
    try {
        const response = await fetch(path);
        if (!response.ok) {
            throw new Error('An error occurred while reading data.');
        }
        return await response.json();
    } catch (error) {
        console.error(`Error loading JSON: ${error}`);
        throw error;
    }
}

/**
 * @description Populates 'About Me' section
 * @returns {Promise<void>}
 */
async function populateAboutMe() {
    try {
        // Create bio section
        const aboutMeContent = document.createElement('p');
        aboutMeContent.textContent = aboutMeData.aboutMe;

        // Create headshot section
        const headshotContainer = document.createElement('div');
        headshotContainer.classList.add('headshotContainer');

        const headshot = document.createElement('img');
        headshot.setAttribute('src', aboutMeData.headshot);
        headshot.setAttribute('alt', 'A picture of me.')
        headshotContainer.append(headshot);

        // Append to the DOM
        const aboutMeElement = document.querySelector('#aboutMe');
        const documentFragment = document.createDocumentFragment();
        documentFragment.append(aboutMeContent, headshotContainer)
        aboutMeElement.append(documentFragment);
    } catch(error) {
        console.error(`Error loading About Me section: ${error}`);
    }
}

/**
 * @description Populates the project list sidebar section
 * @returns {Promise<void>}
 */
function populateProjectList() {
    try {
        const documentFragment = document.createDocumentFragment();

        // Loop through all projects to create their respective elements
        projectsData.forEach(project => {
            // description elements default values propagates to project_id which always has a value
            const {
                project_id,
                project_name,
                short_description = '',
                long_description = '',
                card_image = './images/card_placeholder_bg.webp',
                spotlight_image = './images/spotlight_placeholder_bg.webp',
                url = 'URL currently unavailable.'
            } = project;

            // Create project card
            const projectCard = document.createElement('div');
            projectCard.classList.add('projectCard');
            projectCard.setAttribute('id', project_id);
            projectCard.style.backgroundImage = `url(${card_image})`;

            // Add title and short description
            const projectNameElement = document.createElement('h4');
            projectNameElement.textContent = project_name;

            const projectShortDescriptionElement = document.createElement('p');
            projectShortDescriptionElement.textContent = short_description;

            projectCard.append(projectNameElement, projectShortDescriptionElement);

            documentFragment.append(projectCard);
        });

        // Append to the DOM
        const projectList = document.querySelector('#projectList');
        projectList.append(documentFragment);

    } catch (error) {
        throw Error(`Error loading project list: ${error}`);
    }
}

/**
 * @description Adds scroll handlers to the two arrows
 */
function addScrollHandler() {
    const arrowLeft = document.querySelector('.arrow-left');
    const arrowRight = document.querySelector('.arrow-right');
    arrowLeft.addEventListener('pointerdown', handleLeftUpScroll);
    arrowRight.addEventListener('pointerdown', handleRightDownScroll);
}

/**
 * @description Handles left or up scrolling of the project list based on the screen size
 */
const handleLeftUpScroll = () => {
    const projectList = document.querySelector('#projectList');
    const isWideScreen = window.matchMedia("(width >= 1024px)").matches;
    isWideScreen ? projectList.scrollBy({top: -150, behavior: "smooth"}) : projectList.scrollBy({left: -150, behavior: "smooth"});
};

/**
 * @description Handles right or down scrolling of the project list based on the screen size
 */
const handleRightDownScroll = () => {
    const projectList = document.querySelector('#projectList');
    const isWideScreen = window.matchMedia("(width >= 1024px)").matches;
    isWideScreen ? projectList.scrollBy({top: 150, behavior: "smooth"}) : projectList.scrollBy({left: 150, behavior: "smooth"});
}

/**
 * @description Populates the project spotlight section
 * @param project The default project that will be visible in the spotlight section
 */
function populateProjectSpotlight(project) {
    try {
        // description elements default values propagates to project_id which always has a value
        const {
            project_name = '',
            long_description = '',
            spotlight_image = './images/spotlight_placeholder_bg.webp',
            url = 'URL currently unavailable.'
        } = project;

        const documentFragment = document.createDocumentFragment();

        // Set background image
        const projectSpotlight = document.querySelector('#projectSpotlight');
        projectSpotlight.style.backgroundImage = `url(${spotlight_image})`;

        // Create content elements
        const spotlightTitles = document.querySelector('#spotlightTitles');

        // Remove all children of spotlightTitles element to account for event handler updates
        while (spotlightTitles.firstChild) {
            spotlightTitles.removeChild(spotlightTitles.firstChild);
        }

        const projectSpotlightTitle = document.createElement('h3');
        projectSpotlightTitle.textContent = project_name;

        const projectSpotlightDescription = document.createElement('p');
        projectSpotlightDescription.textContent = long_description;

        const projectSpotlightLink = document.createElement('a');

        if (url !== 'URL currently unavailable.') {
            projectSpotlightLink.textContent = 'Click here to see more...';
            projectSpotlightLink.setAttribute('href', url);
        }
        else {
            projectSpotlightLink.textContent = url;
        }

        documentFragment.append(projectSpotlightTitle, projectSpotlightDescription, projectSpotlightLink);

        // Append to DOM
        spotlightTitles.append(documentFragment);
    } catch (error) {
        throw Error(`Error loading project spotlight section: ${error}`);
    }
}

/**
 * @description Adds project spotlight update handler to project list
 */
function addSpotlightUpdateHandler() {
    const projectList = document.querySelector('#projectList');
    projectList.addEventListener('pointerdown', handleSpotlightUpdate);
}

const handleSpotlightUpdate = (event) => {
    const target = event.target;
    if (target.id !== 'projectList') {
        const projectCard = target.closest('.projectCard');
        const projectId = projectCard.id;

        // Find the project object matching the project card id
        const project = projectsData.find(project => project.project_id === projectId);

        // Update project spotligh section
        populateProjectSpotlight(project);
    }
}

/**
 * @description Populates 'Projects' section
 */
async function populateProjects() {
    try {
        populateProjectList();
        addScrollHandler();

        // Populate project spotlight section with the first project by default
        populateProjectSpotlight(projectsData[0]);

        addSpotlightUpdateHandler();
    } catch (error) {
        throw Error(`Error loading Projects section: ${error}`);
    }
}

/**
 * @description Add counter event listener to contact message in the form section
 */
function addMessageCounter() {
    const messageElement = document.querySelector('#contactMessage');
    messageElement.addEventListener('input', handleMessageCounter);
}

/**
 * @description Update message counter section based on user input
 * @param event
 */
function handleMessageCounter(event) {
    const message = event.target.value;
    const messageLength = message.length;
    const charactersCounter = document.querySelector('#charactersLeft');
    charactersCounter.textContent = `Characters: ${messageLength}/300`;
    if (messageLength > 300) {
        charactersCounter.style.color = 'darkred';
    } else {
        charactersCounter.style.color = '';
    }
}


/**
 * @description Adds form validation event listener
 */
function addFormValidation() {
    const form = document.querySelector('#formSection');
    form.addEventListener('submit', handleFormValidation);
}

function handleFormValidation(event) {
    event.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const illegalCharacters = /[^a-zA-Z0-9@._-]/;

    // Email validation
    const email = document.querySelector('#contactEmail').value;
    const emailError = document.querySelector('#emailError');
    if (email.length === 0 || !emailRegex.test(email) || illegalCharacters.test(email)) {
        emailError.textContent = 'Invalid email address';
    } else {
        emailError.textContent = '';
    }

    // Message validation
    const message = document.querySelector('#contactMessage').value;
    const messageError = document.querySelector('#messageError');
    if (message.length === 0) {
        messageError.textContent = 'Please enter the message you wish to submit';
    } else if (message.length > 300) {
        messageError.textContent = 'Message too long';
    } else if (illegalCharacters.test(message)) {
        messageError.textContent = 'Your message contains illegal characters';
    } else {
        messageError.textContent = '';
    }
}

/**
 * @description Main function that build the application
 * @returns {Promise<void>}
 */
async function build() {
    try {
        aboutMeData = await readData('./data/aboutMeData.json');
        projectsData = await readData('./data/projectsData.json');
        populateAboutMe();
        populateProjects();
        addMessageCounter();
        addFormValidation();
    } catch (error) {
        console.error(`Error loading application: ${error}`);
    }
}

build();