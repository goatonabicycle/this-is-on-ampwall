# this-is-on-ampwall

> A simple extension that shows a banner on Bandcamp pages if the artist you're looking at is also on Ampwall.

## This project uses

- Extension.js for the extension framework
- Biome.js for code formatting and linting

## How do I see it working? 

- `npm i` - Install all the things
- `npm run dev` - This should open a new tab with the extension installed and running
- Navigate to a bandcamp page that also has an Ampwall equivalent
  - https://khodumodumo.bandcamp.com
  - https://woeunholy.bandcamp.com
  - https://convulsing.bandcamp.com/album/perdurance


## Available Scripts

In the project directory, you can run the following scripts:

### npm dev

**Development Mode**: This command runs your extension in development mode. It will launch a new browser instance with your extension loaded. The page will automatically reload whenever you make changes to your code, allowing for a smooth development experience.

```bash
npm run dev
```

### npm start

**Production Preview**: This command runs your extension in production mode. It will launch a new browser instance with your extension loaded, simulating the environment and behavior of your extension as it will appear once published.

```bash
npm run start
```

### npm build

**Build for Production**: This command builds your extension for production. It optimizes and bundles your extension, preparing it for deployment to the target browser's store.

```bash
npm run build
```

## Learn More

To learn more about creating cross-browser extensions with Extension.js, visit the [official documentation](https://extension.js.org).
