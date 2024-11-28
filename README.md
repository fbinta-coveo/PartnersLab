# Generic Demo Environment for Commerce API (WIP)

GDE for new commerce api. It will include the following feature

1. Search Page (commerce api)
2. Product Listing Page (commerce api)
3. Recommendation (search api)

Will work only with the commerce catalog and CMH setup.

## Prerequisite

- Node v16 or greater

- You should have an `.env` file at the root of this project.

- [Setup Guide](https://github.com/mhsumbal-coveo/FiServ-Pre-req)


## API Keys

GDE-CAPI requires 2 API keys

1. Commerce Engine (REACT_APP_COMMERCE_ENGINE_API_KEY)
    - Analytics > Analytics data = Push
    - Analytics > Impersonate = Allowed
    - Search > Impersonate = Allowed

2. Get Product Listing (REACT_APP_GET_PRODUCT_LISTING_API_KEY)
    - Commerce > Catalog = View
    - Commerce > Merchandising Hub = View
    - Commerce > Product listing = View

## Cloning and Running the Application in local

Clone the project into local

```bash
git clone -b GDE-CAPI --single-branch https://github.com/coveo/GDE.git <demo-name>

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

Coming soon ...

## Contribution

When creating a new branch, please follow this format:

`GDE-CAPI-<feature-name>`

Replace `<feature-name>` with a brief, descriptive name of the feature or task you're working on.