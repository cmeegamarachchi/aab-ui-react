# AppSolve application framework react starter kit

`aab-ui-react` is a React.js-based UI starter kit built using Vite. It incorporates **Tailwind CSS** and **ShadCN** for modern, responsive styling and includes features such as pre-built layouts with side navigation and configuration management capabilities.


## Getting Started
`aab-ui-react` offers Visual Studio DevContainer support, enabling seamless setup in containerized environments. To get started:
1. Clone the repository using a DevContainer or directly to your working directory.
2. Run the following commands:  
    * `npm run dev` to start the application in development mode
    * `npm run build` to create a production-ready build of the application

## Layouts
`aab-ui-react` includes the following layout:

### SideNavLayout
A customizable layout featuring single-level navigation. Navigation is configured using a JSON structure, offering flexibility and ease of use.
To explore layouts in detail, run the Storybook tool provided with the project.

## Providers
The `ConfigurationProvider` enables efficient application-wide configuration management. It works seamlessly with the useConfiguration hook, ensuring updated configurations are automatically persisted to local storage for a smooth user experience.

## Hooks
`useHttp` provides various methods and props to interact with http endpoints. This hook can be direcly used in components or in other hooks

## Upgrade
### Upgrade shad-cn components
To upgrade shad-cn components run `update:shadcn` custom script
```bash
cd frontend
npm run update:shadcn
``` 
