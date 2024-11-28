# Generic Demo Environment

The project is hosted live [here](https://gde-atomic.netlify.app/home).

Most components are from Atomic Library and missing features/components from Headless Library. 

This project is built to be compatible with the GENERIC-SE-DEMO. It can be configured for any console.


## Case Assist (BETA)

The case assist can be accessed [here](https://gde-atomic.netlify.app/case-assist)

## Prerequisite

- Node v16 or greater

- You should have an `.env` file at the root of this project. You can use `.env.example` as starting point and make sure to replace all placeholder variables `<...>` by the proper information for your organization.

- [Setup Guide](https://github.com/mhsumbal-coveo/FiServ-Pre-req)

## API Keys

Admin Console > Organization > API keys 

Select the preset "**Search**"

## Cloning and Running the Application in local

Clone the project into local

```bash
git clone -b GDE-atomic --single-branch https://github.com/coveo/GDE.git <demo-name>

cd <demo-name>
```

To clone an existing Demo

```bash
git clone -b <demo-branch> --single-branch https://github.com/coveo/GDE.git <demo-name>

cd <demo-name>
```

Install all the npm packages. Go into the project folder and type the following command to install all npm packages

```bash
npm install
```

To run the application, type the following command

```bash
npm start
```

The Application Runs on **localhost:3000**

## Configuration Steps

1. Replace the organization information in the `.env` file.  
2. Modify the `src/config/SearchConfig.tsx` file. You can modify the following
    - Fields to include in the search results
    - Search Page Tabs
    - Search Page Side Bar recommendations
3. Modify the `src/config/HomeConfig.tsx` file. You can modify the following
    - Anchors inside the navigation bar
    - Anchors inside the Header Config
    - Hero Image, title and description
    - Main Recommendation (title, description, pipeline, searchhub)
    - Video Recommendation (title, description, pipeline, searchhub)
4. Modify the search page in the `src/Compoments/SearchPage/SearchPage.js`. This page is mainly build from [Atomic Library](https://docs.coveo.com/en/atomic/latest/reference/components/) 
    - Modify the Facets
    - Modify sort expression
5. Modify or Add result template using the `src/config/ResultTemplate.jsx`. Take help of this [guide](https://docs.coveo.com/en/atomic/latest/usage/displaying-results/) 
6. Modify the persona and context using the `src/config/ProfileConfig.js` file. 
7. Modify the `src/theme.tsx` file.  

## Need Help from Core Team

You will first have to push your source code in a new branch. Follow the git commands in your terminal.

1. `git checkout -b "<demo-name>-demo"`
2. `git add .`
3. `git commit -m  "<demo-name> ready"`
4. `git push origin <demo-name>-demo`


Afterwards, open up a core ticket or contact the core team directly

## Hosting

Follow the guide below to host it on Netlify

Add the [\_redirects](https://github.com/mhsumbal-coveo/FiServ/blob/main/public/_redirects) in the public folder if you have an older version of FiServ. [Guide](https://ridbay.medium.com/react-routing-and-netlify-redirects-fd1f00eeee95)

- Install Netlify CLI using `npm install netlify-cli -g` (close the terminal after installation and open it again)
- Build the application `npm run build`
- Deploy using `netlify deploy --prod`. You will be asked to login for the first time and answer the questions as below.
  - Create & configure a new site
  - select team => `<select the team it shows>`
  - site name => `<name-of-your-demo>`
  - Publish directory => `build`

After hosting is complete, the website URL will show up in the terminal.

To re-deploy, follow the steps below.

- Build the application again `npm run build`
- Deploy using `netlify deploy --prod`
