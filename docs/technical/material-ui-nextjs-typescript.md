# Get Started with Material UI and Next.js in TypeScript

Material UI paired with Next.js is a very powerful combo for quickly building complex apps.

If you tried to re-engineer this stack from scratch, you'd have to invest hundreds or potentially _thousands_ of hours into it before you ever actually started, you know, _building your app._

Working with Material UI in Next.js is a breeze once you get everything installed and override a few default settings.

This tutorial walks you through the process of setting up a boilerplate Next.js app in TypeScript with Material UI, using Emotion as a styling engine.

If you want to get straight into the code, you can [check out my GitHub repo](https://github.com/samuelsycamore/material-ui-next-js-ts-boilerplate) that contains this boilerplate.

## Introducing Our Stack

### Next.js

[Next.js](https://nextjs.org) is a React framework created by [Vercel](https://vercel.com). Next makes it incredibly simple to spin up a new React app with complex questions like routing, rendering, bundling, and image optimization already answered for you.

### Material UI

[Material UI](https://github.com/mui/material-ui) is an open-source React component library that implements Google's [Material Design](https://material.io/design) system. It's maintained by [MUI](https://mui.com), the startup where I currently work as a Developer Advocate.

Like Next.js, Material UI is cool because it enables you to build so much faster. Many of the toughest decisions have already been made for you, so you can build a truly excellent UI without any of the prerequisite design skills. And if you need to change things up, customization is very intuitive.

### Emotion

Material UI's styling features are made possible by [Emotion](https://emotion.sh), a library for writing CSS styles using JavaScript. 

There are a few different ways of working with Emotion, but MUI's styling engine uses the `styled.div`-flavored API, so the code should look familiar to you if you've worked with styled-components before. 

### TypeScript

This tutorial uses TypeScript, but don't let that scare you off if you've only worked with JavaScript in the past! 

You can still build on top of this boilerplate using JavaScript/JSX, and if you ever decide to translate your code into TS in the future, you can do so *progressively*—one file at a time—without breaking anything.

## Initializing the Project

### Create Next.js App

To create a blank Next.js app with TypeScript, run:

```bash
npx create-next-app@latest --typescript YOUR_APP_NAME
# or
yarn create next-app --typescript YOUR_APP_NAME
```

Navigate into the directory you just created:

```bash
cd YOUR_APP_NAME
```

### Install Material UI

Inside your app's directory, run this command to install Material UI:

```bash
npm install @mui/material
# or
yarn add @mui/material
```

Since Material UI uses the Roboto font by default, let's install that as well:

```bash
npm install @fontsource/roboto
# or
yarn add @fontsource/roboto
```

> You don't have to use Roboto in your app, but we'll stick with it for this boilerplate setup.

Optionally, you may want to install the Material UI icon pack if you plan to use those:

```bash
npm install @mui/icons-material
# or
yarn add @mui/icons-material
```

### Install Emotion

To install Emotion, run:

```bash
npm install @emotion/react @emotion/styled @emotion/server @emotion/cache
# or
yarn add @emotion/react @emotion/styled @emotion/server @emotion/cache
```

### Dependencies

Now that you have everything installed, your list of dependencies in `package.json` should look something like this:

```json
// package.json

"dependencies": {
    "@emotion/cache": "^11.7.1",
    "@emotion/react": "^11.8.1",
    "@emotion/server": "^11.4.0",
    "@emotion/styled": "^11.8.1",
    "@fontsource/roboto": "^4.5.3",
    "@mui/icons-material": "^5.5.0",
    "@mui/material": "^5.5.0",
    "next": "12.1.0",
    "react": "17.0.2",
    "react-dom": "17.0.2"
  },
  "devDependencies": {
    "@types/node": "17.0.21",
    "@types/react": "17.0.39",
    "eslint": "8.10.0",
    "eslint-config-next": "12.1.0",
    "typescript": "4.6.2"
  }
```

## Customizing the Project

### Create a Theme

Inside your project directory, create a new folder called `src` and navigate into it:

```bash
mkdir src && cd src
```

Create a new file named `theme.ts`:

```bash
touch theme.ts
```

Inside `theme.ts`, add the following code to create a new theme instance:

```ts
// src/theme.ts

import { createTheme } from '@mui/material/styles';
import { green } from '@mui/material/colors';

const theme = createTheme({
  palette: {
    primary: {
      main: green.A700,
    },
    secondary: {
      main: '#ff6666',
    },
  },
});

export default theme;
```

This theme is the source of truth for our app's styles. As you can see, it supports the color palettes that come packaged with Material UI as well as custom colors.

### Create Custom Emotion Cache

In order to insert your styles into your Material UI components, you need to create a custom cache to override Emotion's default settings. 

In the `src` folder, create a new file named `createEmotionCache.ts`:

```bash
touch createEmotionCache.ts
```

Inside, adding the following code:

```ts
// src/createEmotionCache.ts

import createCache from '@emotion/cache';

export default function createEmotionCache() {
  return createCache({ key: 'css', prepend: true });
}
```

### Create Custom _document.tsx

By default, Next.js abstracts away the `<html>` and `<body>` tags on your pages. 

To use Material UI, your `theme` and `createEmotionCache` instances need to be able to talk to these tags. This happens in the custom `_document` file.

The custom `_document` also lets you set the `initialProps` for the page, so styles can be rendered on the server before the page is sent to the client.

To override the default `_document`, navigate to your `pages` directory: 

```bash
cd .. && cd pages
```

Create a new file called `_document.tsx`:

```bash
touch _document.tsx
```

Inside, add the following code:

```jsx
// pages/_document.tsx

import * as React from 'react';
import Document, { Html, Head, Main, NextScript } from 'next/document';
import createEmotionServer from '@emotion/server/create-instance';
import theme from '../src/theme';
import createEmotionCache from '../src/createEmotionCache';

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <meta name="theme-color" content={theme.palette.primary.main} />
          <link rel="shortcut icon" href="/static/favicon.ico" />
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
          />
          {(this.props as any).emotionStyleTags}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

MyDocument.getInitialProps = async (ctx) => {
  const originalRenderPage = ctx.renderPage;
  const cache = createEmotionCache();
  const { extractCriticalToChunks } = createEmotionServer(cache);

  ctx.renderPage = () =>
    originalRenderPage({
      enhanceApp: (App: any) =>
        function EnhanceApp(props) {
          return <App emotionCache={cache} {...props} />;
        },
    });

  const initialProps = await Document.getInitialProps(ctx);
  const emotionStyles = extractCriticalToChunks(initialProps.html);
  const emotionStyleTags = emotionStyles.styles.map((style) => (
    <style
      data-emotion={`${style.key} ${style.ids.join(' ')}`}
      key={style.key}
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: style.css }}
    />
  ));

  return {
    ...initialProps,
    emotionStyleTags,
  };
};
```

### Create Custom Link Component

Next.js and Material UI both have their own `Link` components that won't play well together right out of the box.

In order to fix this, you need to create a custom `<NextLink />` component that returns Material UI's `<MuiLink />`.

Navigate back to the `src` folder:

```bash
cd .. && cd src
```

Create a file called `Link.tsx`:

```bash
touch Link.tsx
```

Inside, paste the following code:

```jsx
// src/Link.tsx

import * as React from 'react';
import clsx from 'clsx';
import { useRouter } from 'next/router';
import NextLink, { LinkProps as NextLinkProps } from 'next/link';
import MuiLink, { LinkProps as MuiLinkProps } from '@mui/material/Link';
import { styled } from '@mui/material/styles';

// Add support for the sx prop for consistency with the other branches.
const Anchor = styled('a')({});

interface NextLinkComposedProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>,
    Omit<NextLinkProps, 'href' | 'as'> {
  to: NextLinkProps['href'];
  linkAs?: NextLinkProps['as'];
  href?: NextLinkProps['href'];
}

export const NextLinkComposed = React.forwardRef<HTMLAnchorElement, NextLinkComposedProps>(
  function NextLinkComposed(props, ref) {
    const { to, linkAs, href, replace, scroll, shallow, prefetch, locale, ...other } = props;

    return (
      <NextLink
        href={to}
        prefetch={prefetch}
        as={linkAs}
        replace={replace}
        scroll={scroll}
        shallow={shallow}
        passHref
        locale={locale}
      >
        <Anchor ref={ref} {...other} />
      </NextLink>
    );
  },
);

export type LinkProps = {
  activeClassName?: string;
  as?: NextLinkProps['as'];
  href: NextLinkProps['href'];
  linkAs?: NextLinkProps['as']; // Useful when the as prop is shallow by styled().
  noLinkStyle?: boolean;
} & Omit<NextLinkComposedProps, 'to' | 'linkAs' | 'href'> &
  Omit<MuiLinkProps, 'href'>;

// A styled version of the Next.js Link component:
// https://nextjs.org/docs/api-reference/next/link
const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(function Link(props, ref) {
  const {
    activeClassName = 'active',
    as: linkAs,
    className: classNameProps,
    href,
    noLinkStyle,
    role, // Links don't have roles.
    ...other
  } = props;

  const router = useRouter();
  const pathname = typeof href === 'string' ? href : href.pathname;
  const className = clsx(classNameProps, {
    [activeClassName]: router.pathname === pathname && activeClassName,
  });

  const isExternal =
    typeof href === 'string' && (href.indexOf('http') === 0 || href.indexOf('mailto:') === 0);

  if (isExternal) {
    if (noLinkStyle) {
      return <Anchor className={className} href={href} ref={ref} {...other} />;
    }

    return <MuiLink className={className} href={href} ref={ref} {...other} />;
  }

  if (noLinkStyle) {
    return <NextLinkComposed className={className} ref={ref} to={href} {...other} />;
  }

  return (
    <MuiLink
      component={NextLinkComposed}
      linkAs={linkAs}
      className={className}
      ref={ref}
      to={href}
      {...other}
    />
  );
});

export default Link;
```

Now the `<Link>` component will work as expected in Next.js.

### Update _app.tsx

Open your project's `_app.tsx` in the `pages` directory, and replace the boilerplate code with:

```jsx
// pages/_app.tsx

import * as React from 'react';
import Head from 'next/head';
import { AppProps } from 'next/app';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { CacheProvider, EmotionCache } from '@emotion/react';
import theme from '../src/theme';
import createEmotionCache from '../src/createEmotionCache';

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

export default function MyApp(props: MyAppProps) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <ThemeProvider theme={theme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <Component {...pageProps} />
      </ThemeProvider>
    </CacheProvider>
  );
}
```

With all of that out of the way, now you're ready to start building out your app—beginning with `index.tsx`.

### Update index.tsx

Open `index.tsx` in your project's `pages` directory and replace the boilerplate code with:

```jsx
// pages/index.tsx

import * as React from 'react';
import type { NextPage } from 'next';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

const Home: NextPage = () => {
  return (
    <Container maxWidth='lg'>
      <Box
        sx={{
          my: 5,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Typography component='h1' color='primary'>
          Material UI v5 with Next.js in TypeScript
        </Typography>
        <Typography component='h2' color='secondary'>
          Boilerplate for building faster.
        </Typography>
      </Box>
    </Container>
  );
};

export default Home;
```

This boilerplate homepage isn't much to look at, but it gives you an idea of how some of the basic components and styling features work in Material UI.

## Launching the App

To test out your boilerplate app, navigate to the root directory and run:

```bash
npm run dev
# or
yarn dev
```

When you visit `http://localhost:3000` the page should look like this:

![Screen Shot of boilerplate homepage with filler text](https://cdn.hashnode.com/res/hashnode/image/upload/v1646930488638/kMnoXG5mY.png)

I have to admit, it's not the most beautiful thing I've ever created. 😅

But it _is_ fully functional!

And with all of this setup out of the way, now we can build quickly and efficiently with Material UI and Next.js, with all the benefits of TypeScript.

I hope this is helpful! 