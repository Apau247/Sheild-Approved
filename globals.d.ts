// globals.d.ts
// Teach TypeScript how to handle side-effect CSS imports in Next.js App Router.
// (Prevents: TS2307 Cannot find module or type declarations for side-effect import of './globals.css'.)

declare module "*.css" {
  const content: string;
  export default content;
}

declare module "*.module.css" {
  const classes: { readonly [key: string]: string };
  export default classes;
}
